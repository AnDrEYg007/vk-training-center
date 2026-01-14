
from sqlalchemy.orm import Session
from fastapi import HTTPException
import crud
from services import vk_service
import models
from services.post_helpers import assign_tags_to_db_post

def _apply_tags_to_db_posts(db: Session, project_id: str, model_class):
    """
    Применяет теги к постам, которые уже находятся в базе данных.
    Это гарантирует, что мы работаем с персистентными объектами.
    """
    posts = db.query(model_class).filter(model_class.projectId == project_id).all()
    project_tags = crud.get_tags_by_project_id(db, project_id)
    
    print(f"SERVICE: Applying tags for project {project_id}. Found {len(posts)} posts and {len(project_tags)} tags.")

    if not project_tags:
        print("SERVICE: No tags defined for this project. Skipping tagging.")
        return

    for post in posts:
        assign_tags_to_db_post(db, post, project_id, project_tags)
    
    db.commit()
    print("SERVICE: Tagging complete and committed.")

def _fetch_vk_posts(db: Session, project_id: str, user_token: str, filter_type: str = None) -> tuple[list[dict], dict]:
    """
    Internal helper to fetch and deduplicate posts from VK.
    Returns (deduplicated_items, vk_response).
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, f"Project with id {project_id} not found.")

    numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
    owner_id = vk_service.vk_owner_id_string(numeric_id)
    
    params = {
        'owner_id': owner_id, 
        'count': '100', 
        'access_token': user_token
    }
    if filter_type:
        params['filter'] = filter_type

    print(f"SERVICE: Calling VK API wall.get for project {project_id} (filter={filter_type})...")
    vk_response = vk_service.call_vk_api('wall.get', params, project_id=project_id)
    
    raw_items = vk_response.get('items', [])
    unique_items_map = {}
    
    for item in raw_items:
        post_id = f"{item['owner_id']}_{item['id']}"
        if post_id not in unique_items_map:
            unique_items_map[post_id] = item
            
    deduplicated_items = list(unique_items_map.values())
    print(f"SERVICE: VK API returned {len(raw_items)} items. After deduplication: {len(deduplicated_items)}.")
    return deduplicated_items, vk_response
