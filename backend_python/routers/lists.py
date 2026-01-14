
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import Dict, Union

import schemas
import services.task_monitor as task_monitor
# Explicitly importing the module where clear_list_data is defined
import services.lists.system_list_service as system_list_service
from database import SessionLocal
from config import settings

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/lists/system/getMeta", response_model=schemas.SystemListMetaResponse)
def get_list_meta(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return system_list_service.get_list_meta(db, payload.projectId)

@router.post("/lists/system/getStats", response_model=schemas.ListStatsResponse)
def get_list_stats(payload: schemas.SystemListPayload, db: Session = Depends(get_db)):
    # Передаем новые параметры period и groupBy, а также фильтр ЛС
    return system_list_service.get_list_stats(
        db, 
        payload.projectId, 
        payload.listType, 
        period=payload.statsPeriod or 'all', 
        group_by=payload.statsGroupBy or 'month',
        date_from=payload.statsDateFrom,
        date_to=payload.statsDateTo,
        filter_can_write=payload.filterCanWrite or 'all'
    )

@router.post("/lists/system/getSubscribers", response_model=Union[schemas.SystemListSubscribersResponse, schemas.SystemListPostsResponse, schemas.SystemListHistoryResponse, schemas.SystemListAuthorsResponse, schemas.SystemListMailingResponse])
def get_subscribers(payload: schemas.SystemListPayload, db: Session = Depends(get_db)):
    return system_list_service.get_subscribers(
        db, 
        payload.projectId, 
        payload.listType, 
        payload.page, 
        50, # page_size - fixed value
        payload.searchQuery,
        filter_quality=payload.filterQuality or 'all',
        filter_sex=payload.filterSex or 'all',
        filter_online=payload.filterOnline or 'any',
        filter_can_write=payload.filterCanWrite or 'all', # New parameter
        filter_bdate_month=payload.filterBdateMonth or 'any', # NEW
        filter_platform=payload.filterPlatform or 'any', # NEW
        filter_age=payload.filterAge or 'any' # NEW
    )

@router.post("/lists/system/getPosts", response_model=schemas.SystemListPostsResponse)
def get_posts(payload: schemas.SystemListPayload, db: Session = Depends(get_db)):
    return system_list_service.get_posts(db, payload.projectId, payload.page, payload.searchQuery)

@router.post("/lists/system/getInteractions", response_model=schemas.SystemListInteractionsResponse)
def get_interactions(payload: schemas.SystemListPayload, db: Session = Depends(get_db)):
    return system_list_service.get_interactions(
        db, 
        payload.projectId, 
        payload.listType, 
        payload.page, 
        payload.searchQuery,
        filter_quality=payload.filterQuality or 'all',
        filter_sex=payload.filterSex or 'all',
        filter_online=payload.filterOnline or 'any',
        filter_bdate_month=payload.filterBdateMonth or 'any', # NEW
        filter_platform=payload.filterPlatform or 'any', # NEW
        filter_age=payload.filterAge or 'any' # NEW
    )

@router.post("/lists/system/clear", response_model=schemas.GenericSuccess)
def clear_list(payload: schemas.SystemListPayload, db: Session = Depends(get_db)):
    """
    Полностью очищает данные для указанного списка и проекта.
    Доступно только администраторам (проверка на фронтенде, здесь пока нет).
    """
    system_list_service.clear_list_data(db, payload.projectId, payload.listType)
    return {"success": True}


# --- Эндпоинт для провери статуса задачи ---
@router.get("/lists/system/getTaskStatus/{taskId}", response_model=schemas.TaskStatusResponse)
def get_task_status(taskId: str):
    status = task_monitor.get_task_status(taskId)
    if not status:
        return {
            "taskId": taskId,
            "status": "error",
            "error": "Task not found or expired"
        }
    return {
        "taskId": taskId,
        **status
    }

# --- Эндпоинт для получения активных задач проекта ---
@router.post("/lists/system/getActiveTasks", response_model=Dict[str, str])
def get_active_tasks(payload: schemas.ProjectIdPayload):
    """Возвращает словарь {listType: taskId} для всех активных задач проекта."""
    active_tasks = {}
    # Список всех возможных типов задач, которые мы отслеживаем
    list_types = [
        'subscribers', 'subscriber_details', 
        'history_join', 'history_leave', 
        'posts', 'mailing', 'mailing_analysis', # Added mailing_analysis
        'interactions', # Старый тип, для совместимости
        'interactions_likes', 'interactions_comments', 'interactions_reposts', # Новые раздельные типы
        'interaction_users_likes', 'interaction_users_comments', 'interaction_users_reposts',
        'authors', 'author_details' # NEW
    ]
    
    for l_type in list_types:
        task_id = task_monitor.get_active_task_id(payload.projectId, l_type)
        if task_id:
            active_tasks[l_type] = task_id
            
    return active_tasks


# --- Управление задачами (Admin / Utility) ---
@router.post("/tasks/getAll", response_model=schemas.TaskListResponse)
def get_all_tasks():
    """Возвращает список всех известных задач (активных и недавно завершенных)."""
    tasks = task_monitor.get_all_tasks()
    return {"tasks": tasks}

@router.post("/tasks/delete/{taskId}", response_model=schemas.GenericSuccess)
def delete_task(taskId: str):
    """Принудительно удаляет задачу из монитора (сброс зависших)."""
    task_monitor.delete_task(taskId)
    return {"success": True}

@router.post("/tasks/deleteAll", response_model=schemas.GenericSuccess)
def delete_all_tasks():
    """Принудительно удаляет ВСЕ задачи из монитора."""
    task_monitor.delete_all_tasks()
    return {"success": True}


# --- Фоновые задачи ---

def _get_or_create_task(project_id: str, list_type: str, background_tasks: BackgroundTasks, task_func, *args, **kwargs):
    """Вспомогательная функция: возвращает существующую задачу или создает новую."""
    existing_task_id = task_monitor.get_active_task_id(project_id, list_type)
    if existing_task_id:
        return existing_task_id
    
    new_task_id = str(uuid.uuid4())
    # Регистрируем задачу с привязкой к проекту и типу
    task_monitor.start_task(new_task_id, project_id, list_type)
    
    background_tasks.add_task(task_func, new_task_id, *args, **kwargs)
    return new_task_id

@router.post("/lists/system/refreshSubscribers", response_model=schemas.TaskStartResponse)
def refresh_subscribers(payload: schemas.ProjectIdPayload, background_tasks: BackgroundTasks):
    task_id = _get_or_create_task(
        payload.projectId, 'subscribers', background_tasks,
        system_list_service.refresh_subscribers_task, payload.projectId, settings.vk_user_token
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshSubscriberDetails", response_model=schemas.TaskStartResponse)
def refresh_subscriber_details(payload: schemas.ProjectIdPayload, background_tasks: BackgroundTasks):
    task_id = _get_or_create_task(
        payload.projectId, 'subscriber_details', background_tasks,
        system_list_service.refresh_subscriber_details_task, payload.projectId, settings.vk_user_token
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshAuthorDetails", response_model=schemas.TaskStartResponse)
def refresh_author_details(payload: schemas.ProjectIdPayload, background_tasks: BackgroundTasks):
    task_id = _get_or_create_task(
        payload.projectId, 'author_details', background_tasks,
        system_list_service.refresh_author_details_task, payload.projectId, settings.vk_user_token
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshMailing", response_model=schemas.TaskStartResponse)
def refresh_mailing(payload: schemas.ProjectIdPayload, background_tasks: BackgroundTasks):
    task_id = _get_or_create_task(
        payload.projectId, 'mailing', background_tasks,
        system_list_service.refresh_mailing_task, payload.projectId
    )
    return {"taskId": task_id}
    
@router.post("/lists/system/analyzeMailing", response_model=schemas.TaskStartResponse)
def analyze_mailing(payload: schemas.AnalyzeMailingPayload, background_tasks: BackgroundTasks):
    # Если payload.mode не передан (например, старый фронтенд), pydantic поставит 'missing'
    task_id = _get_or_create_task(
        payload.projectId, 'mailing_analysis', background_tasks,
        system_list_service.refresh_mailing_analysis_task, payload.projectId, mode=payload.mode
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshHistory", response_model=schemas.TaskStartResponse)
def refresh_history(payload: schemas.SystemListPayload, background_tasks: BackgroundTasks):
    task_id = _get_or_create_task(
        payload.projectId, payload.listType, background_tasks, # listType: history_join, history_leave
        system_list_service.refresh_history_details_task, payload.projectId, payload.listType, settings.vk_user_token
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshPosts", response_model=schemas.TaskStartResponse)
def refresh_posts(payload: schemas.RefreshPostsPayload, background_tasks: BackgroundTasks):
    task_id = _get_or_create_task(
        payload.projectId, 'posts', background_tasks,
        system_list_service.refresh_posts_task, payload.projectId, settings.vk_user_token, payload.limit
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshInteractions", response_model=schemas.TaskStartResponse)
def refresh_interactions(payload: schemas.RefreshInteractionsPayload, background_tasks: BackgroundTasks):
    # Формируем уникальный ключ задачи на основе типа взаимодействия
    # Если тип 'all' или не указан, используем общий ключ 'interactions'
    interaction_type = payload.interactionType or 'all'
    task_key = 'interactions' if interaction_type == 'all' else f"interactions_{interaction_type}"

    task_id = _get_or_create_task(
        payload.projectId, task_key, background_tasks,
        system_list_service.refresh_interactions_task, 
        payload.projectId, payload.dateFrom, payload.dateTo, settings.vk_user_token, interaction_type
    )
    return {"taskId": task_id}

@router.post("/lists/system/refreshInteractionUsers", response_model=schemas.TaskStartResponse)
def refresh_interaction_users(payload: schemas.SystemListPayload, background_tasks: BackgroundTasks):
    # Уникальный тип задачи для каждого типа списка (likes, comments...)
    list_type_key = f"interaction_users_{payload.listType}"
    
    task_id = _get_or_create_task(
        payload.projectId, list_type_key, background_tasks,
        system_list_service.refresh_interaction_users_task, payload.projectId, payload.listType, settings.vk_user_token
    )
    return {"taskId": task_id}
