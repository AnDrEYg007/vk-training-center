
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import schemas
import services.project_context_service as context_service
from database import SessionLocal

router = APIRouter(prefix="/project-context", tags=["Project Context"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/structure", response_model=List[schemas.ProjectContextField])
def get_structure(db: Session = Depends(get_db)):
    return context_service.get_context_structure(db)

@router.post("/fields", response_model=schemas.ProjectContextField)
def create_field(payload: schemas.CreateContextFieldPayload, db: Session = Depends(get_db)):
    return context_service.create_field(db, payload.name, payload.description, payload.is_global, payload.project_ids)

@router.put("/fields/{field_id}", response_model=schemas.ProjectContextField)
def update_field(field_id: str, payload: schemas.UpdateContextFieldPayload, db: Session = Depends(get_db)):
    return context_service.update_field(db, field_id, payload)

@router.delete("/fields/{field_id}", response_model=schemas.GenericSuccess)
def delete_field(field_id: str, db: Session = Depends(get_db)):
    context_service.delete_field(db, field_id)
    return {"success": True}

@router.get("/data", response_model=schemas.ProjectContextResponse)
def get_data(db: Session = Depends(get_db)):
    return context_service.get_all_data(db)

@router.post("/values", response_model=schemas.GenericSuccess)
def update_values(payload: schemas.UpdateContextValuesPayload, db: Session = Depends(get_db)):
    context_service.update_values(db, payload.values)
    return {"success": True}

@router.get("/project/{project_id}", response_model=schemas.ProjectSpecificContextResponse)
def get_project_specific_context(project_id: str, db: Session = Depends(get_db)):
    return context_service.get_project_context(db, project_id)

@router.post("/ai-autofill", response_model=List[schemas.ProjectContextValue])
def ai_autofill(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    """
    Запускает AI-анализ данных сообщества VK и автоматически заполняет поля контекста.
    """
    return context_service.ai_autofill_project(db, payload.projectId)

# --- New Endpoints ---

@router.post("/ai-company-desc", response_model=schemas.ProjectContextValue)
def ai_company_desc(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    """Генерирует описание компании на основе данных из VK и контекста."""
    value = context_service.generate_company_desc(db, payload.projectId)
    # Возвращаем в формате, который ожидает фронтенд, но id фейковый, так как не сохраняем
    return {"id": "temp", "project_id": payload.projectId, "field_id": "temp", "value": value}

@router.post("/ai-products-desc", response_model=schemas.ProjectContextValue)
def ai_products_desc(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    """Генерирует описание товаров и услуг на основе каталога."""
    value = context_service.generate_products_desc(db, payload.projectId)
    return {"id": "temp", "project_id": payload.projectId, "field_id": "temp", "value": value}

@router.post("/ai-tone", response_model=schemas.ProjectContextValue)
def ai_tone(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    """Определяет тональность бренда на основе последних постов."""
    value = context_service.generate_tone(db, payload.projectId)
    return {"id": "temp", "project_id": payload.projectId, "field_id": "temp", "value": value}
