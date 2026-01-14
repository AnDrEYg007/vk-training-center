
from sqlalchemy.orm import Session
from fastapi import HTTPException
import time

import crud
import services.automations.reviews.crud as crud_automations # Import automations crud
import schemas
from database import SessionLocal
# ИЗМЕНЕНО: Прямые импорты модулей вместо from services import ...
import services.task_monitor as task_monitor
import services.post_retrieval_service as post_retrieval_service
# Добавляем сервис товаров для массового обновления
import services.market_service as market_service
from config import settings

def get_initial_data(db: Session) -> dict:
    projects = crud.get_all_projects(db)
    suggested_counts = crud.get_suggested_post_counts(db)
    
    # Fill in counts for projects with 0 suggested posts
    for p in projects:
        if p.id not in suggested_counts:
            suggested_counts[p.id] = 0
            
    # Получаем статусы конкурсов отзывов
    reviews_contest_statuses = crud_automations.get_all_contest_statuses(db)
            
    return {
        "projects": projects,
        "allPosts": {},
        "suggestedPostCounts": suggested_counts,
        "reviewsContestStatuses": reviews_contest_statuses
    }

def get_project_details(db: Session, project_id: str) -> schemas.Project:
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project with id {project_id} not found.")
    return project

def update_project_settings(db: Session, project_data: schemas.Project) -> schemas.Project:
    updated_project = crud.update_project_settings(db, project_data)
    if not updated_project:
        raise HTTPException(status_code=404, detail=f"Project with id {project_data.id} not found for update.")
    return updated_project

def get_project_variables(db: Session, project_id: str) -> list[dict]:
    return crud.get_project_variables(db, project_id)

# --- Background Tasks ---

def refresh_all_projects_task(task_id: str, view_type: str = 'schedule'):
    """
    Фоновая задача для последовательного обновления всех активных проектов.
    Запрашивает данные в зависимости от view_type.
    """
    db = SessionLocal()
    try:
        # 1. Получаем все активные проекты
        projects = crud.get_all_projects(db)
        total_count = len(projects)
        
        target_name = "расписание"
        if view_type == 'suggested':
            target_name = "предложенные посты"
        elif view_type == 'products':
            target_name = "товары"
            
        task_monitor.update_task(task_id, "processing", loaded=0, total=total_count, message=f"Найдено {total_count} проектов. Обновляем {target_name}.")
        
        success_count = 0
        error_count = 0
        
        for i, project in enumerate(projects):
            current_progress = i + 1
            # ВАЖНО: Добавляем спец. маркер [PID:...] в начало сообщения, чтобы фронтенд мог распарсить ID
            # и повесить лоадер на конкретный проект, а также обновить предыдущий.
            status_message = f"[PID:{project.id}] Обработка: {project.name}"
            
            task_monitor.update_task(
                task_id, 
                "processing", 
                loaded=current_progress, 
                total=total_count, 
                message=status_message
            )
            
            try:
                if view_type == 'suggested':
                    post_retrieval_service.refresh_suggested_posts(db, project.id, settings.vk_user_token)
                elif view_type == 'products':
                    # Для товаров вызываем метод принудительного обновления всего
                    market_service.refresh_all_market_data(db, project.id, settings.vk_user_token)
                else:
                    # Default: schedule (scheduled + published)
                    # Обновляем отложку
                    post_retrieval_service.refresh_scheduled_posts(db, project.id, settings.vk_user_token)
                    # Обновляем опубликованные
                    post_retrieval_service.refresh_published_posts(db, project.id, settings.vk_user_token)
                
                success_count += 1
            except Exception as e:
                print(f"TASK {task_id}: Error refreshing project {project.name}: {e}")
                error_count += 1
                # Не прерываем цикл, идем к следующему проекту
            
            # Небольшая пауза, чтобы не задушить VK API, если проектов очень много
            time.sleep(0.5)

        result_msg = f"Завершено. Успешно: {success_count}, Ошибок: {error_count}"
        task_monitor.update_task(task_id, "done", message=result_msg)
        
    except Exception as e:
        print(f"TASK {task_id} CRITICAL ERROR: {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()