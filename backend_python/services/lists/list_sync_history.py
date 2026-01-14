
import json
import time

import crud
import models
from services import vk_service, task_monitor
from services.post_helpers import get_rounded_timestamp
from database import SessionLocal
from .list_sync_utils import get_all_project_tokens, fetch_users_smart_parallel
from crud.lists.utils import deduplicate_users

def refresh_history_details_task(task_id: str, project_id: str, list_type: str, user_token: str):
    """
    Фоновая задача для обновления деталей истории (Split Session).
    """
    # --- Phase 1: Read ---
    all_vk_ids = []
    unique_tokens = []
    
    db = SessionLocal()
    try:
        model = None
        if list_type == 'history_join': 
            model = models.SystemListHistoryJoin
        elif list_type == 'history_leave': 
            model = models.SystemListHistoryLeave
        
        if not model:
            task_monitor.update_task(task_id, "error", error="Invalid list type")
            return

        # 1. Удаляем дубликаты перед получением списка ID
        deduplicate_users(db, model, project_id)

        all_vk_ids = crud.get_all_history_vk_ids(db, project_id, list_type)
        unique_tokens = get_all_project_tokens(db, user_token)
    finally:
        db.close()

    if not all_vk_ids:
        task_monitor.update_task(task_id, "done")
        return

    if not unique_tokens:
        task_monitor.update_task(task_id, "error", error="Нет токенов")
        return

    # --- Phase 2: Network ---
    task_monitor.update_task(task_id, "fetching", loaded=0, total=len(all_vk_ids))
    fields = 'last_seen,first_name,last_name,sex,photo_100,bdate,city,country,domain,has_mobile'
    
    def on_progress(loaded, total):
        task_monitor.update_task(task_id, "fetching", loaded=loaded, total=total)

    fetched_users = fetch_users_smart_parallel(all_vk_ids, unique_tokens, fields, project_id, on_progress)
    
    # --- Phase 3: Write ---
    db = SessionLocal()
    try:
        task_monitor.update_task(task_id, "processing", message="Сохранение...")
        
        updates = []
        for user_data in fetched_users:
            updates.append({
                'vk_user_id': user_data['id'],
                'deactivated': user_data.get('deactivated'),
                'last_seen': user_data.get('last_seen', {}).get('time') if user_data.get('last_seen') else None,
                'platform': user_data.get('last_seen', {}).get('platform') if user_data.get('last_seen') else None,
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'sex': user_data.get('sex'),
                'photo_url': user_data.get('photo_100'),
                'domain': user_data.get('domain'),
                'bdate': user_data.get('bdate'),
                'city': user_data.get('city', {}).get('title') if user_data.get('city') else None,
                'country': user_data.get('country', {}).get('title') if user_data.get('country') else None,
                'has_mobile': bool(user_data.get('has_mobile')),
                'is_closed': user_data.get('is_closed'),
                'can_access_closed': user_data.get('can_access_closed')
            })
        
        if updates:
            crud.bulk_update_history_details(db, project_id, list_type, updates)

        # Пересчитываем реальное количество записей
        model = models.SystemListHistoryJoin if list_type == 'history_join' else models.SystemListHistoryLeave
        real_count = db.query(model).filter(model.project_id == project_id).count()

        timestamp = get_rounded_timestamp()
        
        meta_updates = {}
        if list_type == "history_join":
            meta_updates["history_join_last_updated"] = timestamp
            meta_updates["history_join_count"] = real_count
        else:
            meta_updates["history_leave_last_updated"] = timestamp
            meta_updates["history_leave_count"] = real_count
            
        crud.update_list_meta(db, project_id, meta_updates)

        task_monitor.update_task(task_id, "done")

    except Exception as e:
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
