from sqlalchemy.orm import Session
import logging
from datetime import datetime

from models_library.automations import StoriesAutomation
from models_library.projects import Project
from services import vk_service
from services.automations import stories_service
from services.post_helpers import get_rounded_timestamp
from services.post_retrieval.helpers import _apply_tags_to_db_posts
import crud
import models
from config import settings

# Setup logger
logger = logging.getLogger(__name__)

def run_stories_automation_cycle():
    """
    Background task:
    1. Finds all projects with Active Stories Automation.
    2. Fetches their latest posts.
    3. Runs the matching logic to create stories.
    
    This ensures that stories are generated even if the user is not online.
    """
    from database import SessionLocal # Lazy import to avoid circular dependency
    from datetime import datetime
    import time
    
    # print(f"STORIES_BG: Cycle STARTED at {datetime.now()}")
    
    db = SessionLocal()
    try:
        # 1. Find active automations
        active_configs = db.query(StoriesAutomation).filter(StoriesAutomation.is_active == True).all()
        
        if not active_configs:
            # print("STORIES_BG: No active automations found.")
            return

        total_projects = len(active_configs)
        print(f"STORIES_BG: Found {total_projects} active automation(s). Starting SEQUENTIAL check at {datetime.now()}...")

        for index, config in enumerate(active_configs):
            project_id = config.project_id
            
            # Simple validity check
            if not config.keywords:
                continue

            print(f"STORIES_BG: [{index+1}/{total_projects}] > Checking project {project_id}...")

            try:
                project = db.query(Project).filter(Project.id == project_id).first()
                if not project or project.disabled:
                    continue
                
                # Resolve Group ID
                try:
                    group_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
                    owner_id_str = vk_service.vk_owner_id_string(group_id)
                except Exception as e:
                    print(f"STORIES_BG: Failed to resolve group for {project_id}: {e}")
                    continue
                
                # 2. Fetch latest posts (fetching last 10 is usually enough for 10 min interval)
                # Note: stories_service handles logic to avoid duplicates (checks DB logs)
                # and checks age (last 24h).
                posts = vk_service.get_latest_wall_posts(owner_id_str, settings.vk_user_token, count=10)
                
                if not posts:
                    print(f"STORIES_BG: > No posts returned for {project_id}")
                    # Even if no posts, we might want to sync manual stories?
                    # But if no posts, unlikely much happened. Let's still try syncing stories just in case.
                else:
                    print(f"STORIES_BG: > Found {len(posts)} posts. Syncing to DB and processing stories...")
                
                # --- SYNC TO DB (Auto-Refresh) ---
                if posts:
                    try:
                        timestamp = get_rounded_timestamp()
                        # Format for internal DB
                        # We assume these are published since they come from Wall
                        formatted_posts = [
                            vk_service.format_vk_post(item, is_published=True) 
                            for item in posts
                        ]
                        
                        # Upsert (Insert or Update)
                        has_changes = crud.upsert_published_posts(db, project_id, formatted_posts, timestamp)
                        
                        # Apply Tags to these posts (or all)
                        # _apply_tags_to_db_posts iterates ALL posts of project, which is fine but maybe slow if many?
                        # But for now it's robust.
                        _apply_tags_to_db_posts(db, project_id, models.Post)
                        
                        # Update status
                        if has_changes:
                            crud.update_project_last_update_time(db, project_id, 'published', timestamp)
                        else:
                            print(f"STORIES_BG: No content changes detected for {project_id}. Skipping tracker update.")
                        
                    except Exception as sync_e:
                        print(f"STORIES_BG: Error syncing posts to DB: {sync_e}")

                # 3. Process Stories Automation
                # This will find new posts and convert them to stories if rules match
                try:
                    stories_service.process_stories_automation(db, project_id, posts, settings.vk_user_token)
                except Exception as auto_e:
                    print(f"STORIES_BG: Error calling process_stories_automation: {auto_e}")

                # 4. Sync Manual Stories (New Feature)
                # We reuse get_community_stories which fetches everything and saves manual ones to logs
                # This ensures manual stories appear in history/archive
                try:
                    # print(f"STORIES_BG: > Syncing manual stories for {project_id}...")
                    stories_service.get_community_stories(db, project_id, settings.vk_user_token)
                except Exception as manual_e:
                    print(f"STORIES_BG: Error syncing manual stories: {manual_e}")
                
                # --- RATE LIMIT PROTECTION ---
                # Add delay between projects to prevent "burst" requests and give VK API a breath
                # Even if calls are sequential, rapid sequential calls might look suspicious or hit ~3-5 RPS limits.
                time.sleep(2) 

            except Exception as proj_e:
                print(f"STORIES_BG: Project level error for {project_id}: {proj_e}")

    except Exception as e:
        print(f"STORIES_BG: Fatal error in cycle: {e}")
    finally:
        db.close()
