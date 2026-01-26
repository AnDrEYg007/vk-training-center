
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
import time
import json

import crud
import schemas
from services import vk_service, global_variable_service
from services.vk_service import VkApiError
from services.post_helpers import find_conflict_free_time, assign_tags_to_post

def save_to_vk_schedule(db: Session, payload: schemas.SavePostPayload, user_token: str) -> schemas.ScheduledPost:
    """Внутренняя функция для сохранения поста в отложенную очередь VK."""
    print(f"SERVICE: Saving post to VK schedule for project {payload.projectId}...", flush=True)
    print(f"SERVICE: Payload post.images = {[img.model_dump() for img in payload.post.images]}", flush=True)
    print(f"SERVICE: Payload post.attachments = {[att.model_dump() for att in (payload.post.attachments or [])]}", flush=True)
    project = crud.get_project_by_id(db, payload.projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    is_new = payload.post.id.startswith('new-post-')
    numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
    owner_id = vk_service.vk_owner_id_string(numeric_id)
    
    # ВАЖНО: Всегда используем user_token для wall.post/wall.edit
    # communityToken не может использовать attachment'ы, загруженные другим токеном
    preferred_token = user_token

    # Подстановка глобальных переменных
    substituted_text = global_variable_service.substitute_global_variables(db, payload.post.text or '', project.id)
    
    attachments = [img.id for img in payload.post.images] + [att.id for att in payload.post.attachments or []]
    print(f"SERVICE: Attachments string for VK API = {attachments}", flush=True)
    
    # Базовые параметры для wall.post / wall.edit
    params = {
        'owner_id': owner_id,
        'message': substituted_text,
        'attachments': ",".join(attachments)
    }
    print(f"SERVICE: VK API params = {params}", flush=True)

    # Логика даты публикации
    publish_date_ts = 0
    if not payload.publishNow:
        conflict_free_date_iso = find_conflict_free_time(db, payload.projectId, payload.post.date, is_new)
        dt = datetime.fromisoformat(conflict_free_date_iso.replace('Z', '+00:00'))
        if dt.timestamp() > time.time():
            publish_date_ts = int(dt.timestamp())
            params['publish_date'] = str(publish_date_ts)

    saved_post_id = None
    MAX_RETRIES = 12
    DELAY_SECONDS = 300  # 5 minutes

    # Используем логику publish_with_fallback для надежности (ротация токенов)
    method = 'wall.post'
    if is_new:
        params['from_group'] = 1
    else:
        method = 'wall.edit'
        params['post_id'] = payload.post.id.split('_')[1]

    for attempt in range(MAX_RETRIES):
        try:
            # Вызываем универсальный метод с ротацией
            # Передаем method, чтобы поддерживать и wall.post, и wall.edit
            response = vk_service.publish_with_fallback(params, method=method, preferred_token=preferred_token)
            
            if is_new:
                saved_post_id = response.get('post_id')
            else:
                saved_post_id = params['post_id'] # Для edit ID не меняется
            break 

        except VkApiError as e:
            # Обработка конфликта времени (214)
            if e.code == 214 and 'publish_date' in params:
                print(f"VK API time conflict on attempt {attempt + 1}. Shifting time again.")
                current_ts = int(params['publish_date'])
                params['publish_date'] = str(current_ts + DELAY_SECONDS)
                if attempt == MAX_RETRIES - 1:
                    raise HTTPException(status_code=409, detail=f"Failed to find a free time slot after {MAX_RETRIES} attempts.")
            else:
                raise HTTPException(status_code=400, detail=str(e))
    
    if not saved_post_id:
        raise HTTPException(500, "VK API did not return post_id after saving.")

    # Получаем сохраненный пост для кеширования
    # Используем publish_with_fallback для wall.getById с ТЕМ ЖЕ приоритетным токеном.
    # Это критично для отложенных постов, так как системные токены их не видят.
    try:
        fetch_params = {'posts': f"{owner_id}_{saved_post_id}"}
        response = vk_service.publish_with_fallback(fetch_params, method='wall.getById', preferred_token=preferred_token)
        
        fresh_posts = response.get('posts', response.get('items', []))
        print(f"SERVICE: wall.getById returned {len(fresh_posts)} posts", flush=True)
        if fresh_posts:
            fresh_post = fresh_posts[0]
            print(f"SERVICE: Fresh post attachments: {json.dumps(fresh_post.get('attachments', []), ensure_ascii=False)}", flush=True)
            is_published = int(fresh_post.get('date', 0)) <= time.time()
            formatted_post = vk_service.format_vk_post(fresh_post, is_published)
            print(f"SERVICE: Formatted post images: {json.dumps(formatted_post.get('images', []), ensure_ascii=False)}", flush=True)
            
            assign_tags_to_post(db, formatted_post, payload.projectId)
            
            crud.upsert_post(db, formatted_post, is_published, payload.projectId)
            
            # Возвращаем объект поста из базы
            full_post_data_query = crud.get_scheduled_posts_by_project_id if not is_published else crud.get_posts_by_project_id
            full_post_data = full_post_data_query(db, payload.projectId)
            saved_full_post = next((p for p in full_post_data if p.id == formatted_post['id']), None)
            
            if saved_full_post:
                return schemas.ScheduledPost.model_validate(saved_full_post, from_attributes=True)
    except Exception as e:
        import traceback
        print(f"SERVICE: Warning - Failed to fetch/cache saved post {saved_post_id}: {e}", flush=True)
        print(f"SERVICE: Traceback: {traceback.format_exc()}", flush=True)

    # Fallback: возвращаем объект на основе входных данных
    # Это предотвращает падение задачи (Error 500), если сохранение в VK прошло успешно, но не удалось обновить кеш.
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')
    fallback_date = payload.post.date
    if publish_date_ts > 0:
         fallback_date = datetime.fromtimestamp(publish_date_ts).isoformat() + 'Z'

    return schemas.ScheduledPost(
        id=f"{owner_id}_{saved_post_id}",
        projectId=payload.projectId,
        date=fallback_date,
        text=payload.post.text,
        images=payload.post.images,
        attachments=payload.post.attachments or [],
        vkPostUrl=f"https://vk.com/wall{owner_id}_{saved_post_id}",
        tags=[],
        _lastUpdated=timestamp
    )
