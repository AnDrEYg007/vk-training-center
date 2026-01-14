
from typing import List, Dict, Any, Optional
from database import SessionLocal
import crud
from config import settings
# Импортируем низкоуровневый клиент как _raw_call
from .api_client import call_vk_api as _raw_call_vk_api, VkApiError

def get_candidate_tokens(preferred_token: Optional[str] = None) -> List[str]:
    """
    Вспомогательная функция для сбора списка токенов в порядке приоритета.
    1. Preferred token (если передан).
    2. ENV token.
    3. System tokens (Active).
    Возвращает список уникальных токенов.
    """
    tokens = []
    if preferred_token:
        tokens.append(preferred_token)
    
    if settings.vk_user_token:
        tokens.append(settings.vk_user_token)
        
    db = SessionLocal()
    try:
        system_tokens = crud.get_active_account_tokens(db)
        tokens.extend(system_tokens)
    except Exception as e:
        print(f"VK_SERVICE: Error fetching system tokens: {e}")
    finally:
        db.close()
        
    # Удаляем дубликаты, сохраняя порядок
    seen = set()
    unique_tokens = []
    for t in tokens:
        if t and t not in seen:
            unique_tokens.append(t)
            seen.add(t)
            
    return unique_tokens

def call_vk_api(method: str, params: Dict[str, Any], project_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Высокоуровневая обертка над вызовом API VK с инвертированным механизмом Token Rotation.
    Сначала используются токены системных аккаунтов, а токен из .env - как резервный.
    """
    fallback_token_from_env = params.get('access_token')
    last_exception = None

    # 1. Получаем основные токены (Системные аккаунты)
    db = SessionLocal()
    primary_system_tokens = []
    try:
        primary_system_tokens = crud.get_active_account_tokens(db)
    except Exception as db_err:
        print(f"VK_SERVICE: Ошибка получения токенов из БД: {db_err}")
    finally:
        db.close()

    # 2. Пытаемся выполнить запрос с токенами системных аккаунтов
    if primary_system_tokens:
        api_params = params.copy()
        
        for token in primary_system_tokens:
            try:
                api_params['access_token'] = token
                result = _raw_call_vk_api(method, api_params, project_id=project_id)
                return result
            except VkApiError as e:
                last_exception = e
                continue
    
    # 3. Если все системные токены не сработали (или их не было), используем резервный токен из .env
    if fallback_token_from_env:
        try:
            return _raw_call_vk_api(method, params, project_id=project_id)
        except VkApiError as e:
            last_exception = e
    else:
        print("VK_SERVICE: Резервный токен из .env не предоставлен.")

    # 4. Если ничего не помогло, пробрасываем последнюю пойманную ошибку
    if last_exception:
        raise last_exception
    
    raise VkApiError("Нет доступных токенов (ни системных, ни из .env) для выполнения API запроса.", -1)


def publish_with_fallback(params: Dict[str, Any], method: str = 'wall.post', preferred_token: Optional[str] = None, project_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Специализированная функция для публикации/редактирования постов с агрессивной ротацией токенов.
    """
    last_exception = None
    unique_tokens = get_candidate_tokens(preferred_token)

    print(f"VK_SERVICE [PUBLISH]: Starting attempt for {method}. {len(unique_tokens)} tokens available.")

    for token in unique_tokens:
        try:
            current_params = params.copy()
            current_params['access_token'] = token
            
            result = _raw_call_vk_api(method, current_params, project_id=project_id)
            print(f"VK_SERVICE [PUBLISH]: Success with token ending in ...{token[-4:]}!")
            return result

        except VkApiError as e:
            print(f"VK_SERVICE [PUBLISH]: Failed with token ...{token[-4:]}. Error: {e}")
            last_exception = e
            # Если ошибка параметров, нет смысла менять токен
            if e.code in {100}: 
                 raise e
            continue
            
    if last_exception:
        raise last_exception
        
    raise VkApiError("No tokens available for publication", -1)
