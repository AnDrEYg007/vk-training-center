
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import crud.token_log_crud as log_crud
import crud.system_accounts.account_crud as account_crud
from config import settings
from database import SessionLocal

# Кеш токенов для быстрой проверки (token -> account_id)
_TOKEN_CACHE = {}

def log_api_call(token: str, method: str, project_id: str = None, success: bool = True, error_details: str = None):
    """
    Основная функция логирования. Вызывается из api_client.
    Определяет владельца токена и пишет лог в БД в отдельной сессии.
    """
    db = SessionLocal()
    try:
        account_id = None
        is_env_token = False
        
        # 1. Проверка на ENV токен
        if token == settings.vk_user_token:
            is_env_token = True
        
        # 2. Если не ENV, ищем в системных аккаунтах
        if not is_env_token:
            # Проверяем кеш
            if token in _TOKEN_CACHE:
                account_id = _TOKEN_CACHE[token]
            else:
                # Ищем в БД
                accounts = account_crud.get_all_accounts(db)
                for acc in accounts:
                    if acc.token == token:
                        account_id = acc.id
                        _TOKEN_CACHE[token] = account_id
                        break
        
        log_data = {
            "account_id": account_id,
            "is_env_token": is_env_token,
            "project_id": project_id,
            "method": method,
            "status": "success" if success else "error",
            "error_details": error_details,
            # Явно используем серверное время, вместо func.now(), которое может быть UTC
            "timestamp": datetime.now()
        }
        
        log_crud.create_log(db, log_data)
        
    except Exception as e:
        print(f"LOGGING ERROR: Failed to write token log: {e}")
    finally:
        db.close()

def get_logs(
    db: Session, 
    page: int = 1, 
    page_size: int = 50,
    account_ids: Optional[List[str]] = None,
    search_query: Optional[str] = None,
    status: Optional[str] = 'all'
):
    items = log_crud.get_logs(db, page, page_size, account_ids, search_query, status)
    total = log_crud.get_logs_count(db, account_ids, search_query, status)
    
    return {
        "items": items,
        "total_count": total,
        "page": page,
        "page_size": page_size
    }

def clear_logs(db: Session, account_id: str = None):
    log_crud.clear_logs(db, account_id)

def delete_log(db: Session, log_id: str):
    """Удаляет одну запись лога."""
    log_crud.delete_log(db, log_id)

def delete_logs_batch(db: Session, log_ids: List[str]):
    """Удаляет несколько записей логов."""
    log_crud.delete_logs_batch(db, log_ids)

def get_stats(db: Session, account_id: str):
    """Получает агрегированную статистику по аккаунту."""
    results = log_crud.get_aggregated_stats(db, account_id)
    
    items = []
    total_requests = 0
    success_count = 0
    error_count = 0
    
    for r in results:
        # r: (method, project_id, status, count, last_used)
        count = r[3]
        status = r[2]
        
        total_requests += count
        if status == 'success':
            success_count += count
        else:
            error_count += count
            
        items.append({
            "method": r[0],
            "project_id": r[1],
            "status": status,
            "count": count,
            "last_used": r[4].isoformat() if r[4] else None
        })
        
    return {
        "total_requests": total_requests,
        "success_count": success_count,
        "error_count": error_count,
        "items": items
    }

def get_chart_data(db: Session, account_id: str, granularity: str, project_id: Optional[str], metric: str):
    """
    Формирует данные для графика, агрегируя их по времени.
    granularity определяет временное окно и шаг:
    - 'hour':  последние 60 минут, шаг 1 минута.
    - 'day':   последние 24 часа, шаг 1 час.
    - 'week':  последние 7 дней, шаг 1 день.
    - 'month': последние 30 дней, шаг 1 день.
    """
    # ИСПОЛЬЗУЕМ ЛОКАЛЬНОЕ СЕРВЕРНОЕ ВРЕМЯ
    now = datetime.now()
    
    # Настройка периода и шага группировки
    if granularity == 'hour':
        # Данные за последний час, разбивка по минутам
        date_from = now - timedelta(minutes=60)
        delta = timedelta(minutes=1)
        time_format = '%H:%M'
        # Округляем start_time до минуты
        current = date_from.replace(second=0, microsecond=0)
        
    elif granularity == 'day':
        # Данные за последние 24 часа, разбивка по часам
        date_from = now - timedelta(hours=24)
        delta = timedelta(hours=1)
        time_format = '%H:00'
        # Округляем до часа
        current = date_from.replace(minute=0, second=0, microsecond=0)
        
    elif granularity == 'week':
        # Данные за последние 7 дней, разбивка по дням
        date_from = now - timedelta(days=6) # включая сегодня = 7 дней
        delta = timedelta(days=1)
        time_format = '%d.%m'
        # Округляем до дня
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)
        
    elif granularity == 'month':
        # Данные за последние 30 дней, разбивка по дням
        date_from = now - timedelta(days=29) # включая сегодня = 30 дней
        delta = timedelta(days=1)
        time_format = '%d.%m'
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)
        
    else:
        # Default fallback (Week)
        date_from = now - timedelta(days=7)
        delta = timedelta(days=1)
        time_format = '%Y-%m-%d'
        current = date_from.replace(hour=0, minute=0, second=0, microsecond=0)

    # Получаем сырые данные за этот период
    raw_logs = log_crud.get_logs_for_chart(db, account_id, date_from, project_id, metric)
    
    # Агрегация в памяти
    # result_map: { "14:35": { "wall.get": 10, "users.get": 5 } }
    result_map: Dict[str, Dict[str, int]] = {}
    
    # Инициализируем временную шкалу нулями, чтобы график был непрерывным
    # Цикл идет до текущего момента включительно
    end_time = now
    
    # Для точности цикла с datetime используем while
    # Добавляем небольшой запас, чтобы включить текущую минуту/час
    while current <= end_time + delta:
        key = current.strftime(time_format)
        if key not in result_map:
            result_map[key] = {}
        
        current += delta

    for log in raw_logs:
        # log: (timestamp, method, status)
        ts = log[0]
        method = log[1]
        
        # Форматируем ключ времени так же, как при инициализации
        key = ts.strftime(time_format)
        
        # Если лог попал в диапазон (ключ существует), инкрементируем
        if key in result_map:
            if method not in result_map[key]:
                result_map[key][method] = 0
            result_map[key][method] += 1
        
    # Преобразуем в список для фронтенда, сортируя по времени
    chart_data = []
    
    # Для сортировки нам нужно знать порядок ключей.
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
                "methods": result_map[key]
            })
            keys_processed.add(key)
        
        current += delta
        # Safety break to prevent infinite loop if logic drifts
        if current > end_time + timedelta(days=1):
            break
        
    return chart_data
