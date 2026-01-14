from typing import Dict, List, Set
from database import redis_client

# Локальный фоллбэк, если Redis недоступен
_LOCAL_UPDATED_PROJECT_IDS: Set[str] = set()

REDIS_KEY = "vk_planner:updated_projects"

def add_updated_project(project_id: str):
    """Добавляет ID проекта в список для обновления."""
    print(f"TRACKER: Project '{project_id}' marked for update.")
    
    if redis_client:
        try:
            # Используем Redis Set для хранения уникальных ID
            redis_client.sadd(REDIS_KEY, project_id)
            # Устанавливаем TTL, чтобы данные не висели вечно, если фронтенд не забирает (напр. 1 час)
            redis_client.expire(REDIS_KEY, 3600)
        except Exception as e:
            print(f"TRACKER ERROR (Redis): {e}")
            # Fallback
            _LOCAL_UPDATED_PROJECT_IDS.add(project_id)
    else:
        _LOCAL_UPDATED_PROJECT_IDS.add(project_id)

def get_and_clear_updates() -> Dict[str, List[str]]:
    """Возвращает список ID обновленных проектов и очищает его."""
    updates = []
    
    if redis_client:
        try:
            # Атомарно получаем все члены множества и удаляем ключ
            # Используем pipeline для атомарности (или Lua скрипт в идеале, но spop count тоже ок)
            # В данном случае для простоты: SMEMBERS -> DEL
            pipe = redis_client.pipeline()
            pipe.smembers(REDIS_KEY)
            pipe.delete(REDIS_KEY)
            results = pipe.execute()
            
            members = results[0] # set of strings
            if members:
                updates = list(members)
                
        except Exception as e:
            print(f"TRACKER ERROR (Redis): {e}")
            # Fallback to local + return empty list if redis failed to avoid duplicates logic issues
            updates = list(_LOCAL_UPDATED_PROJECT_IDS)
            _LOCAL_UPDATED_PROJECT_IDS.clear()
    else:
        if _LOCAL_UPDATED_PROJECT_IDS:
            updates = list(_LOCAL_UPDATED_PROJECT_IDS)
            _LOCAL_UPDATED_PROJECT_IDS.clear()
    
    if updates:
        print(f"TRACKER: Polling updates. Found: {updates}. Clearing tracker.")
        
    return {"updatedProjectIds": updates}