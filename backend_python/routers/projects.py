
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import uuid

import schemas
import services.project_service as project_service
import services.task_monitor as task_monitor
# ИЗМЕНЕНО: Прямой импорт для предотвращения циклических зависимостей
import services.update_tracker as update_tracker
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getInitialData", response_model=schemas.InitialDataResponse)
def get_initial_data(db: Session = Depends(get_db)):
    return project_service.get_initial_data(db)

@router.post("/forceRefreshProjects", response_model=schemas.ForceRefreshResponse)
def force_refresh_projects(db: Session = Depends(get_db)):
    # По сути, это та же логика, что и getInitialData, так как кеширования на уровне API нет
    return project_service.get_initial_data(db)

@router.post("/getProjectDetails", response_model=schemas.Project)
def get_project_details(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return project_service.get_project_details(db, payload.projectId)

@router.post("/updateProjectSettings", response_model=schemas.Project)
def update_project_settings(payload: schemas.UpdateProjectPayload, db: Session = Depends(get_db)):
    return project_service.update_project_settings(db, payload.project)

@router.post("/getProjectVariables", response_model=schemas.VariablesResponse)
def get_project_variables(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    variables = project_service.get_project_variables(db, payload.projectId)
    return {"variables": variables}

# Новый эндпоинт для фонового опроса
@router.post("/getUpdates", response_model=Dict[str, List[str]])
async def get_updates():
    return update_tracker.get_and_clear_updates()

@router.post("/bulkRefreshProjects", response_model=schemas.TaskStartResponse)
def bulk_refresh_projects(payload: schemas.BulkRefreshPayload, background_tasks: BackgroundTasks):
    """
    Запускает глобальную задачу обновления всех проектов.
    Если viewType == 'suggested', обновляет только предложенные посты.
    Иначе - опубликованные и отложенные.
    """
    PROJECT_ID_GLOBAL = "GLOBAL"
    
    # Для разделения задач используем разный TASK_TYPE в зависимости от режима обновления
    TASK_TYPE_GLOBAL = f"global_refresh_{payload.viewType}"
    
    try:
        # 1. Проверяем, не запущена ли уже задача ТАКОГО ЖЕ типа
        existing_task_id = task_monitor.get_active_task_id(PROJECT_ID_GLOBAL, TASK_TYPE_GLOBAL)
        if existing_task_id:
            return {"taskId": existing_task_id}
        
        # 2. Запускаем новую
        new_task_id = str(uuid.uuid4())
        task_monitor.start_task(new_task_id, PROJECT_ID_GLOBAL, TASK_TYPE_GLOBAL)
        
        background_tasks.add_task(
            project_service.refresh_all_projects_task,
            new_task_id,
            payload.viewType
        )
        
        return {"taskId": new_task_id}
    except Exception as e:
        print(f"ERROR starting bulk refresh task: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start background task: {str(e)}")