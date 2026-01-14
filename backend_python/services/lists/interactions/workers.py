
import json
import time
from typing import List, Dict, Any

import models
from services.vk_api.api_client import call_vk_api as raw_vk_call
from .config import (
    LIKES_INNER_COUNT, LIKES_ITERATIONS,
    COMMENTS_INNER_COUNT, COMMENTS_ITERATIONS,
    REPOSTS_INNER_COUNT, REPOSTS_ITERATIONS
)

def _fetch_multi_post_batch(
    tokens: List[str], 
    chunk_index: int, 
    posts_chunk: List[models.SystemListPost], 
    interaction_type: str, 
    owner_id: int,
    project_id: str
) -> List[Dict]:
    """
    Воркер ФАЗЫ 1: Запрашивает первые 1000 активностей сразу для НЕСКОЛЬКИХ постов.
    Возвращает список результатов: [{post_id, count, items, profiles, groups}, ...]
    """
    if not tokens or not posts_chunk:
        return []

    # Подготовка параметров для скрипта
    post_ids = [p.vk_post_id for p in posts_chunk]
    
    # ВАЖНО: Полный список полей для профиля
    common_fields = "sex,bdate,city,country,photo_100,domain,has_mobile,last_seen,is_closed,can_access_closed"
    
    # Формируем VK Script
    if interaction_type == 'likes':
        code = f"""
        var post_ids = {json.dumps(post_ids)};
        var owner_id = {owner_id};
        var result = [];
        var i = 0;
        
        while (i < post_ids.length) {{
            var pid = post_ids[i];
            var resp = API.likes.getList({{
                "type": "post", "owner_id": owner_id, "item_id": pid,
                "filter": "likes", "extended": 1, "fields": "{common_fields}",
                "count": 1000, "offset": 0
            }});
            result.push({{
                "post_id": pid,
                "count": resp.count ? resp.count : 0,
                "items": resp.items ? resp.items : []
            }});
            i = i + 1;
        }}
        return result;
        """
    elif interaction_type == 'comments':
        code = f"""
        var post_ids = {json.dumps(post_ids)};
        var owner_id = {owner_id};
        var result = [];
        var i = 0;
        
        while (i < post_ids.length) {{
            var pid = post_ids[i];
            var resp = API.wall.getComments({{
                "owner_id": owner_id, "post_id": pid,
                "extended": 1, "fields": "{common_fields}",
                "count": 100, "offset": 0
            }});
            result.push({{
                "post_id": pid,
                "count": resp.count ? resp.count : 0,
                "items": resp.items ? resp.items : [],
                "profiles": resp.profiles ? resp.profiles : [],
                "groups": resp.groups ? resp.groups : []
            }});
            i = i + 1;
        }}
        return result;
        """
    elif interaction_type == 'reposts':
        code = f"""
        var post_ids = {json.dumps(post_ids)};
        var owner_id = {owner_id};
        var result = [];
        var i = 0;
        
        while (i < post_ids.length) {{
            var pid = post_ids[i];
            var resp = API.wall.getReposts({{
                "owner_id": owner_id, "post_id": pid,
                "extended": 1, "fields": "{common_fields}",
                "count": 1000, "offset": 0
            }});
            result.push({{
                "post_id": pid,
                "count": resp.count ? resp.count : 0,
                "items": resp.items ? resp.items : [],
                "profiles": resp.profiles ? resp.profiles : [],
                "groups": resp.groups ? resp.groups : []
            }});
            i = i + 1;
        }}
        return result;
        """
    else:
        return []

    # Ротация токенов
    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    rotation_order = tokens[primary_index:] + tokens[:primary_index]

    for token in rotation_order:
        masked_token = f"...{token[-6:]}" if len(token) > 6 else "???"
        try:
            result = raw_vk_call("execute", {"code": code, "access_token": token}, project_id=project_id)
            
            # Проверка на пустой результат (если посты были, а ответ пустой/null)
            if result is None and post_ids:
                 raise Exception("Empty response from execute (Token might be restricted).")
            
            # Легкий троттлинг после успешного запроса для снижения нагрузки на API
            time.sleep(0.1)
                 
            return result if isinstance(result, list) else []

        except Exception as e:
            print(f"   [MultiWorker {interaction_type} {masked_token}] !! ERROR: {e}. Trying next...")
            time.sleep(0.2)

    print(f"   [MultiWorker] !! ALL TOKENS FAILED for chunk {chunk_index}")
    return []

def _fetch_deep_scan_batch(
    tokens: List[str], 
    chunk_index: int, 
    owner_id: int, 
    post_vk_id: int, 
    interaction_type: str, 
    offset: int, 
    count_to_fetch: int, 
    project_id: str
) -> Dict[str, List]:
    """
    Воркер ФАЗЫ 2: Глубокое сканирование одного поста (для > 1000 активностей).
    Использует execute для пагинации внутри одного поста.
    """
    if not tokens:
        return {"items": [], "profiles": [], "groups": []}

    # Поля, которые мы хотим получить
    fields_param = "sex,bdate,city,country,photo_100,domain,has_mobile,last_seen,is_closed,can_access_closed"

    if interaction_type == 'likes':
        api_method = 'likes.getList'
        inner_count = LIKES_INNER_COUNT
        base_params = f'"type": "post", "owner_id": {owner_id}, "item_id": {post_vk_id}, "filter": "likes", "extended": 1, "fields": "{fields_param}"'
    elif interaction_type == 'comments':
        api_method = 'wall.getComments'
        inner_count = COMMENTS_INNER_COUNT
        base_params = f'"owner_id": {owner_id}, "post_id": {post_vk_id}, "extended": 1, "fields": "{fields_param}"'
    elif interaction_type == 'reposts':
        api_method = 'wall.getReposts'
        inner_count = REPOSTS_INNER_COUNT
        base_params = f'"owner_id": {owner_id}, "post_id": {post_vk_id}, "extended": 1, "fields": "{fields_param}"'
    else:
        return {"items": [], "profiles": [], "groups": []}

    iterations = (count_to_fetch + inner_count - 1) // inner_count
    
    # VK Script для пагинации
    if interaction_type == 'likes':
        code = f"""
        var offset = {offset};
        var count = {inner_count};
        var iterations = {iterations};
        var items = [];
        var i = 0;
        while (i < iterations) {{
            var resp = API.{api_method}({{ {base_params}, "offset": offset + (i * count), "count": count }});
            if (resp.items) {{ items = items + resp.items; }}
            i = i + 1;
        }}
        return {{"items": items}};
        """
    else:
        code = f"""
        var offset = {offset};
        var count = {inner_count};
        var iterations = {iterations};
        var items = [];
        var profiles = [];
        var groups = [];
        var i = 0;
        while (i < iterations) {{
            var resp = API.{api_method}({{ {base_params}, "offset": offset + (i * count), "count": count }});
            if (resp.items) {{ items = items + resp.items; }}
            if (resp.profiles) {{ profiles = profiles + resp.profiles; }}
            if (resp.groups) {{ groups = groups + resp.groups; }}
            i = i + 1;
        }}
        return {{"items": items, "profiles": profiles, "groups": groups}};
        """

    # Ротация
    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    rotation_order = tokens[primary_index:] + tokens[:primary_index]

    for token in rotation_order:
        masked_token = f"...{token[-6:]}" if len(token) > 6 else "???"
        try:
            result = raw_vk_call("execute", {"code": code, "access_token": token}, project_id=project_id)
            
            # Легкий троттлинг
            time.sleep(0.1)

            items = result.get('items', [])
            if not items and count_to_fetch > 0:
                 # pass or raise exception based on strictness
                 pass
            return result
        except Exception as e:
            print(f"   [DeepWorker {interaction_type} {masked_token}] !! ERROR post={post_vk_id}: {e}. Trying next...")
            time.sleep(0.2)

    print(f"   [DeepWorker] !! ALL TOKENS FAILED for post={post_vk_id}")
    return {"items": [], "profiles": [], "groups": []}
