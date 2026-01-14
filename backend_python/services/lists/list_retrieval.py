
from sqlalchemy.orm import Session
from typing import Optional
import crud
from .retrieval.fetchers import fetch_list_items, fetch_list_count

# Этот файл теперь является Фасадом (Hub), который объединяет
# логику из подмодулей пакета `retrieval`.

def get_list_meta(db: Session, project_id: str):
    return {"meta": crud.get_list_meta(db, project_id)}

def get_list_stats(db: Session, project_id: str, list_type: str, period: str = 'all', group_by: str = 'month', date_from: Optional[str] = None, date_to: Optional[str] = None, filter_can_write: str = 'all'):
    return crud.get_list_stats_data(db, project_id, list_type, period, group_by, date_from, date_to, filter_can_write)

def get_subscribers(
    db: Session, 
    project_id: str, 
    list_type: str, 
    page: int, 
    page_size: int, 
    search_query: Optional[str] = None, 
    filter_quality: str = 'all', 
    filter_sex: str = 'all', 
    filter_online: str = 'any', 
    filter_can_write: str = 'all',
    filter_bdate_month: str = 'any', # NEW
    filter_platform: str = 'any', # NEW
    filter_age: str = 'any' # NEW
):
    items = fetch_list_items(db, project_id, list_type, page, page_size, search_query, filter_quality, filter_sex, filter_online, filter_can_write, filter_bdate_month, filter_platform, filter_age)
    total = fetch_list_count(db, project_id, list_type, search_query, filter_quality, filter_sex, filter_online, filter_can_write, filter_bdate_month, filter_platform, filter_age)
    meta = crud.get_list_meta(db, project_id)
    return {"meta": meta, "items": items, "total_count": total, "page": page, "page_size": page_size}

def get_posts(db: Session, project_id: str, page: int, search_query: Optional[str] = None):
    items = fetch_list_items(db, project_id, 'posts', page, 50, search_query)
    total = fetch_list_count(db, project_id, 'posts', search_query)
    meta = crud.get_list_meta(db, project_id)
    return {"meta": meta, "items": items, "total_count": total, "page": page, "page_size": 50}

def get_interactions(
    db: Session, 
    project_id: str, 
    list_type: str, 
    page: int, 
    search_query: Optional[str] = None, 
    filter_quality: str = 'all', 
    filter_sex: str = 'all', 
    filter_online: str = 'any',
    filter_bdate_month: str = 'any', # NEW
    filter_platform: str = 'any', # NEW
    filter_age: str = 'any' # NEW
):
    items = fetch_list_items(db, project_id, list_type, page, 50, search_query, filter_quality, filter_sex, filter_online, 'all', filter_bdate_month, filter_platform, filter_age)
    total = fetch_list_count(db, project_id, list_type, search_query, filter_quality, filter_sex, filter_online, 'all', filter_bdate_month, filter_platform, filter_age)
    meta = crud.get_list_meta(db, project_id)
    return {"meta": meta, "items": items, "total_count": total, "page": page, "page_size": 50}
