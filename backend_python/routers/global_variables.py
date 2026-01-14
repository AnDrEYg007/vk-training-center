from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import schemas
import services.global_variable_service as gv_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getAllDefinitions", response_model=List[schemas.GlobalVariableDefinition])
def get_all_definitions(db: Session = Depends(get_db)):
    return gv_service.get_all_definitions(db)

@router.post("/updateAllDefinitions", response_model=schemas.GenericSuccess)
def update_all_definitions(payload: schemas.UpdateAllDefinitionsPayload, db: Session = Depends(get_db)):
    gv_service.update_all_definitions(db, payload.definitions)
    return {"success": True}

@router.post("/getForProject", response_model=schemas.GetGlobalVariablesForProjectResponse)
def get_for_project(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return gv_service.get_for_project(db, payload.projectId)

@router.post("/updateForProject", response_model=schemas.GenericSuccess)
def update_for_project(payload: schemas.UpdateValuesForProjectPayload, db: Session = Depends(get_db)):
    gv_service.update_for_project(db, payload.projectId, payload.values)
    return {"success": True}
