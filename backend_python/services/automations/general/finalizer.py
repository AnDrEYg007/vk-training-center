import random
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from services.automations.general import crud, collector
from models_library.general_contests import (
    GeneralContest,
    GeneralContestPromoCode,
    GeneralContestBlacklist,
    GeneralContestDeliveryLog
)
from models_library.posts import SystemPost, Note
from services.vk_service import call_vk_api
import logging
import uuid

logger = logging.getLogger(__name__)

def process_contest_results(db: Session, post: SystemPost):
    # post.related_id is the contest_id
    contest_id = post.related_id
    logger.info(f"[Contest: {contest_id}] Finalizing contest results. SystemPost ID: {post.id}")
    contest = crud.get_contest(db, contest_id)
    
    if not contest:
        logger.error(f"[Contest: {contest_id}] Contest not found")
        post.status = 'error'
        post.error_details = "Contest not found"
        db.commit()
        return

    # 1. Safety Check: Promo Codes
    available_codes_count = db.query(GeneralContestPromoCode).filter(
        GeneralContestPromoCode.contest_id == contest_id,
        GeneralContestPromoCode.is_issued == False
    ).count()

    if available_codes_count < contest.winners_count:
        logger.error(f"[Contest: {contest_id}] Not enough promo codes. Available: {available_codes_count}, Required: {contest.winners_count}")
        # Create Note
        note = Note(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            date=datetime.now().strftime("%Y-%m-%d"),
            content=f"ОШИБКА: Не хватило призов для конкурса {contest.name}",
            color="red"
        )
        db.add(note)
        
        post.status = 'error'
        post.error_details = "Not enough promo codes"
        db.commit()
        return

    # 2. Collect Participants
    logger.info(f"[Contest: {contest_id}] Collecting participants...")
    entries = collector.collect_participants(db, contest_id)
    logger.info(f"[Contest: {contest_id}] Collected {len(entries)} participants.")
    
    # 3. Blacklist Filter
    blacklist_ids = db.query(GeneralContestBlacklist.user_vk_id).filter(
        GeneralContestBlacklist.contest_id == contest_id
    ).all()
    blacklist_set = set(id[0] for id in blacklist_ids)
    
    valid_entries = [e for e in entries if e.user_vk_id not in blacklist_set]
    logger.info(f"[Contest: {contest_id}] Valid participants after blacklist: {len(valid_entries)}")
    
    # 4. Pick Winners
    winners_count = min(contest.winners_count, len(valid_entries))
    winners = []
    if winners_count > 0:
        winners = random.sample(valid_entries, winners_count)
        logger.info(f"[Contest: {contest_id}] Selected winners: {', '.join([str(w.user_vk_id) for w in winners])}")
    else:
        logger.info(f"[Contest: {contest_id}] No winners selected (no valid entries or count is 0).")
    
    # 5. Issue Promo Codes & Log
    winners_list_text = []
    for winner in winners:
        # Get code
        code = db.query(GeneralContestPromoCode).filter(
            GeneralContestPromoCode.contest_id == contest_id,
            GeneralContestPromoCode.is_issued == False
        ).first()
        
        if code:
            code.is_issued = True
            code.issued_at = datetime.now()
            code.issued_to_user_id = winner.user_vk_id
            code.issued_to_user_name = winner.user_name
            
            # Log delivery
            log = GeneralContestDeliveryLog(
                id=str(uuid.uuid4()),
                contest_id=contest_id,
                user_vk_id=winner.user_vk_id,
                user_name=winner.user_name,
                promo_code=code.code,
                prize_description=code.description,
                message_text=contest.template_dm.replace("{code}", code.code) if contest.template_dm else f"Ваш код: {code.code}"
            )
            db.add(log)
            
            winners_list_text.append(f"@id{winner.user_vk_id} ({winner.user_name})")
    
    db.commit()

    # 6. Publish Results Post
    post_text = contest.template_result_post or "Итоги конкурса:\n{winners_list}"
    post_text = post_text.replace("{winners_list}", "\n".join(winners_list_text))
    
    # Get owner_id from project (similar logic to collector)
    from models_library.projects import Project
    project = db.query(Project).filter(Project.id == contest.project_id).first()
    owner_id = None
    if project and project.vk_group_id:
        owner_id = int(project.vk_group_id)
        if owner_id > 0: owner_id = -owner_id

    if owner_id:
        res = call_vk_api("wall.post", {
            "owner_id": owner_id,
            "message": post_text,
            # attachments?
        })
        
        if res and 'post_id' in res:
            logger.info(f"[Contest: {contest_id}] Result post published. VK Post ID: {res['post_id']}")
            post.vk_post_id = res['post_id']
            post.status = 'published'
            post.published_at = datetime.now()
            
            # Update logs with result link
            # TODO: Update logs
        else:
            logger.error(f"[Contest: {contest_id}] Failed to publish VK post.")
            post.status = 'error'
            post.error_details = "Failed to publish VK post"
    else:
        logger.error(f"[Contest: {contest_id}] No owner_id found for publishing results.")
        post.status = 'error'
        post.error_details = "No owner_id"

    db.commit()

    # 7. Send DMs
    # This should probably be done asynchronously or here if not too many
    logger.info(f"[Contest: {contest_id}] Sending DMs to winners.")
    for winner in winners:
        # Find log
        log = db.query(GeneralContestDeliveryLog).filter(
            GeneralContestDeliveryLog.contest_id == contest_id,
            GeneralContestDeliveryLog.user_vk_id == winner.user_vk_id
        ).order_by(GeneralContestDeliveryLog.id.desc()).first()
        
        if log:
            try:
                call_vk_api("messages.send", {
                    "user_id": winner.user_vk_id,
                    "message": log.message_text,
                    "random_id": random.randint(0, 2**32)
                })
                # TODO: Update log status if needed
                logger.info(f"[Contest: {contest_id}] DM sent to {winner.user_vk_id}.")
            except Exception as e:
                logger.error(f"[Contest: {contest_id}] Failed to send DM to {winner.user_vk_id}: {e}")
                # Fallback comment?
                if contest.template_fallback_comment and post.vk_post_id:
                     logger.info(f"[Contest: {contest_id}] Creating fallback comment for {winner.user_vk_id}.")
                     call_vk_api("wall.createComment", {
                         "owner_id": owner_id,
                         "post_id": post.vk_post_id,
                         "message": f"@id{winner.user_vk_id} {contest.template_fallback_comment}"
                     })

    # 8. Restart Cycle
    if contest.is_cyclic:
        logger.info(f"[Contest: {contest_id}] Restating cycle.")
        restart_delay = contest.restart_delay_hours or 24
        next_start = datetime.now() + timedelta(hours=restart_delay)
        
        # Create new start post
        new_start_post = SystemPost(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            post_type="general_contest_start",
            related_id=contest_id,
            status="scheduled",
            publication_date=next_start.isoformat(),
            text=contest.post_text,
            images=contest.post_media,
            title=f"Старт конкурса: {contest.name}"
        )
        db.add(new_start_post)
        contest.current_start_post_id = new_start_post.id
        
        # Create new result post (placeholder date)
        # Date will be updated when start post is published
        new_result_post = SystemPost(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            post_type="general_contest_result",
            related_id=contest_id,
            status="paused", # Paused until start post is published
            publication_date=(next_start + timedelta(hours=24)).isoformat(), # Placeholder
            text=contest.template_result_post or "Итоги конкурса...",
            title=f"Итоги конкурса: {contest.name}"
        )
        db.add(new_result_post)
        contest.current_result_post_id = new_result_post.id
        
        db.commit()
        restart_delay = contest.restart_delay_hours or 24
        next_start = datetime.now() + timedelta(hours=restart_delay)
        
        # Create new start post
        new_start_post = SystemPost(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            type="general_contest_start",
            related_id=contest_id,
            status="scheduled",
            scheduled_time=next_start,
            content=contest.post_text,
            media=contest.post_media
        )
        db.add(new_start_post)
        contest.current_start_post_id = new_start_post.id
        
        # Create new result post (placeholder date)
        # Date will be updated when start post is published
        new_result_post = SystemPost(
            id=str(uuid.uuid4()),
            project_id=contest.project_id,
            type="general_contest_result",
            related_id=contest_id,
            status="paused", # Paused until start post is published
            scheduled_time=next_start + timedelta(hours=24) # Placeholder
        )
        db.add(new_result_post)
        contest.current_result_post_id = new_result_post.id
        
        db.commit()
