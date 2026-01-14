
from sqlalchemy.orm import Session
from typing import List
import uuid

import models
import schemas

def get_all_tokens(db: Session) -> List[models.AiToken]:
    return db.query(models.AiToken).all()

def delete_token(db: Session, token_id: str) -> bool:
    deleted_count = db.query(models.AiToken).filter(models.AiToken.id == token_id).delete()
    db.commit()
    return deleted_count > 0

def update_tokens(db: Session, tokens_data: List[schemas.AiToken]):
    """
    Массово обновляет, создает и удаляет токены (аналогично пользователям).
    """
    all_current_ids = {str(t.id) for t in db.query(models.AiToken.id).all()}
    all_incoming_ids = {t.id for t in tokens_data if not t.id.startswith('new-')}

    # 1. Удаление
    ids_to_delete = all_current_ids - all_incoming_ids
    if ids_to_delete:
        db.query(models.AiToken).filter(models.AiToken.id.in_(ids_to_delete)).delete(synchronize_session=False)

    # 2. Обновление и создание
    for token_data in tokens_data:
        if token_data.id.startswith('new-'):
            # Создание
            if token_data.token: # Токен обязателен
                new_db_token = models.AiToken(
                    id=str(uuid.uuid4()),
                    description=token_data.description,
                    token=token_data.token
                )
                db.add(new_db_token)
        else:
            # Обновление
            db_token = db.query(models.AiToken).filter(models.AiToken.id == token_data.id).first()
            if db_token:
                db_token.description = token_data.description
                db_token.token = token_data.token
    
    db.commit()
