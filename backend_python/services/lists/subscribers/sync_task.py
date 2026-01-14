
import uuid
import time
import concurrent.futures
from datetime import datetime, timezone

import crud
import models
from services import vk_service, task_monitor
from services.post_helpers import get_rounded_timestamp
from services.vk_api.api_client import call_vk_api as raw_vk_call
from database import SessionLocal
from services.lists.list_sync_utils import get_all_project_tokens

from .config import EXECUTE_BATCH_SIZE
from .workers import _fetch_batch_execute_members

def refresh_subscribers_task(task_id: str, project_id: str, user_token: str):
    """
    Фоновая задача для полной синхронизации списка подписчиков.
    Использует Split Session для предотвращения SSL SYSCALL error.
    """
    
    # --- ЭТАП 1: ПОДГОТОВКА (Чтение) ---
    project_vk_id = None
    project_name = "Unknown"
    unique_tokens = []
    db_ids_set = set() # Храним ID существующих подписчиков здесь
    
    # ОТКРЫВАЕМ БД (Read)
    db = SessionLocal()
    try:
        project = crud.get_project_by_id(db, project_id)
        if not project:
            task_monitor.update_task(task_id, "error", error="Project not found")
            return
            
        project_vk_id = project.vkProjectId
        project_name = project.name
        
        # 1. Сбор токенов
        unique_tokens = get_all_project_tokens(db, user_token)

        # 2. Загрузка существующих ID для сравнения (ВАЖНО: делаем это до скачивания новых)
        # Это фиксит баг с историей - мы точно знаем, кто был в базе ДО начала обновления
        db_ids_set = crud.get_all_subscriber_vk_ids(db, project_id)

        if not unique_tokens:
            task_monitor.update_task(task_id, "error", error="Нет доступных токенов для работы")
            return
    except Exception as e:
        print(f"SERVICE ERROR (Stage 1): {e}")
        task_monitor.update_task(task_id, "error", error=f"Init failed: {e}")
        return
    finally:
        db.close() # ЗАКРЫВАЕМ БД перед долгим запросом
        
    
    # --- ЭТАП 2: СКАЧИВАНИЕ ИЗ VK (Без БД) ---
    all_members = []
    failed_chunks = [] # Очередь для повторных попыток

    try:
        print(f"SERVICE: Refreshing subscribers for '{project_name}' using {len(unique_tokens)} tokens...")
        
        numeric_id = vk_service.resolve_vk_group_id(project_vk_id, unique_tokens[0])
        fields = 'sex,bdate,city,country,photo_100,domain,has_mobile,last_seen'

        # Разведка кол-ва
        total_vk_count = 0
        count_success = False
        for token in unique_tokens:
            try:
                initial_resp = raw_vk_call('groups.getMembers', {
                    'group_id': numeric_id, 'count': 1, 'access_token': token
                }, project_id=project_id)
                total_vk_count = initial_resp.get('count', 0)
                count_success = True
                break 
            except Exception:
                continue 

        if not count_success:
             task_monitor.update_task(task_id, "error", error="Не удалось получить кол-во подписчиков.")
             return

        # Чанкинг
        tasks_params = []
        current_offset = 0
        while current_offset < total_vk_count:
            remaining = total_vk_count - current_offset
            chunk_size = min(remaining, EXECUTE_BATCH_SIZE)
            tasks_params.append({"offset": current_offset, "count": chunk_size})
            current_offset += chunk_size

        total_fetched = 0
        max_workers = min(len(unique_tokens), 15)
        
        # --- ФАЗА 2.1: ПАРАЛЛЕЛЬНАЯ ЗАГРУЗКА ---
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_params = {}
            for i, params in enumerate(tasks_params):
                future = executor.submit(
                    _fetch_batch_execute_members,
                    unique_tokens, i, numeric_id, params['offset'], params['count'], fields, project_id
                )
                future_to_params[future] = params

            for future in concurrent.futures.as_completed(future_to_params):
                params = future_to_params[future]
                try:
                    items = future.result()
                    all_members.extend(items)
                    total_fetched += len(items)
                    task_monitor.update_task(task_id, "fetching", loaded=total_fetched, total=total_vk_count)
                except Exception as e:
                    print(f"Chunk failed (offset {params['offset']}): {e}. Adding to retry queue.")
                    failed_chunks.append(params)

        # --- ФАЗА 2.2: ПОСЛЕДОВАТЕЛЬНАЯ ПОВТОРНАЯ ОБРАБОТКА (RETRY) ---
        if failed_chunks:
            print(f"SERVICE: Starting RETRY for {len(failed_chunks)} failed chunks...")
            task_monitor.update_task(task_id, "fetching", message=f"Докачка ошибок ({len(failed_chunks)})...", loaded=total_fetched, total=total_vk_count)
            
            for i, params in enumerate(failed_chunks):
                try:
                    # Ждем немного перед запросом, чтобы дать API отдохнуть
                    time.sleep(1.0)
                    
                    # Выполняем в том же потоке (последовательно) для надежности
                    items = _fetch_batch_execute_members(
                        unique_tokens, i, numeric_id, params['offset'], params['count'], fields, project_id
                    )
                    
                    if items:
                        all_members.extend(items)
                        total_fetched += len(items)
                        print(f"   -> Retry success: offset {params['offset']}, got {len(items)} items")
                    else:
                        print(f"   -> Retry returned empty for offset {params['offset']}")
                        
                    task_monitor.update_task(task_id, "fetching", loaded=total_fetched, total=total_vk_count)

                except Exception as e:
                    print(f"   -> Retry FAILED for offset {params['offset']}: {e}")

        threshold = int(total_vk_count * 0.95) # Повысили порог до 95%
        if total_fetched < threshold:
             task_monitor.update_task(task_id, "error", error=f"Критическая потеря данных. Скачано {total_fetched} из {total_vk_count}.")
             return
             
    except Exception as e:
        print(f"SERVICE ERROR (Stage 2): {e}")
        task_monitor.update_task(task_id, "error", error=f"Download failed: {e}")
        return


    # --- ЭТАП 3: СОХРАНЕНИЕ (Write with Session Rotation) ---
    # Используем ротацию сессий для предотвращения таймаутов транзакций при больших объемах
    try:
        task_monitor.update_task(task_id, "processing", message="Анализ изменений...")

        vk_members_map = {}
        for m in all_members:
            if 'id' in m:
                vk_members_map[m['id']] = m

        vk_ids_set = set(vk_members_map.keys())
        
        # Сравниваем с db_ids_set, который мы получили на Этапе 1
        new_ids = list(vk_ids_set - db_ids_set)
        left_ids = list(db_ids_set - vk_ids_set)
        
        # ID, которые есть и в базе, и в VK. Их нужно обновить.
        existing_ids = list(vk_ids_set.intersection(db_ids_set))
        
        timestamp = get_rounded_timestamp() 
        
        SUPER_BATCH_SIZE = 3000

        # 1. Обработка НОВЫХ (JOIN)
        if new_ids:
            total_new = len(new_ids)
            for i in range(0, total_new, SUPER_BATCH_SIZE):
                batch_ids = new_ids[i:i + SUPER_BATCH_SIZE]
                task_monitor.update_task(task_id, "processing", message=f"Сохранение новых: {min(i + SUPER_BATCH_SIZE, total_new)}/{total_new}")
                
                new_subscribers_data = []
                new_history_join_data = []
                
                # Подготовка данных в памяти (CPU)
                for vk_id in batch_ids:
                    vk_data = vk_members_map[vk_id]
                    
                    base_data = {
                        "project_id": project_id,
                        "vk_user_id": vk_id,
                        "first_name": vk_data.get('first_name'),
                        "last_name": vk_data.get('last_name'),
                        "sex": vk_data.get('sex'),
                        "photo_url": vk_data.get('photo_100'),
                        "domain": vk_data.get('domain'),
                        "bdate": vk_data.get('bdate'),
                        "city": vk_data.get('city', {}).get('title') if vk_data.get('city') else None,
                        "country": vk_data.get('country', {}).get('title') if vk_data.get('country') else None,
                        "has_mobile": bool(vk_data.get('has_mobile')),
                        "deactivated": vk_data.get('deactivated'),
                        "last_seen": vk_data.get('last_seen', {}).get('time') if vk_data.get('last_seen') else None,
                        "platform": vk_data.get('last_seen', {}).get('platform') if vk_data.get('last_seen') else None,
                        "source": "manual"
                    }

                    subscriber_entry = base_data.copy()
                    subscriber_entry["id"] = f"{project_id}_{vk_id}"
                    subscriber_entry["added_at"] = datetime.now(timezone.utc)
                    new_subscribers_data.append(subscriber_entry)
                    
                    history_join_entry = base_data.copy()
                    history_join_entry["id"] = str(uuid.uuid4())
                    history_join_entry["event_date"] = datetime.now(timezone.utc)
                    new_history_join_data.append(history_join_entry)
                
                # Запись в БД с новой сессией
                db_batch = SessionLocal()
                try:
                    crud.bulk_add_subscribers(db_batch, new_subscribers_data)
                    crud.bulk_add_history_join(db_batch, new_history_join_data)
                finally:
                    db_batch.close()

        # 2. Обработка УШЕДШИХ (LEAVE)
        if left_ids:
            total_left = len(left_ids)
            for i in range(0, total_left, SUPER_BATCH_SIZE):
                batch_ids = left_ids[i:i + SUPER_BATCH_SIZE]
                task_monitor.update_task(task_id, "processing", message=f"Обработка вышедших: {min(i + SUPER_BATCH_SIZE, total_left)}/{total_left}")
                
                db_batch = SessionLocal()
                try:
                    leavers_data = crud.get_subscribers_by_vk_ids(db_batch, project_id, batch_ids)
                    
                    new_history_leave_data = []
                    for leaver in leavers_data:
                         new_history_leave_data.append({
                            "id": str(uuid.uuid4()),
                            "project_id": project_id,
                            "vk_user_id": leaver.vk_user_id,
                            "first_name": leaver.first_name,
                            "last_name": leaver.last_name,
                            "sex": leaver.sex,
                            "photo_url": leaver.photo_url,
                            "domain": leaver.domain,
                            "bdate": leaver.bdate,
                            "city": leaver.city,
                            "country": leaver.country,
                            "has_mobile": leaver.has_mobile,
                            "deactivated": leaver.deactivated,
                            "last_seen": leaver.last_seen,
                            "platform": leaver.platform,
                            "event_date": datetime.now(timezone.utc),
                            "source": "manual"
                        })
                    
                    if new_history_leave_data:
                        crud.bulk_add_history_leave(db_batch, new_history_leave_data)

                    crud.bulk_delete_subscribers(db_batch, project_id, batch_ids)
                finally:
                    db_batch.close()

        # 3. Обновление СУЩЕСТВУЮЩИХ (UPDATE DETAILS)
        # Это важно, чтобы данные (онлайн, платформа) были актуальны после рефреша
        if existing_ids:
            total_existing = len(existing_ids)
            for i in range(0, total_existing, SUPER_BATCH_SIZE):
                batch_ids = existing_ids[i:i + SUPER_BATCH_SIZE]
                task_monitor.update_task(task_id, "processing", message=f"Обновление существующих: {min(i + SUPER_BATCH_SIZE, total_existing)}/{total_existing}")
                
                updates = []
                for vk_id in batch_ids:
                    vk_data = vk_members_map[vk_id]
                    updates.append({
                        'vk_user_id': vk_id,
                        'first_name': vk_data.get('first_name'),
                        'last_name': vk_data.get('last_name'),
                        'sex': vk_data.get('sex'),
                        'photo_url': vk_data.get('photo_100'),
                        'domain': vk_data.get('domain'),
                        'bdate': vk_data.get('bdate'),
                        'city': vk_data.get('city', {}).get('title') if vk_data.get('city') else None,
                        'country': vk_data.get('country', {}).get('title') if vk_data.get('country') else None,
                        'has_mobile': bool(vk_data.get('has_mobile')),
                        'deactivated': vk_data.get('deactivated'),
                        'last_seen': vk_data.get('last_seen', {}).get('time') if vk_data.get('last_seen') else None,
                        'platform': vk_data.get('last_seen', {}).get('platform') if vk_data.get('last_seen') else None,
                    })
                
                db_batch = SessionLocal()
                try:
                    crud.bulk_update_subscriber_details(db_batch, project_id, updates)
                finally:
                    db_batch.close()

        # 4. Обновление МЕТАДАННЫХ (отдельная короткая сессия)
        db_meta = SessionLocal()
        try:
            current_subscribers_count = len(vk_ids_set)
            
            meta_updates = {
                "subscribers_last_updated": timestamp,
                "subscribers_count": current_subscribers_count
            }
            
            current_meta = crud.get_list_meta(db_meta, project_id)
            
            if new_ids:
                meta_updates["history_join_last_updated"] = timestamp
                meta_updates["history_join_count"] = (current_meta.history_join_count or 0) + len(new_ids)

            if left_ids:
                meta_updates["history_leave_last_updated"] = timestamp
                meta_updates["history_leave_count"] = (current_meta.history_leave_count or 0) + len(left_ids)

            crud.update_list_meta(db_meta, project_id, meta_updates)
        finally:
            db_meta.close()
        
        task_monitor.update_task(task_id, "done")
    
    except Exception as e:
        print(f"SERVICE ERROR (Stage 3): {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
