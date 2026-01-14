
from sqlalchemy.orm import Session
from typing import List, Dict
import uuid
import models
import schemas # Для Pydantic моделей

def get_all_fields(db: Session) -> List[schemas.ProjectContextField]:
    """
    Получает все поля контекста.
    Для не-глобальных полей подгружает список project_ids.
    """
    db_fields = db.query(models.ProjectContextField).order_by(models.ProjectContextField.name).all()
    
    result = []
    for f in db_fields:
        # Преобразуем в Pydantic модель
        pydantic_field = schemas.ProjectContextField.model_validate(f, from_attributes=True)
        
        # Если поле не глобальное, ищем привязки
        if not f.is_global:
            visibility_records = db.query(models.ProjectContextFieldVisibility).filter(
                models.ProjectContextFieldVisibility.field_id == f.id
            ).all()
            pydantic_field.project_ids = [r.project_id for r in visibility_records]
        else:
            pydantic_field.project_ids = []
            
        result.append(pydantic_field)
        
    return result

def create_field(db: Session, name: str, description: str = None, is_global: bool = True, project_ids: List[str] = None) -> schemas.ProjectContextField:
    new_id = str(uuid.uuid4())
    db_field = models.ProjectContextField(
        id=new_id,
        name=name,
        description=description,
        is_global=is_global
    )
    db.add(db_field)
    
    # Если не глобальное и есть список проектов, сохраняем видимость
    if not is_global and project_ids:
        for pid in project_ids:
            vis_rec = models.ProjectContextFieldVisibility(
                field_id=new_id,
                project_id=pid
            )
            db.add(vis_rec)
    
    db.commit()
    db.refresh(db_field)
    
    # Формируем ответ
    response_field = schemas.ProjectContextField.model_validate(db_field, from_attributes=True)
    if not is_global and project_ids:
        response_field.project_ids = project_ids
    
    return response_field

def update_field(db: Session, field_id: str, payload: schemas.UpdateContextFieldPayload) -> schemas.ProjectContextField:
    db_field = db.query(models.ProjectContextField).filter(models.ProjectContextField.id == field_id).first()
    if not db_field:
        return None
    
    # Обновляем основные поля
    if payload.name is not None:
        db_field.name = payload.name
    if payload.description is not None:
        db_field.description = payload.description
    
    # Логика смены видимости
    if payload.is_global is not None:
        db_field.is_global = payload.is_global
    
    # Если поле стало не глобальным или обновился список проектов
    # Или если поле глобальное, но нужно очистить привязки (на всякий случай)
    if payload.project_ids is not None or payload.is_global is not None:
        # Сначала очищаем старые привязки
        db.query(models.ProjectContextFieldVisibility).filter(
            models.ProjectContextFieldVisibility.field_id == field_id
        ).delete(synchronize_session=False)
        
        # Если поле НЕ глобальное, добавляем новые привязки
        # (Учитываем и новое значение is_global из payload, и старое из db если не менялось)
        current_is_global = payload.is_global if payload.is_global is not None else db_field.is_global
        
        if not current_is_global and payload.project_ids:
            for pid in payload.project_ids:
                vis_rec = models.ProjectContextFieldVisibility(
                    field_id=field_id,
                    project_id=pid
                )
                db.add(vis_rec)

    db.commit()
    db.refresh(db_field)
    
    # Формируем ответ
    response_field = schemas.ProjectContextField.model_validate(db_field, from_attributes=True)
    if not db_field.is_global:
         visibility_records = db.query(models.ProjectContextFieldVisibility).filter(
            models.ProjectContextFieldVisibility.field_id == field_id
         ).all()
         response_field.project_ids = [r.project_id for r in visibility_records]
    
    return response_field


def delete_field(db: Session, field_id: str):
    """
    Удаляет поле контекста.
    Связанные значения и записи видимости удаляются автоматически благодаря
    ondelete="CASCADE" в моделях ProjectContextValue и ProjectContextFieldVisibility.
    """
    db.query(models.ProjectContextField).filter(models.ProjectContextField.id == field_id).delete()
    db.commit()

def get_all_values(db: Session) -> List[models.ProjectContextValue]:
    return db.query(models.ProjectContextValue).all()

def get_values_by_project(db: Session, project_id: str) -> List[models.ProjectContextValue]:
    return db.query(models.ProjectContextValue).filter(models.ProjectContextValue.project_id == project_id).all()

def update_values(db: Session, values_data: List[Dict]):
    """
    Upsert values. values_data = [{project_id, field_id, value}, ...]
    """
    for item in values_data:
        project_id = item['project_id']
        field_id = item['field_id']
        val = item['value']
        
        existing = db.query(models.ProjectContextValue).filter(
            models.ProjectContextValue.project_id == project_id,
            models.ProjectContextValue.field_id == field_id
        ).first()
        
        if existing:
            if not val:
                db.delete(existing) # Remove empty value
            else:
                existing.value = val
        elif val: # Create only if value is not empty
            new_rec = models.ProjectContextValue(
                id=str(uuid.uuid4()),
                project_id=project_id,
                field_id=field_id,
                value=val
            )
            db.add(new_rec)
    
    db.commit()
