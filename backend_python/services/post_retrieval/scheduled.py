
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone

import crud
from schemas import ScheduledPost
from services import vk_service
from services.vk_service import VkApiError
from services.post_helpers import get_rounded_timestamp
import models
import services.automations.reviews.scheduler as contest_scheduler
from .helpers import _fetch_vk_posts, _apply_tags_to_db_posts
from .published import get_published_posts

def get_scheduled_posts(db: Session, project_id: str) -> list[ScheduledPost]:
    # Актуализируем посты автоматизации перед отдачей
    contest_scheduler.ensure_future_contest_posts(db, project_id)
    
    posts = crud.get_scheduled_posts_by_project_id(db, project_id)
    return [ScheduledPost.model_validate(p, from_attributes=True) for p in posts]
    
def get_scheduled_post_count(db: Session, project_id: str) -> int:
    return crud.get_scheduled_post_count_for_project(db, project_id)

def refresh_scheduled_posts(db: Session, project_id: str, user_token: str) -> list[ScheduledPost]:
    """
    Обновление отложенных постов.
    Использует стратегию 'Standard Rotation' (как и для опубликованных).
    Берет первый работающий токен из пула.
    """
    print(f"SERVICE: Refreshing scheduled posts for project {project_id} (Strategy: Standard Rotation)...")
    
    # Актуализируем посты автоматизации
    print(f"SERVICE: Ensuring future contest posts...")
    contest_scheduler.ensure_future_contest_posts(db, project_id)

    timestamp = get_rounded_timestamp()
    try:
        print(f"SERVICE: Fetching scheduled posts from VK...")
        deduplicated_items, _ = _fetch_vk_posts(db, project_id, user_token, filter_type='postponed')
        now_ts = datetime.utcnow().timestamp()

        # Фильтруем, оставляя только будущие посты (на всякий случай, хотя фильтр postponed это делает)
        posts_from_vk = [
            vk_service.format_vk_post(item, is_published=False) 
            for item in deduplicated_items 
            if int(item.get('date', 0)) > now_ts
        ]
        print(f"SERVICE: Fetched {len(posts_from_vk)} scheduled posts.")
        
        # 1. Сохраняем посты в базу
        print(f"SERVICE: Saving scheduled posts to DB...")
        crud.replace_scheduled_posts(db, project_id, posts_from_vk, timestamp)
        
        # 2. Применяем теги к постам уже в базе данных
        print(f"SERVICE: Applying tags to scheduled posts...")
        _apply_tags_to_db_posts(db, project_id, models.ScheduledPost)
        
        crud.update_project_last_update_time(db, project_id, 'scheduled', timestamp)
        
        print(f"SERVICE: Scheduled posts refresh complete.")
        return get_scheduled_posts(db, project_id)

    except VkApiError as e:
        print(f"VK API Error in refresh_scheduled_posts for {project_id}: {e}")
        # Преобразуем ошибку VK в 403 Forbidden, чтобы фронтенд мог установить флаг ошибки доступа
        raise HTTPException(status_code=403, detail=str(e))

    except Exception as e:
        print(f"ERROR: Failed to refresh scheduled posts for {project_id}: {e}.")
        raise e

def refresh_all_schedule_data(db: Session, project_id: str, user_token: str) -> dict:
    """
    Atomic refresh of both published and scheduled posts.
    Order:
    1. Fetch Published (VK)
    2. Fetch Scheduled (VK)
    3. Save Published (DB)
    4. Save Scheduled (DB)
    5. Tag Published (DB)
    6. Tag Scheduled (DB)
    7. Return All
    """
    print(f"SERVICE: Refreshing ALL schedule data for project {project_id}...")
    
    # Актуализируем посты автоматизации
    print(f"SERVICE: [1/7] Ensuring future contest posts...")
    contest_scheduler.ensure_future_contest_posts(db, project_id)
    
    timestamp = get_rounded_timestamp()
    now_ts = datetime.utcnow().timestamp()
    
    try:
        # 1. Fetch Published
        print(f"SERVICE: [2/7] Fetching published posts from VK...")
        pub_deduplicated, pub_vk_response = _fetch_vk_posts(db, project_id, user_token)
        pub_posts_vk = [vk_service.format_vk_post(item, is_published=int(item.get('date', 0)) <= now_ts) for item in pub_deduplicated]
        print(f"SERVICE: Fetched {len(pub_posts_vk)} published posts.")
        
        # 2. Fetch Scheduled
        print(f"SERVICE: [3/7] Fetching scheduled posts from VK...")
        sch_deduplicated, _ = _fetch_vk_posts(db, project_id, user_token, filter_type='postponed')
        sch_posts_vk = [
            vk_service.format_vk_post(item, is_published=False) 
            for item in sch_deduplicated 
            if int(item.get('date', 0)) > now_ts
        ]
        print(f"SERVICE: Fetched {len(sch_posts_vk)} scheduled posts.")
        
        # 3. Save Published
        print(f"SERVICE: [4/7] Saving published posts to DB...")
        crud.replace_published_posts(db, project_id, pub_posts_vk, timestamp)
        
        # 4. Save Scheduled
        print(f"SERVICE: [5/7] Saving scheduled posts to DB...")
        crud.replace_scheduled_posts(db, project_id, sch_posts_vk, timestamp)
        
        # 5. Tag Published
        print(f"SERVICE: [6/7] Applying tags to published posts...")
        _apply_tags_to_db_posts(db, project_id, models.Post)
        
        # 6. Tag Scheduled
        print(f"SERVICE: [7/7] Applying tags to scheduled posts...")
        _apply_tags_to_db_posts(db, project_id, models.ScheduledPost)
        
        crud.update_project_last_update_time(db, project_id, 'published', timestamp)
        crud.update_project_last_update_time(db, project_id, 'scheduled', timestamp)
        
        # --- SYNC WITH SYSTEM LISTS (Published only) ---
        print(f"SERVICE: Syncing with System Lists...")
        try:
            system_list_entries = []
            total_count_vk = pub_vk_response.get('count', 0)
            numeric_id = vk_service.resolve_vk_group_id(crud.get_project_by_id(db, project_id).vkProjectId, user_token)
            owner_id = vk_service.vk_owner_id_string(numeric_id)
            
            for post in pub_deduplicated:
                image_url = None
                attachments = post.get('attachments', [])
                if attachments:
                    for att in attachments:
                        if att['type'] == 'photo' and 'sizes' in att.get('photo', {}):
                            sizes = att['photo']['sizes']
                            best_size = next((s for s in sizes if s.get('type') == 'x'), sizes[-1])
                            image_url = best_size.get('url')
                            break
                
                post_author_id = None
                if 'post_author_data' in post and 'author' in post['post_author_data']:
                    post_author_id = post['post_author_data']['author']
                
                entry = {
                    "id": f"{project_id}_{post['id']}",
                    "project_id": project_id,
                    "vk_post_id": post['id'],
                    "date": datetime.fromtimestamp(post['date'], timezone.utc),
                    "text": post.get('text', ''),
                    "image_url": image_url,
                    "vk_link": f"https://vk.com/wall{owner_id}_{post['id']}",
                    "likes_count": post.get('likes', {}).get('count', 0),
                    "comments_count": post.get('comments', {}).get('count', 0),
                    "reposts_count": post.get('reposts', {}).get('count', 0),
                    "views_count": post.get('views', {}).get('count', 0),
                    "can_post_comment": bool(post.get('comments', {}).get('can_post', 0)),
                    "can_like": bool(post.get('likes', {}).get('can_like', 0)),
                    "user_likes": bool(post.get('likes', {}).get('user_likes', 0)),
                    "signer_id": post.get('signer_id'),
                    "post_author_id": post_author_id
                }
                system_list_entries.append(entry)
                
            if system_list_entries:
                crud.bulk_upsert_posts(db, system_list_entries)
                crud.update_list_meta(db, project_id, {
                    "posts_last_updated": timestamp,
                    "posts_count": total_count_vk
                })
        except Exception as sync_e:
            print(f"WARNING: Failed to auto-sync published posts to System Lists: {sync_e}")
            
        return {
            "published": get_published_posts(db, project_id),
            "scheduled": get_scheduled_posts(db, project_id)
        }

    except VkApiError as e:
        print(f"VK API Error in refresh_all_schedule_data for {project_id}: {e}")
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        print(f"ERROR: Failed to refresh all schedule data for {project_id}: {e}.")
        raise e
