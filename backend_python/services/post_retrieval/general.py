
from sqlalchemy.orm import Session
import crud
import services.automations.reviews.scheduler as contest_scheduler

def get_all_data_for_projects(db: Session, project_ids: list[str]) -> dict:
    # Перед загрузкой данных проверяем, не просрочены ли посты автоматизаций
    # и сдвигаем их в будущее, если нужно
    for pid in project_ids:
        contest_scheduler.ensure_future_contest_posts(db, pid)

    return crud.get_all_data_for_project_ids(db, project_ids)

def get_project_update_status(db: Session) -> dict:
    return crud.get_project_update_status(db)
