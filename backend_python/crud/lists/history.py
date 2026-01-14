
from sqlalchemy.orm import Session
from typing import List, Dict
import models

def bulk_add_history_join(db: Session, items: List[Dict]):
    if not items: return
    
    # Уменьшаем размер пакета до 100
    CHUNK_SIZE = 100
    for i in range(0, len(items), CHUNK_SIZE):
        chunk = items[i:i + CHUNK_SIZE]
        db.bulk_insert_mappings(models.SystemListHistoryJoin, chunk)
        db.commit()

def bulk_add_history_leave(db: Session, items: List[Dict]):
    if not items: return
    
    # Уменьшаем размер пакета до 100
    CHUNK_SIZE = 100
    for i in range(0, len(items), CHUNK_SIZE):
        chunk = items[i:i + CHUNK_SIZE]
        db.bulk_insert_mappings(models.SystemListHistoryLeave, chunk)
        db.commit()

def get_all_history_vk_ids(db: Session, project_id: str, list_type: str) -> List[int]:
    if list_type == 'history_join': model = models.SystemListHistoryJoin
    elif list_type == 'history_leave': model = models.SystemListHistoryLeave
    else: return []
    results = db.query(model.vk_user_id).filter(model.project_id == project_id).all()
    return [r[0] for r in results]

def delete_all_history_join(db: Session, project_id: str):
    """Полное удаление истории вступлений."""
    db.query(models.SystemListHistoryJoin).filter(
        models.SystemListHistoryJoin.project_id == project_id
    ).delete(synchronize_session=False)
    db.commit()

def delete_all_history_leave(db: Session, project_id: str):
    """Полное удаление истории выходов."""
    db.query(models.SystemListHistoryLeave).filter(
        models.SystemListHistoryLeave.project_id == project_id
    ).delete(synchronize_session=False)
    db.commit()

def bulk_update_history_details(db: Session, project_id: str, list_type: str, updates: List[Dict]):
    if not updates: return
    if list_type == 'history_join': model = models.SystemListHistoryJoin
    elif list_type == 'history_leave': model = models.SystemListHistoryLeave
    else: return

    vk_ids = [u['vk_user_id'] for u in updates]
    
    # Чанкинг для SELECT запроса
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
            update_payload = {
                "id": pk,
                "deactivated": u.get('deactivated'),
                "last_seen": u.get('last_seen')
            }
            if u.get('first_name'): update_payload['first_name'] = u.get('first_name')
            if u.get('last_name'): update_payload['last_name'] = u.get('last_name')
            if u.get('sex'): update_payload['sex'] = u.get('sex')
            if u.get('photo_url'): update_payload['photo_url'] = u.get('photo_url')
            
            # Обновляем расширенные поля
            if u.get('city'): update_payload['city'] = u.get('city')
            if u.get('country'): update_payload['country'] = u.get('country')
            if u.get('bdate'): update_payload['bdate'] = u.get('bdate')
            if u.get('domain'): update_payload['domain'] = u.get('domain')
            if 'has_mobile' in u: update_payload['has_mobile'] = u['has_mobile']
            if 'is_closed' in u: update_payload['is_closed'] = u['is_closed']
            if 'can_access_closed' in u: update_payload['can_access_closed'] = u['can_access_closed']
            if 'platform' in u: update_payload['platform'] = u['platform']

            final_updates.append(update_payload)
    
    if final_updates:
        CHUNK_SIZE = 100
        for i in range(0, len(final_updates), CHUNK_SIZE):
            chunk = final_updates[i:i + CHUNK_SIZE]
            db.bulk_update_mappings(model, chunk)
            db.commit()
