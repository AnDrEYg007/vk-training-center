from sqlalchemy.orm import Session
from models_library.automations import StoriesAutomationLog
import requests
import json
from datetime import datetime, timezone

def batch_update_stats(db: Session, logs: list[StoriesAutomationLog], user_token: str):
    """
    Updates statistics for a list of story logs using VK Execute for batching.
    """
    if not logs:
        return {"status": "ok", "updated": 0}

    valid_logs = []
    # Pre-process logs to get story IDs
    for log in logs:
        if not log.log: continue
        try:
            data = json.loads(log.log)
            link = data.get('story_link')
            if not link: continue
            
            # Format: https://vk.com/story{owner_id}_{story_id}
            parts = link.replace('https://vk.com/story', '').split('_')
            if len(parts) != 2: continue
            
            owner_id = parts[0]
            story_id = parts[1]
            valid_logs.append({
                'log_obj': log,
                'owner_id': owner_id,
                'story_id': story_id
            })
        except:
            continue
            
    if not valid_logs:
        return {"status": "ok", "updated": 0}
        
    # Batch by 25
    chunk_size = 25
    updated_count = 0
    from datetime import datetime, timezone
    
    for i in range(0, len(valid_logs), chunk_size):
        chunk = valid_logs[i:i + chunk_size]
        
        # Build Execute Code
        code = "return ["
        calls = []
        for item in chunk:
            oid = item['owner_id']
            sid = item['story_id']
            calls.append(f"API.stories.getStats({{'owner_id': {oid}, 'story_id': {sid}}})")
        
        code += ",".join(calls)
        code += "];"
        
        try:
            resp = requests.post("https://api.vk.com/method/execute", data={
                "code": code,
                "access_token": user_token,
                "v": "5.131"
            }).json()
            
            if 'response' in resp:
                results = resp['response']
                for idx, stat_data in enumerate(results):
                    # API.stories.getStats returns the object directly or false
                    if stat_data and isinstance(stat_data, dict):
                         log_item = chunk[idx]['log_obj']
                         log_item.stats = json.dumps(stat_data)
                         log_item.stats_updated_at = datetime.now(timezone.utc)
                         updated_count += 1
            elif 'error' in resp:
                print(f"Error in batch update stats: {resp['error']}")
                
        except Exception as e:
            print(f"Exception in batch update stats: {e}")
            
    db.commit()
    return {"status": "ok", "updated": updated_count}
