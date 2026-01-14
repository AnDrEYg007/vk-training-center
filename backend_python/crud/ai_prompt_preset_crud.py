from sqlalchemy.orm import Session
import uuid

import models
from schemas import AiPromptPresetCreate, AiPromptPresetUpdate

def get_presets_by_project_id(db: Session, project_id: str) -> list[models.AiPromptPreset]:
    return db.query(models.AiPromptPreset).filter(models.AiPromptPreset.project_id == project_id).order_by(models.AiPromptPreset.name).all()

def create_preset(db: Session, preset_data: AiPromptPresetCreate, project_id: str) -> models.AiPromptPreset:
    db_preset = models.AiPromptPreset(
        id=str(uuid.uuid4()),
        project_id=project_id,
        **preset_data.model_dump()
    )
    db.add(db_preset)
    db.commit()
    db.refresh(db_preset)
    return db_preset

def update_preset(db: Session, preset_id: str, preset_data: AiPromptPresetUpdate) -> models.AiPromptPreset:
    db_preset = db.query(models.AiPromptPreset).filter(models.AiPromptPreset.id == preset_id).first()
    if db_preset:
        update_data = preset_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_preset, key, value)
        db.commit()
        db.refresh(db_preset)
    return db_preset

def delete_preset(db: Session, preset_id: str) -> bool:
    deleted_count = db.query(models.AiPromptPreset).filter(models.AiPromptPreset.id == preset_id).delete()
    db.commit()
    return deleted_count > 0
