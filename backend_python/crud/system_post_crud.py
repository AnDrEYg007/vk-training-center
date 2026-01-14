
from sqlalchemy.orm import Session
import uuid
import json
from typing import List

import models
from schemas import SystemPost as SystemPostSchema

def get_system_post_by_id(db: Session, post_id: str) -> models.SystemPost:
    return db.query(models.SystemPost).filter(models.SystemPost.id == post_id).first()

def get_system_posts_for_project_ids(db: Session, project_ids: List[str]) -> List[models.SystemPost]:
    return db.query(models.SystemPost).filter(models.SystemPost.project_id.in_(project_ids)).all()

def create_or_update_system_post(db: Session, project_id: str, post_data: SystemPostSchema) -> models.SystemPost:
    is_new = post_data.id.startswith('new-post-')
    
    db_post = None
    if not is_new:
        db_post = get_system_post_by_id(db, post_data.id)

    if db_post:
        # Обновление
        db_post.publication_date = post_data.publication_date
        db_post.text = post_data.text
        db_post.images = json.dumps([img.model_dump() for img in post_data.images])
        db_post.attachments = json.dumps([att.model_dump() for att in post_data.attachments])
        db_post.status = 'pending_publication' # Сбрасываем статус при редактировании
        # Обновление цикличности
        db_post.is_cyclic = post_data.is_cyclic
        db_post.recurrence_type = post_data.recurrence_type
        db_post.recurrence_interval = post_data.recurrence_interval
        # Обновление расширенных настроек цикличности
        db_post.recurrence_end_type = post_data.recurrence_end_type
        db_post.recurrence_end_count = post_data.recurrence_end_count
        db_post.recurrence_end_date = post_data.recurrence_end_date
        db_post.recurrence_fixed_day = post_data.recurrence_fixed_day
        db_post.recurrence_is_last_day = post_data.recurrence_is_last_day
        # Обновление параметров AI
        db_post.ai_generation_params = post_data.ai_generation_params
    else:
        # Создание
        db_post = models.SystemPost(
            id=str(uuid.uuid4()),
            project_id=project_id,
            publication_date=post_data.publication_date,
            text=post_data.text,
            images=json.dumps([img.model_dump() for img in post_data.images]),
            attachments=json.dumps([att.model_dump() for att in post_data.attachments]),
            status='pending_publication',
            post_type='regular',
            # Сохранение цикличности
            is_cyclic=post_data.is_cyclic,
            recurrence_type=post_data.recurrence_type,
            recurrence_interval=post_data.recurrence_interval,
            # Сохранение расширенных настроек
            recurrence_end_type=post_data.recurrence_end_type,
            recurrence_end_count=post_data.recurrence_end_count,
            recurrence_end_date=post_data.recurrence_end_date,
            recurrence_fixed_day=post_data.recurrence_fixed_day,
            recurrence_is_last_day=post_data.recurrence_is_last_day,
            # Сохранение параметров AI
            ai_generation_params=post_data.ai_generation_params
        )
        db.add(db_post)
    
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_system_post(db: Session, post_id: str) -> bool:
    db_post = get_system_post_by_id(db, post_id)
    if db_post:
        db.delete(db_post)
        db.commit()
        return True
    return False
