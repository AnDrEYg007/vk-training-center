from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import schemas
import services.user_service as user_service
from database import SessionLocal

router = APIRouter(prefix="/users", tags=["User Management"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getAll", response_model=List[schemas.User])
def get_all_users(db: Session = Depends(get_db)):
    """Возвращает полный список всех пользователей для страницы управления."""
    return user_service.get_all_users(db)

@router.post("/updateAll", response_model=schemas.GenericSuccess)
def update_all_users(payload: schemas.UpdateUsersPayload, db: Session = Depends(get_db)):
    """Массово обновляет, создает и удаляет пользователей."""
    user_service.update_users(db, payload.users)
    return {"success": True}
