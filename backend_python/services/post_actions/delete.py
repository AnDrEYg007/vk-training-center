
from sqlalchemy.orm import Session
from fastapi import HTTPException

import crud
import schemas
from services import vk_service
from services.vk_service import VkApiError

def delete_scheduled_post(db: Session, payload: schemas.DeletePostPayload, user_token: str):
    owner_id, post_id = payload.postId.split('_')
    try:
        vk_service.call_vk_api('wall.delete', {'owner_id': owner_id, 'post_id': post_id, 'access_token': user_token})
    except VkApiError as e:
        if e.code not in {100, 212}: raise HTTPException(status_code=400, detail=str(e))
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
