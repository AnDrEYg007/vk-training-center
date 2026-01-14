from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

import crud
from schemas import Tag, TagCreate, TagUpdate
from . import update_tracker

# --- CRUD for Tags ---

def get_tags_for_project(db: Session, project_id: str) -> List[Tag]:
    tags = crud.get_tags_by_project_id(db, project_id)
    return [Tag.model_validate(t, from_attributes=True) for t in tags]

def create_tag(db: Session, tag_data: TagCreate, project_id: str) -> Tag:
    created_tag = crud.create_tag(db, tag_data, project_id)
    return Tag.model_validate(created_tag, from_attributes=True)

def update_tag(db: Session, tag_id: str, tag_data: TagUpdate) -> Tag:
    updated_tag = crud.update_tag(db, tag_id, tag_data)
    if not updated_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return Tag.model_validate(updated_tag, from_attributes=True)

def delete_tag(db: Session, tag_id: str) -> bool:
    return crud.delete_tag(db, tag_id)

# --- Business Logic ---

def retag_all_posts_for_project(db: Session, project_id: str):
    """
    Переназначает теги для всех опубликованных и отложенных постов проекта.
    """
    print(f"SERVICE: Starting retagging process for project {project_id}...")
    
    # 1. Получаем все посты (опубликованные и отложенные)
    published_posts = crud.get_posts_by_project_id(db, project_id)
    scheduled_posts = crud.get_scheduled_posts_by_project_id(db, project_id)
    all_posts = published_posts + scheduled_posts
    
    if not all_posts:
        print(f"SERVICE: No posts found for project {project_id}. Nothing to retag.")
        return

    # 2. Получаем все теги для проекта
    tags = crud.get_tags_by_project_id(db, project_id)
    
    # 3. Проходим по каждому посту и обновляем теги
    updated_count = 0
    for post in all_posts:
        original_tag_ids = {t.id for t in post.tags}
        
        post_text_lower = post.text.lower() if post.text else ""
        
        matching_tags = []
        if post_text_lower:
            for tag in tags:
                if tag.keyword and tag.keyword.lower() in post_text_lower:
                    matching_tags.append(tag)
        
        new_tag_ids = {t.id for t in matching_tags}

        if original_tag_ids != new_tag_ids:
            post.tags = matching_tags
            updated_count += 1
            
    # 4. Сохраняем изменения в БД
    if updated_count > 0:
        db.commit()
        print(f"SERVICE: Retagging complete. Updated {updated_count} posts for project {project_id}.")
    else:
        print("SERVICE: Retagging complete. No changes were necessary.")
        
    # 5. Помечаем проект как обновленный для фронтенда
    update_tracker.add_updated_project(project_id)