
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import schemas
from database import SessionLocal
import services.automations.ai_posts_service as ai_posts_service

router = APIRouter(prefix="/automations/ai-posts", tags=["Automations AI Posts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/list", response_model=List[schemas.SystemPost])
def get_list(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return ai_posts_service.get_ai_posts(db, payload.projectId)

@router.post("/create", response_model=schemas.SystemPost)
def create(payload: schemas.SavePostPayload, db: Session = Depends(get_db)):
    return ai_posts_service.create_ai_post(db, payload)

@router.post("/delete", response_model=schemas.GenericSuccess)
def delete(payload: schemas.SimplePostIdPayload, db: Session = Depends(get_db)):
    ai_posts_service.delete_ai_post(db, payload.postId)
    return {"success": True}
