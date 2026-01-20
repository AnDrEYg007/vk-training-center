from sqlalchemy.orm import Session
from sqlalchemy import func
import json
import models
from schemas import Project

# ===============================================
# PROJECTS
# ===============================================

def get_all_projects(db: Session) -> list[models.Project]:
    """Возвращает все НЕАРХИВИРОВАННЫЕ проекты, отсортированные по sort_order, а затем по имени."""
    return db.query(models.Project).filter(models.Project.archived == False).order_by(models.Project.sort_order.asc().nulls_last(), models.Project.name.asc()).all()

def get_max_sort_order(db: Session) -> int:
    """Возвращает максимальный существующий порядковый номер."""
    max_order = db.query(func.max(models.Project.sort_order)).scalar()
    return max_order or 0

def get_archived_projects(db: Session) -> list[models.Project]:
    """Возвращает все проекты, помеченные как архивированные."""
    return db.query(models.Project).filter(models.Project.archived == True).all()

def permanently_delete_project(db: Session, project_id: str) -> bool:
    """Безвозвратно удаляет проект и все связанные с ним данные (посты, заметки и т.д.)."""
    db_project = get_project_by_id(db, project_id)
    if not db_project:
        return False
    
    # SQLAlchemy с настроенными каскадами (ondelete="CASCADE")
    # должен автоматически удалить связанные посты, заметки, теги и т.д.
    db.delete(db_project)
    db.commit()
    return True

def get_project_by_id(db: Session, project_id: str) -> models.Project:
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_project_by_vk_id(db: Session, vk_id: int) -> models.Project:
    return db.query(models.Project).filter(models.Project.vkProjectId == str(vk_id)).first()

def update_project_settings(db: Session, project_data: Project) -> models.Project:
    db_project = get_project_by_id(db, project_data.id)
    if not db_project:
        return None
    
    update_data = project_data.model_dump(exclude_unset=True)
    
    # Специальная обработка для списка дополнительных токенов -> JSON
    if 'additional_community_tokens' in update_data:
        tokens = update_data['additional_community_tokens']
        if tokens is None:
            tokens = []
        # Фильтруем пустые строки
        tokens = [t.strip() for t in tokens if t and t.strip()]
        update_data['additional_community_tokens'] = json.dumps(tokens)

    for key, value in update_data.items():
        setattr(db_project, key, value)
        
    db.commit()
    db.refresh(db_project)
    return db_project

import services.update_tracker as update_tracker

def update_project_last_update_time(db: Session, project_id: str, update_type: str, timestamp: str):
    """Обновляет время последнего обновления для проекта."""
    project = get_project_by_id(db, project_id)
    if project:
        if update_type == 'published':
            project.last_published_update = timestamp
        elif update_type == 'scheduled':
            project.last_scheduled_update = timestamp
        elif update_type == 'market':
            project.last_market_update = timestamp
        
        db.commit()
        # NOTIFY FRONTEND via Update Tracker
        try:
             update_tracker.add_updated_project(project_id)
        except Exception as e:
             print(f"Warning: Failed to update tracker: {e}")


def get_project_variables(db: Session, project_id: str) -> list[dict]:
    project = get_project_by_id(db, project_id)
    if not project or not project.variables:
        return []

    raw_variables = project.variables
    variables = []
    try:
        cleaned_str = raw_variables.strip()
        if not cleaned_str: return []
        
        if cleaned_str.startswith('(') and cleaned_str.endswith(')'):
             pass

        pairs = cleaned_str.split('), (')
        for i, pair in enumerate(pairs):
            pair = pair.strip()
            if i == 0:
                pair = pair.lstrip('(')
            if i == len(pairs) - 1:
                pair = pair.rstrip(')')

            parts = pair.split('||')
            if len(parts) == 2:
                variables.append({"name": parts[0].strip(), "value": parts[1].strip()})
    except Exception as e:
        print(f"Error parsing variables for project {project_id}: {e}")
        return []

    return variables

def get_all_vk_project_ids(db: Session) -> set[str]:
    """Возвращает набор всех `vkProjectId` из базы данных для быстрой проверки дубликатов."""
    results = db.query(models.Project.vkProjectId).all()
    return {r[0] for r in results if r[0]}