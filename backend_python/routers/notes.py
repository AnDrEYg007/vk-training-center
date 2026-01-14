from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import schemas
import services.note_service as note_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getNotes", response_model=List[schemas.Note])
def get_notes(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    return note_service.get_notes(db, payload.projectId)

@router.post("/saveNote", response_model=schemas.Note)
def save_note(payload: schemas.SaveNotePayload, db: Session = Depends(get_db)):
    return note_service.save_note(db, payload.note, payload.projectId)

@router.post("/deleteNote", response_model=schemas.GenericSuccess)
def delete_note(payload: schemas.DeleteNotePayload, db: Session = Depends(get_db)):
    note_service.delete_note(db, payload.noteId)
    return {"success": True}
