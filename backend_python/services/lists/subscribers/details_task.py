
import crud
import models
from services import task_monitor
from services.post_helpers import get_rounded_timestamp
from database import SessionLocal
from services.lists.list_sync_utils import get_all_project_tokens, fetch_users_smart_parallel
from crud.lists.utils import deduplicate_users

def refresh_subscriber_details_task(task_id: str, project_id: str, user_token: str):
    """
    Фоновая задача для обновления деталей (статус, город, фото) существующих подписчиков.
    """
    # --- Phase 1: Read ---
    all_vk_ids = []
    unique_tokens = []
    
    db = SessionLocal()
    try:
        project = crud.get_project_by_id(db, project_id)
        if not project:
            task_monitor.update_task(task_id, "error", error="Project not found")
            return

        # 1. Получаем список ID всех текущих подписчиков
        # Перед этим можно сделать дедупликацию, на всякий случай
        deduplicate_users(db, models.SystemListSubscriber, project_id)
        
        all_vk_ids = list(crud.get_all_subscriber_vk_ids(db, project_id))
        unique_tokens = get_all_project_tokens(db, user_token)
    finally:
        db.close()

    if not all_vk_ids:
        task_monitor.update_task(task_id, "done", message="Нет подписчиков")
        return
        
    if not unique_tokens:
        task_monitor.update_task(task_id, "error", error="Нет токенов")
        return

    # --- Phase 2: Network ---
    task_monitor.update_task(task_id, "fetching", loaded=0, total=len(all_vk_ids))
    
    # Запрашиваем те же поля, что и при основной синхронизации
    fields = 'sex,bdate,city,country,photo_100,domain,has_mobile,last_seen,deactivated,is_closed,can_access_closed'
    
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
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'sex': user_data.get('sex'),
                'photo_url': user_data.get('photo_100'),
                'domain': user_data.get('domain'),
                'bdate': user_data.get('bdate'),
                'city': user_data.get('city', {}).get('title') if user_data.get('city') else None,
                'country': user_data.get('country', {}).get('title') if user_data.get('country') else None,
                'has_mobile': bool(user_data.get('has_mobile')),
                'deactivated': user_data.get('deactivated'),
                'last_seen': user_data.get('last_seen', {}).get('time') if user_data.get('last_seen') else None,
                'platform': user_data.get('last_seen', {}).get('platform') if user_data.get('last_seen') else None,
                'is_closed': user_data.get('is_closed'),
                'can_access_closed': user_data.get('can_access_closed')
            })
        
        if updates:
            crud.bulk_update_subscriber_details(db, project_id, updates)
            
        # Обновляем метаданные
        # Мы не меняли количество, но обновили дату актуальности
        timestamp = get_rounded_timestamp()
        
        # Пересчитываем кол-во на всякий случай (после дедупликации)
        real_count = db.query(models.SystemListSubscriber).filter(models.SystemListSubscriber.project_id == project_id).count()
        
        crud.update_list_meta(db, project_id, {
            "subscribers_last_updated": timestamp,
            "subscribers_count": real_count
        })

        task_monitor.update_task(task_id, "done", message="Данные обновлены")

    except Exception as e:
        print(f"SERVICE ERROR (Details Task): {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
