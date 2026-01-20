from sqlalchemy.orm import Session
from models_library.automations import StoriesAutomation, StoriesAutomationLog
from models_library.projects import Project
from models_library.posts import Post
from services import vk_service
from datetime import datetime, timezone
import requests
import json
import uuid

def get_story_preview(story):
    if story.get('photo'):
        sizes = story['photo'].get('sizes', [])
        if sizes: return sizes[-1].get('url') # Return largest for best quality
    if story.get('video'):
         return story['video'].get('first_frame_800')
    return None

def get_community_stories(db: Session, project_id: str, user_token: str, refresh: bool = False):
    """
    Deprecated alias for get_unified_stories really, but keeping signature for compatibility if needed.
    """
    return get_unified_stories(db, project_id, refresh=refresh)

def get_unified_stories(db: Session, project_id: str, refresh: bool = False):
    """
    Returns a unified list of stories from DB logs.
    Combines with active stories from VK to update status and date if refresh=True.
    
    Args:
        refresh (bool): If True, fetches live data from VK. If False, returns DB cache only.
    
    Returns:
        { "items": [ ... ] } dict
    """
    unified_list = []
    
    # Get Logs from DB
    logs = db.query(StoriesAutomationLog).filter(StoriesAutomationLog.project_id == project_id).all()
    
    active_stories_map = {}
    group_id = None
    
    # --- SYNC LOGIC ---
    if refresh:
        # Get project and settings (token)
        from config import settings as app_settings
        user_token = app_settings.vk_user_token
        
        project = db.query(Project).filter(Project.id == project_id).first()
        if project and project.vkProjectId:
            try:
                group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
            except: pass
            
        if group_id:
            try:
                active_stories = vk_service.get_active_stories(group_id, user_token)
                if active_stories:
                    for s in active_stories:
                        if s.get('id'):
                            active_stories_map[int(s.get('id'))] = s
            except Exception as e:
                print(f"STORIES_AUTO: Failed to fetch active stories: {e}")
                pass

    # Process logs to map by vk_story_id
    log_map = {}
    for log in logs:
        s_id = None
        if log.log:
            try:
               data = json.loads(log.log)
               if 'story_link' in data:
                   parts = data['story_link'].replace('https://vk.com/story', '').split('_')
                   if len(parts) >= 2:
                       s_id_str = parts[-1]
                       s_id = int(s_id_str.split('?')[0])
            except:
                pass
        
        if s_id:
            log_map[s_id] = log
            
    # Combine all known IDs.
    all_seen_ids = set(active_stories_map.keys()) | set(log_map.keys())
    
    new_logs_to_add = []
    logs_to_update = [] # For self-healing
    
    for s_id in all_seen_ids:
        vk_story = active_stories_map.get(s_id)
        log_obj = log_map.get(s_id)
        
        # --- NEW: Auto-save manual stories to DB ---
        if refresh and vk_story and not log_obj and group_id:
             story_link = f"https://vk.com/story-{group_id}_{s_id}"
             current_preview = get_story_preview(vk_story)
             
             new_log = StoriesAutomationLog(
                 id=str(uuid.uuid4()),
                 project_id=project_id,
                 vk_post_id=0, # Manual
                 status='published',
                 created_at=datetime.fromtimestamp(vk_story.get('date', 0), tz=timezone.utc),
                 image_url=current_preview,
                 log=json.dumps({
                     "story_link": story_link, 
                     "image_url": current_preview, 
                     "source": "manual",
                     "imported_at": datetime.now().isoformat()
                 })
             )
             new_logs_to_add.append(new_log)
             log_obj = new_log
        
        is_active = vk_story is not None if refresh else False 
        
        is_automated = log_obj is not None and (log_obj.vk_post_id is not None and log_obj.vk_post_id != 0)
        
        date_ts = 0
        type_str = 'photo'
        preview = None
        link = None 

        if log_obj and log_obj.log:
             try:
                 d = json.loads(log_obj.log)
                 link = d.get('story_link')
             except: pass
        
        # Construct link if missing (active story case)
        if not link and group_id and s_id: # Only if group_id known
             link = f"https://vk.com/story-{group_id}_{s_id}"

        views = 0
        detailed_stats = None
        stats_updated_at = None
        
        # 1. Try to get data from VK Active Story
        if vk_story:
            date_ts = vk_story.get('date', 0)
            type_str = vk_story.get('type', 'photo')
            views = vk_story.get('views', 0)
            preview = get_story_preview(vk_story)
            
            # [SELF-HEALING] Update DB log if it exists but missing image, and we have one from VK (Fix for disappearing images)
            if log_obj and not log_obj.image_url and preview:
                log_obj.image_url = preview
                if log_obj.log:
                    try:
                        ld = json.loads(log_obj.log)
                        ld['image_url'] = preview
                        log_obj.log = json.dumps(ld)
                    except: pass
                if log_obj not in logs_to_update:
                    logs_to_update.append(log_obj)

        # 2. Try to get data from Log (DB)
        if log_obj:
            if date_ts == 0:
                # Prefer Log Creation Time
                date_ts = int(log_obj.created_at.replace(tzinfo=timezone.utc).timestamp())
                
                # Fallback
                if date_ts == 0:
                    try:
                         # Fallback to Post Date Heuristic
                        if log_obj.vk_post_id and log_obj.vk_post_id != 0:
                             post_match = db.query(Post).filter(
                                 Post.projectId == project_id,
                                 Post.vkPostUrl.like(f"%_{log_obj.vk_post_id}")
                             ).first()
                             if post_match and post_match.date:
                                 try:
                                     dt = datetime.fromisoformat(post_match.date.replace('Z', '+00:00'))
                                     date_ts = int(dt.timestamp())
                                 except ValueError:
                                     date_ts = int(post_match.date)
                    except Exception: pass
            
            # --- FIX PREVIEW RECOVERY & SELF-HEALING ---
            if not preview:
                if log_obj.image_url:
                    preview = log_obj.image_url
                elif log_obj.log:
                    try:
                        data = json.loads(log_obj.log)
                        if 'image_url' in data:
                            preview = data['image_url']
                    except: pass
            
            # Fallback: recover preview from original post if automated
            if not preview and log_obj.vk_post_id and log_obj.vk_post_id != 0:
                try:
                     post_match = db.query(Post).filter(
                         Post.projectId == project_id,
                         Post.vkPostUrl.like(f"%_{log_obj.vk_post_id}")
                     ).first()
                     
                     if post_match:
                         # 1. Try 'images' column
                         if post_match.images:
                             try:
                                 imgs = json.loads(post_match.images)
                                 if imgs and len(imgs) > 0:
                                     preview = imgs[0].get('url')
                             except: pass
                         
                         # 2. Try 'attachments' column
                         if not preview and post_match.attachments:
                             try:
                                 atts = json.loads(post_match.attachments)
                                 for att in atts:
                                     if att.get('type') == 'photo' and att.get('photo'):
                                         sizes = att['photo'].get('sizes', [])
                                         best = next((s for s in sizes if s.get('type') == 'w'), sizes[-1])
                                         if best:
                                             preview = best.get('url')
                                             break
                             except: pass
                             
                         # 3. SELF-HEALING: Save recovered preview to DB
                         if preview:
                             log_obj.image_url = preview
                             logs_to_update.append(log_obj)
                             
                except Exception: pass
            # -------------------------------------------
            
            if log_obj.stats:
                try:
                    stats_json = json.loads(log_obj.stats)
                    detailed_stats = stats_json
                    if is_active and 'views' in detailed_stats and isinstance(detailed_stats['views'], dict):
                         detailed_stats['views']['count'] = max(detailed_stats['views']['count'], views)
                    stats_updated_at = log_obj.stats_updated_at.isoformat() if log_obj.stats_updated_at else None
                except: pass
        
        if date_ts == 0:
            continue

        unified_list.append({
            'vk_story_id': s_id,
            'date': date_ts,
            'type': type_str,
            'preview': preview,
            'link': link,
            'is_active': is_active,
            'is_automated': is_automated,
            'log_id': log_obj.id if log_obj else None,
            'vk_post_id': log_obj.vk_post_id if log_obj else None,
            'views': views,
            'detailed_stats': detailed_stats,
            'stats_updated_at': stats_updated_at
        })

    # Sort
    unified_list.sort(key=lambda x: x['date'], reverse=True)
    unique_unified = list({v['vk_story_id']: v for v in unified_list}.values())
    unique_unified.sort(key=lambda x: x['date'], reverse=True)
    
    # [RESCUE] Try to fetch missing previews for archived manual stories
    if refresh and group_id:
        # Ensure user_token is available (it is defined in 'if refresh:' block above)
        try:
             from config import settings as app_settings
             user_token = app_settings.vk_user_token
             
             rescue_ids = []
             rescue_map = {} 
             
             for s_id, l in log_map.items():
                 # Manual story (vk_post_id=0 or None), missing image, not active
                 if s_id not in active_stories_map and (not l.vk_post_id) and not l.image_url:
                      rescue_ids.append(f"-{group_id}_{s_id}")
                      rescue_map[s_id] = l
             
             if rescue_ids:
                 chunk_size = 70 
                 for i in range(0, len(rescue_ids), chunk_size):
                      chunk = rescue_ids[i:i + chunk_size]
                      resp = requests.post("https://api.vk.com/method/stories.getById", data={
                          "stories": ",".join(chunk),
                          "access_token": user_token,
                          "v": "5.131",
                          "extended": 1
                      }).json()
                      
                      if 'response' in resp and 'items' in resp['response']:
                          for item in resp['response']['items']:
                              s_id_remote = item.get('id')
                              if s_id_remote in rescue_map:
                                  prev = get_story_preview(item)
                                  if prev:
                                      l_obj = rescue_map[s_id_remote]
                                      l_obj.image_url = prev
                                      if l_obj.log:
                                          try:
                                              ld = json.loads(l_obj.log)
                                              ld['image_url'] = prev
                                              l_obj.log = json.dumps(ld)
                                          except: pass
                                      if l_obj not in logs_to_update:
                                          logs_to_update.append(l_obj)
        except Exception as e:
             print(f"STORIES RESCUE FAILED: {e}")

    # Batch Commit updates
    if logs_to_update:
        try:
             # Just commiting current transaction state should save modified objects
             # as they are attached to session
             db.add_all(logs_to_update)
             db.commit()
             # print(f"STORIES: Self-healed {len(logs_to_update)} log entries with previews.")
        except Exception as e:
            print(f"STORIES: Failed to save healed logs: {e}")

    if new_logs_to_add:
        try:
            db.add_all(new_logs_to_add)
            db.commit()
        except Exception: pass
            
    return {'items': unique_unified}
