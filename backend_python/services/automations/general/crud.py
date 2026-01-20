from sqlalchemy.orm import Session
from sqlalchemy import desc
from models_library.general_contests import (
    GeneralContest, 
    GeneralContestCycle,
    GeneralContestEntry,
    GeneralContestPromoCode,
    GeneralContestBlacklist,
    GeneralContestDeliveryLog
)
from models_library.posts import SystemPost
from schemas.general_contests import GeneralContestCreate, GeneralContestUpdate
import uuid
import logging
import json

logger = logging.getLogger(__name__)

def get_contest(db: Session, contest_id: str):
    return db.query(GeneralContest).filter(GeneralContest.id == contest_id).first()

def get_contests_by_project(db: Session, project_id: str):
    contests = db.query(GeneralContest).filter(GeneralContest.project_id == project_id).all()
    
    for c in contests:
        # Get Latest Cycle
        latest_cycle = db.query(GeneralContestCycle)\
            .filter(GeneralContestCycle.contest_id == c.id)\
            .order_by(desc(GeneralContestCycle.created_at))\
            .first()
        
        c.active_cycle = latest_cycle
        
        # Determine Status derived from latest cycle
        status = 'paused_manual' # Default
        participants_count = 0
        dms_sent_count = 0
        
        if c.is_active:
            if latest_cycle:
                status = latest_cycle.status
                participants_count = latest_cycle.participants_count
            else:
                status = 'active_no_cycle' # Should initiate
        else:
            status = 'paused'

        # Count Promocodes (Global pool for this contest)
        codes_total = db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.contest_id == c.id).count()
        codes_available = db.query(GeneralContestPromoCode).filter(
            GeneralContestPromoCode.contest_id == c.id,
            GeneralContestPromoCode.is_issued == False
        ).count()
        
        c.stats = {
            "participants": participants_count,
            "promocodes_available": codes_available,
            "promocodes_total": codes_total,
            "status": status,
            "start_post_status": None, # Deprecated or retrieve from specific cycle logic if needed
            "result_post_status": None,
            "dms_sent_count": dms_sent_count,
            "active_cycle_id": latest_cycle.id if latest_cycle else None
        }

    return contests

def create_contest(db: Session, contest: GeneralContestCreate):
    logger.info(f"Creating contest: {contest.dict().get('name')}")
    db_contest = GeneralContest(
        id=str(uuid.uuid4()),
        **contest.dict()
    )
    db.add(db_contest)
    db.commit()
    db.refresh(db_contest)
    return db_contest

def update_contest(db: Session, contest_id: str, contest: GeneralContestUpdate):
    logger.info(f"Updating contest: {contest_id}")
    db_contest = get_contest(db, contest_id)
    if not db_contest:
        logger.warning(f"Contest {contest_id} not found for update.")
        return None
    
    update_data = contest.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_contest, key, value)
    
    db.commit()
    db.refresh(db_contest)
    return db_contest

def delete_contest(db: Session, contest_id: str):
    logger.info(f"Deleting contest: {contest_id}")
    db_contest = get_contest(db, contest_id)
    if db_contest:
        # 1. Delete associated SystemPosts (Start/End triggers) from Schedule
        # This ensures the calendar is cleaned up when automation is removed.
        deleted_posts = db.query(SystemPost).filter(SystemPost.related_id == contest_id).delete()
        logger.info(f"Deleted {deleted_posts} system posts for contest {contest_id}")

        # 2. Delete the contest 
        # (Cascade usually handles cycles/promocodes, but if not, they might remain orphaned or raise FK error. 
        # Assuming FK cascade is set or acceptable.)
        db.delete(db_contest)
        db.commit()
        return True
    logger.warning(f"Contest {contest_id} not found for deletion.")
    return False

# --- Cycles ---
def create_cycle(db: Session, contest_id: str, start_scheduled_post_id: str = None, end_scheduled_post_id: str = None):
    cycle = GeneralContestCycle(
        id=str(uuid.uuid4()),
        contest_id=contest_id,
        status='created',
        start_scheduled_post_id=start_scheduled_post_id,
        end_scheduled_post_id=end_scheduled_post_id
    )
    db.add(cycle)
    db.commit()
    return cycle

def get_active_cycle(db: Session, contest_id: str):
    return db.query(GeneralContestCycle).filter(
        GeneralContestCycle.contest_id == contest_id,
        GeneralContestCycle.status.in_(['created', 'active', 'evaluating'])
    ).order_by(desc(GeneralContestCycle.created_at)).first()

# --- Entries (Participants) ---
def get_entries(db: Session, contest_id: str):
    # Retrieve entries for the active cycle or last finished
    latest_cycle = get_active_cycle(db, contest_id)
    if not latest_cycle:
        # Try finding last finished one if no active?
        latest_cycle = db.query(GeneralContestCycle).filter(
            GeneralContestCycle.contest_id == contest_id
        ).order_by(desc(GeneralContestCycle.created_at)).first()
        
    if latest_cycle:
        return db.query(GeneralContestEntry).filter(GeneralContestEntry.cycle_id == latest_cycle.id).all()
    return []

def clear_entries(db: Session, contest_id: str):
    # Clears entries for active cycle? Or all?
    # Usually used for debugging.
    # Let's clear active cycle entries.
    cycle = get_active_cycle(db, contest_id)
    if cycle:
        db.query(GeneralContestEntry).filter(GeneralContestEntry.cycle_id == cycle.id).delete()
        db.commit()

# --- Promocodes ---
def get_promocodes(db: Session, contest_id: str):
    return db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.contest_id == contest_id).all()

def add_promocodes(db: Session, contest_id: str, codes: list):
    new_codes = []
    for c in codes:
        new_codes.append(GeneralContestPromoCode(
            id=str(uuid.uuid4()),
            contest_id=contest_id,
            code=c.code,
            description=c.description,
            is_issued=False
        ))
    db.add_all(new_codes)
    db.commit()
    return True

def delete_promocode(db: Session, promo_id: str):
    db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.id == promo_id).delete()
    db.commit()
    return True

def delete_promocodes_bulk(db: Session, promo_ids: list):
    db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.id.in_(promo_ids)).delete(synchronize_session=False)
    db.commit()
    return True

def clear_promocodes(db: Session, contest_id: str):
    db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.contest_id == contest_id).delete()
    db.commit()
    return True

def update_promocode(db: Session, promo_id: str, description: str):
    code = db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.id == promo_id).first()
    if code:
        code.description = description
        db.commit()
        return True
    return False

# --- Blacklist ---
# Blacklist is now Project wide in the model (project_id), but function signature requests contest_id sometimes.
# We should probably fix the router to pass project_id.
# For now, let's look up project_id from contest if not provided.

def get_blacklist(db: Session, contest_id: str):
    contest = get_contest(db, contest_id)
    if contest:
        return db.query(GeneralContestBlacklist).filter(GeneralContestBlacklist.project_id == contest.project_id).all()
    return []

def add_to_blacklist(db: Session, project_id: str, user_vk_id: int, note=None):
    existing = db.query(GeneralContestBlacklist).filter(
        GeneralContestBlacklist.project_id == project_id,
        GeneralContestBlacklist.user_vk_id == user_vk_id
    ).first()
    
    if existing:
        existing.note = note
    else:
        entry = GeneralContestBlacklist(
            id=str(uuid.uuid4()),
            project_id=project_id,
            user_vk_id=user_vk_id,
            note=note
        )
        db.add(entry)
    db.commit()
    return True

def delete_from_blacklist(db: Session, entry_id: str):
    db.query(GeneralContestBlacklist).filter(GeneralContestBlacklist.id == entry_id).delete()
    db.commit()
    return True

# --- Delivery Logs ---
def get_delivery_logs(db: Session, contest_id: str):
    # Logs are per cycle.
    # Return logs for all cycles of this contest? or just active?
    # History view needs all.
    # Joining with ContestCycle to filter by contest_id.
    
    return db.query(GeneralContestDeliveryLog)\
        .join(GeneralContestCycle, GeneralContestCycle.id == GeneralContestDeliveryLog.cycle_id)\
        .filter(GeneralContestCycle.contest_id == contest_id)\
        .all()

def clear_delivery_logs(db: Session, contest_id: str):
    # Dangerous. 
    pass
