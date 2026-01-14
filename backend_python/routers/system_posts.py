from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import schemas
import services.system_post_service as system_post_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Изменено: эндпоинт теперь POST /deleteSystemPost и принимает payload
@router.post("/deleteSystemPost", response_model=schemas.GenericSuccess)
def delete_system_post(payload: schemas.SimplePostIdPayload, db: Session = Depends(get_db)):
    """Удаляет системный пост по его ID."""
    system_post_service.delete_system_post(db, payload.postId)
    return {"success": True}

# Изменено: payload теперь SimplePostIdPayload, чтобы использовать `postId`
@router.post("/moveSystemPostToScheduled", response_model=schemas.GenericSuccess)
def move_to_scheduled(payload: schemas.SimplePostIdPayload, db: Session = Depends(get_db)):
    """Переносит системный пост в отложенные посты VK."""
    system_post_service.move_to_scheduled(db, payload.postId)
    return {"success": True}

# Изменено: payload теперь SimplePostIdPayload, чтобы использовать `postId`
@router.post("/confirmSystemPostPublication", response_model=schemas.GenericSuccess)
def confirm_publication(payload: schemas.SimplePostIdPayload, db: Session = Depends(get_db)):
    """Подтверждает публикацию поста с возможной ошибкой, удаляя его из системы."""
    system_post_service.confirm_publication(db, payload.postId)
    return {"success": True}

# Новый эндпоинт для немедленной публикации системного поста
@router.post("/publishSystemPostNow", response_model=schemas.GenericSuccess)
def publish_system_post_now(payload: schemas.SimplePostIdPayload, db: Session = Depends(get_db)):
    """Публикует системный пост немедленно."""
    system_post_service.publish_system_post_now(db, payload.postId)
    return {"success": True}