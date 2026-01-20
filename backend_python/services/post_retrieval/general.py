
from sqlalchemy.orm import Session
from fastapi import BackgroundTasks
import crud
import services.automations.reviews.scheduler as contest_scheduler

def process_contest_scheduler_updates(db_session_factory, project_ids: list[str]):
    # Создаем новую сессию, так как фоновая задача работает после завершения запроса
    db = db_session_factory()
    try:
        for pid in project_ids:
            contest_scheduler.ensure_future_contest_posts(db, pid)
    except Exception as e:
        print(f"Error in background contest scheduler update: {e}")
    finally:
        db.close()

def get_all_data_for_projects(db: Session, project_ids: list[str], background_tasks: BackgroundTasks = None) -> dict:
    # Оптимизация: переносим тяжелую проверку дат в фон
    # Это позволяет пользователю сразу получить контент, а обновление дат
    # произойдет асинхронно и отобразится при следующем обновлении
    if background_tasks:
        # Импортируем SessionLocal внутри функции, чтобы избежать циклических импортов на уровне модуля
        from database import SessionLocal
        background_tasks.add_task(process_contest_scheduler_updates, SessionLocal, project_ids)
    else:
        # Fallback для старых вызовов без bg tasks
        try:
             for pid in project_ids:
                contest_scheduler.ensure_future_contest_posts(db, pid)
        except: pass

    return crud.get_all_data_for_project_ids(db, project_ids)

def get_project_update_status(db: Session) -> dict:
    return crud.get_project_update_status(db)
