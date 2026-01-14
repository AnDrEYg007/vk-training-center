
import json
import time
import concurrent.futures
from datetime import datetime, timezone
from typing import List, Dict, Any

import crud
import models
from services import vk_service, task_monitor
from services.post_helpers import get_rounded_timestamp
from services.vk_api.api_client import call_vk_api as raw_vk_call
from database import SessionLocal

MESSAGES_BATCH_SIZE = 600
INNER_REQ_COUNT = 200

def _fetch_batch_execute_mailing(tokens: List[str], chunk_index: int, offset: int, count_to_fetch: int, project_id: str) -> Dict[str, List]:
    """Воркер для скачивания диалогов."""
    if not tokens:
        return {"items": [], "profiles": []}

    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    rotation_order = tokens[primary_index:] + tokens[:primary_index]
    
    iterations = (count_to_fetch + INNER_REQ_COUNT - 1) // INNER_REQ_COUNT
    
    code = f"""
    var offset = {offset};
    var count = {INNER_REQ_COUNT};
    var iterations = {iterations};
    var items = [];
    var profiles = [];
    var i = 0;
    
    while (i < iterations) {{
        var resp = API.messages.getConversations({{
            "offset": offset + (i * count),
            "count": count,
            "extended": 1,
            "fields": "sex,bdate,city,country,photo_100,domain,has_mobile,last_seen"
        }});
        if (resp.items) {{
            items = items + resp.items;
            profiles = profiles + resp.profiles;
        }}
        i = i + 1;
    }}
    return {{"items": items, "profiles": profiles}};
    """
    
    for token in rotation_order:
        try:
            result = raw_vk_call("execute", {"code": code, "access_token": token}, project_id=project_id)
            items = result.get('items', [])
            if not items and count_to_fetch > 0:
                 raise Exception(f"Empty response from execute.")
            return result
        except Exception as e:
            time.sleep(0.2)

    return {"items": [], "profiles": []}

def refresh_mailing_task(task_id: str, project_id: str):
    """
    Фоновая задача синхронизации рассылки с Split Session.
    """
    
    # --- PHASE 1: PREPARE ---
    unique_tokens = []
    project_name = ""
    
    db = SessionLocal()
    try:
        project = crud.get_project_by_id(db, project_id)
        if not project:
            task_monitor.update_task(task_id, "error", error="Project not found")
            return
        
        project_name = project.name
        project_tokens = []
        if project.communityToken:
            project_tokens.append(project.communityToken)
        
        if project.additional_community_tokens:
            try:
                extras = json.loads(project.additional_community_tokens)
                if isinstance(extras, list):
                    project_tokens.extend([t for t in extras if t])
            except Exception:
                pass

        unique_tokens = list(set(project_tokens))
        if not unique_tokens:
            task_monitor.update_task(task_id, "error", error="Нет токенов сообщества")
            return
    finally:
        db.close()

    # --- PHASE 2: FETCH & INTERMEDIATE SAVE ---
    try:
        print(f"SERVICE: Refreshing mailing for '{project_name}'...")
        
        # Разведка
        total_vk_count = 0
        count_success = False
        for token in unique_tokens:
            try:
                initial_resp = raw_vk_call('messages.getConversations', {
                    'count': 1, 'filter': 'all', 'access_token': token
                }, project_id=project_id)
                total_vk_count = initial_resp.get('count', 0)
                count_success = True
                break
            except Exception:
                continue

        if not count_success:
            task_monitor.update_task(task_id, "error", error="Все токены сообщества не работают.")
            return

        tasks_params = []
        current_offset = 0
        while current_offset < total_vk_count:
            remaining = total_vk_count - current_offset
            chunk_size = min(remaining, MESSAGES_BATCH_SIZE)
            tasks_params.append({"offset": current_offset, "count": chunk_size})
            current_offset += chunk_size

        total_fetched = 0
        processed_count = 0
        max_workers = min(len(unique_tokens), 20)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_offset = {}
            for i, params in enumerate(tasks_params):
                future = executor.submit(
                    _fetch_batch_execute_mailing, unique_tokens, i, params['offset'], params['count'], project_id
                )
                future_to_offset[future] = params['offset']

            for future in concurrent.futures.as_completed(future_to_offset):
                offset_val = future_to_offset[future]
                try:
                    result_data = future.result() or {}
                    items = result_data.get('items', [])
                    profiles = result_data.get('profiles', [])
                    batch_profiles = {p['id']: p for p in profiles}
                    
                    mailing_users_batch = []
                    for item in items:
                        conversation = item.get('conversation', {})
                        peer = conversation.get('peer', {})
                        if peer.get('type') != 'user': continue
                            
                        user_id = peer.get('id')
                        user_data = batch_profiles.get(user_id, {})
                        last_message = item.get('last_message', {})
                        last_msg_date_ts = last_message.get('date', 0)
                        last_msg_date = datetime.fromtimestamp(last_msg_date_ts, timezone.utc) if last_msg_date_ts else None
                        
                        entry = {
                            "vk_user_id": user_id,
                            "first_name": user_data.get('first_name', 'Unknown'),
                            "last_name": user_data.get('last_name', ''),
                            "sex": user_data.get('sex', 0),
                            "photo_url": user_data.get('photo_100'),
                            "domain": user_data.get('domain'),
                            "bdate": user_data.get('bdate'),
                            "city": user_data.get('city', {}).get('title') if user_data.get('city') else None,
                            "country": user_data.get('country', {}).get('title') if user_data.get('country') else None,
                            "has_mobile": bool(user_data.get('has_mobile')),
                            "deactivated": user_data.get('deactivated'),
                            "last_seen": user_data.get('last_seen', {}).get('time') if user_data.get('last_seen') else None,
                            "platform": user_data.get('last_seen', {}).get('platform') if user_data.get('last_seen') else None,
                            "is_closed": user_data.get('is_closed', False),
                            "can_access_closed": bool(conversation.get('can_write', {}).get('allowed')),
                            "last_message_date": last_msg_date,
                            # Заполняем поля, которых не хватало
                            # ИСПОЛЬЗУЕМ СЕРВЕРНОЕ ВРЕМЯ ВМЕСТО UTC
                            "added_at": datetime.now(),
                            "source": "manual"
                        }
                        mailing_users_batch.append(entry)

                    if mailing_users_batch:
                        # !!! PHASE 3 (INTERMEDIATE): WRITE CHUNK !!!
                        db_chunk = SessionLocal()
                        try:
                            crud.bulk_upsert_mailing(db_chunk, project_id, mailing_users_batch)
                        finally:
                            db_chunk.close()
                        processed_count += len(mailing_users_batch)
                    
                    total_fetched += len(items)
                    task_monitor.update_task(task_id, "fetching", loaded=total_fetched, total=total_vk_count)

                except Exception as exc:
                    print(f"   -> Mailing Chunk failed: {exc}")

        threshold = int(total_vk_count * 0.95)
        if total_fetched < threshold:
             task_monitor.update_task(task_id, "error", error=f"Слишком много ошибок. Скачано {total_fetched}/{total_vk_count}.")
             return

        # --- PHASE 4: FINALIZE ---
        db_final = SessionLocal()
        try:
            task_monitor.update_task(task_id, "processing", message="Обновление статистики...")
            real_count = db_final.query(models.SystemListMailing).filter(models.SystemListMailing.project_id == project_id).count()
            timestamp = get_rounded_timestamp()
            crud.update_list_meta(db_final, project_id, {
                "mailing_last_updated": timestamp,
                "mailing_count": real_count
            })
            task_monitor.update_task(task_id, "done", message=f"Загружено {processed_count} диалогов")
        finally:
            db_final.close()

    except Exception as e:
        print(f"Critical error in refresh_mailing_task: {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
