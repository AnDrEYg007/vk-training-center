from sqlalchemy.orm import Session
from models_library.automations import StoriesAutomation
from models_library.projects import Project
from services import vk_service
from .logic import process_single_story_for_post
from datetime import datetime, timedelta

def process_stories_automation(db: Session, project_id: str, posts_from_vk: list[dict], user_token: str):
    """
    Checks posts against Stories Automation rules and posts to stories if matched.
    """
    # 1. Check settings
    settings = db.query(StoriesAutomation).filter(StoriesAutomation.project_id == project_id, StoriesAutomation.is_active == True).first()
    if not settings:
        return

    # Check for "All Posts" mode (*) or specific keywords
    is_all_mode = False
    keywords = []

    if settings.keywords and settings.keywords.strip() == '*':
        is_all_mode = True
    elif settings.keywords:
        keywords = [k.strip().lower() for k in settings.keywords.split(',')]
    
    # If not in "All Mode" and no valid keywords found, stop.
    if not is_all_mode and not keywords:
        return

    # Get numeric group ID
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return
        
    try:
        group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
    except Exception as e:
        print(f"STORIES_AUTO: Failed to resolve group ID for {project_id}: {e}")
        return

    # 2. Iterate posts
    for post in posts_from_vk:
        post_id = post.get('id')
        text = post.get('text', '').lower()
        date_ts = post.get('date', 0)
        
        # Check age (only last 24h to avoid spamming old posts on first run)
        # Assuming automation is for "fresh" content.
        if datetime.fromtimestamp(date_ts) < datetime.now() - timedelta(hours=24):
            continue

        # Check keywords (Skip check if "All Mode" is active)
        if not is_all_mode and not any(k in text for k in keywords):
            continue

        # Check if already processed
        # Note: logic inside process_single_story_for_post also checks this if force=False,
        # but we check here to avoid overhead of function call loop.
        # But wait, logic moved to 'logic.py' has to handle DB import, so we can duplicate check here strictly for performance OR check inside.
        # Let's check here as it was in original.
        from models_library.automations import StoriesAutomationLog
        existing_log = db.query(StoriesAutomationLog).filter(
            StoriesAutomationLog.project_id == project_id,
            StoriesAutomationLog.vk_post_id == post_id
        ).first()
        
        if existing_log:
            continue
            
        process_single_story_for_post(db, project_id, post, group_id, user_token, force=False)
