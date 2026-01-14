from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import List
import re

import crud
import models

def get_rounded_timestamp() -> str:
    """Возвращает текущее время в формате UTC YYYY-MM-DDTHH:MM:SS.000Z."""
    now = datetime.utcnow()
    return now.strftime('%Y-%m-%dT%H:%M:%S.000Z')

def assign_tags_to_post(db: Session, post_data: dict, project_id: str, project_tags: List[models.Tag] = None):
    """Проверяет текст поста и присваивает ему все подходящие теги из базы, используя поиск по целому слову."""
    if project_tags is None:
        project_tags = crud.get_tags_by_project_id(db, project_id)
        
    post_text_lower = post_data.get('text', '').lower()
    matching_tags = []
    if post_text_lower and project_tags:
        for tag in project_tags:
            # Проверяем, что ключевое слово не пустое
            if tag.keyword:
                # Экранируем ключевое слово на случай, если в нем есть спецсимволы regex,
                # и оборачиваем в границы слова (\b) для поиска точного совпадения.
                keyword_lower = tag.keyword.lower()
                pattern = r'\b' + re.escape(keyword_lower) + r'\b'
                if re.search(pattern, post_text_lower):
                    matching_tags.append(tag)
    post_data['tags'] = matching_tags

def assign_tags_to_db_post(db: Session, post: object, project_id: str, project_tags: List[models.Tag] = None):
    """
    Проверяет текст поста (объекта модели) и присваивает ему все подходящие теги из базы.
    Работает с объектом SQLAlchemy, обновляя отношение tags.
    """
    if project_tags is None:
        project_tags = crud.get_tags_by_project_id(db, project_id)
        
    post_text_lower = (post.text or '').lower()
    matching_tags = []
    if post_text_lower and project_tags:
        for tag in project_tags:
            if tag.keyword:
                keyword_lower = tag.keyword.lower()
                # Используем простой поиск подстроки, как в tag_service.py,
                # чтобы поведение было согласованным.
                if keyword_lower in post_text_lower:
                    matching_tags.append(tag)
    
    post.tags = matching_tags


def find_conflict_free_time(db: Session, project_id: str, initial_date_iso: str, is_new: bool) -> str:
    """
    Проверяет дату на конфликт с существующими постами (системными и отложенными).
    Если конфликт найден и это новый пост, сдвигает время на 5 минут вперед.
    """
    if not is_new:
        return initial_date_iso

    all_times = crud.get_all_publication_times_for_project(db, project_id)
    
    current_date_obj = datetime.fromisoformat(initial_date_iso.replace('Z', '+00:00'))
    current_date_iso = initial_date_iso

    while current_date_iso in all_times:
        print(f"Time conflict found at {current_date_iso}. Shifting by 5 minutes.")
        current_date_obj += timedelta(minutes=5)
        current_date_iso = current_date_obj.astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

    if current_date_iso != initial_date_iso:
        print(f"Found conflict-free time: {current_date_iso}")

    return current_date_iso