
from sqlalchemy.orm import Session

def get_core_counts(db: Session, model, project_id: str) -> dict:
    """Считает общее количество, активных, забаненных и удаленных."""
    base_query = db.query(model).filter(model.project_id == project_id)
    
    total = base_query.count()
    if total == 0:
        return {
            "total_users": 0,
            "banned_count": 0,
            "deleted_count": 0,
            "active_count": 0
        }

    banned = base_query.filter(model.deactivated == 'banned').count()
    deleted = base_query.filter(model.deactivated == 'deleted').count()
    active = total - banned - deleted
    
    return {
        "total_users": total,
        "banned_count": banned,
        "deleted_count": deleted,
        "active_count": active
    }
