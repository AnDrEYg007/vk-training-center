
from sqlalchemy.orm import Session
from typing import List, Dict, Set
import models

def bulk_upsert_mailing(db: Session, project_id: str, items: List[Dict]):
    """
    Обновление списка рассылки.
    Использует стратегию Split Upsert:
    1. Проверяет существование записей по ID.
    2. Новые записи -> INSERT.
    3. Существующие записи -> UPDATE (обновляем профиль, но сохраняем данные анализа и дату добавления).
    """
    if not items: return
    
    # 1. Группируем входящие данные по ID для дедупликации внутри пакета
    upserts_map = {}
    for item in items:
        # Генерируем ID: project_id_userid
        record_id = f"{project_id}_{item['vk_user_id']}"
        
        record = item.copy()
        record['id'] = record_id
        record['project_id'] = project_id
        
        upserts_map[record_id] = record

    all_ids = list(upserts_map.keys())

    # 2. Проверяем, какие ID уже есть в БД
    existing_ids = set()
    # Разбиваем на чанки для SELECT IN, если пакет большой
    CHUNK_SIZE_SELECT = 500
    for i in range(0, len(all_ids), CHUNK_SIZE_SELECT):
        chunk_ids = all_ids[i:i + CHUNK_SIZE_SELECT]
        found = db.query(models.SystemListMailing.id).filter(
            models.SystemListMailing.id.in_(chunk_ids)
        ).all()
        for (fid,) in found:
            existing_ids.add(fid)

    # 3. Разделяем на списки для вставки и обновления
    to_insert = []
    to_update = []

    for record_id, record in upserts_map.items():
        if record_id in existing_ids:
            # UPDATE: Убираем поля, которые НЕЛЬЗЯ перезаписывать при синхронизации
            update_payload = record.copy()
            
            # Сохраняем дату добавления (когда пользователь впервые попал в базу)
            if 'added_at' in update_payload:
                del update_payload['added_at']
                
            # Сохраняем источник (если он был задан ранее, не меняем на дефолт)
            if 'source' in update_payload:
                del update_payload['source']

            # ВАЖНО: Эти поля приходят из синхронизации пустыми (или не приходят),
            # но если они вдруг есть в payload как None, их нужно убрать, чтобы не затереть данные анализа.
            # Обычно list_sync_mailing.py их не формирует, но для безопасности убираем явно.
            if 'first_message_date' in update_payload:
                del update_payload['first_message_date']
            if 'first_message_from_id' in update_payload:
                del update_payload['first_message_from_id']

            to_update.append(update_payload)
        else:
            # INSERT: Вставляем как есть
            to_insert.append(record)

    # 4. Выполняем операции пакетами
    CHUNK_SIZE_OP = 100

    if to_update:
        for i in range(0, len(to_update), CHUNK_SIZE_OP):
            chunk = to_update[i:i + CHUNK_SIZE_OP]
            db.bulk_update_mappings(models.SystemListMailing, chunk)
            db.commit()

    if to_insert:
        for i in range(0, len(to_insert), CHUNK_SIZE_OP):
            chunk = to_insert[i:i + CHUNK_SIZE_OP]
            db.bulk_insert_mappings(models.SystemListMailing, chunk)
            db.commit()

def get_all_mailing_vk_ids(db: Session, project_id: str) -> Set[int]:
    results = db.query(models.SystemListMailing.vk_user_id).filter(models.SystemListMailing.project_id == project_id).all()
    return {r[0] for r in results}

def delete_all_mailing(db: Session, project_id: str):
    """Полное удаление списка рассылки."""
    db.query(models.SystemListMailing).filter(
        models.SystemListMailing.project_id == project_id
    ).delete(synchronize_session=False)
    db.commit()
