
from sqlalchemy.orm import Session
import schemas

# Импорт функций из специализированных модулей
from .post_actions.save_system import save_as_system_post as _save_as_system_post
from .post_actions.save_vk import save_to_vk_schedule as _save_to_vk_schedule
from .post_actions.delete import delete_scheduled_post, delete_published_post
from .post_actions.publish import publish_now, publish_post_task
from .post_actions.tasks import schedule_post_task

# Ре-экспортируем функции для использования в роутерах и других сервисах
__all__ = [
    'save_post',
    'delete_scheduled_post',
    'delete_published_post',
    'publish_now',
    'publish_post_task',
    'schedule_post_task',
    '_save_as_system_post',
    '_save_to_vk_schedule'
]

def save_post(db: Session, payload: schemas.SavePostPayload, user_token: str) -> schemas.ScheduledPost:
    """Диспетчер сохранения поста."""
    
    # ПРИОРИТЕТ 1: Отложка VK
    if payload.scheduleInVk:
        return _save_to_vk_schedule(db, payload, user_token)
    
    # ПРИОРИТЕТ 2: Системный пост (default)
    else:
        return _save_as_system_post(db, payload)
