from sqlalchemy.orm import Session
from typing import Optional
from config import settings
import crud

def authenticate_user(db: Session, username: str, password: str) -> Optional[dict]:
    """
    Проверяет учетные данные пользователя.
    1. Сравнивает с данными администратора из .env.
    2. Если не совпадает, ищет пользователя в базе данных.
    """
    # 1. Проверяем, является ли пользователь администратором
    if username == settings.admin_username and password == settings.admin_password:
        return {"success": True, "username": username, "role": "admin"}

    # 2. Если нет, ищем в базе данных
    user = crud.get_user_by_username(db, username)
    if user and user.password == password:
        return {"success": True, "username": user.username, "role": "user"}

    # Если ни одно условие не выполнено
    return None