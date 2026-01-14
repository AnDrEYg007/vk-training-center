from sqlalchemy.orm import Session
from models_library.general_contests import (
    GeneralContest, 
    GeneralContestEntry,
    GeneralContestPromoCode,
    GeneralContestBlacklist,
    GeneralContestDeliveryLog
)
from models_library.posts import SystemPost
from schemas.general_contests import GeneralContestCreate, GeneralContestUpdate
import uuid
import logging

logger = logging.getLogger(__name__)

def get_contest(db: Session, contest_id: str):
    return db.query(GeneralContest).filter(GeneralContest.id == contest_id).first()

def get_contests_by_project(db: Session, project_id: str):
    contests = db.query(GeneralContest).filter(GeneralContest.project_id == project_id).all()
    
    # Enrich with stats and status logic
    for c in contests:
        # Basic Counts
        participants_count = db.query(GeneralContestEntry).filter(GeneralContestEntry.contest_id == c.id).count()
        codes_total = db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.contest_id == c.id).count()
        codes_used = db.query(GeneralContestEntry).filter(GeneralContestEntry.contest_id == c.id).count() # Simplified usage logic
        # In reality codes_available = total - used, if unique per user. Or just query Unused codes.
        # Let's assume codes table has 'is_used' or we count entries with code issued.
        # For General Contests, promo codes are optional or one-time. 
        # Let's count available codes roughly:
        # Assuming entries consume codes 1-to-1 if mechanics implies it. 
        # But for now let's just count total.
        
        # Determine Status
        status = 'paused_manual'
        start_post_status = 'pending'
        result_post_status = 'pending'
        dms_sent_count = 0 # Placeholder

        # Fetch related posts statuses
        start_post = db.query(SystemPost).filter(SystemPost.id == c.current_start_post_id).first() if c.current_start_post_id else None
        result_post = db.query(SystemPost).filter(SystemPost.id == c.current_result_post_id).first() if c.current_result_post_id else None
        
        if start_post: start_post_status = start_post.status 
        if result_post: result_post_status = result_post.status

        if not c.is_active:
            status = 'paused_manual'
        else:
            # Active
            if start_post_status == 'published':
                if result_post_status == 'published':
                    status = 'completed' # Or 'results_published'
                    # Check if all DMs sent (mock logic for now)
                    status = 'results_published'
                else:
                    status = 'running'
            else:
                 status = 'awaiting_start'

        c.stats = {
            "participants": participants_count,
            "promocodes_available": codes_total, # Fix logic later
            "promocodes_total": codes_total,
            "status": status,
            "start_post_status": start_post_status,
            "result_post_status": result_post_status,
            "dms_sent_count": dms_sent_count
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
        # Delete related system posts if they are not published
        db.query(SystemPost).filter(
            SystemPost.related_id == contest_id,
            SystemPost.post_type.in_(['general_contest_start', 'general_contest_result']),
            SystemPost.status != 'published'
        ).delete(synchronize_session=False)

        db.delete(db_contest)
        db.commit()
        return True
    logger.warning(f"Contest {contest_id} not found for deletion.")
    return False

def clear_entries(db: Session, contest_id: str):
    db.query(GeneralContestEntry).filter(GeneralContestEntry.contest_id == contest_id).delete()
    db.commit()

def add_entry(db: Session, contest_id: str, user_vk_id: int, user_name: str = None, user_photo: str = None):
    entry = GeneralContestEntry(
        id=str(uuid.uuid4()),
        contest_id=contest_id,
        user_vk_id=user_vk_id,
        user_name=user_name,
        user_photo=user_photo
    )
    db.add(entry)
    db.commit()
    return entry

def get_entries(db: Session, contest_id: str):
    return db.query(GeneralContestEntry).filter(GeneralContestEntry.contest_id == contest_id).all()

# --- Promocodes ---
def get_promocodes(db: Session, contest_id: str):
    return db.query(GeneralContestPromoCode).filter(GeneralContestPromoCode.contest_id == contest_id).all()

def add_promocodes(db: Session, contest_id: str, codes: list):
    # codes is list of dicts or objects with 'code' and 'description'
    new_codes = []
    for c in codes:
        new_codes.append(GeneralContestPromoCode(
            id=str(uuid.uuid4()),
            contest_id=contest_id,
            code=c.code,
            description=c.description
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
def get_blacklist(db: Session, contest_id: str):
    return db.query(GeneralContestBlacklist).filter(GeneralContestBlacklist.contest_id == contest_id).all()

def add_to_blacklist(db: Session, contest_id: str, user_vk_id: int, until_date=None, reason=None):
    # Check if exists
    existing = db.query(GeneralContestBlacklist).filter(
        GeneralContestBlacklist.contest_id == contest_id,
        GeneralContestBlacklist.user_vk_id == user_vk_id
    ).first()
    
    if existing:
        existing.until_date = until_date
        # reason not stored in current model?
    else:
        entry = GeneralContestBlacklist(
            id=str(uuid.uuid4()),
            contest_id=contest_id,
            user_vk_id=user_vk_id,
            until_date=until_date
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
    return db.query(GeneralContestDeliveryLog).filter(GeneralContestDeliveryLog.contest_id == contest_id).all()

def clear_delivery_logs(db: Session, contest_id: str):
    db.query(GeneralContestDeliveryLog).filter(GeneralContestDeliveryLog.contest_id == contest_id).delete()
    db.commit()
    return True

def get_winners(db: Session, contest_id: str):
    # Winners are essentially delivery logs where promo code was issued
    return db.query(GeneralContestDeliveryLog).filter(
        GeneralContestDeliveryLog.contest_id == contest_id,
        GeneralContestDeliveryLog.promo_code != None
    ).all()
