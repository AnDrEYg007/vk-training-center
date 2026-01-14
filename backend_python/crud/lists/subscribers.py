
from sqlalchemy.orm import Session
from typing import List, Dict, Set
import models

def get_all_subscriber_vk_ids(db: Session, project_id: str) -> Set[int]:
    results = db.query(models.SystemListSubscriber.vk_user_id).filter(models.SystemListSubscriber.project_id == project_id).all()
    return {r[0] for r in results}

def get_subscribers_by_vk_ids(db: Session, project_id: str, vk_ids: List[int]) -> List[models.SystemListSubscriber]:
    """
    Получает полные данные подписчиков по списку ID.
    Используется для переноса данных в историю перед удалением.
    """
    if not vk_ids:
        return []
    
    result = []
    # Разбиваем на чанки, так как IN (...) имеет лимиты
    CHUNK_SIZE = 500
    for i in range(0, len(vk_ids), CHUNK_SIZE):
        chunk = vk_ids[i:i + CHUNK_SIZE]
        batch = db.query(models.SystemListSubscriber).filter(
            models.SystemListSubscriber.project_id == project_id,
            models.SystemListSubscriber.vk_user_id.in_(chunk)
        ).all()
        result.extend(batch)
        
    return result

def bulk_add_subscribers(db: Session, subscribers: List[Dict]):
    if not subscribers:
        return
    
    # Разбиваем на пакеты по 100 записей для стабильности (снижаем нагрузку на память и локи БД)
    CHUNK_SIZE = 100
    for i in range(0, len(subscribers), CHUNK_SIZE):
        chunk = subscribers[i:i + CHUNK_SIZE]
        db.bulk_insert_mappings(models.SystemListSubscriber, chunk)
        # Коммитим каждый чанк, чтобы не держать транзакцию слишком долго
        db.commit()

def bulk_delete_subscribers(db: Session, project_id: str, vk_user_ids: List[int]):
    if not vk_user_ids:
        return
    # Уменьшаем размер чанка для удаления
    CHUNK_SIZE = 500
    for i in range(0, len(vk_user_ids), CHUNK_SIZE):
        chunk = vk_user_ids[i:i + CHUNK_SIZE]
        db.query(models.SystemListSubscriber).filter(
            models.SystemListSubscriber.project_id == project_id,
            models.SystemListSubscriber.vk_user_id.in_(chunk)
        ).delete(synchronize_session=False)
        db.commit()

def delete_all_subscribers(db: Session, project_id: str):
    """Полное удаление всех подписчиков проекта."""
    db.query(models.SystemListSubscriber).filter(
        models.SystemListSubscriber.project_id == project_id
    ).delete(synchronize_session=False)
    db.commit()

def bulk_update_subscriber_details(db: Session, project_id: str, updates: List[Dict]):
    """
    Массовое обновление полей существующих подписчиков.
    """
    if not updates: return

    vk_ids = [u['vk_user_id'] for u in updates]
    
    # Находим первичные ключи (id) для этих vk_user_id
    # Разбиваем запрос на чанки, если ID очень много
    vk_to_pk_map = {}
    FETCH_CHUNK = 1000
    
    for i in range(0, len(vk_ids), FETCH_CHUNK):
        chunk_ids = vk_ids[i:i + FETCH_CHUNK]
        records = db.query(models.SystemListSubscriber.id, models.SystemListSubscriber.vk_user_id).filter(
            models.SystemListSubscriber.project_id == project_id,
            models.SystemListSubscriber.vk_user_id.in_(chunk_ids)
        ).all()
        for r in records:
            vk_to_pk_map[r.vk_user_id] = r.id
    
    final_updates = []
    for u in updates:
        pk = vk_to_pk_map.get(u['vk_user_id'])
        if pk:
            # Копируем все поля из update dict, добавляем PK
            update_payload = u.copy()
            update_payload['id'] = pk
            # Удаляем vk_user_id из payload, так как мы обновляем по id (PK) и vk_user_id менять не надо
            if 'vk_user_id' in update_payload:
                del update_payload['vk_user_id']
                
            final_updates.append(update_payload)
    
    if final_updates:
        # Чанкинг для обновлений
        CHUNK_SIZE = 100
        for i in range(0, len(final_updates), CHUNK_SIZE):
            chunk = final_updates[i:i + CHUNK_SIZE]
            db.bulk_update_mappings(models.SystemListSubscriber, chunk)
            db.commit()
