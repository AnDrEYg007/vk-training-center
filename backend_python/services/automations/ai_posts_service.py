
from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
import json
import random
from datetime import datetime

import crud
import models
import schemas
from services.post_helpers import find_conflict_free_time
from services import ai_service, global_variable_service, update_tracker, post_service, gemini_service
# Импорт контекстных сервисов
import crud.project_context_crud as context_crud
from config import settings

def get_ai_posts(db: Session, project_id: str):
    """Возвращает все активные AI посты для проекта."""
    return db.query(models.SystemPost).filter(
        models.SystemPost.project_id == project_id,
        models.SystemPost.post_type == 'ai_feed'
    ).order_by(models.SystemPost.publication_date.desc()).all()

def create_ai_post(db: Session, payload: schemas.SavePostPayload):
    """
    Создает или обновляет AI пост.
    """
    print(f"SERVICE: Processing AI Post for project {payload.projectId}...")
    project_id = payload.projectId
    
    # 1. Генерация первого поста
    ai_params = payload.post.aiGenerationParams
    if not ai_params:
        raise HTTPException(400, "AI Parameters are required for AI Post.")
        
    # 2. Поиск свободного времени (только для новых или если дата изменилась существенно)
    conflict_free_date = find_conflict_free_time(db, project_id, payload.post.date, True)
    
    ai_params_json = json.dumps(ai_params, ensure_ascii=False)
    
    post_id = payload.post.id
    
    # Если это новый пост (ID с фронта содержит new-post или пуст)
    if not post_id or post_id.startswith('new-post-'):
        post_id = str(uuid.uuid4())
        print(f"  -> Creating NEW AI Post with ID {post_id}")
        
        new_post = models.SystemPost(
            id=post_id,
            project_id=project_id,
            publication_date=conflict_free_date,
            text=payload.post.text or "Generating...",
            images=json.dumps([img.model_dump() for img in payload.post.images]),
            attachments=json.dumps([att.model_dump() for att in (payload.post.attachments or [])]),
            status='pending_publication',
            post_type='ai_feed',
            
            # Цикличность
            is_cyclic=True,
            recurrence_type=payload.post.recurrence_type,
            recurrence_interval=payload.post.recurrence_interval,
            recurrence_end_type=payload.post.recurrence_end_type,
            recurrence_end_count=payload.post.recurrence_end_count,
            recurrence_end_date=payload.post.recurrence_end_date,
            recurrence_fixed_day=payload.post.recurrence_fixed_day,
            recurrence_is_last_day=payload.post.recurrence_is_last_day,
            
            # AI настройки
            ai_generation_params=ai_params_json,
            
            # Метаданные (Название, Описание, Статус активности)
            title=payload.post.title,
            description=payload.post.description,
            is_active=payload.post.is_active if payload.post.is_active is not None else True
        )
        db.add(new_post)
    else:
        # Обновление существующего
        print(f"  -> Updating EXISTING AI Post {post_id}")
        existing_post = crud.get_system_post_by_id(db, post_id)
        if not existing_post:
            raise HTTPException(404, f"AI Post with id {post_id} not found for update.")
            
        existing_post.publication_date = conflict_free_date
        existing_post.text = payload.post.text
        existing_post.images = json.dumps([img.model_dump() for img in payload.post.images])
        existing_post.attachments = json.dumps([att.model_dump() for att in (payload.post.attachments or [])])
        
        # Обновляем цикличность
        existing_post.recurrence_type = payload.post.recurrence_type
        existing_post.recurrence_interval = payload.post.recurrence_interval
        existing_post.recurrence_end_type = payload.post.recurrence_end_type
        existing_post.recurrence_end_count = payload.post.recurrence_end_count
        existing_post.recurrence_end_date = payload.post.recurrence_end_date
        existing_post.recurrence_fixed_day = payload.post.recurrence_fixed_day
        existing_post.recurrence_is_last_day = payload.post.recurrence_is_last_day
        
        # Обновляем AI настройки
        existing_post.ai_generation_params = ai_params_json

        # Обновляем метаданные
        if payload.post.title is not None:
             existing_post.title = payload.post.title
        if payload.post.description is not None:
             existing_post.description = payload.post.description
        if payload.post.is_active is not None:
             existing_post.is_active = payload.post.is_active
        
        # Сбрасываем статус, чтобы пост снова был подхвачен трекером, если он был в ошибке
        # Но только если он активен!
        if existing_post.status == 'error' and existing_post.is_active:
             existing_post.status = 'pending_publication'

        new_post = existing_post

    db.commit()
    db.refresh(new_post)
    
    update_tracker.add_updated_project(project_id)
    return new_post

def delete_ai_post(db: Session, post_id: str):
    """Удаляет AI пост."""
    post = crud.get_system_post_by_id(db, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
        
    db.delete(post)
    db.commit()
    update_tracker.add_updated_project(post.project_id)

def generate_and_publish_post(db: Session, post: models.SystemPost) -> str:
    """
    Генерирует текст на основе параметров AI, подставляет переменные и публикует пост.
    Возвращает ID опубликованного поста.
    """
    print(f"AI_SERVICE: Generating content for post {post.id}...")
    
    if not post.ai_generation_params or post.ai_generation_params == '{}':
        raise Exception("AI parameters are missing or empty.")

    try:
        params = json.loads(post.ai_generation_params)
    except json.JSONDecodeError:
        raise Exception("Invalid AI parameters JSON.")

    system_prompt = params.get('systemPrompt', '')
    user_prompt = params.get('userPrompt', '')
    
    if not user_prompt:
        raise Exception("User prompt is missing in AI params.")

    # 1. Сбор контекста (Товар + Компания)
    context_string = ""
    
    # 1.1 Товар
    product_id = params.get('productId')
    product_fields = params.get('productFields', [])
    if product_id and product_fields:
        clean_item_id = str(product_id).split('_')[-1]
        db_product = db.query(models.MarketItem).filter(
            models.MarketItem.project_id == post.project_id,
            models.MarketItem.id.like(f"%_{clean_item_id}")
        ).first()
        
        if db_product:
            parts = []
            price_data = json.loads(db_product.price) if db_product.price else {}
            if 'title' in product_fields: parts.append(f"Название: {db_product.title}")
            if 'price' in product_fields and 'amount' in price_data:
                parts.append(f"Цена: {int(price_data['amount']) // 100} руб.")
            if 'old_price' in product_fields and price_data.get('old_amount'):
                parts.append(f"Старая цена: {int(price_data['old_amount']) // 100} руб.")
            if 'description' in product_fields: parts.append(f"Описание: {db_product.description}")
            
            if parts:
                context_string += f"\n[КОНТЕКСТ ТОВАРА]\n{', '.join(parts)}\n"

    # 1.2 Компания
    company_fields = params.get('companyFields', [])
    if company_fields:
        all_context_fields = context_crud.get_all_fields(db)
        field_map = {f.name: f.id for f in all_context_fields}
        company_parts = []
        for field_name in company_fields:
            field_id = field_map.get(field_name)
            if field_id:
                val = db.query(models.ProjectContextValue).filter(
                    models.ProjectContextValue.project_id == post.project_id,
                    models.ProjectContextValue.field_id == field_id
                ).first()
                if val and val.value:
                    company_parts.append(f"{field_name}: {val.value}")
        if company_parts:
            # FIX: f-string expression part cannot include a backslash in Python < 3.12
            joined_company_parts = "\n".join(company_parts)
            context_string += f"\n[КОНТЕКСТ КОМПАНИИ]\n{joined_company_parts}\n"

    # 2. Генерация текста
    final_prompt = f"{context_string}\n{user_prompt}"
    generated_text = gemini_service.generate_text(final_prompt, system_instruction=system_prompt, strategy='CREATIVE')
    
    if not generated_text:
        raise Exception("AI returned empty text.")

    # 3. Подстановка глобальных переменных
    substituted_text = global_variable_service.substitute_global_variables(db, generated_text, post.project_id)
    
    # 4. Обработка изображений (ФИЛЬТРАЦИЯ)
    all_images = json.loads(post.images) if post.images else []
    selected_images = all_images

    media_mode = params.get('mediaMode', 'all') # 'all' or 'subset'
    
    if media_mode == 'subset' and all_images:
        try:
            subset_count = int(params.get('mediaSubsetCount', 1))
            subset_type = params.get('mediaSubsetType', 'random') # 'random' or 'order'
            
            # Валидация количества
            count_to_take = max(1, min(len(all_images), subset_count))
            
            if subset_type == 'random':
                selected_images = random.sample(all_images, count_to_take)
                print(f"AI_SERVICE: Selected {count_to_take} random images out of {len(all_images)}")
            else: # order
                # Получаем текущий курсор (индекс начала)
                cursor = params.get('mediaCursor', 0)
                
                selected_images = []
                for i in range(count_to_take):
                    index = (cursor + i) % len(all_images)
                    selected_images.append(all_images[index])
                
                print(f"AI_SERVICE: Selected {count_to_take} images sequentially starting from index {cursor}")
                
                # Обновляем курсор для следующего раза (сдвигаем на количество взятых фото)
                new_cursor = (cursor + count_to_take) % len(all_images)
                params['mediaCursor'] = new_cursor
                
                # Сохраняем обновленные параметры обратно в пост
                post.ai_generation_params = json.dumps(params, ensure_ascii=False)
                db.commit()

        except Exception as e:
            print(f"AI_SERVICE: Error processing media subset logic: {e}. Using all images.")
            selected_images = all_images

    # 5. Публикация
    post_schema = schemas.ScheduledPost(
        id=post.id,
        date=post.publication_date,
        text=substituted_text, 
        images=selected_images, # Используем отфильтрованные изображения
        attachments=json.loads(post.attachments) if post.attachments else []
    )
    
    payload = schemas.PublishPostPayload(post=post_schema, projectId=post.project_id)
    
    # Публикуем (синхронно внутри задачи)
    vk_post_id = post_service.publish_now(db, payload, settings.vk_user_token, delete_original=False)
    
    # ВАЖНО: Обновляем текст поста в базе для истории. Картинки НЕ обновляем, чтобы сохранить пул.
    post.text = substituted_text
    db.commit()
    
    return vk_post_id
