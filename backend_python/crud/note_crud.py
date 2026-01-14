from sqlalchemy.orm import Session
import uuid

import models
from schemas import Note

# ===============================================
# NOTES
# ===============================================

def get_notes_by_project_id(db: Session, project_id: str) -> list[models.Note]:
    return db.query(models.Note).filter(models.Note.projectId == project_id).all()

def save_note(db: Session, note_data: Note, project_id: str) -> models.Note:
    if not note_data.id or note_data.id.startswith('new-note-'):
        db_note = models.Note(id=str(uuid.uuid4()), projectId=project_id, **note_data.model_dump(exclude={'id', 'projectId'}))
        db.add(db_note)
    else:
        db_note = db.query(models.Note).filter(models.Note.id == note_data.id).first()
        if not db_note: return None
        for key, value in note_data.model_dump(exclude_unset=True).items():
            setattr(db_note, key, value)
            
    db.commit()
    db.refresh(db_note)
    return db_note

def delete_note(db: Session, note_id: str) -> bool:
    deleted_count = db.query(models.Note).filter(models.Note.id == note_id).delete()
    db.commit()
    return deleted_count > 0
