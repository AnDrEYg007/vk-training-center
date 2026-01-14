
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from pydantic import BaseModel

import schemas
import services.post_service as post_service
import services.task_monitor as task_monitor
from database import SessionLocal
from config import settings

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getAllPostsForProjects", response_model=schemas.AllPostsForProjectsResponse)
def get_all_posts_for_projects(payload: schemas.ProjectIdsPayload, db: Session = Depends(get_db)):
    return post_service.get_all_data_for_projects(db, payload.projectIds)

@router.post("/getProjectUpdateStatus", response_model=schemas.UpdateStatusResponse)
def get_project_update_status(db: Session = Depends(get_db)):
    return post_service.get_project_update_status(db)

# --- Published Posts ---
@router.post("/getCachedPublishedPosts", response_model=List[schemas.ScheduledPost])
def get_cached_published_posts(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.get_published_posts(db, payload.projectId)

@router.post("/refreshPublishedPosts", response_model=List[schemas.ScheduledPost])
def refresh_published_posts(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.refresh_published_posts(db, payload.projectId, settings.vk_user_token)

# --- Scheduled Posts ---
@router.post("/getCachedScheduledPosts", response_model=List[schemas.ScheduledPost])
def get_cached_scheduled_posts(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.get_scheduled_posts(db, payload.projectId)

@router.post("/refreshScheduledPosts", response_model=List[schemas.ScheduledPost])
def refresh_scheduled_posts(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.refresh_scheduled_posts(db, payload.projectId, settings.vk_user_token)

@router.post("/refreshAllScheduleData", response_model=schemas.ScheduleRefreshResponse)
def refresh_all_schedule_data(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.refresh_all_schedule_data(db, payload.projectId, settings.vk_user_token)

@router.post("/getScheduledPostCount", response_model=schemas.PostCountResponse)
def get_scheduled_post_count(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    count = post_service.get_scheduled_post_count(db, payload.projectId)
    return {"count": count}

# --- Suggested Posts ---
@router.post("/getSuggestedPosts", response_model=List[schemas.SuggestedPost])
def get_suggested_posts(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.get_suggested_posts(db, payload.projectId)

@router.post("/refreshSuggestedPosts", response_model=List[schemas.SuggestedPost])
def refresh_suggested_posts(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return post_service.refresh_suggested_posts(db, payload.projectId, settings.vk_user_token)

# --- Post Actions ---
@router.post("/savePost", response_model=schemas.ScheduledPost)
def save_post(payload: schemas.SavePostPayload, db: Session = Depends(get_db)):
    # Здесь мы обрабатываем сохранение (create/update) в базу или в отложку.
    # Если publishNow=True, это должно обрабатываться через /publishPost (фронтенд должен это учитывать)
    if payload.publishNow:
        # Для обратной совместимости, но лучше использовать async publish
        pass
        
    return post_service.save_post(db, payload, settings.vk_user_token)

class ScheduleTaskPayload(schemas.SavePostPayload):
    deleteOriginalId: Optional[str] = None # ID поста, который нужно удалить после переноса (для Drag-and-Drop move)

@router.post("/schedulePostTask", response_model=schemas.TaskStartResponse)
def schedule_post_task(payload: ScheduleTaskPayload, background_tasks: BackgroundTasks):
    """
    Запускает фоновую задачу сохранения/планирования поста в VK.
    Используется для Drag-and-Drop, чтобы избежать зависаний при ротации токенов.
    """
    task_id = str(uuid.uuid4())
    task_monitor.start_task(task_id, payload.projectId, 'schedule_post')
    
    background_tasks.add_task(
        post_service.schedule_post_task,
        task_id,
        payload,
        payload.deleteOriginalId,
        settings.vk_user_token
    )
    
    return {"taskId": task_id}

@router.post("/deletePost", response_model=schemas.GenericSuccess)
def delete_post(payload: schemas.DeletePostPayload, db: Session = Depends(get_db)):
    post_service.delete_scheduled_post(db, payload, settings.vk_user_token)
    return {"success": True}

@router.post("/deletePublishedPost", response_model=schemas.DeletePublishedPostResponse)
def delete_published_post(payload: schemas.DeletePostPayload, db: Session = Depends(get_db)):
    message = post_service.delete_published_post(db, payload, settings.vk_user_token)
    return {"success": True, "message": message}

@router.post("/publishPost", response_model=schemas.TaskStartResponse)
def publish_post(payload: schemas.PublishPostPayload, background_tasks: BackgroundTasks):
    """
    Запускает фоновую задачу публикации поста с надежной ротацией токенов.
    """
    task_id = str(uuid.uuid4())
    task_monitor.start_task(task_id, payload.projectId, 'publish_post')
    
    # Формируем SavePostPayload для задачи
    save_payload = schemas.SavePostPayload(
        post=payload.post,
        projectId=payload.projectId,
        publishNow=True
    )

    background_tasks.add_task(
        post_service.publish_post_task,
        task_id,
        save_payload,
        settings.vk_user_token
    )
    
    return {"taskId": task_id}
