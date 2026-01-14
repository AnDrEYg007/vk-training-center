
from sqlalchemy.orm import Session
from typing import List, Dict
import models

def bulk_upsert_posts(db: Session, posts: List[Dict]):
    if not posts: return
    post_ids = [p['id'] for p in posts]
    
    # Удаление старых записей (тоже стоит разбить, если их очень много, но обычно < 1000)
    CHUNK_SIZE_DELETE = 500
    for i in range(0, len(post_ids), CHUNK_SIZE_DELETE):
        chunk = post_ids[i:i + CHUNK_SIZE_DELETE]
        db.query(models.SystemListPost).filter(models.SystemListPost.id.in_(chunk)).delete(synchronize_session=False)
        db.commit()
    
    # Пакетная вставка
    CHUNK_SIZE_INSERT = 100
    for i in range(0, len(posts), CHUNK_SIZE_INSERT):
        chunk = posts[i:i + CHUNK_SIZE_INSERT]
        db.bulk_insert_mappings(models.SystemListPost, chunk)
        db.commit()

def get_stored_posts_count(db: Session, project_id: str) -> int:
    return db.query(models.SystemListPost).filter(models.SystemListPost.project_id == project_id).count()

def delete_all_posts(db: Session, project_id: str):
    """Полное удаление всех постов списка."""
    db.query(models.SystemListPost).filter(
        models.SystemListPost.project_id == project_id
    ).delete(synchronize_session=False)
    db.commit()
