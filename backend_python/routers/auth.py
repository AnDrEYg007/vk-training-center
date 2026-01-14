from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import schemas
import services.auth_service as auth_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/auth/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginPayload, db: Session = Depends(get_db)):
    """
    Аутентифицирует пользователя по логину и паролю.
    Сначала проверяет учетные данные администратора из .env, затем ищет в базе данных.
    """
    result = auth_service.authenticate_user(db, payload.username, payload.password)
    if not result:
        # Используем HTTPException с кодом 401, который будет обработан middleware
        raise HTTPException(
            status_code=401,
            detail="Неправильный логин или пароль",
        )
    return result
