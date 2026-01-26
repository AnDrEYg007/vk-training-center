
from sqlalchemy.orm import Session
from fastapi import HTTPException
import json

import crud
import schemas
from database import SessionLocal
from services import vk_service, global_variable_service, task_monitor
from services.post_helpers import assign_tags_to_post
# Импортируем функции удаления, так как они используются при публикации
from .delete import delete_scheduled_post
# Импортируем функцию обновления кеша, чтобы избежать циклических ссылок, импортируем внутри
from services.post_retrieval_service import refresh_published_posts

def publish_now(db: Session, payload: schemas.PublishPostPayload, user_token: str, delete_original: bool = True) -> str:
    """
    Синхронная версия публикации.
    Для UI используйте асинхронную задачу через publish_post_task.
    """
    project = crud.get_project_by_id(db, payload.projectId)
    if not project:
        raise HTTPException(404, "Project not found")

    numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
    owner_id = vk_service.vk_owner_id_string(numeric_id)
    attachments = [img.id for img in payload.post.images] + [att.id for att in payload.post.attachments or []]
    
    # Подстановка глобальных переменных
    substituted_text = global_variable_service.substitute_global_variables(db, payload.post.text or '', project.id)

    params = {
        'owner_id': owner_id,
        'from_group': 1,
        'message': substituted_text,
        'attachments': ",".join(attachments),
    }
    
    # ВАЖНО: Используем user_token для wall.post
    # communityToken не может использовать attachment'ы, загруженные пользовательским токеном
    new_post_response = vk_service.publish_with_fallback(params, method='wall.post', preferred_token=user_token)

    if not payload.post.id.startswith('new-post-') and delete_original:
        try:
            delete_scheduled_post(db, schemas.DeletePostPayload(postId=payload.post.id, projectId=payload.projectId), user_token)
        except Exception as e:
            print(f"Warning: could not delete original post {payload.post.id}: {e}")
            
    new_post_id = new_post_response.get('post_id')
    full_post_id = None
    if new_post_id:
        full_post_id = f"{owner_id}_{new_post_id}"
        
        # Используем publish_with_fallback для получения поста, чтобы гарантировать доступ
        try:
            fetch_params = {'posts': full_post_id}
            response = vk_service.publish_with_fallback(fetch_params, method='wall.getById', preferred_token=project.communityToken)
            fresh_posts = response.get('posts', response.get('items', []))
            if fresh_posts:
                formatted_post = vk_service.format_vk_post(fresh_posts[0], is_published=True)
                assign_tags_to_post(db, formatted_post, payload.projectId)
                crud.upsert_post(db, formatted_post, is_published=True, project_id=payload.projectId)
        except Exception as e:
            print(f"Warning: Failed to fetch/cache post after immediate publish: {e}")
            # Fallback to full refresh
            refresh_published_posts(db, payload.projectId, user_token)
    else:
        refresh_published_posts(db, payload.projectId, user_token)

    return full_post_id

def publish_post_task(task_id: str, payload: schemas.SavePostPayload, user_token: str, delete_original: bool = True):
    """
    Фоновая задача для немедленной публикации поста с ротацией токенов.
    Создает собственную сессию БД.
    """
    db = SessionLocal()
    try:
        task_monitor.update_task(task_id, "processing", message="Подготовка к публикации...")
        
        print(f"TASK {task_id}: Starting background publication for project {payload.projectId}...")
        project = crud.get_project_by_id(db, payload.projectId)
        if not project:
            raise Exception("Project not found")

        # Разрешаем ID группы
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        owner_id = vk_service.vk_owner_id_string(numeric_id)
        
        attachments = [img.id for img in payload.post.images] + [att.id for att in payload.post.attachments or []]
        
        # Подстановка глобальных переменных
        substituted_text = global_variable_service.substitute_global_variables(db, payload.post.text or '', project.id)

        params = {
            'owner_id': owner_id,
            'from_group': 1,
            'message': substituted_text,
            'attachments': ",".join(attachments),
            # 'access_token' не указываем здесь, он будет подставлен в vk_service.publish_with_fallback
        }

        task_monitor.update_task(task_id, "processing", message="Отправка в VK (подбор токена)...")

        # ВАЖНО: Используем user_token для wall.post
        # communityToken не может использовать attachment'ы, загруженные пользовательским токеном
        new_post_response = vk_service.publish_with_fallback(params, method='wall.post', preferred_token=user_token)

        new_post_id = new_post_response.get('post_id')
        if not new_post_id:
             raise Exception("VK API did not return post_id after publishing.")

        print(f"TASK {task_id}: Published successfully. VK ID: {new_post_id}")
        task_monitor.update_task(task_id, "processing", message="Сохранение результата...")

        # После успеха удаляем оригинал (если это был перенос из отложки или системного)
        if not payload.post.id.startswith('new-post-') and delete_original:
            try:
                delete_scheduled_post(db, schemas.DeletePostPayload(postId=payload.post.id, projectId=payload.projectId), user_token)
            except Exception as e:
                print(f"Warning: could not delete original post {payload.post.id}: {e}")

        # Сохраняем результат в кеш опубликованных
        full_post_id = f"{owner_id}_{new_post_id}"
        
        # Пытаемся получить пост обратно, чтобы сохранить полные данные
        # Используем publish_with_fallback для надежности
        try:
            fetch_params = {'posts': full_post_id}
            response = vk_service.publish_with_fallback(fetch_params, method='wall.getById', preferred_token=project.communityToken)
            fresh_posts = response.get('posts', response.get('items', []))
            if fresh_posts:
                formatted_post = vk_service.format_vk_post(fresh_posts[0], is_published=True)
                assign_tags_to_post(db, formatted_post, payload.projectId)
                crud.upsert_post(db, formatted_post, is_published=True, project_id=payload.projectId)
            else:
                # Fallback: full refresh if specific get failed but publish succeeded
                refresh_published_posts(db, payload.projectId, user_token)
        except Exception as fetch_err:
            print(f"TASK {task_id}: Warning - failed to fetch cached post after publish: {fetch_err}")
            # Не фейлим задачу, так как публикация прошла

        task_monitor.update_task(task_id, "done", message="Опубликовано!")

    except Exception as e:
        print(f"TASK {task_id} ERROR: {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
