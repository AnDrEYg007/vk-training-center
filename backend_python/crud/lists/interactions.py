
from sqlalchemy.orm import Session
from typing import List, Dict, Optional, Any
import json
import models
from .retrieval import get_subscribers

def get_interactions(
    db: Session, 
    project_id: str, 
    list_type: str, # likes, comments, reposts
    page: int, 
    page_size: int, 
    search_query: Optional[str] = None,
    filter_quality: str = 'all',
    filter_sex: str = 'all',
    filter_online: str = 'any',
    filter_bdate_month: str = 'any', # NEW
    filter_platform: str = 'any', # NEW
    filter_age: str = 'any' # NEW
) -> List[Any]:
    # Теперь мы пробрасываем все фильтры в get_subscribers, который умеет их обрабатывать
    # (поскольку get_subscribers использует универсальный apply_filters)
    return get_subscribers(
        db, 
        project_id, 
        list_type, 
        page, 
        page_size, 
        search_query, 
        filter_quality, 
        filter_sex, 
        filter_online, 
        'all', # filter_can_write (not applicable)
        filter_bdate_month,
        filter_platform,
        filter_age
    )

def bulk_upsert_interactions(db: Session, project_id: str, list_type: str, items: List[Dict]):
    """
    Upsert логика для взаимодействий.
    Если пользователь уже есть в списке - обновляем. Если нет - создаем.
    """
    if not items: return

    if list_type == 'likes': model = models.SystemListLikes
    elif list_type == 'comments': model = models.SystemListComments
    elif list_type == 'reposts': model = models.SystemListReposts
    else: return

    # 1. Получаем существующих пользователей из этого пакета
    vk_ids = [i['vk_user_id'] for i in items]
    
    # Разбиваем запрос на получение существующих записей
    existing_records = []
    FETCH_CHUNK = 500
    for i in range(0, len(vk_ids), FETCH_CHUNK):
        chunk_ids = vk_ids[i:i + FETCH_CHUNK]
        chunk_records = db.query(model).filter(
            model.project_id == project_id,
            model.vk_user_id.in_(chunk_ids)
        ).all()
        existing_records.extend(chunk_records)
    
    existing_map = {r.vk_user_id: r for r in existing_records}
    
    new_records = []
    updates = []
    
    for item in items:
        existing = existing_map.get(item['vk_user_id'])
        
        # Парсим новые post_ids
        try:
            new_post_ids = set(json.loads(item['post_ids']))
        except Exception:
            new_post_ids = set()
        
        # ВАЖНО: last_interaction_date приходит как объект datetime из сервиса
        new_date = item['last_interaction_date']

        if existing:
            # Merge Logic
            try:
                current_post_ids = set(json.loads(existing.post_ids))
            except:
                current_post_ids = set()
            
            merged_post_ids = current_post_ids.union(new_post_ids)
            
            update_payload = {
                "id": existing.id,
                "last_interaction_date": max(existing.last_interaction_date, new_date),
                "last_post_id": item['last_post_id'] if new_date >= existing.last_interaction_date else existing.last_post_id,
                "interaction_count": len(merged_post_ids),
                "post_ids": json.dumps(list(merged_post_ids)),
                # Обновляем базовые поля
                "first_name": item.get('first_name', existing.first_name),
                "last_name": item.get('last_name', existing.last_name),
                "photo_url": item.get('photo_url', existing.photo_url),
                "sex": item.get('sex', existing.sex),
            }
            
            # Обновляем расширенные поля, если они есть в новых данных
            # Проверяем наличие ключа в словаре item.
            # Если ключа нет, не трогаем существующее значение.
            if 'city' in item: update_payload['city'] = item['city']
            if 'country' in item: update_payload['country'] = item['country']
            if 'bdate' in item: update_payload['bdate'] = item['bdate']
            if 'domain' in item: update_payload['domain'] = item['domain']
            if 'has_mobile' in item: update_payload['has_mobile'] = item['has_mobile']
            if 'last_seen' in item: update_payload['last_seen'] = item['last_seen']
            if 'platform' in item: update_payload['platform'] = item['platform']
            if 'deactivated' in item: update_payload['deactivated'] = item['deactivated']
            if 'is_closed' in item: update_payload['is_closed'] = item['is_closed']
            if 'can_access_closed' in item: update_payload['can_access_closed'] = item['can_access_closed']

            updates.append(update_payload)
        else:
            # New Record
            item['interaction_count'] = len(new_post_ids)
            new_records.append(item)

    CHUNK_SIZE = 100

    if updates:
        for i in range(0, len(updates), CHUNK_SIZE):
            chunk = updates[i:i + CHUNK_SIZE]
            db.bulk_update_mappings(model, chunk)
            db.commit()
    
    if new_records:
        for i in range(0, len(new_records), CHUNK_SIZE):
            chunk = new_records[i:i + CHUNK_SIZE]
            db.bulk_insert_mappings(model, chunk)
            db.commit()

def get_all_interaction_vk_ids(db: Session, project_id: str, list_type: str) -> List[int]:
    """Получает все VK ID пользователей из списка взаимодействий."""
    if list_type == 'likes': model = models.SystemListLikes
    elif list_type == 'comments': model = models.SystemListComments
    elif list_type == 'reposts': model = models.SystemListReposts
    else: return []
    
    results = db.query(model.vk_user_id).filter(model.project_id == project_id).all()
    return [r[0] for r in results]

def bulk_update_interaction_users(db: Session, project_id: str, list_type: str, updates: List[Dict]):
    """Обновляет профильные данные пользователей в списках взаимодействий."""
    if not updates: return
    
    if list_type == 'likes': model = models.SystemListLikes
    elif list_type == 'comments': model = models.SystemListComments
    elif list_type == 'reposts': model = models.SystemListReposts
    else: return

    vk_ids = [u['vk_user_id'] for u in updates]
    
    # Чанкинг для SELECT
    vk_to_pk_map = {}
    FETCH_CHUNK = 1000
    for i in range(0, len(vk_ids), FETCH_CHUNK):
        chunk_ids = vk_ids[i:i + FETCH_CHUNK]
        records = db.query(model.id, model.vk_user_id).filter(
            model.project_id == project_id,
            model.vk_user_id.in_(chunk_ids)
        ).all()
        for r in records:
            vk_to_pk_map[r.vk_user_id] = r.id
    
    final_updates = []
    for u in updates:
        pk = vk_to_pk_map.get(u['vk_user_id'])
        if pk:
            payload = {"id": pk}
            # Обновляем все поля, которые пришли
            # Используем .get() для безопасности, но предполагаем, что ключи есть в словаре updates
            if 'first_name' in u: payload['first_name'] = u['first_name']
            if 'last_name' in u: payload['last_name'] = u['last_name']
            if 'sex' in u: payload['sex'] = u['sex']
            if 'photo_url' in u: payload['photo_url'] = u['photo_url']
            if 'deactivated' in u: payload['deactivated'] = u['deactivated']
            if 'last_seen' in u: payload['last_seen'] = u['last_seen']
            if 'platform' in u: payload['platform'] = u['platform']
            
            # Новые поля
            if 'city' in u: payload['city'] = u['city']
            if 'country' in u: payload['country'] = u['country']
            if 'bdate' in u: payload['bdate'] = u['bdate']
            if 'domain' in u: payload['domain'] = u['domain']
            if 'has_mobile' in u: payload['has_mobile'] = u['has_mobile']
            if 'is_closed' in u: payload['is_closed'] = u['is_closed']
            if 'can_access_closed' in u: payload['can_access_closed'] = u['can_access_closed']

            final_updates.append(payload)

    if final_updates:
        CHUNK_SIZE = 100
        for i in range(0, len(final_updates), CHUNK_SIZE):
            chunk = final_updates[i:i + CHUNK_SIZE]
            db.bulk_update_mappings(model, chunk)
            db.commit()

def delete_all_interactions(db: Session, project_id: str, list_type: str):
    """Полное удаление взаимодействий."""
    if list_type == 'likes': model = models.SystemListLikes
    elif list_type == 'comments': model = models.SystemListComments
    elif list_type == 'reposts': model = models.SystemListReposts
    else: return
    
    db.query(model).filter(model.project_id == project_id).delete(synchronize_session=False)
    db.commit()
