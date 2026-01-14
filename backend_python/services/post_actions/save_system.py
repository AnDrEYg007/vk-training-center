
from sqlalchemy.orm import Session
import json

import crud
import schemas
from services.post_helpers import find_conflict_free_time

def save_as_system_post(db: Session, payload: schemas.SavePostPayload) -> schemas.ScheduledPost:
    """Внутренняя функция для сохранения поста в системную базу данных."""
    print(f"SERVICE: Saving post as a system post for project {payload.projectId}...")
    is_new = payload.post.id.startswith('new-post-')
    
    conflict_free_date_iso = find_conflict_free_time(db, payload.projectId, payload.post.date, is_new)
    
    # Обработка параметров AI
    ai_params_json = None
    
    # ЛОГИРОВАНИЕ ОТЛАДКИ
    if payload.post.aiGenerationParams:
        print(f"SERVICE DEBUG: Received aiGenerationParams: {payload.post.aiGenerationParams}")
        try:
            ai_params_json = json.dumps(payload.post.aiGenerationParams, ensure_ascii=False)
            print("SERVICE: Successfully serialized AI Generation Params.")
        except Exception as e:
            print(f"SERVICE WARNING: Failed to dump AI params: {e}")
    else:
        print("SERVICE DEBUG: No aiGenerationParams received in payload.")

    system_post_data = schemas.SystemPost(
        id=payload.post.id,
        project_id=payload.projectId,
        publication_date=conflict_free_date_iso,
        text=payload.post.text,
        images=payload.post.images,
        attachments=payload.post.attachments or [],
        status='pending_publication',
        post_type='regular',
        is_cyclic=payload.post.is_cyclic,
        recurrence_type=payload.post.recurrence_type,
        recurrence_interval=payload.post.recurrence_interval,
        recurrence_end_type=payload.post.recurrence_end_type,
        recurrence_end_count=payload.post.recurrence_end_count,
        recurrence_end_date=payload.post.recurrence_end_date,
        recurrence_fixed_day=payload.post.recurrence_fixed_day,
        recurrence_is_last_day=payload.post.recurrence_is_last_day,
        ai_generation_params=ai_params_json # Сохраняем JSON строку
    )
    
    saved_db_post = crud.create_or_update_system_post(db, payload.projectId, system_post_data)
    
    # Возвращаем в формате ScheduledPost для совместимости с ответом API
    return_post = schemas.ScheduledPost(
        id=saved_db_post.id,
        date=saved_db_post.publication_date,
        text=saved_db_post.text,
        images=json.loads(saved_db_post.images) if saved_db_post.images else [],
        attachments=json.loads(saved_db_post.attachments) if saved_db_post.attachments else [],
        tags=[],
        is_cyclic=saved_db_post.is_cyclic,
        recurrence_type=saved_db_post.recurrence_type,
        recurrence_interval=saved_db_post.recurrence_interval,
        recurrence_end_type=saved_db_post.recurrence_end_type,
        recurrence_end_count=saved_db_post.recurrence_end_count,
        recurrence_end_date=saved_db_post.recurrence_end_date,
        recurrence_fixed_day=saved_db_post.recurrence_fixed_day,
        recurrence_is_last_day=saved_db_post.recurrence_is_last_day,
        aiGenerationParams=payload.post.aiGenerationParams # Возвращаем то, что пришло, для консистентности UI
    )
    print(f"SERVICE: System post {return_post.id} saved successfully at {return_post.date}.")
    return return_post
