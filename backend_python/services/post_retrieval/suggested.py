
from sqlalchemy.orm import Session
from fastapi import HTTPException

import crud
from schemas import SuggestedPost
from services import vk_service
from services.vk_api.api_client import call_vk_api as raw_vk_api_call
from services.post_helpers import get_rounded_timestamp

def get_suggested_posts(db: Session, project_id: str) -> list[SuggestedPost]:
    posts = crud.get_suggested_posts_by_project_id(db, project_id)
    return [SuggestedPost.model_validate(p, from_attributes=True) for p in posts]

def refresh_suggested_posts(db: Session, project_id: str, user_token: str) -> list[SuggestedPost]:
    """
    Обновление предложенных постов. Используем стратегию 'Broadcast' (запрос со всех токенов),
    так как права на просмотр предложки есть не у всех админов/редакторов.
    """
    print(f"SERVICE: Refreshing suggested posts for project {project_id} (Strategy: Broadcast)...")
    return _refresh_restricted_posts_broadcast(db, project_id, 'suggests', user_token, get_suggested_posts)

def _refresh_restricted_posts_broadcast(db: Session, project_id: str, filter_type: str, env_token: str, getter_func):
    """
    Вспомогательная функция для стратегии Broadcast.
    Опрашивает ВСЕ доступные токены и выбирает ответ с наибольшим количеством данных.
    Используется только для 'suggests'.
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, f"Project with id {project_id} not found.")

    # 1. Собираем все доступные токены
    tokens_to_try = []
    if env_token:
        tokens_to_try.append(env_token)
    
    # Добавляем системные токены
    system_tokens = crud.get_active_account_tokens(db)
    tokens_to_try.extend(system_tokens)
    
    # Убираем дубликаты
    unique_tokens = list(set(tokens_to_try))
    
    print(f"SERVICE: Found {len(unique_tokens)} unique tokens to try for '{filter_type}'.")

    best_response = None
    best_token_masked = "None"
    successful_calls = 0
    
    # 2. Делаем запросы с каждого токена
    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, env_token) 
        owner_id = vk_service.vk_owner_id_string(numeric_id)
    except Exception as e:
         print(f"Error resolving group ID for broadcast: {e}")
         raise HTTPException(400, f"Invalid group ID: {e}")

    print(f"SERVICE: Starting broadcast fetch from {len(unique_tokens)} tokens...")
    for token in unique_tokens:
        masked = f"{token[:6]}...{token[-4:]}"
        try:
            # Используем прямой вызов без ротации, чтобы проверить конкретный токен
            response = raw_vk_api_call(
                'wall.get', 
                {
                    'owner_id': owner_id, 
                    'filter': filter_type, 
                    'count': '100', 
                    'access_token': token
                },
                project_id=project_id
            )
            
            items = response.get('items', [])
            count = response.get('count', 0)
            
            print(f"  -> Token {masked}: Success. Items: {len(items)}, Count: {count}")
            successful_calls += 1

            # Логика выбора лучшего ответа:
            if best_response is None:
                best_response = response
                best_token_masked = masked
            else:
                current_best_len = len(best_response.get('items', []))
                if len(items) > current_best_len:
                    best_response = response
                    best_token_masked = masked
                elif len(items) == current_best_len and count > best_response.get('count', 0):
                    best_response = response
                    best_token_masked = masked

        except Exception as e:
            print(f"  -> Token {masked}: Failed. Error: {e}")
            continue

    # ЗАЩИТА: Если ни один токен не сработал, выбрасываем ошибку, чтобы не очистить БД
    if successful_calls == 0 and unique_tokens:
        print("SERVICE: All tokens failed in broadcast. Aborting DB update to prevent data loss.")
        raise HTTPException(503, "Update failed: No available tokens could fetch data.")
        
    # Если токенов вообще нет - это тоже ошибка
    if not unique_tokens:
         print("SERVICE: No tokens available for broadcast.")
         raise HTTPException(400, "No access tokens available.")

    print(f"SERVICE: Best response selected from token {best_token_masked} with {len(best_response.get('items', []))} items.")

    # 3. Обрабатываем лучший ответ
    try:
        timestamp = get_rounded_timestamp()
        
        # Дедупликация
        raw_items = best_response.get('items', [])
        unique_items_map = {}
        for item in raw_items:
             post_id = f"{item['owner_id']}_{item['id']}"
             unique_items_map[post_id] = item
        
        if filter_type == 'suggests':
            print(f"SERVICE: Saving suggested posts to DB...")
            posts_from_vk = [vk_service.format_suggested_vk_post(item, project_id) for item in unique_items_map.values()]
            crud.replace_suggested_posts(db, project_id, posts_from_vk, timestamp)
            
        return getter_func(db, project_id)

    except Exception as e:
        print(f"ERROR: Failed to process best response for {project_id}: {e}.")
        raise e
