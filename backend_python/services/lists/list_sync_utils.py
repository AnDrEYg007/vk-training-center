
import time
import concurrent.futures
from typing import List, Dict, Optional
from services.vk_api.api_client import call_vk_api as raw_vk_call
import crud
from database import SessionLocal

def get_all_project_tokens(db, user_token: str = None) -> List[str]:
    """
    Собирает "Армию токенов": ENV токен + Системные аккаунты.
    """
    tokens = []
    if user_token:
        tokens.append(user_token)
    
    system_tokens = crud.get_active_account_tokens(db)
    tokens.extend(system_tokens)
    
    # Убираем дубликаты и пустые, сохраняя порядок (хотя для set порядок не гарантирован)
    unique_tokens = list(set([t for t in tokens if t]))
    return unique_tokens

def _check_token_admin_rights(token: str, group_id: int) -> Optional[str]:
    """
    Воркер для проверки прав одного токена.
    Возвращает токен, если он АДМИНИСТРАТОР (level 3), иначе None.
    """
    try:
        # groups.getById возвращает поле is_admin для текущего пользователя
        # Также запрашиваем admin_level для точного определения роли
        response = raw_vk_call('groups.getById', {
            'group_id': group_id,
            'fields': 'is_admin,admin_level',
            'access_token': token
        })
        
        group_info = None
        
        # Логика обработки ответа
        if isinstance(response, list) and len(response) > 0:
            # Стандартный случай: api_client вернул список
            group_info = response[0]
        elif isinstance(response, dict):
            # Edge-case: api_client вернул словарь (например, с ключом response или groups)
            if 'response' in response and isinstance(response['response'], list) and len(response['response']) > 0:
                group_info = response['response'][0]
            elif 'groups' in response and isinstance(response['groups'], list) and len(response['groups']) > 0:
                group_info = response['groups'][0]

        if not group_info:
            return None

        # 1. Пользователь должен быть руководителем
        if group_info.get('is_admin') == 1:
            # 2. admin_level: 1-модератор, 2-редактор, 3-администратор
            # Для wall.getReposts требуются права администратора (level 3)
            if group_info.get('admin_level', 0) >= 3:
                return token
    except Exception as e:
        # Логируем ошибку для отладки, но не прерываем процесс
        print(f"Admin check failed for token ...{token[-4:]}: {e}")
        pass
    return None

def filter_admin_tokens(tokens: List[str], group_id: int) -> List[str]:
    """
    Фильтрует список токенов, оставляя только те, которые являются АДМИНИСТРАТОРАМИ в указанной группе.
    Выполняется параллельно для скорости.
    """
    if not tokens:
        return []
        
    admin_tokens = []
    # Ограничиваем количество потоков
    max_workers = min(len(tokens), 20)
    
    print(f"SERVICE: Checking admin rights (level 3+) for {len(tokens)} tokens in group {group_id}...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Запускаем проверки
        future_to_token = {
            executor.submit(_check_token_admin_rights, token, group_id): token 
            for token in tokens
        }
        
        for future in concurrent.futures.as_completed(future_to_token):
            result = future.result()
            if result:
                admin_tokens.append(result)
                
    print(f"SERVICE: Found {len(admin_tokens)} admin tokens out of {len(tokens)}.")
    return admin_tokens

def _fetch_chunk_smart(
    user_ids_chunk: List[int], 
    tokens: List[str], 
    chunk_index: int, 
    fields: str, 
    project_id: str
) -> List[Dict]:
    """
    Воркер для обработки одного чанка пользователей.
    Реализует Smart Fallback: если токен падает, пробует следующий.
    """
    if not tokens:
        return []

    # Round-Robin выбор "основного" токена для этого чанка
    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    
    # Формируем порядок перебора: [Primary, Next, Next, ..., Previous]
    # Это гарантирует, что нагрузка распределена, но при сбое есть резерв
    rotation_order = tokens[primary_index:] + tokens[:primary_index]
    
    ids_str = ",".join(map(str, user_ids_chunk))
    last_error = None

    for token in rotation_order:
        masked = f"...{token[-4:]}"
        try:
            # Прямой вызов без глобальной ротации (мы управляем ротацией здесь)
            response = raw_vk_call('users.get', {
                'user_ids': ids_str,
                'fields': fields,
                'access_token': token
            }, project_id=project_id)
            
            # Успех! Возвращаем данные
            # print(f"   [Smart Worker] Chunk {chunk_index} OK with token {masked}")
            return response

        except Exception as e:
            print(f"   [Smart Worker] Chunk {chunk_index} FAILED with token {masked}: {e}. Trying next...")
            last_error = e
            time.sleep(0.2) # Небольшая пауза перед ретраем с другим токеном

    print(f"   [Smart Worker] !! ALL TOKENS FAILED for Chunk {chunk_index}. Data skipped.")
    return []

def fetch_users_smart_parallel(
    vk_ids: List[int], 
    tokens: List[str], 
    fields: str, 
    project_id: str,
    progress_callback=None
) -> List[Dict]:
    """
    Параллельная загрузка пользователей с защитой от сбоев токенов.
    """
    total_count = len(vk_ids)
    if total_count == 0 or not tokens:
        return []

    # Разбиваем на чанки по 1000 (лимит users.get)
    CHUNK_SIZE = 1000
    chunks = [vk_ids[i:i + CHUNK_SIZE] for i in range(0, total_count, CHUNK_SIZE)]
    
    all_users_data = []
    total_fetched = 0
    
    # Запускаем воркеры
    # Ограничиваем кол-во потоков кол-вом токенов (или разумным максимумом)
    max_workers = min(len(tokens), 15)
    
    print(f"SERVICE: Smart Sync users: {total_count} items, {len(chunks)} chunks. Using {len(tokens)} tokens in {max_workers} threads.")

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_index = {
            executor.submit(_fetch_chunk_smart, chunk, tokens, i, fields, project_id): i 
            for i, chunk in enumerate(chunks)
        }

        for future in concurrent.futures.as_completed(future_to_index):
            try:
                data = future.result()
                if data:
                    all_users_data.extend(data)
                    total_fetched += len(data)
                
                if progress_callback:
                    progress_callback(total_fetched, total_count)
                    
            except Exception as e:
                print(f"   [Smart Sync] Critical error in thread: {e}")

    return all_users_data
