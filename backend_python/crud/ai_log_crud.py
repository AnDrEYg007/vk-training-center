
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, func
import models
from typing import List, Optional, Dict
from datetime import datetime

def create_log(db: Session, log_data: dict):
    """Создает запись в логе."""
    db_log = models.AiTokenLog(**log_data)
    db.add(db_log)
    db.commit()
    return db_log

def _apply_filters(query, token_ids: Optional[List[str]], search_query: Optional[str], status: Optional[str]):
    """Вспомогательная функция для применения фильтров."""
    if token_ids:
        conditions = []
        if 'env' in token_ids:
            conditions.append(models.AiTokenLog.is_env_token == True)
        
        uuids = [id for id in token_ids if id != 'env']
        if uuids:
            conditions.append(models.AiTokenLog.token_id.in_(uuids))
        
        if conditions:
            query = query.filter(or_(*conditions))
    
    if status and status != 'all':
        query = query.filter(models.AiTokenLog.status == status)
        
    if search_query:
        search = f"%{search_query}%"
        query = query.filter(or_(
            models.AiTokenLog.model_name.ilike(search),
            models.AiTokenLog.error_details.ilike(search)
        ))
    return query

def get_logs(
    db: Session, 
    page: int, 
    page_size: int, 
    token_ids: Optional[List[str]] = None,
    search_query: Optional[str] = None,
    status: Optional[str] = 'all'
) -> List[models.AiTokenLog]:
    """Получает логи с пагинацией и фильтрацией."""
    query = db.query(models.AiTokenLog)
    query = _apply_filters(query, token_ids, search_query, status)
    return query.order_by(desc(models.AiTokenLog.timestamp)).offset((page - 1) * page_size).limit(page_size).all()

def get_logs_count(
    db: Session, 
    token_ids: Optional[List[str]] = None,
    search_query: Optional[str] = None,
    status: Optional[str] = 'all'
) -> int:
    """Получает общее количество логов."""
    query = db.query(models.AiTokenLog)
    query = _apply_filters(query, token_ids, search_query, status)
    return query.count()

def clear_logs(db: Session, token_id: str = None):
    """Очищает логи (все или по конкретному токену)."""
    query = db.query(models.AiTokenLog)
    
    if token_id == 'env':
        query = query.filter(models.AiTokenLog.is_env_token == True)
    elif token_id:
        query = query.filter(models.AiTokenLog.token_id == token_id)
        
    query.delete(synchronize_session=False)
    db.commit()

def delete_log(db: Session, log_id: str):
    """Удаляет одну запись лога по ID."""
    db.query(models.AiTokenLog).filter(models.AiTokenLog.id == log_id).delete(synchronize_session=False)
    db.commit()

def delete_logs_batch(db: Session, log_ids: List[str]):
    """Удаляет несколько записей логов по списку ID."""
    db.query(models.AiTokenLog).filter(models.AiTokenLog.id.in_(log_ids)).delete(synchronize_session=False)
    db.commit()

def get_all_stats_map(db: Session) -> Dict[str, Dict[str, int]]:
    """
    Возвращает карту статистики для ВСЕХ AI токенов.
    Format: { 'token_uuid': {'success': 10, 'error': 2}, 'env': {'success': 5, 'error': 0} }
    """
    query = db.query(
        models.AiTokenLog.token_id,
        models.AiTokenLog.is_env_token,
        models.AiTokenLog.status,
        func.count(models.AiTokenLog.id)
    ).group_by(
        models.AiTokenLog.token_id,
        models.AiTokenLog.is_env_token,
        models.AiTokenLog.status
    )
    
    results = query.all()
    
    stats_map = {}
    
    for token_id, is_env_token, status, count in results:
        key = 'env' if is_env_token else token_id
        if not key: continue
        
        if key not in stats_map:
            stats_map[key] = {'success': 0, 'error': 0}
        
        if status == 'success':
            stats_map[key]['success'] += count
        else:
            stats_map[key]['error'] += count
            
    return stats_map

def get_aggregated_stats(db: Session, token_id: str):
    """
    Агрегирует статистику по токену: общее кол-во, детализация по моделям.
    """
    query = db.query(
        models.AiTokenLog.model_name,
        models.AiTokenLog.status,
        func.count(models.AiTokenLog.id).label('count'),
        func.max(models.AiTokenLog.timestamp).label('last_used')
    )

    if token_id == 'env':
        query = query.filter(models.AiTokenLog.is_env_token == True)
    else:
        query = query.filter(models.AiTokenLog.token_id == token_id)
    
    results = query.group_by(
        models.AiTokenLog.model_name,
        models.AiTokenLog.status
    ).order_by(desc('count')).all()
    
    return results

def get_logs_for_chart(
    db: Session, 
    token_id: str, 
    date_from: datetime,
    status: Optional[str] = None
) -> List[models.AiTokenLog]:
    """
    Выбирает сырые логи для построения графика.
    """
    query = db.query(
        models.AiTokenLog.timestamp,
        models.AiTokenLog.model_name,
        models.AiTokenLog.status
    )

    if token_id == 'env':
        query = query.filter(models.AiTokenLog.is_env_token == True)
    else:
        query = query.filter(models.AiTokenLog.token_id == token_id)

    query = query.filter(models.AiTokenLog.timestamp >= date_from)

    if status and status != 'total':
        query = query.filter(models.AiTokenLog.status == status)

    return query.order_by(models.AiTokenLog.timestamp.asc()).all()
