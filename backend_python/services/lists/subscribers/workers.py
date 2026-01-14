
import time
from typing import List, Dict
from services.vk_api.api_client import call_vk_api as raw_vk_call
from .config import INNER_REQ_COUNT

def _fetch_batch_execute_members(tokens: List[str], chunk_index: int, group_id: int, offset: int, count_to_fetch: int, fields: str, project_id: str) -> List[Dict]:
    """
    Вспомогательная функция (воркер).
    Загружает пачку участников, используя VK Script (execute).
    """
    if not tokens:
        return []

    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    rotation_order = tokens[primary_index:] + tokens[:primary_index]
    
    iterations = (count_to_fetch + INNER_REQ_COUNT - 1) // INNER_REQ_COUNT
    
    code = f"""
    var group_id = {group_id};
    var offset = {offset};
    var count = {INNER_REQ_COUNT};
    var iterations = {iterations};
    var fields = "{fields}";
    var items = [];
    var i = 0;
    
    while (i < iterations) {{
        var resp = API.groups.getMembers({{
            "group_id": group_id,
            "offset": offset + (i * count),
            "count": count,
            "fields": fields
        }});
        if (resp.items) {{
            items = items + resp.items;
        }}
        i = i + 1;
    }}
    return items;
    """
    
    for token in rotation_order:
        try:
            result = raw_vk_call("execute", {"code": code, "access_token": token}, project_id=project_id)
            items = result if isinstance(result, list) else []
            
            # Строгая проверка: если мы запрашивали данные, но вернулось пусто - это ошибка батча
            if not items and count_to_fetch > 0:
                raise Exception(f"Empty response from execute. Expected ~{count_to_fetch} items.")
            
            return items

        except Exception as e:
            time.sleep(1.5)

    # Если все токены упали - выбрасываем исключение, чтобы батч попал в retry queue
    raise Exception(f"All tokens failed for chunk offset {offset}")
