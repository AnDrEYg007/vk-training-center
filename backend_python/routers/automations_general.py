from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.general_contests import (
    GeneralContestCreate, GeneralContestUpdate, GeneralContestResponse, GeneralContestEntryResponse,
    GeneralContestPromoCodeCreate, GeneralContestPromoCodeDelete, GeneralContestPromoCodeDeleteBulk, GeneralContestPromoCodeUpdate, GeneralContestClear,
    GeneralContestBlacklistAdd, GeneralContestBlacklistDelete,
    GeneralContestDeliveryRetry, GeneralContestDeliveryRetryAll,
    GeneralContestListRequest, GeneralContestIdRequest, GeneralContestUpdatePayload
)
from schemas.automations import PromoCodeResponse, ContestDeliveryLogResponse, BlacklistEntryResponse
from services.automations.general import crud, service
from typing import List

router = APIRouter(
    prefix="/automations/general",
    tags=["automations-general"]
)

@router.post("/create", response_model=GeneralContestResponse)
def create_contest(contest: GeneralContestCreate, db: Session = Depends(get_db)):
    new_contest = crud.create_contest(db, contest)
    service.sync_contest_posts(db, new_contest.id)
    return new_contest

@router.post("/update", response_model=GeneralContestResponse)
def update_contest(payload: GeneralContestUpdatePayload, db: Session = Depends(get_db)):
    try:
        updated = crud.update_contest(db, payload.contest_id, payload.contest)
        if not updated:
            raise HTTPException(status_code=404, detail="Contest not found")
        service.sync_contest_posts(db, updated.id)
        return updated
    except Exception as e:
        print(f"Error updating contest: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete")
def delete_contest(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    success = crud.delete_contest(db, payload.contest_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contest not found")
    return {"status": "success"}

@router.post("/get", response_model=GeneralContestResponse)
def get_contest(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    contest = crud.get_contest(db, payload.contest_id)
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    return contest

@router.post("/list", response_model=List[GeneralContestResponse])
def list_contests(payload: GeneralContestListRequest, db: Session = Depends(get_db)):
    return crud.get_contests_by_project(db, payload.project_id)

@router.post("/stats", response_model=List[GeneralContestEntryResponse])
def get_stats(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    return crud.get_entries(db, payload.contest_id)

# --- Promocodes ---

@router.post("/promocodes/get", response_model=List[PromoCodeResponse])
def get_promocodes(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    return crud.get_promocodes(db, payload.contest_id)

@router.post("/promocodes/add")
def add_promocodes(payload: GeneralContestPromoCodeCreate, db: Session = Depends(get_db)):
    crud.add_promocodes(db, payload.contest_id, payload.codes)
    return {"success": True}

@router.post("/promocodes/delete")
def delete_promocode(payload: GeneralContestPromoCodeDelete, db: Session = Depends(get_db)):
    crud.delete_promocode(db, payload.promo_id)
    return {"success": True}

@router.post("/promocodes/deleteBulk")
def delete_promocodes_bulk(payload: GeneralContestPromoCodeDeleteBulk, db: Session = Depends(get_db)):
    crud.delete_promocodes_bulk(db, payload.promo_ids)
    return {"success": True}

@router.post("/promocodes/clear")
def clear_promocodes(payload: GeneralContestClear, db: Session = Depends(get_db)):
    crud.clear_promocodes(db, payload.contest_id)
    return {"success": True}

@router.post("/promocodes/update")
def update_promocode(payload: GeneralContestPromoCodeUpdate, db: Session = Depends(get_db)):
    crud.update_promocode(db, payload.id, payload.description)
    return {"success": True}

# --- Participants ---

@router.post("/stats/participants", response_model=List[GeneralContestEntryResponse])
def get_participants(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    return crud.get_entries(db, payload.contest_id)

@router.post("/stats/participants/clear")
def clear_participants(payload: GeneralContestClear, db: Session = Depends(get_db)):
    crud.clear_entries(db, payload.contest_id)
    return {"success": True}

@router.post("/stats/winners", response_model=List[ContestDeliveryLogResponse])
def get_winners(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    return crud.get_winners(db, payload.contest_id)

# --- Blacklist ---

@router.post("/blacklist/get", response_model=List[BlacklistEntryResponse])
def get_blacklist(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    return crud.get_blacklist(db, payload.contest_id)

@router.post("/blacklist/add")
def add_blacklist(payload: GeneralContestBlacklistAdd, db: Session = Depends(get_db)):
    crud.add_to_blacklist(db, payload.project_id, payload.payload.user_vk_id, payload.payload.note)
    return {"success": True}

@router.post("/blacklist/delete")
def delete_blacklist(payload: GeneralContestBlacklistDelete, db: Session = Depends(get_db)):
    crud.delete_from_blacklist(db, payload.entry_id)
    return {"success": True}

# --- Delivery ---

@router.post("/delivery/logs", response_model=List[ContestDeliveryLogResponse])
def get_delivery_logs(payload: GeneralContestIdRequest, db: Session = Depends(get_db)):
    return crud.get_delivery_logs(db, payload.contest_id)

@router.post("/delivery/clear")
def clear_delivery_logs(payload: GeneralContestClear, db: Session = Depends(get_db)):
    crud.clear_delivery_logs(db, payload.contest_id)
    return {"success": True}


@router.post("/delivery/retry")
def retry_delivery(payload: GeneralContestDeliveryRetry, db: Session = Depends(get_db)):
    # TODO: Implement retry logic
    return {"success": True}

@router.post("/delivery/retryAll")
def retry_delivery_all(payload: GeneralContestDeliveryRetryAll, db: Session = Depends(get_db)):
    # TODO: Implement retry all logic
    return {"success": True}
