
from sqlalchemy.orm import Session
from fastapi import HTTPException
import json

import crud
import schemas
from . import vk_service
from . import update_tracker
from config import settings

def delete_system_post(db: Session, post_id: str):
    """Удаляет системный пост, если он находится в разрешенном статусе."""
    post = crud.get_system_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="System post not found.")
    
    if post.status not in ['pending_publication', 'error', 'possible_error', 'publishing', 'paused']:
        raise HTTPException(status_code=400, detail=f"Cannot delete post with status '{post.status}'.")

    crud.delete_system_post(db, post_id)

def move_to_scheduled(db: Session, post_id: str):
    """Переносит системный пост в отложенные посты VK."""
    post = crud.get_system_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="System post not found.")
    if post.status != 'pending_publication':
        raise HTTPException(status_code=400, detail="Only posts with 'pending_publication' status can be moved.")
    
    # Защита: Циклические посты нельзя переносить в отложку, 
    # так как это разрывает цепочку генерации следующих постов.
    if post.is_cyclic:
        raise HTTPException(status_code=400, detail="Cyclic posts cannot be moved to VK schedule as it breaks the cycle logic.")

    project = crud.get_project_by_id(db, post.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found for this post.")

    # Создаем объект, совместимый с `savePost`
    post_data_to_save = schemas.ScheduledPost(
        id=f"new-post-{post.id}",
        date=post.publication_date,
        text=post.text,
        images=json.loads(post.images) if post.images else [],
        attachments=json.loads(post.attachments) if post.attachments else []
    )
    
    try:
        # Вызываем существующую логику сохранения поста, но с флагом scheduleInVk=True
        # Эта логика находится в `post_service`, поэтому импортируем его здесь, чтобы избежать циклических зависимостей
        from . import post_service
        payload = schemas.SavePostPayload(post=post_data_to_save, projectId=project.id, scheduleInVk=True)
        saved_vk_post = post_service.save_post(db, payload, settings.vk_user_token)
        
        # После успешного сохранения в VK, удаляем системный пост
        if saved_vk_post:
            crud.delete_system_post(db, post_id)
            # Принудительно обновляем отложку, чтобы фронтенд увидел изменения
            post_service.refresh_scheduled_posts(db, project.id, settings.vk_user_token)

    except Exception as e:
        # Перехватываем исключения из `save_post` и пробрасываем их дальше
        raise e

def confirm_publication(db: Session, post_id: str):
    """Подтверждает публикацию поста со статусом 'possible_error'."""
    post = crud.get_system_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="System post not found.")
    if post.status != 'possible_error':
        raise HTTPException(status_code=400, detail="This action is only for posts with 'possible_error' status.")
    
    crud.delete_system_post(db, post_id)

def publish_system_post_now(db: Session, post_id: str):
    """Публикует системный пост немедленно, обновляя его статус для верификации."""
    post = crud.get_system_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="System post not found.")

    if post.status not in ['pending_publication', 'error', 'possible_error']:
        raise HTTPException(status_code=400, detail=f"Post with status '{post.status}' cannot be published now.")

    from . import post_service

    try:
        # Собираем payload для существующей функции publish_now
        post_schema = schemas.ScheduledPost(
            id=post.id, # Передаем ID системного поста
            date=post.publication_date,
            text=post.text,
            images=json.loads(post.images) if post.images else [],
            attachments=json.loads(post.attachments) if post.attachments else []
        )
        payload = schemas.PublishPostPayload(post=post_schema, projectId=post.project_id)
        
        # Вызываем сервис публикации, который вернет vk_post_id
        # delete_original=False, т.к. мы удаляем системный пост, а не отложенный
        vk_post_id = post_service.publish_now(db, payload, settings.vk_user_token, delete_original=False)
        
        # Обновляем пост: меняем статус и сохраняем ID из VK
        post.status = 'publishing'
        post.vk_post_id = vk_post_id
        db.commit()

        # Помечаем проект как обновленный
        update_tracker.add_updated_project(post.project_id)
        print(f"  -> Successfully sent system post {post.id} to VK API for immediate publication. Received VK ID: {vk_post_id}.")

    except Exception as e:
        print(f"  -> ERROR publishing system post {post.id} now: {e}")
        post.status = 'error'
        db.commit()
        update_tracker.add_updated_project(post.project_id)
        raise e
