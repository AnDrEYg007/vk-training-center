import random
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from services.automations.general import crud, collector
from models_library.general_contests import (
    GeneralContest,
    GeneralContestCycle,
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

    # 1. Identify Cycle
    # We find the active cycle. The Trigger Post (End) should be linked to it.
    cycle = crud.get_active_cycle(db, contest_id)
    if not cycle:
        logger.error(f"[Contest: {contest_id}] No active cycle found for finalization.")
        post.status = 'error'
        post.error_details = "No active cycle found"
        db.commit()
        return
    
    # Update Cycle Status
    cycle.status = 'evaluating'
    db.commit()
    
    # 2. Safety Check: Promo Codes
    # Check global pool or cycle specific allocation?
    # Global pool for the contest.
    available_codes_count = db.query(GeneralContestPromoCode).filter(
        GeneralContestPromoCode.contest_id == contest_id,
        GeneralContestPromoCode.is_issued == False
    ).count()

    if available_codes_count < contest.winners_count:
        logger.error(f"[Contest: {contest_id}] Not enough promo codes. Available: {available_codes_count}, Required: {contest.winners_count}")
        # Create Note
        note = Note(
            id=str(uuid.uuid4()),
            projectId=contest.project_id,
            date=datetime.now().strftime("%Y-%m-%d"),
            title=f"Ошибка конкурса: {contest.name}",
            text=f"ОШИБКА: Не хватило призов для конкурса {contest.name}. Требовалось: {contest.winners_count}, Доступно: {available_codes_count}. Конкурс остановлен.",
            color="red"
        )
        db.add(note)
        
        post.status = 'error'
        post.error_details = "Not enough promo codes"
        cycle.status = 'active' # Revert status? Or set to paused error?
        db.commit()
        return

    # 3. Collect Participants (if not already done or specific step required)
    # The collector function now works with the active cycle
    logger.info(f"[Contest: {contest_id}] Collecting participants for Cycle {cycle.id}...")
    entries = collector.collect_participants(db, contest_id)
    logger.info(f"[Contest: {contest_id}] Collected {len(entries)} participants.")
    
    # 4. Blacklist Filter
    # Blacklist is Project-wide usually, but model has project_id now?
    # Or strict contest_id? Logic in crud.get_blacklist uses project_id if mapped.
    # Let's use crud.
    # The model GeneralContestBlacklist was patched to have project_id? 
    # Check `models_library/general_contests.py`. YES, used project_id.
    
    blacklist_ids = db.query(GeneralContestBlacklist.user_vk_id).filter(
        GeneralContestBlacklist.project_id == contest.project_id
    ).all()
    blacklist_set = set(id[0] for id in blacklist_ids)
    
    valid_entries = [e for e in entries if e.user_vk_id not in blacklist_set]
    logger.info(f"[Contest: {contest_id}] Valid participants after blacklist: {len(valid_entries)}")
    
    # 5. Pick Winners
    winners_count = min(contest.winners_count, len(valid_entries))
    winners = []
    if winners_count > 0:
        winners = random.sample(valid_entries, winners_count)
        logger.info(f"[Contest: {contest_id}] Selected winners: {', '.join([str(w.user_vk_id) for w in winners])}")
    else:
        logger.info(f"[Contest: {contest_id}] No winners selected (no valid entries or count is 0).")
    
    # 6. Issue Promo Codes & Log (Audit Trail)
    winners_data_snapshot = []
    
    for winner in winners:
        # Get code
        code = db.query(GeneralContestPromoCode).filter(
            GeneralContestPromoCode.contest_id == contest_id,
            GeneralContestPromoCode.is_issued == False
        ).first()
        
        if code:
            code.is_issued = True
            code.issued_at = datetime.now()
            code.issued_in_cycle_id = cycle.id # Link to Cycle
            code.issued_to_user_id = winner.user_vk_id
            code.issued_to_user_name = winner.user_name
            
            # Log delivery
            log_id = str(uuid.uuid4())
            log = GeneralContestDeliveryLog(
                id=log_id,
                cycle_id=cycle.id, # Link to Cycle
                user_vk_id=winner.user_vk_id,
                user_name=winner.user_name,
                promo_code=code.code,
                prize_description=code.description,
                message_text=contest.template_dm or "Ваш приз!",
                status='pending'
            )
            db.add(log)
            
            winners_data_snapshot.append({
                "user_id": winner.user_vk_id,
                "name": winner.user_name,
                "code": code.code,
                "log_id": log_id
            })
    
    # 7. Finalize Cycle
    cycle.status = 'finished'
    cycle.finished_at = datetime.now()
    cycle.winners_snapshot = json.dumps(winners_data_snapshot)
    
    # 8. Publish Results Post (The actual post, NOT the trigger which is 'post')
    # The 'post' argument here is the Trigger Scheduled Post. It should delete itself or mark as processed.
    # But we need to create a REAL post on VK.
    # Tracker usually calls `api.wall.post` if it wasn't intercepted.
    # Service "process_contest_results" is called INSTEAD of publication?
    # Yes. see spec 4.5.3: "Tracker... НЕ публикует... вызывает service... Service берет текст шаблона... Публикует финальный контент."
    
    # Generate Text
    if len(winners) > 0:
        winner_mentions = [f"@id{w.user_vk_id} ({w.user_name or 'Победитель'})" for w in winners]
        text_body = contest.template_result_post or "Итоги конкурса!"
        final_text = text_body.replace("{winners_list}", ", ".join(winner_mentions))
        
        # Publish to VK
        # owner_id from project
        from models_library.projects import Project
        project = db.query(Project).filter(Project.id == contest.project_id).first()
        if project and project.vk_group_id:
             # Call VK API
             owner_id = -int(project.vk_group_id)
             res = call_vk_api("wall.post", {
                 "owner_id": owner_id,
                 "message": final_text,
                 "attachments": "" # TODO: Add images from contest.template_result_images if any
             })
             if res and 'post_id' in res:
                 cycle.vk_result_post_id = res['post_id']
                 # TODO: Link this URL to DeliveryLogs
    
    post.status = 'deleted' # Remove Trigger from Schedule
    db.commit()
    
    # 9. Trigger Auto-Restart (if enabled)
    if contest.is_cyclic:
         # TODO: Create next cycle
         pass

