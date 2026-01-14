
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import crud.ai_log_crud as log_crud
import crud.ai_token_crud as token_crud
from config import settings
from database import SessionLocal

# Кеш токенов для быстрой проверки (token -> id)
_AI_TOKEN_CACHE = {}

def log_ai_request(token: str, model_name: str, success: bool = True, error_details: str = None):
    """
    Основная функция логирования AI запросов.
    Определяет ID токена и пишет лог в БД в отдельной сессии.
    """
    db = SessionLocal()
    try:
        token_id = None
        is_env_token = False
        
        # 1. Проверка на ENV токен
        if token == settings.gemini_api_key:
            is_env_token = True
        
        # 2. Если не ENV, ищем в таблице токенов
        if not is_env_token:
            # Проверяем кеш
            if token in _AI_TOKEN_CACHE:
                token_id = _AI_TOKEN_CACHE[token]
            else:
                # Ищем в БД
                db_tokens = token_crud.get_all_tokens(db)
                for t in db_tokens:
                    if t.token == token:
                        token_id = t.id
                        _AI_TOKEN_CACHE[token] = token_id
                        break
        
        log_data = {
            "token_id": token_id,
            "is_env_token": is_env_token,
            "model_name": model_name,
            "status": "success" if success else "error",
            "error_details": error_details,
            # Явно используем серверное время
            "timestamp": datetime.now()
        }
        
        log_crud.create_log(db, log_data)
        
    except Exception as e:
        print(f"AI LOGGING ERROR: Failed to write log: {e}")
    finally:
        db.close()

def get_logs(
    db: Session, 
    page: int = 1, 
    page_size: int = 50,
    token_ids: Optional[List[str]] = None,
    search_query: Optional[str] = None,
    status: Optional[str] = 'all'
):
    items = log_crud.get_logs(db, page, page_size, token_ids, search_query, status)
    total = log_crud.get_logs_count(db, token_ids, search_query, status)
    
    return {
        "items": items,
        "total_count": total,
        "page": page,
        "page_size": page_size
    }

def clear_logs(db: Session, token_id: str = None):
    log_crud.clear_logs(db, token_id)

def get_stats(db: Session, token_id: str):
    """Получает агрегированную статистику по AI токену."""
    results = log_crud.get_aggregated_stats(db, token_id)
    
    items = []
    total_requests = 0
    success_count = 0
    error_count = 0
    
    for r in results:
        # r: (model_name, status, count, last_used)
        count = r[2]
        status = r[1]
        
        total_requests += count
        if status == 'success':
            success_count += count
        else:
            error_count += count
            
        items.append({
            "method": r[0], # model_name мапим в method для совместимости с фронтом
            "status": status,
            "count": count,
            "last_used": r[3].isoformat() if r[3] else None
        })
        
    return {
        "total_requests": total_requests,
        "success_count": success_count,
        "error_count": error_count,
        "items": items
    }

def get_chart_data(db: Session, token_id: str, granularity: str, metric: str):
    """
    Формирует данные для графика использования AI токена.
    """
    # ИСПОЛЬЗУЕМ ЛОКАЛЬНОЕ СЕРВЕРНОЕ ВРЕМЯ
    now = datetime.now()
    
    # Настройка периода
    if granularity == 'hour':
        date_from = now - timedelta(minutes=60)
        delta = timedelta(minutes=1)
        time_format = '%H:%M'
        current = date_from.replace(second=0, microsecond=0)
    elif granularity == 'day':
        date_from = now - timedelta(hours=24)
        delta = timedelta(hours=1)
        time_format = '%H:00'
        current = date_from.replace(minute=0, second=0, microsecond=0)
    elif granularity == 'week':
        date_from = now - timedelta(days=6)
        delta = timedelta(days=1)
        time_format = '%d.%m'
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)
    elif granularity == 'month':
        date_from = now - timedelta(days=29)
        delta = timedelta(days=1)
        time_format = '%d.%m'
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        date_from = now - timedelta(days=7)
        delta = timedelta(days=1)
        time_format = '%Y-%m-%d'
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)

    raw_logs = log_crud.get_logs_for_chart(db, token_id, date_from, status=metric)
    
    result_map: Dict[str, Dict[str, int]] = {}
    end_time = now
    
    while current <= end_time + delta:
        key = current.strftime(time_format)
        if key not in result_map:
            result_map[key] = {}
        current += delta

    for log in raw_logs:
        # log: (timestamp, model_name, status)
        ts = log[0]
        model_name = log[1]
        key = ts.strftime(time_format)
        
        if key in result_map:
            if model_name not in result_map[key]:
                result_map[key][model_name] = 0
            result_map[key][model_name] += 1
            
    chart_data = []
    
    # Восстанавливаем порядок
    if granularity == 'hour':
        current = date_from.replace(second=0, microsecond=0)
    elif granularity == 'day':
        current = date_from.replace(minute=0, second=0, microsecond=0)
    else:
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)
        
    keys_processed = set()
    while len(chart_data) < len(result_map):
        key = current.strftime(time_format)
        if key in result_map and key not in keys_processed:
            chart_data.append({
                "date": key,
                "methods": result_map[key] # "methods" используется на фронте как мапа значений
            })
            keys_processed.add(key)
        current += delta
        if current > end_time + timedelta(days=1): break
        
    return chart_data
