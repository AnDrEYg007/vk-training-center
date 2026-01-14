from sqlalchemy.orm import Session
from models_library.general_contests import GeneralContest
from models_library.posts import SystemPost
from services.automations.general import crud, finalizer
from datetime import datetime, timedelta
import logging
import uuid

logger = logging.getLogger(__name__)

def sync_contest_posts(db: Session, contest_id: str):
    logger.info(f"[Contest: {contest_id}] Starting post synchronization.")
    contest = crud.get_contest(db, contest_id)
    if not contest:
        logger.error(f"[Contest: {contest_id}] Contest not found during sync.")
        return

    # Helper to safely get ISO date
    def get_iso_date(d):
        if not d: return None
        return d.isoformat() if hasattr(d, 'isoformat') else str(d)

    # --- 1. Start Post ---
    start_post_date = get_iso_date(contest.start_date)
    # Fallback if date is missing but DB requires it. 
    # We'll use a placeholder and force status to paused.
    if not start_post_date:
        start_post_date = datetime.now().isoformat()
        start_post_status = 'paused' # Force pause if no date
    else:
        start_post_status = 'pending_publication' if contest.is_active else 'paused'

    start_post = None
    if contest.current_start_post_id:
        start_post = db.query(SystemPost).filter(SystemPost.id == contest.current_start_post_id).first()
    
    if not start_post:
        logger.info(f"[Contest: {contest_id}] Creating new start post.")
        start_post = SystemPost(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            post_type='general_contest_start',
            related_id=contest.id,
            status=start_post_status,
            publication_date=start_post_date, # Pass it here!
            text=contest.post_text,
            images=contest.post_media,
            title=f"Старт конкурса: {contest.name}"
        )
        db.add(start_post)
        db.flush()
        contest.current_start_post_id = start_post.id
    else:
        logger.info(f"[Contest: {contest_id}] Updating existing start post {start_post.id}.")
        start_post.text = contest.post_text
        start_post.images = contest.post_media
        start_post.title = f"Старт конкурса: {contest.name}"
        start_post.publication_date = start_post_date
        start_post.status = start_post_status

    # --- 2. Result Post ---
    # Calculate result date
    result_post_date = None
    result_post_status = 'paused'

    if contest.finish_type == 'date' and contest.finish_date:
         result_post_date = get_iso_date(contest.finish_date)
         result_post_status = 'pending_publication' if contest.is_active else 'paused'
    elif contest.finish_type == 'duration':
        if contest.last_vk_post_id and contest.finish_date:
             result_post_date = get_iso_date(contest.finish_date)
             result_post_status = 'pending_publication'
        else:
             # Tentative date
             if contest.start_date and contest.finish_duration_hours:
                 tentative_finish = contest.start_date + timedelta(hours=contest.finish_duration_hours)
                 result_post_date = get_iso_date(tentative_finish)
             else:
                 # No start date or duration, use fallback
                 result_post_date = datetime.now().isoformat()
             
             result_post_status = 'paused' # Always paused until start post runs

    # Fallback for DB constraint
    if not result_post_date:
        result_post_date = datetime.now().isoformat()
        result_post_status = 'paused'

    result_post = None
    if contest.current_result_post_id:
        result_post = db.query(SystemPost).filter(SystemPost.id == contest.current_result_post_id).first()
    
    if not result_post:
        logger.info(f"[Contest: {contest_id}] Creating new result post.")
        result_post = SystemPost(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            post_type='general_contest_result',
            related_id=contest.id,
            status=result_post_status,
            publication_date=result_post_date, # Pass it here!
            text=contest.template_result_post or "Итоги конкурса...",
            title=f"Итоги конкурса: {contest.name}"
        )
        db.add(result_post)
        db.flush()
        contest.current_result_post_id = result_post.id
    else:
        logger.info(f"[Contest: {contest_id}] Updating existing result post {result_post.id}.")
        result_post.text = contest.template_result_post or "Итоги конкурса..."
        result_post.title = f"Итоги конкурса: {contest.name}"
        result_post.publication_date = result_post_date
        result_post.status = result_post_status

    db.commit()

def on_start_post_published(db: Session, system_post: SystemPost, vk_post_id: int):
    contest_id = system_post.related_id
    logger.info(f"[Contest: {contest_id}] Start post published. VK Post ID: {vk_post_id}.")
    contest = crud.get_contest(db, contest_id)
    
    if not contest:
        logger.error(f"[Contest: {contest_id}] Contest not found for post {system_post.id}")
        return

    # 1. Save VK Post ID
    contest.last_vk_post_id = vk_post_id
    
    # 2. Calculate Result Date
    start_date = datetime.now() # Or system_post.published_at
    finish_date = None
    
    if contest.finish_type == 'duration' and contest.finish_duration_hours:
        finish_date = start_date + timedelta(hours=contest.finish_duration_hours)
    elif contest.finish_type == 'date' and contest.finish_date:
        finish_date = contest.finish_date
        # If date is in past, maybe set to now + 1 hour? Or keep as is (will run immediately)
    
    if not finish_date:
        finish_date = start_date + timedelta(hours=24) # Default fallback

    contest.finish_date = finish_date # Update if needed

    # 3. Update Result Post
    if contest.current_result_post_id:
        result_post = db.query(SystemPost).filter(SystemPost.id == contest.current_result_post_id).first()
        if result_post:
            result_post.scheduled_time = finish_date
            result_post.status = 'scheduled' # Activate it
            if hasattr(finish_date, 'isoformat'):
                 result_post.publication_date = finish_date.isoformat()
            else:
                 result_post.publication_date = str(finish_date)
    
    db.commit()

def process_results(db: Session, system_post: SystemPost):
    finalizer.process_contest_results(db, system_post)
