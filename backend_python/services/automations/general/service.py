from sqlalchemy.orm import Session
from models_library.general_contests import GeneralContest
from models_library.posts import SystemPost
from services.automations.general import crud, finalizer
from datetime import datetime, timedelta
import logging
import uuid
import re

logger = logging.getLogger(__name__)

def sync_contest_posts(db: Session, contest_id: str):
    """
    Synchronizes GeneralContest configuration with Scheduled SystemPosts.
    Adapts to 'Cycle' architecture.
    Only updates posts for a Cycle in 'created' status.
    Active cycles should generally not have their Start Post changed (it's already public).
    End Post (Trigger) for active cycle CAN be updated if settings change.
    """
    logger.info(f"[Contest: {contest_id}] Starting post synchronization.")
    contest = crud.get_contest(db, contest_id)
    if not contest:
        logger.error(f"[Contest: {contest_id}] Contest not found during sync.")
        return

    # 1. Get or Create Cycle
    # We look for a cycle that hasn't started yet (status='created')
    # If the latest cycle is Active/Finished, we usually don't create a new one automatically here
    # UNLESS it's a first setup.
    cycle = crud.get_active_cycle(db, contest_id)
    
    if not cycle:
        # Create initial cycle context
        cycle = crud.create_cycle(db, contest_id)
    
    # helper for dates
    def get_iso_date(d):
        return d.isoformat() if d else datetime.now().isoformat()

    # 2. Update Start Post or Handle Existing Link
    # Logic:
    # - If 'new_post': ensure SystemPost exists and matches settings.
    # - If 'existing_post': ensure no SystemPost exists (delete if was created). Check link and activate if needed.
    
    if cycle.status == 'created':
        start_post = db.query(SystemPost).filter(SystemPost.id == cycle.start_scheduled_post_id).first() if cycle.start_scheduled_post_id else None
        
        target_status = 'pending_publication' if contest.is_active else 'paused'
        
        if contest.start_type == 'new_post':
            if not start_post:
                start_post = SystemPost(
                    id=str(uuid.uuid4()),
                    project_id=contest.project_id,
                    post_type='general_contest_start',
                    related_id=contest.id, # Keep related to contest for easy lookup
                    status=target_status,
                    publication_date=get_iso_date(contest.start_date),
                    text=contest.post_text,
                    images=contest.post_media,
                    title=f"Конкурс: {contest.name} (Старт)"
                )
                db.add(start_post)
                db.flush() # get ID
                cycle.start_scheduled_post_id = start_post.id
                db.add(cycle)
            else:
                start_post.text = contest.post_text
                start_post.images = contest.post_media
                start_post.title = f"Конкурс: {contest.name} (Старт)"
                start_post.publication_date = get_iso_date(contest.start_date)
                start_post.status = target_status
                start_post.related_id = contest.id # Ensure link
        
        elif contest.start_type == 'existing_post':
            # 1. Cleanup scheduled post if it exists (user switched mode)
            if start_post:
                db.delete(start_post)
                cycle.start_scheduled_post_id = None
                db.add(cycle)
                logger.info(f"[Contest: {contest_id}] Deleted scheduled start post because mode switched to existing_post.")

            # 2. Validate Link and Auto-Activate
            if contest.existing_post_link and contest.is_active:
                match = re.search(r"wall(-?\d+)_(\d+)", contest.existing_post_link)
                if match:
                    # Found a valid link
                    vk_post_id = int(match.group(2))
                    logger.info(f"[Contest: {contest_id}] Found existing post link. ID: {vk_post_id}. Activating cycle.")
                    
                    cycle.vk_start_post_id = vk_post_id
                    cycle.status = 'active'
                    cycle.started_at = datetime.now()
                    db.add(cycle)
                else:
                    logger.warning(f"[Contest: {contest_id}] Existing post link provided but invalid: {contest.existing_post_link}")
    
    # 3. Update End Post (Trigger) - Always relevant if cycle is not finished
    if cycle.status in ['created', 'active']:
        end_post = db.query(SystemPost).filter(SystemPost.id == cycle.end_scheduled_post_id).first() if cycle.end_scheduled_post_id else None
        
        # Calculate Finish Date
        finish_dt = contest.finish_date
        if contest.finish_type == 'duration' and contest.finish_duration_hours:
             # If started, date = started_at + duration
             # If not started, date = start_date + duration
             base_date = cycle.started_at if cycle.started_at else contest.start_date
             if base_date:
                finish_dt = base_date + timedelta(hours=contest.finish_duration_hours)
        
        target_status = 'pending_publication' if contest.is_active else 'paused'

        if not end_post:
            end_post = SystemPost(
                id=str(uuid.uuid4()),
                project_id=contest.project_id,
                post_type='general_contest_result', # Trigger Type
                related_id=contest.id,
                status=target_status,
                publication_date=get_iso_date(finish_dt),
                text=contest.template_result_post, # Placeholder text
                title=f"Итоги: {contest.name}"
            )
            db.add(end_post)
            db.flush()
            cycle.end_scheduled_post_id = end_post.id
            db.add(cycle)
        else:
            end_post.publication_date = get_iso_date(finish_dt)
            end_post.status = target_status
            end_post.text = contest.template_result_post
            # Force post_type if needed
            end_post.post_type = 'general_contest_result'

    db.commit()

def on_start_post_published(db: Session, system_post: SystemPost, vk_post_id: int):
    contest_id = system_post.related_id
    logger.info(f"[Contest: {contest_id}] Start post published. VK Post ID: {vk_post_id}.")
    contest = crud.get_contest(db, contest_id)
    
    if not contest:
        logger.error(f"[Contest: {contest_id}] Contest not found for post {system_post.id}")
        return

    # 1. Update Active Cycle
    cycle = crud.get_active_cycle(db, contest_id)
    if not cycle:
        logger.warning(f"[Contest: {contest_id}] Post published but no active cycle matched. Post ID: {system_post.id}")
        # Could happen if cycle handling is out of sync.
        # Fallback: Find cycle by scheduled_post_id?
        # For now, just log.
        return

    # 2. Store VK ID in Cycle
    cycle.vk_start_post_id = vk_post_id
    cycle.status = 'active'
    cycle.started_at = datetime.now()
    
    # 4. Activate End Post (Trigger)
    # Now that we have a definitive start time, we can lock in the end time (especially for duration).
    
    if cycle.end_scheduled_post_id:
        end_post = db.query(SystemPost).filter(SystemPost.id == cycle.end_scheduled_post_id).first()
        if end_post:
            finish_dt = contest.finish_date
            
            # Recalculate if duration
            if contest.finish_type == 'duration' and contest.finish_duration_hours:
                finish_dt = datetime.now() + timedelta(hours=contest.finish_duration_hours)
            
            # Default fallback
            if not finish_dt:
                finish_dt = datetime.now() + timedelta(hours=24)

            # Update End Post
            end_post.publication_date = finish_dt.isoformat()
            end_post.status = 'pending_publication' # Ready for Tracker to pick it up
            
            logger.info(f"[Contest: {contest_id}] Activated End Post {end_post.id} for {finish_dt}")

    db.commit()

def process_results(db: Session, system_post: SystemPost):
    finalizer.process_contest_results(db, system_post)

