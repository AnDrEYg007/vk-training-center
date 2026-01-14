from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

import crud
import schemas

def get_notes(db: Session, project_id: str) -> List[schemas.Note]:
    notes = crud.get_notes_by_project_id(db, project_id)
    return [schemas.Note.model_validate(n, from_attributes=True) for n in notes]

def save_note(db: Session, note_data: schemas.Note, project_id: str) -> schemas.Note:
    saved_note = crud.save_note(db, note_data, project_id)
    if not saved_note:
        raise HTTPException(status_code=404, detail=f"Note with id {note_data.id} not found for update.")
    return schemas.Note.model_validate(saved_note, from_attributes=True)

def delete_note(db: Session, note_id: str):
    success = crud.delete_note(db, note_id)
    if not success:
        # We don't raise an error to match the original frontend expectation
        print(f"Note with id {note_id} not found for deletion, but proceeding gracefully.")
    return {"success": True}
