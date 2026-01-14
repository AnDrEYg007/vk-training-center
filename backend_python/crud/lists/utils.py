
from sqlalchemy.orm import Session
from sqlalchemy import func
import models

def deduplicate_users(db: Session, model, project_id: str) -> int:
    """
    Удаляет дубликаты записей пользователей (по vk_user_id) в рамках проекта.
    Оставляет одну (первую найденную) запись.
    После удаления ОБНОВЛЯЕТ счетчик в project_list_meta.
    """
    # 1. Находим vk_user_id, у которых более 1 записи
    duplicates = db.query(model.vk_user_id).filter(
        model.project_id == project_id
    ).group_by(model.vk_user_id).having(func.count(model.id) > 1).all()
    
    if not duplicates:
        # print(f"DEDUPLICATION: No duplicates found for {model.__tablename__} in project {project_id}.")
        return 0

    print(f"DEDUPLICATION: Found {len(duplicates)} users with duplicates for {model.__tablename__} in project {project_id}.")

    deleted_count = 0
    for (vk_id,) in duplicates:
        # Получаем все записи дубликатов
        entries = db.query(model).filter(
            model.project_id == project_id,
            model.vk_user_id == vk_id
        ).all()
        
        # Если записей > 1, оставляем одну (первую), остальные удаляем
        if len(entries) > 1:
            # Оставляем entries[0], удаляем остальные
            keep_entry = entries[0]
            remove_entries = entries[1:]
            
            # print(f"  -> User {vk_id}: keeping {keep_entry.id}, deleting {len(remove_entries)} others.")
            
            for entry in remove_entries:
                db.delete(entry)
                deleted_count += 1
    
    if deleted_count > 0:
        print(f"DEDUPLICATION: Committing deletion of {deleted_count} duplicate entries...")
        db.commit()

        # --- ОБНОВЛЕНИЕ МЕТАДАННЫХ (СЧЕТЧИКОВ) ---
        # Определяем, какое поле в ProjectListMeta нужно обновить в зависимости от таблицы
        table_name = model.__tablename__
        meta_field = None
        
        if table_name == "system_list_subscribers": meta_field = "subscribers_count"
        elif table_name == "system_list_history_join": meta_field = "history_join_count"
        elif table_name == "system_list_history_leave": meta_field = "history_leave_count"
        elif table_name == "system_list_mailing": meta_field = "mailing_count"
        elif table_name == "system_list_authors": meta_field = "authors_count"
        elif table_name == "system_list_likes": meta_field = "likes_count"
        elif table_name == "system_list_comments": meta_field = "comments_count"
        elif table_name == "system_list_reposts": meta_field = "reposts_count"
        
        if meta_field:
            # Считаем реальное количество оставшихся записей
            actual_count = db.query(model).filter(model.project_id == project_id).count()
            
            # Обновляем запись метаданных
            meta = db.query(models.ProjectListMeta).filter(models.ProjectListMeta.project_id == project_id).first()
            if meta:
                setattr(meta, meta_field, actual_count)
                db.commit()
                print(f"DEDUPLICATION: Updated metadata '{meta_field}' to {actual_count} for project {project_id}.")
        
    print(f"DEDUPLICATION: Successfully removed {deleted_count} duplicate entries for {model.__tablename__} in project {project_id}.")
    return deleted_count
