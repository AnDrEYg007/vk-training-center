
from sqlalchemy.orm import Session
from fastapi import HTTPException

import crud
import schemas
from services import vk_service
from services.vk_service import VkApiError
from services.vk_callback.debounce import set_event_cooldown, clear_event_cooldown

def delete_scheduled_post(db: Session, payload: schemas.DeletePostPayload, user_token: str):
    """
    Удаляет отложенный пост.
    
    Устанавливает cooldown на события wall_schedule_post_delete,
    чтобы callback от VK не вызывал дублирующий refresh.
    """
    owner_id, post_id = payload.postId.split('_')
    
    # Извлекаем group_id (owner_id отрицательный для групп)
    group_id = abs(int(owner_id))
    
    # Устанавливаем cooldown ПЕРЕД удалением
    set_event_cooldown(group_id, "wall_schedule_post_delete")
    
    try:
        vk_service.call_vk_api('wall.delete', {'owner_id': owner_id, 'post_id': post_id, 'access_token': user_token})
    except VkApiError as e:
        if e.code not in {100, 212}: 
            # При ошибке снимаем cooldown
            clear_event_cooldown(group_id, "wall_schedule_post_delete")
            raise HTTPException(status_code=400, detail=str(e))
    finally:
        # Cooldown автоматически истечёт через 30 сек
        # Не снимаем его сразу, т.к. callback от VK может прийти с задержкой
        pass
    
    crud.delete_post_from_cache(db, payload.postId, is_published=False)

def delete_published_post(db: Session, payload: schemas.DeletePostPayload, user_token: str) -> str:
    owner_id, post_id = payload.postId.split('_')
    message = 'deleted'
    try:
        vk_service.call_vk_api('wall.delete', {'owner_id': owner_id, 'post_id': post_id, 'access_token': user_token})
    except VkApiError as e:
        if e.code in {100, 212}: message = 'already_deleted'
        else: raise HTTPException(status_code=400, detail=str(e))
    crud.delete_post_from_cache(db, payload.postId, is_published=True)
    return message
