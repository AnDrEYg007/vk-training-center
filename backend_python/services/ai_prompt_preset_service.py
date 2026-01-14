from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

import crud
from schemas import AiPromptPreset, AiPromptPresetCreate, AiPromptPresetUpdate

def get_presets_for_project(db: Session, project_id: str) -> List[AiPromptPreset]:
    presets = crud.get_presets_by_project_id(db, project_id)
    return [AiPromptPreset.model_validate(p, from_attributes=True) for p in presets]

def create_preset(db: Session, preset_data: AiPromptPresetCreate, project_id: str) -> AiPromptPreset:
    created_preset = crud.create_preset(db, preset_data, project_id)
    return AiPromptPreset.model_validate(created_preset, from_attributes=True)

def update_preset(db: Session, preset_id: str, preset_data: AiPromptPresetUpdate) -> AiPromptPreset:
    updated_preset = crud.update_preset(db, preset_id, preset_data)
    if not updated_preset:
        raise HTTPException(status_code=404, detail="AI Prompt Preset not found")
    return AiPromptPreset.model_validate(updated_preset, from_attributes=True)

def delete_preset(db: Session, preset_id: str) -> bool:
    return crud.delete_preset(db, preset_id)
