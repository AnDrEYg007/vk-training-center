from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from schemas import Tag, ProjectIdPayload, CreateTagPayload, UpdateTagPayload, GenericSuccess
import services.tag_service as tag_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getForProject", response_model=List[Tag])
def get_tags_for_project(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return tag_service.get_tags_for_project(db, payload.projectId)

@router.post("/create", response_model=Tag)
def create_tag(payload: CreateTagPayload, db: Session = Depends(get_db)):
    return tag_service.create_tag(db, payload.tag, payload.projectId)

@router.post("/update/{tag_id}", response_model=Tag)
def update_tag(tag_id: str, payload: UpdateTagPayload, db: Session = Depends(get_db)):
    updated_tag = tag_service.update_tag(db, tag_id, payload.tag)
    if not updated_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return updated_tag

@router.post("/delete/{tag_id}", response_model=GenericSuccess)
def delete_tag(tag_id: str, db: Session = Depends(get_db)):
    success = tag_service.delete_tag(db, tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return {"success": True}

@router.post("/retagProject", response_model=GenericSuccess)
def retag_project(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    tag_service.retag_all_posts_for_project(db, payload.projectId)
    return {"success": True}