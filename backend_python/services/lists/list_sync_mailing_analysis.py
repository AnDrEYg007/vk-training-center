
import json
import time
import concurrent.futures
from datetime import datetime, timezone
from typing import List, Dict, Optional
from sqlalchemy.orm import Session

import crud
import models
from services import task_monitor
from services.vk_api.api_client import call_vk_api as raw_vk_call
from database import SessionLocal

# Лимит execute = 25 запросов. Ставим 20 для безопасности.
ANALYSIS_BATCH_SIZE = 20

def _fetch_analysis_batch(tokens: List[str], chunk_index: int, peer_ids: List[int], project_id: str) -> Optional[List[Dict]]:
    """
    Воркер для анализа диалогов (First Date + Initiator).
    Возвращает List[Dict] при успехе или None при фатальной ошибке всех токенов.
    """
    if not tokens or not peer_ids:
        print(f"[ANALYSIS_DEBUG] Batch {chunk_index}: ABORT. Tokens or peers missing.")
        return None

    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    rotation_order = tokens[primary_index:] + tokens[:primary_index]
    
    peers_json = json.dumps(peer_ids)
    
    code = f"""
    var peers = {peers_json};
    var result = [];
    var idx = 0;

    while (idx < peers.length) {{
        var peer_id = peers[idx];
        var first_date = 0;
        var first_from_id = 0;
        var items = null;

        var history = API.messages.getHistory({{
            "peer_id": peer_id,
            "count": 1,
            "offset": 0,
            "rev": 1 
        }});

        if (history) {{
            items = history.items;
            if (items) {{
                 if (items.length > 0) {{
                    var msg = items[0];
                    first_date = msg.date;
                    first_from_id = msg.from_id;
                 }}
            }}
        }}

        result.push({{
            "peer_id": peer_id,
            "first_date": first_date,
            "first_from_id": first_from_id
        }});

        idx = idx + 1;
    }}

    return result;
    """
    
    for token_idx, token in enumerate(rotation_order):
        try:
            result = raw_vk_call("execute", {"code": code, "access_token": token}, project_id=project_id)
            
            if result is not None:
                 if len(result) > 0:
                     return result
                 else:
                     return []
            
        except Exception as e:
             error_str = str(e)
             # Если ошибка "Too many requests" (Code 6), ждем дольше
             if "Code: 6" in error_str:
                 time.sleep(2)
             else:
                 time.sleep(0.5)
             
    return None


def _save_batch_results(db: Session, project_id: str, results: List[Dict]):
    """Вспомогательная функция для сохранения результатов батча в БД."""
    updates = []
    for res in results:
        # Валидация ответа перед записью
        if res.get('first_date') and res.get('first_date') > 0:
            updates.append({
                'vk_user_id': res['peer_id'],
                'first_message_date': datetime.fromtimestamp(res['first_date'], timezone.utc),
                'first_message_from_id': res['first_from_id']
            })
    
    if updates:
        # 1. Маппинг VK ID -> PK ID
        vk_ids_in_batch = [u['vk_user_id'] for u in updates]
        records = db.query(models.SystemListMailing.id, models.SystemListMailing.vk_user_id).filter(
            models.SystemListMailing.project_id == project_id,
            models.SystemListMailing.vk_user_id.in_(vk_ids_in_batch)
        ).all()
        
        vk_to_pk = {r.vk_user_id: r.id for r in records}
        
        final_db_updates = []
        for u in updates:
            pk = vk_to_pk.get(u['vk_user_id'])
            if pk:
                final_db_updates.append({
                    "id": pk,
                    "first_message_date": u['first_message_date'],
                    "first_message_from_id": u['first_message_from_id']
                })
        
        if final_db_updates:
            db.bulk_update_mappings(models.SystemListMailing, final_db_updates)
            db.commit()
            return len(final_db_updates)
    return 0


def refresh_mailing_analysis_task(task_id: str, project_id: str, mode: str = 'missing'):
    """
    Фоновая задача для анализа диалогов.
    """
    print(f"[ANALYSIS_DEBUG] TASK STARTED: {task_id} for project {project_id}. MODE: {mode}")
    
    # --- PHASE 1: PREPARE & READ IDS ---
    unique_tokens = []
    vk_ids_to_process = []
    
    db = SessionLocal()
    try:
        project = crud.get_project_by_id(db, project_id)
        if not project:
            print(f"[ANALYSIS_DEBUG] Project not found in DB")
            task_monitor.update_task(task_id, "error", error="Project not found")
            return
            
        project_tokens = []
        if project.communityToken: 
            project_tokens.append(project.communityToken)
            
        if project.additional_community_tokens:
            try:
                extras = json.loads(project.additional_community_tokens)
                if isinstance(extras, list): 
                    valid_extras = [t for t in extras if t]
                    project_tokens.extend(valid_extras)
            except Exception as e:
                print(f"[ANALYSIS_DEBUG] Failed to parse additional tokens: {e}")
        
        unique_tokens = list(set(project_tokens))
        
        # Получаем список ID
        query = db.query(models.SystemListMailing.vk_user_id).filter(models.SystemListMailing.project_id == project_id)
        
        if mode == 'missing':
             query = query.filter(models.SystemListMailing.first_message_date.is_(None))
             
        results = query.all()
        vk_ids_to_process = [r[0] for r in results]

    finally:
        db.close()

    if not unique_tokens:
        task_monitor.update_task(task_id, "error", error="Нет токенов сообщества")
        return
        
    if not vk_ids_to_process:
        task_monitor.update_task(task_id, "done", message="Нет данных для анализа")
        return

    total_count = len(vk_ids_to_process)
    task_monitor.update_task(task_id, "processing", loaded=0, total=total_count, message=f"Анализ {total_count} диалогов...")
    
    # --- PHASE 2: PARALLEL PROCESSING (With Interleaved Checks) ---
    
    batches = [vk_ids_to_process[i:i + ANALYSIS_BATCH_SIZE] for i in range(0, total_count, ANALYSIS_BATCH_SIZE)]
    processed_count = 0
    failed_batches = []
    
    max_workers = min(len(unique_tokens), 15)
    
    # Вспомогательная функция для обработки ОДНОГО готового результата
    def process_completed_future(future):
        nonlocal processed_count
        try:
            results = future.result()
            batch_data = future.batch_data # Достаем прикрепленные данные
            
            if results is None:
                # print(f"[ANALYSIS_DEBUG] Batch failed. Adding to retry.")
                failed_batches.append(batch_data)
            else:
                db_chunk = SessionLocal()
                try:
                    _save_batch_results(db_chunk, project_id, results)
                except Exception as db_err:
                    print(f"[ANALYSIS_DEBUG] DB WRITE ERROR: {db_err}")
                finally:
                    db_chunk.close()

                processed_count += len(batch_data)
                # ОБНОВЛЯЕМ ПРОГРЕСС "НА ЛЕТУ"
                task_monitor.update_task(task_id, "processing", loaded=processed_count, total=total_count)
                
        except Exception as e:
            print(f"[ANALYSIS_DEBUG] Batch processing exception: {e}")
            failed_batches.append(future.batch_data)

    print(f"[ANALYSIS_DEBUG] Processing {len(batches)} batches with {max_workers} threads (Staggered start)")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        pending_futures = []
        
        # 1. ЗАПУСК И ПАРАЛЛЕЛЬНАЯ ПРОВЕРКА
        for i, batch in enumerate(batches):
            # STAGGERING: Задержка для предотвращения Code 6
            if i > 0:
                time.sleep(0.35) 

            # Запускаем задачу
            future = executor.submit(
                _fetch_analysis_batch, unique_tokens, i, batch, project_id
            )
            # Прикрепляем метаданные к объекту future, чтобы знать, какой батч обрабатывался
            future.batch_data = batch
            pending_futures.append(future)
            
            # ВАЖНО: Во время паузы проверяем, не завершилось ли что-то
            # Проходим по списку запущенных задач и обрабатываем готовые
            # (Итерируемся с конца, чтобы безопасно удалять из списка)
            for idx in range(len(pending_futures) - 1, -1, -1):
                f = pending_futures[idx]
                if f.done():
                    process_completed_future(f)
                    del pending_futures[idx]

        # 2. ОЖИДАНИЕ ОСТАВШИХСЯ
        # Когда все задачи отправлены, ждем завершения оставшихся
        for future in concurrent.futures.as_completed(pending_futures):
            process_completed_future(future)


    # --- PHASE 3: RETRY LOGIC (SEQUENTIAL) ---
    if failed_batches:
        print(f"[ANALYSIS_DEBUG] Starting RETRY phase for {len(failed_batches)} failed batches...")
        # Важно: Не сбрасываем loaded в 0, передаем текущее значение, или не передаем loaded вообще
        task_monitor.update_task(task_id, "processing", message=f"Повторная обработка ошибок ({len(failed_batches)})...", loaded=processed_count, total=total_count)
        
        for i, batch in enumerate(failed_batches):
            time.sleep(1.5)
            results = _fetch_analysis_batch(unique_tokens, -1, batch, project_id)
            
            if results is not None:
                db_chunk = SessionLocal()
                try:
                    _save_batch_results(db_chunk, project_id, results)
                    processed_count += len(batch)
                    task_monitor.update_task(task_id, "processing", loaded=processed_count, total=total_count)
                except Exception as e:
                    print(f"[ANALYSIS_DEBUG] Retry DB Error: {e}")
                finally:
                    db_chunk.close()
            else:
                print(f"[ANALYSIS_DEBUG] Retry FAILED again for batch {i+1}.")

    print(f"[ANALYSIS_DEBUG] TASK COMPLETED. Processed {processed_count}/{total_count}")
    task_monitor.update_task(task_id, "done", message=f"Анализ завершен. Обработано: {processed_count}")
