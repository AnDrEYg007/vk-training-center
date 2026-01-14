
# Этот файл теперь выступает в роли "хаба" (Facade), объединяя функциональность
# нескольких специализированных модулей для работы с системными списками.

from sqlalchemy.orm import Session
import crud
import models
import services.automations.reviews.crud as crud_automations

from .list_retrieval import (
    get_list_meta,
    get_list_stats,
    get_subscribers,
    get_posts,
    get_interactions
)

from .list_sync_subscribers import refresh_subscribers_task, refresh_subscriber_details_task
from .list_sync_history import refresh_history_details_task
from .list_sync_posts import refresh_posts_task
from .list_sync_interactions import refresh_interactions_task, refresh_interaction_users_task
from .list_sync_mailing import refresh_mailing_task
from .list_sync_mailing_analysis import refresh_mailing_analysis_task
from .list_sync_authors import refresh_author_details_task


def clear_list_data(db: Session, project_id: str, list_type: str):
    """
    Очищает данные конкретного списка для проекта и сбрасывает соответствующие счетчики.
    """
    print(f"SERVICE: Clearing list data for project {project_id}, type: {list_type}")
    meta_updates = {}
    
    if list_type == 'subscribers':
        crud.delete_all_subscribers(db, project_id)
        meta_updates = {"subscribers_count": 0, "subscribers_last_updated": None}
        
    elif list_type == 'history_join':
        crud.delete_all_history_join(db, project_id)
        meta_updates = {"history_join_count": 0, "history_join_last_updated": None}
        
    elif list_type == 'history_leave':
        crud.delete_all_history_leave(db, project_id)
        meta_updates = {"history_leave_count": 0, "history_leave_last_updated": None}
        
    elif list_type == 'mailing':
        crud.delete_all_mailing(db, project_id)
        meta_updates = {"mailing_count": 0, "mailing_last_updated": None}
        
    elif list_type == 'posts':
        crud.delete_all_posts(db, project_id)
        meta_updates = {
            "posts_count": 0, 
            "stored_posts_count": 0, 
            "posts_last_updated": None
        }
    
    elif list_type == 'authors': # NEW
        crud.delete_all_authors(db, project_id)
        meta_updates = {
            "authors_count": 0,
            "authors_last_updated": None
        }
        
    elif list_type == 'likes':
        crud.delete_all_interactions(db, project_id, 'likes')
        meta_updates = {"likes_count": 0, "likes_last_updated": None}
        
    elif list_type == 'comments':
        crud.delete_all_interactions(db, project_id, 'comments')
        meta_updates = {"comments_count": 0, "comments_last_updated": None}
        
    elif list_type == 'reposts':
        crud.delete_all_interactions(db, project_id, 'reposts')
        meta_updates = {"reposts_count": 0, "reposts_last_updated": None}
    
    elif list_type in ['reviews_winners', 'reviews_participants', 'reviews_posts']:
        # Для автоматизаций очистка списка равносильна сбросу всех участников
        crud_automations.delete_contest_entries(db, project_id)
        meta_updates = {
            "reviews_participants_count": 0,
            "reviews_winners_count": 0,
            "reviews_posts_count": 0
        }
        
    if meta_updates:
        crud.update_list_meta(db, project_id, meta_updates)
    
    print(f"SERVICE: Clear complete for {list_type}.")
