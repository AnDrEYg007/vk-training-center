
from sqlalchemy.orm import Session
import crud
import models
import services.automations.reviews.crud as crud_automations

def get_contest_entries(db: Session, project_id: str) -> list[models.ReviewContestEntry]:
    contest = crud_automations.get_contest_settings(db, project_id)
    if not contest:
        return []
    
    return db.query(models.ReviewContestEntry)\
        .filter(models.ReviewContestEntry.contest_id == contest.id)\
        .order_by(models.ReviewContestEntry.created_at.desc())\
        .all()

def clear_contest_entries(db: Session, project_id: str):
    """Очищает список участников конкурса через CRUD."""
    crud_automations.delete_contest_entries(db, project_id)
