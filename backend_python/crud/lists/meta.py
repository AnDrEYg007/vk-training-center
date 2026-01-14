from sqlalchemy.orm import Session
from typing import Dict
import models

def get_list_meta(db: Session, project_id: str) -> models.ProjectListMeta:
    meta = db.query(models.ProjectListMeta).filter(models.ProjectListMeta.project_id == project_id).first()
    if not meta:
        # Создаем дефолтную запись, если ее нет
        meta = models.ProjectListMeta(
            id=project_id,
            project_id=project_id,
            subscribers_count=0,
            history_join_count=0,
            history_leave_count=0,
            posts_count=0,
            likes_count=0,
            comments_count=0,
            reposts_count=0
        )
        db.add(meta)
        db.commit()
        db.refresh(meta)
    return meta

def update_list_meta(db: Session, project_id: str, updates: Dict):
    meta = get_list_meta(db, project_id)
    for key, value in updates.items():
        setattr(meta, key, value)
    db.commit()