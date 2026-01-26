
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, func, and_
import models
from typing import List, Optional, Dict
from datetime import datetime

def create_log(db: Session, log_data: dict):
    """Создает запись в логе."""
    db_log = models.TokenLog(**log_data)
    db.add(db_log)
    db.commit()
    return db_log

def _apply_filters(query, account_ids: Optional[List[str]], search_query: Optional[str], status: Optional[str]):
    """Вспомогательная функция для применения фильтров."""
    if account_ids:
        conditions = []
        if 'env' in account_ids:
            conditions.append(models.TokenLog.is_env_token == True)
        
        uuids = [id for id in account_ids if id != 'env']
        if uuids:
            conditions.append(models.TokenLog.account_id.in_(uuids))
        
        if conditions:
            query = query.filter(or_(*conditions))
    
    if status and status != 'all':
        query = query.filter(models.TokenLog.status == status)
        
    if search_query:
        search = f"%{search_query}%"
        query = query.filter(or_(
            models.TokenLog.method.ilike(search),
            models.TokenLog.error_details.ilike(search),
            models.TokenLog.project_id.ilike(search)
        ))
    return query

def get_logs(
    db: Session, 
    page: int, 
    page_size: int, 
    account_ids: Optional[List[str]] = None,
    search_query: Optional[str] = None,
    status: Optional[str] = 'all'
) -> List[models.TokenLog]:
    """Получает логи с пагинацией и фильтрацией."""
    query = db.query(models.TokenLog)
    query = _apply_filters(query, account_ids, search_query, status)
    return query.order_by(desc(models.TokenLog.timestamp)).offset((page - 1) * page_size).limit(page_size).all()

def get_logs_count(
    db: Session, 
    account_ids: Optional[List[str]] = None,
    search_query: Optional[str] = None,
    status: Optional[str] = 'all'
) -> int:
    """Получает общее количество логов."""
    query = db.query(models.TokenLog)
    query = _apply_filters(query, account_ids, search_query, status)
    return query.count()

def clear_logs(db: Session, account_id: str = None):
    """Очищает логи (все или по конкретному аккаунту)."""
    query = db.query(models.TokenLog)
    
    if account_id == 'env':
        query = query.filter(models.TokenLog.is_env_token == True)
    elif account_id:
        query = query.filter(models.TokenLog.account_id == account_id)
        
    query.delete(synchronize_session=False)
    db.commit()

def delete_log(db: Session, log_id: str):
    """Удаляет одну запись лога по ID."""
    db.query(models.TokenLog).filter(models.TokenLog.id == log_id).delete(synchronize_session=False)
    db.commit()

def delete_logs_batch(db: Session, log_ids: List[str]):
    """Удаляет несколько записей логов по списку ID."""
    db.query(models.TokenLog).filter(models.TokenLog.id.in_(log_ids)).delete(synchronize_session=False)
    db.commit()

def get_aggregated_stats(db: Session, account_id: str):
    """
    Агрегирует статистику по токену: общее кол-во, успех/ошибка,
    детализация по (метод, проект, статус).
    """
    query = db.query(
        models.TokenLog.method,
        models.TokenLog.project_id,
        models.TokenLog.status,
        func.count(models.TokenLog.id).label('count'),
        func.max(models.TokenLog.timestamp).label('last_used')
    )

    if account_id == 'env':
        query = query.filter(models.TokenLog.is_env_token == True)
    else:
        query = query.filter(models.TokenLog.account_id == account_id)
    
    # Группировка
    results = query.group_by(
        models.TokenLog.method,
        models.TokenLog.project_id,
        models.TokenLog.status
    ).order_by(desc('count')).all()
    
    return results

def get_all_stats_map(db: Session) -> Dict[str, Dict[str, int]]:
    """
    Возвращает карту статистики для ВСЕХ токенов (включая ENV).
    Format: { 'account_uuid': {'success': 10, 'error': 2}, 'env': {'success': 5, 'error': 0} }
    """
    query = db.query(
        models.TokenLog.account_id,
        models.TokenLog.is_env_token,
        models.TokenLog.status,
        func.count(models.TokenLog.id)
    ).group_by(
        models.TokenLog.account_id,
        models.TokenLog.is_env_token,
        models.TokenLog.status
    )
    
    results = query.all()
    
    stats_map = {}
    
    for account_id, is_env_token, status, count in results:
        key = 'env' if is_env_token else account_id
        if not key: continue
        
        if key not in stats_map:
            stats_map[key] = {'success': 0, 'error': 0}
        
        if status == 'success':
            stats_map[key]['success'] += count
        else:
            stats_map[key]['error'] += count
            
    return stats_map

def get_logs_for_chart(
    db: Session, 
    account_id: str, 
    date_from: datetime,
    project_id: Optional[str] = None,
    status: Optional[str] = None
) -> List[models.TokenLog]:
    """
    Выбирает сырые логи для построения графика. 
    Агрегация по времени выполняется в сервисе (Python), чтобы избежать
    зависимости от диалекта SQL (strftime vs date_trunc).
    """
    query = db.query(
        models.TokenLog.timestamp,
        models.TokenLog.method,
        models.TokenLog.status
    )

    if account_id == 'env':
        query = query.filter(models.TokenLog.is_env_token == True)
    else:
        query = query.filter(models.TokenLog.account_id == account_id)

    query = query.filter(models.TokenLog.timestamp >= date_from)

    if project_id and project_id != 'all':
        query = query.filter(models.TokenLog.project_id == project_id)
    
    if status and status != 'total':
        query = query.filter(models.TokenLog.status == status)

    # Сортируем по времени, чтобы упростить агрегацию
    return query.order_by(models.TokenLog.timestamp.asc()).all()
