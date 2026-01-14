from sqlalchemy.orm import Session
from typing import List, Dict
import uuid

import models
from schemas import GlobalVariableDefinition

def get_all_definitions(db: Session) -> List[models.GlobalVariableDefinition]:
    return db.query(models.GlobalVariableDefinition).order_by(models.GlobalVariableDefinition.name).all()

def get_values_by_project_id(db: Session, project_id: str) -> List[models.ProjectGlobalVariableValue]:
    return db.query(models.ProjectGlobalVariableValue).filter(models.ProjectGlobalVariableValue.project_id == project_id).all()

def update_all_definitions(db: Session, definitions_data: List[GlobalVariableDefinition]):
    all_current_def_ids = {str(d.id) for d in db.query(models.GlobalVariableDefinition.id).all()}
    all_incoming_def_ids = {d.id for d in definitions_data if not d.id.startswith('new-')}

    # 1. Удаляем определения, которых больше нет
    ids_to_delete = all_current_def_ids - all_incoming_def_ids
    if ids_to_delete:
        db.query(models.GlobalVariableDefinition).filter(models.GlobalVariableDefinition.id.in_(ids_to_delete)).delete(synchronize_session=False)

    # 2. Обновляем существующие и создаем новые определения
    for def_data in definitions_data:
        if def_data.id.startswith('new-'):
            new_db_def = models.GlobalVariableDefinition(
                id=str(uuid.uuid4()),
                name=def_data.name,
                placeholder_key=def_data.placeholder_key,
                note=def_data.note
            )
            db.add(new_db_def)
        else:
            db_def = db.query(models.GlobalVariableDefinition).filter(models.GlobalVariableDefinition.id == def_data.id).first()
            if db_def:
                db_def.name = def_data.name
                db_def.placeholder_key = def_data.placeholder_key
                db_def.note = def_data.note
    
    db.commit()

def update_values_for_project(db: Session, project_id: str, values_data: List[Dict[str, str]]):
    # Операция upsert (update/insert). Проще всего удалить все старые значения для проекта и вставить новые.
    db.query(models.ProjectGlobalVariableValue).filter(models.ProjectGlobalVariableValue.project_id == project_id).delete(synchronize_session=False)

    new_values = []
    for value_item in values_data:
        # Сохраняем, только если есть значение
        if value_item.get('value'):
            new_db_value = models.ProjectGlobalVariableValue(
                id=str(uuid.uuid4()),
                project_id=project_id,
                definition_id=value_item['definition_id'],
                value=value_item['value']
            )
            new_values.append(new_db_value)
    
    if new_values:
        db.add_all(new_values)
    
    db.commit()
