from sqlalchemy.orm import Session
from typing import List
import uuid

import models
import schemas

def get_user_by_username(db: Session, username: str) -> models.User:
    """Находит пользователя по его логину."""
    return db.query(models.User).filter(models.User.username == username).first()

def get_all_users(db: Session) -> List[models.User]:
    """Возвращает всех пользователей, отсортированных по ФИО."""
    return db.query(models.User).order_by(models.User.full_name).all()

def update_users(db: Session, users_data: List[schemas.User]):
    """
    Массово обновляет, создает и удаляет пользователей на основе предоставленного списка.
    """
    all_current_user_ids = {str(u.id) for u in db.query(models.User.id).all()}
    all_incoming_user_ids = {u.id for u in users_data if not u.id.startswith('new-')}

    # 1. Определяем, каких пользователей нужно удалить
    ids_to_delete = all_current_user_ids - all_incoming_user_ids
    if ids_to_delete:
        db.query(models.User).filter(models.User.id.in_(ids_to_delete)).delete(synchronize_session=False)

    # 2. Обновляем существующих и создаем новых пользователей
    for user_data in users_data:
        if user_data.id.startswith('new-'):
            # Создаем нового пользователя, если все поля заполнены
            if user_data.full_name and user_data.username and user_data.password:
                new_db_user = models.User(
                    id=str(uuid.uuid4()),
                    full_name=user_data.full_name,
                    username=user_data.username,
                    password=user_data.password
                )
                db.add(new_db_user)
        else:
            # Обновляем существующего пользователя
            db_user = db.query(models.User).filter(models.User.id == user_data.id).first()
            if db_user:
                db_user.full_name = user_data.full_name
                db_user.username = user_data.username
                # Обновляем пароль, только если он был явно предоставлен
                if user_data.password:
                    db_user.password = user_data.password
    
    db.commit()
