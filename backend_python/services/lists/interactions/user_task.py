
import crud
import models
from services import task_monitor
from services.lists.list_sync_utils import get_all_project_tokens, fetch_users_smart_parallel
from crud.lists.utils import deduplicate_users
from database import SessionLocal

def refresh_interaction_users_task(task_id: str, project_id: str, list_type: str, user_token: str):
    """
    Фоновая задача обновления профилей взаимодействий (Split Session).
    """
    # --- Phase 1: Read ---
    all_vk_ids = []
    unique_tokens = []
    model = None

    if list_type == 'likes': model = models.SystemListLikes
    elif list_type == 'comments': model = models.SystemListComments
    elif list_type == 'reposts': model = models.SystemListReposts
    
    db = SessionLocal()
    try:
        if not model:
            task_monitor.update_task(task_id, "error", error="Invalid list type")
            return

        # Удаляем дубликаты перед обработкой
        deduplicate_users(db, model, project_id)

        all_vk_ids = crud.get_all_interaction_vk_ids(db, project_id, list_type)
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
    
    def on_progress(loaded, total):
        task_monitor.update_task(task_id, "fetching", loaded=loaded, total=total)

    fields = 'last_seen,first_name,last_name,sex,photo_100,bdate,city,country,domain,has_mobile'
    fetched_users = fetch_users_smart_parallel(all_vk_ids, unique_tokens, fields, project_id, on_progress)
    
    # --- Phase 3: Write ---
    db = SessionLocal()
    try:
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
            crud.bulk_update_interaction_users(db, project_id, list_type, updates)
        
        task_monitor.update_task(task_id, "done")

    except Exception as e:
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
