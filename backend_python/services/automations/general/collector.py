import json
from sqlalchemy.orm import Session
from services.automations.general import crud
from services.vk_service import call_vk_api
from models_library.general_contests import GeneralContest
from models_library.lists import SystemListMailing
import logging

logger = logging.getLogger(__name__)

def collect_participants(db: Session, contest_id: str):
    logger.info(f"[Contest: {contest_id}] Starting participant collection.")
    contest = crud.get_contest(db, contest_id)
    if not contest or not contest.last_vk_post_id:
        logger.warning(f"[Contest: {contest_id}] Contest not found or no VK post ID")
        return []

    conditions = json.loads(contest.conditions_schema)
    all_candidates = set()

    # Получаем owner_id из проекта (предполагаем, что он есть в контексте или настройках)
    # Для простоты пока возьмем из первого попавшегося токена или настроек проекта
    # TODO: Получить реальный owner_id группы
    owner_id = None 
    
    # ВАЖНО: call_vk_api использует токены из базы. Нам нужно знать ID группы.
    # Обычно он есть в project.vk_group_id
    from models_library.projects import Project
    project = db.query(Project).filter(Project.id == contest.project_id).first()
    if project and project.vk_group_id:
        owner_id = int(project.vk_group_id)
        if owner_id > 0: owner_id = -owner_id # Для группы ID должен быть отрицательным в некоторых методах, но в likes.getList owner_id передается отдельно
    
    if not owner_id:
        logger.error(f"[Contest: {contest_id}] Could not determine owner_id for contest")
        return []

    logger.info(f"[Contest: {contest_id}] Owner ID: {owner_id}, VK Post ID: {contest.last_vk_post_id}")

    for group in conditions:
        if group.get("type") != "and_group":
            continue
        
        logger.info(f"[Contest: {contest_id}] Processing condition group: {group.get('id', 'unknown')}")
        group_candidates = None # Set of user_ids

        for condition in group.get("conditions", []):
            cond_type = condition.get("type")
            logger.info(f"[Contest: {contest_id}] Checking condition: {cond_type}")
            current_set = set()

            if cond_type == "like":
                # likes.getList
                logger.info(f"[Contest: {contest_id}] Fetching likes...")
                # type='post', owner_id=owner_id, item_id=contest.last_vk_post_id
                res = call_vk_api("likes.getList", {
                    "type": "post",
                    "owner_id": owner_id,
                    "item_id": contest.last_vk_post_id,
                    "count": 1000 # TODO: Pagination
                })
                if res and 'items' in res:
                    current_set = set(res['items'])
                logger.info(f"[Contest: {contest_id}] Found {len(current_set)} likes.")

            elif cond_type == "comment":
                # wall.getComments
                logger.info(f"[Contest: {contest_id}] Fetching comments...")
                res = call_vk_api("wall.getComments", {
                    "owner_id": owner_id,
                    "post_id": contest.last_vk_post_id,
                    "count": 100, # TODO: Pagination
                    "extended": 1
                })
                if res and 'items' in res:
                    text_contains = condition.get("text_contains", "").lower()
                    for comment in res['items']:
                        if 'from_id' in comment and comment['from_id'] > 0:
                            if not text_contains or text_contains in comment.get('text', '').lower():
                                current_set.add(comment['from_id'])
                logger.info(f"[Contest: {contest_id}] Found {len(current_set)} matching comments.")

            elif cond_type == "repost":
                # wall.getReposts
                logger.info(f"[Contest: {contest_id}] Fetching reposts...")
                res = call_vk_api("wall.getReposts", {
                    "owner_id": owner_id,
                    "post_id": contest.last_vk_post_id,
                    "count": 1000 # TODO: Pagination
                })
                if res and 'items' in res:
                    for item in res['items']:
                        if 'from_id' in item and item['from_id'] > 0:
                            current_set.add(item['from_id'])
                logger.info(f"[Contest: {contest_id}] Found {len(current_set)} reposts.")

            elif cond_type == "member_of_group":
                # groups.isMember
                logger.info(f"[Contest: {contest_id}] Checking group membership...")
                # Это проверка конкретного пользователя, сложно сделать массово для "всех".
                # Поэтому этот фильтр лучше применять к уже собранному списку кандидатов.
                target_group_id = condition.get("group_id")
                if target_group_id == "current":
                    target_group_id = str(abs(owner_id))
                
                if group_candidates is not None:
                    # Проверяем только тех, кто уже есть
                    to_remove = set()
                    # groups.isMember может принимать список user_ids
                    user_ids = list(group_candidates)
                    # Разбиваем на чанки по 500
                    for i in range(0, len(user_ids), 500):
                        chunk = user_ids[i:i+500]
                        res = call_vk_api("groups.isMember", {
                            "group_id": target_group_id,
                            "user_ids": ",".join(map(str, chunk))
                        })
                        if res:
                            for item in res:
                                if not item.get('member'):
                                    to_remove.add(item['user_id'])
                    
                    current_set = group_candidates - to_remove
                else:
                    # Если это первое условие - мы не можем получить список всех подписчиков эффективно для большого паблика
                    logger.warning(f"[Contest: {contest_id}] member_of_group cannot be the first condition efficiently. Skipping initial filter.")
                    current_set = set()

            elif cond_type == "mailing":
                 # Проверка наличия vk_id в таблице system_list_mailing
                 # Аналогично member_of_group, лучше применять как фильтр
                 logger.info(f"[Contest: {contest_id}] Checking mailing subscription...")
                 if group_candidates is not None:
                     allowed_ids = db.query(SystemListMailing.vk_id).filter(
                         SystemListMailing.vk_id.in_(group_candidates),
                         SystemListMailing.can_access_closed == True
                     ).all()
                     current_set = set(id[0] for id in allowed_ids)
                 else:
                     # Если первое - берем всех из базы?
                     allowed_ids = db.query(SystemListMailing.vk_id).filter(
                         SystemListMailing.can_access_closed == True
                     ).all()
                     current_set = set(id[0] for id in allowed_ids)

            # Logic AND
            if group_candidates is None:
                group_candidates = current_set
                logger.info(f"[Contest: {contest_id}] Initialized group candidates: {len(group_candidates)}")
            else:
                before_len = len(group_candidates)
                group_candidates = group_candidates.intersection(current_set)
                logger.info(f"[Contest: {contest_id}] Intersected candidates. Before: {before_len}, After: {len(group_candidates)}")
        
        if group_candidates:
            all_candidates.update(group_candidates)

    logger.info(f"[Contest: {contest_id}] Total unique candidates: {len(all_candidates)}")

    # Сохраняем в базу
    crud.clear_entries(db, contest_id)
    
    # Нам нужно получить инфо о пользователях (имя, фото)
    # users.get
    user_ids_list = list(all_candidates)
    entries = []
    logger.info(f"[Contest: {contest_id}] Fetching user details for {len(user_ids_list)} users.")
    for i in range(0, len(user_ids_list), 1000):
        chunk = user_ids_list[i:i+1000]
        users_info = call_vk_api("users.get", {
            "user_ids": ",".join(map(str, chunk)),
            "fields": "photo_100"
        })
        if users_info:
            for u in users_info:
                entry = crud.add_entry(
                    db, 
                    contest_id, 
                    u['id'], 
                    f"{u.get('first_name', '')} {u.get('last_name', '')}", 
                    u.get('photo_100')
                )
                entries.append(entry)
                
    return entries
