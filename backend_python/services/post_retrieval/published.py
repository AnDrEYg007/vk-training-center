
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone

import crud
from schemas import ScheduledPost
from services import vk_service
from services.vk_service import VkApiError
from services.post_helpers import get_rounded_timestamp
import models
from .helpers import _fetch_vk_posts, _apply_tags_to_db_posts

def get_published_posts(db: Session, project_id: str) -> list[ScheduledPost]:
    posts = crud.get_posts_by_project_id(db, project_id)
    return [ScheduledPost.model_validate(p, from_attributes=True) for p in posts]

def refresh_published_posts(db: Session, project_id: str, user_token: str) -> list[ScheduledPost]:
    print(f"SERVICE: Refreshing published posts for project {project_id}...")
    timestamp = get_rounded_timestamp()
    try:
        print(f"SERVICE: Fetching published posts from VK...")
        deduplicated_items, vk_response = _fetch_vk_posts(db, project_id, user_token)
        now_ts = datetime.utcnow().timestamp()
        
        posts_from_vk = [vk_service.format_vk_post(item, is_published=int(item.get('date', 0)) <= now_ts) for item in deduplicated_items]
        print(f"SERVICE: Fetched {len(posts_from_vk)} published posts.")
        
        # 1. Сохраняем посты в базу (без тегов или со старыми тегами, если они пришли, но мы их пересчитаем)
        print(f"SERVICE: Saving published posts to DB...")
        crud.replace_published_posts(db, project_id, posts_from_vk, timestamp)
        
        # 2. Применяем теги к постам уже в базе данных
        print(f"SERVICE: Applying tags to published posts...")
        _apply_tags_to_db_posts(db, project_id, models.Post)
        
        crud.update_project_last_update_time(db, project_id, 'published', timestamp)
        
        # --- SYNC WITH SYSTEM LISTS ---
        print(f"SERVICE: Syncing with System Lists...")
        try:
            system_list_entries = []
            total_count_vk = vk_response.get('count', 0)
            numeric_id = vk_service.resolve_vk_group_id(crud.get_project_by_id(db, project_id).vkProjectId, user_token)
            owner_id = vk_service.vk_owner_id_string(numeric_id)
            
            for post in deduplicated_items:
                image_url = None
                attachments = post.get('attachments', [])
                if attachments:
                    for att in attachments:
                        if att['type'] == 'photo' and 'sizes' in att.get('photo', {}):
                            sizes = att['photo']['sizes']
                            best_size = next((s for s in sizes if s.get('type') == 'x'), sizes[-1])
                            image_url = best_size.get('url')
                            break
                
                # Извлечение post_author_data.author (приоритет)
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
                    # Сохраняем signer_id
                    "signer_id": post.get('signer_id'),
                    # NEW: Сохраняем post_author_id
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
        # -----------------------------
        
        return get_published_posts(db, project_id)
    
    except VkApiError as e:
        print(f"VK API Error in refresh_published_posts for {project_id}: {e}")
        # Преобразуем ошибку VK в 403 Forbidden, чтобы фронтенд мог установить флаг ошибки доступа
        raise HTTPException(status_code=403, detail=str(e))
        
    except Exception as e:
        print(f"ERROR: Failed to refresh published posts for {project_id} from VK: {e}.")
        raise e
