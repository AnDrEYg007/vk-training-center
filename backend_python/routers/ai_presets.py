from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from schemas import AiPromptPreset, ProjectIdPayload, CreateAiPromptPresetPayload, UpdateAiPromptPresetPayload, GenericSuccess
import services.ai_prompt_preset_service as preset_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getForProject", response_model=List[AiPromptPreset])
def get_presets_for_project(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return preset_service.get_presets_for_project(db, payload.projectId)

@router.post("/create", response_model=AiPromptPreset)
def create_preset(payload: CreateAiPromptPresetPayload, db: Session = Depends(get_db)):
    return preset_service.create_preset(db, payload.preset, payload.projectId)

@router.post("/update/{preset_id}", response_model=AiPromptPreset)
def update_preset(preset_id: str, payload: UpdateAiPromptPresetPayload, db: Session = Depends(get_db)):
    return preset_service.update_preset(db, preset_id, payload.preset)

@router.post("/delete/{preset_id}", response_model=GenericSuccess)
def delete_preset(preset_id: str, db: Session = Depends(get_db)):
    success = preset_service.delete_preset(db, preset_id)
    if not success:
        raise HTTPException(status_code=404, detail="AI Prompt Preset not found")
    return {"success": True}
