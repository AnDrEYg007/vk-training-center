import json
from sqlalchemy.orm import Session
from sqlalchemy import desc
from services.automations.general import crud
from services.vk_service import call_vk_api
from models_library.general_contests import GeneralContest
from models_library.general_contests import GeneralContestCycle, GeneralContestEntry
from models_library.lists import SystemListMailing
import logging
import uuid

logger = logging.getLogger(__name__)

def collect_participants(db: Session, contest_id: str):
    logger.info(f"[Contest: {contest_id}] Starting participant collection.")
    contest = crud.get_contest(db, contest_id)
    if not contest:
        logger.error(f"[Contest: {contest_id}] Contest not found")
        return []

    # 1. Identify Active Cycle
    cycle = crud.get_active_cycle(db, contest_id)
    if not cycle:
        logger.warning(f"[Contest: {contest_id}] No active cycle found for participant collection.")
        return []

    # 2. Identify Source Post
    last_vk_post_id = cycle.vk_start_post_id
    if not last_vk_post_id:
         # Try fallback to contest settings? 
         # Only if Scenario B (Existing Post) and cycle doesn't have it yet?
         if contest.start_type == 'existing_post' and contest.existing_post_link:
             # This logic should have been handled when Cycle started (parsing link)
             logger.warning(f"[Contest: {contest_id}] Cycle {cycle.id} has no vk_start_post_id.")
             return []
         else:
             logger.warning(f"[Contest: {contest_id}] Cycle {cycle.id} has no vk_start_post_id (Post not published?).")
             return []

    conditions = json.loads(contest.conditions_schema) if contest.conditions_schema else []
    
    # 3. Get Project Owner ID
    from models_library.projects import Project
    project = db.query(Project).filter(Project.id == contest.project_id).first()
    owner_id = None
    if project and project.vk_group_id:
        owner_id = int(project.vk_group_id)
        if owner_id > 0: owner_id = -owner_id # Group ID is negative for owner_id in posts
    
    # Correction: For certain API calls like likes.getList, owner_id is separate parameter and usually negative for groups.
    # But usually API client handles user context or group context.
    # Let's assume passed owner_id should be integer ID of the group (negative).

    if not owner_id:
        logger.error(f"[Contest: {contest_id}] Could not determine owner_id for contest (no project group id)")
        return []

    logger.info(f"[Contest: {contest_id}] Cycle: {cycle.id}, Owner ID: {owner_id}, VK Post ID: {last_vk_post_id}")
    
    # AND/OR Logic Implementation (Intersect within groups, Union between groups)
    final_candidates_map = {} # user_id -> { validation_data }

    for group_idx, group in enumerate(conditions):
        if group.get("type") != "and_group":
            continue
        
        logger.info(f"[Contest: {contest_id}] Processing Group #{group_idx}")
        
        group_candidates_ids = None # Set of user_ids (Intersect result)
        group_validation_data = {} # user_id -> { 'liked': true ... }

        for condition in group.get("conditions", []):
            cond_type = condition.get("type")
            current_condition_users = set() # Setup for this specific condition
            
            logger.info(f"   -> Processing condition: {cond_type}")

            if cond_type == "like":
                # likes.getList
                res = call_vk_api("likes.getList", {
                    "type": "post",
                    "owner_id": owner_id,
                    "item_id": last_vk_post_id,
                    "count": 1000, 
                    "extended": 0
                })
                if res and 'items' in res:
                    current_condition_users = set(res['items'])
                logger.info(f"      Found {len(current_condition_users)} likes.")

            elif cond_type == "comment":
                # wall.getComments
                res = call_vk_api("wall.getComments", {
                    "owner_id": owner_id,
                    "post_id": last_vk_post_id,
                    "count": 100, 
                    "extended": 1 # To get from_id easily inside items? or standard items have from_id
                })
                if res and 'items' in res:
                    text_contains = condition.get("params", {}).get("text_contains", "").lower()
                    for comment in res['items']:
                        uid = comment.get('from_id')
                        if uid and uid > 0:
                            if not text_contains or text_contains in comment.get('text', '').lower():
                                current_condition_users.add(uid)
                logger.info(f"      Found {len(current_condition_users)} comments.")

            elif cond_type == "repost":
                # wall.getReposts
                res = call_vk_api("wall.getReposts", {
                    "owner_id": owner_id,
                    "post_id": last_vk_post_id,
                    "count": 1000 
                })
                if res and 'items' in res:
                    for item in res['items']:
                        uid = item.get('from_id')
                        if uid and uid > 0:
                            current_condition_users.add(uid)
                logger.info(f"      Found {len(current_condition_users)} reposts.")
            
            # Intersection Logic
            if group_candidates_ids is None:
                group_candidates_ids = current_condition_users
            else:
                group_candidates_ids = group_candidates_ids.intersection(current_condition_users)
            
            if len(group_candidates_ids) == 0:
                 logger.info("      Intersection empty, group failed.")
                 break
        
        # End of Group Loop
        if group_candidates_ids:
            logger.info(f"   Group #{group_idx} produced {len(group_candidates_ids)} candidates.")
            for uid in group_candidates_ids:
                # Store them (Union Logic)
                if uid not in final_candidates_map:
                    final_candidates_map[uid] = { "group_pass": group_idx }
    
    # Convert to Entry Objects
    entries = []
    
    # Clear old entries for this cycle (if re-running collection)
    db.query(GeneralContestEntry).filter(GeneralContestEntry.cycle_id == cycle.id).delete()
    
    for uid, data in final_candidates_map.items():
        # TODO: Ideally fetch user info (name, photo) from VK 'users.get' in bulk
        entry = GeneralContestEntry(
            id=str(uuid.uuid4()),
            cycle_id=cycle.id, # Link to Cycle!
            user_vk_id=uid,
            validation_data=json.dumps(data)
        )
        entries.append(entry)
    
    db.add_all(entries)
    cycle.participants_count = len(entries)
    db.commit()
    
    return entries
