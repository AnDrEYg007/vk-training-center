
from sqlalchemy.orm import Session
from typing import List, Dict
import models

def bulk_upsert_authors(db: Session, items: List[Dict]):
    """
    Массовое обновление/вставка авторов.
    Использует логику: если запись существует, обновляет детали. Если нет - вставляет.
    """
    if not items: return
    
    # Получаем существующие записи, чтобы обновить их, или вставить новые.
    # Так как нам нужно сохранять уникальность по project_id + vk_user_id.
    
    # 1. Группируем входящие данные по ID для дедупликации внутри пакета
    upserts_map = {}
    for item in items:
        # ID формируется как project_id_userid
        record_id = item['id'] 
        upserts_map[record_id] = item
        
    upserts = list(upserts_map.values())
    ids_to_check = list(upserts_map.keys())

    # 2. Проверяем, какие записи уже есть в базе
    existing_records = []
    CHUNK_SIZE = 500
    for i in range(0, len(ids_to_check), CHUNK_SIZE):
        chunk_ids = ids_to_check[i:i + CHUNK_SIZE]
        found = db.query(models.SystemListAuthor).filter(
            models.SystemListAuthor.id.in_(chunk_ids)
        ).all()
        existing_records.extend(found)
        
    existing_ids = {r.id for r in existing_records}
    
    # 3. Разделяем на INSERT и UPDATE
    to_insert = []
    to_update = []
    
    for item in upserts:
        if item['id'] in existing_ids:
            # Для обновления мы не меняем event_date (дата первого обнаружения)
            update_data = item.copy()
            if 'event_date' in update_data:
                del update_data['event_date']
            to_update.append(update_data)
        else:
            to_insert.append(item)
            
    # 4. Выполняем операции
    CHUNK_SIZE_OP = 100
    
    if to_insert:
        for i in range(0, len(to_insert), CHUNK_SIZE_OP):
            chunk = to_insert[i:i + CHUNK_SIZE_OP]
            db.bulk_insert_mappings(models.SystemListAuthor, chunk)
            db.commit()
            
    if to_update:
        for i in range(0, len(to_update), CHUNK_SIZE_OP):
            chunk = to_update[i:i + CHUNK_SIZE_OP]
            db.bulk_update_mappings(models.SystemListAuthor, chunk)
            db.commit()

def delete_all_authors(db: Session, project_id: str):
    """Полное удаление списка авторов."""
    db.query(models.SystemListAuthor).filter(
        models.SystemListAuthor.project_id == project_id
    ).delete(synchronize_session=False)
    db.commit()
