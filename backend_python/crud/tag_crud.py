from sqlalchemy.orm import Session
import uuid

import models
from schemas import TagCreate, TagUpdate

# ===============================================
# TAGS
# ===============================================

def get_tags_by_project_id(db: Session, project_id: str) -> list[models.Tag]:
    return db.query(models.Tag).filter(models.Tag.project_id == project_id).order_by(models.Tag.name).all()

def create_tag(db: Session, tag_data: TagCreate, project_id: str) -> models.Tag:
    db_tag = models.Tag(
        id=str(uuid.uuid4()),
        project_id=project_id,
        **tag_data.model_dump()
    )
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def update_tag(db: Session, tag_id: str, tag_data: TagUpdate) -> models.Tag:
    db_tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if db_tag:
        update_data = tag_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_tag, key, value)
        db.commit()
        db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: str) -> bool:
    deleted_count = db.query(models.Tag).filter(models.Tag.id == tag_id).delete()
    db.commit()
    return deleted_count > 0
