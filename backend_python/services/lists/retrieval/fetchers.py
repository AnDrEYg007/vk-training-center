
from sqlalchemy.orm import Session
from typing import List, Optional, Any
import models
import services.automations.reviews.crud as crud_automations
from .filters import apply_filters

def fetch_list_items(
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
) -> List[Any]:
    
    # 1. SPECIAL CASE: Automation lists (mapped from ReviewContestEntry)
    if list_type in ['reviews_participants', 'reviews_winners', 'reviews_posts']:
        contest = crud_automations.get_contest_settings(db, project_id)
        if not contest:
            return []
            
        query = db.query(models.ReviewContestEntry).filter(models.ReviewContestEntry.contest_id == contest.id)
        
        if list_type == 'reviews_participants':
             # Участники: Все, кроме статуса 'new' (т.е. обработанные)
             query = query.filter(models.ReviewContestEntry.status != 'new')
        elif list_type == 'reviews_winners':
             # Победители: Статус 'winner'
             query = query.filter(models.ReviewContestEntry.status == 'winner')
        # reviews_posts - берем всех
        
        query = apply_filters(query, list_type, search_query)
        
        offset = (page - 1) * page_size
        entries = query.order_by(models.ReviewContestEntry.created_at.desc()).offset(offset).limit(page_size).all()
        
        # MAPPING TO STANDARD MODELS
        mapped_items = []
        if list_type == 'reviews_posts':
            # Для постов конкурса: подтягиваем полные данные из SystemListPost для красивого отображения
            vk_post_ids = [e.vk_post_id for e in entries]
            
            # Получаем полные данные постов из базы системных списков
            system_posts = db.query(models.SystemListPost).filter(
                models.SystemListPost.project_id == project_id,
                models.SystemListPost.vk_post_id.in_(vk_post_ids)
            ).all()
            
            posts_map = {p.vk_post_id: p for p in system_posts}
            
            for entry in entries:
                # Пытаемся найти полные данные
                full_post = posts_map.get(entry.vk_post_id)
                
                # Мапим ReviewContestEntry + SystemListPost -> SystemListPost для фронтенда
                mapped_items.append(models.SystemListPost(
                    id=entry.id, # Используем ID записи конкурса как уникальный ключ
                    project_id=project_id,
                    vk_post_id=entry.vk_post_id,
                    # Если нашли полный пост - берем его дату, иначе дату создания записи (fallback)
                    date=full_post.date if full_post else entry.created_at,
                    # Текст берем из полного поста (он может быть полнее) или из слепка
                    text=full_post.text if full_post else entry.post_text,
                    # Картинку берем только из полного поста
                    image_url=full_post.image_url if full_post else None,
                    vk_link=entry.post_link,
                    
                    # Статистика из полного поста или 0
                    likes_count=full_post.likes_count if full_post else 0,
                    comments_count=full_post.comments_count if full_post else 0,
                    reposts_count=full_post.reposts_count if full_post else 0,
                    views_count=full_post.views_count if full_post else 0,
                    
                    can_post_comment=full_post.can_post_comment if full_post else True,
                    can_like=full_post.can_like if full_post else True,
                    user_likes=full_post.user_likes if full_post else False,
                    
                    signer_id=full_post.signer_id if full_post else None,
                    post_author_id=entry.user_vk_id, # Автор поста точно известен из записи конкурса
                    
                    last_updated=full_post.last_updated if full_post else entry.created_at
                ))
        else:
            for entry in entries:
                # Мапим ReviewContestEntry -> SystemListSubscriber
                # Разбиваем имя на First/Last
                parts = (entry.user_name or "").split(' ', 1)
                first = parts[0]
                last = parts[1] if len(parts) > 1 else ""
                
                mapped_items.append(models.SystemListSubscriber(
                    id=entry.id,
                    project_id=project_id,
                    vk_user_id=entry.user_vk_id,
                    first_name=first,
                    last_name=last,
                    sex=0, # Нет данных
                    photo_url=entry.user_photo,
                    added_at=entry.created_at,
                    source=f"contest:{entry.status}"
                ))
                
        return mapped_items

    # 2. STANDARD CASE
    if list_type == 'history_join':
        model = models.SystemListHistoryJoin
        date_col = models.SystemListHistoryJoin.event_date
    elif list_type == 'history_leave':
        model = models.SystemListHistoryLeave
        date_col = models.SystemListHistoryLeave.event_date
    elif list_type == 'posts':
        model = models.SystemListPost
        date_col = models.SystemListPost.date
    elif list_type == 'likes':
        model = models.SystemListLikes
        date_col = models.SystemListLikes.last_interaction_date
    elif list_type == 'comments':
        model = models.SystemListComments
        date_col = models.SystemListComments.last_interaction_date
    elif list_type == 'reposts':
        model = models.SystemListReposts
        date_col = models.SystemListReposts.last_interaction_date
    elif list_type == 'mailing':
        model = models.SystemListMailing
        date_col = models.SystemListMailing.last_message_date
    elif list_type == 'authors': # NEW
        model = models.SystemListAuthor
        date_col = models.SystemListAuthor.event_date
    else:
        model = models.SystemListSubscriber
        date_col = models.SystemListSubscriber.added_at

    query = db.query(model).filter(model.project_id == project_id)
    
    # Применяем фильтры
    query = apply_filters(query, list_type, search_query, filter_quality, filter_sex, filter_online, filter_can_write, filter_bdate_month, filter_platform, filter_age)

    offset = (page - 1) * page_size
    return query.order_by(date_col.desc().nulls_last())\
                .offset(offset)\
                .limit(page_size)\
                .all()

def fetch_list_count(
    db: Session, 
    project_id: str, 
    list_type: str, 
    search_query: Optional[str] = None,
    filter_quality: str = 'all',
    filter_sex: str = 'all',
    filter_online: str = 'any',
    filter_can_write: str = 'all',
    filter_bdate_month: str = 'any', # NEW
    filter_platform: str = 'any', # NEW
    filter_age: str = 'any' # NEW
) -> int:
    """
    Возвращает количество записей, соответствующих фильтрам.
    """
    # 1. SPECIAL CASE: Automation lists
    if list_type in ['reviews_participants', 'reviews_winners', 'reviews_posts']:
        contest = crud_automations.get_contest_settings(db, project_id)
        if not contest: return 0
        
        query = db.query(models.ReviewContestEntry).filter(models.ReviewContestEntry.contest_id == contest.id)
        
        if list_type == 'reviews_participants':
             query = query.filter(models.ReviewContestEntry.status != 'new')
        elif list_type == 'reviews_winners':
             query = query.filter(models.ReviewContestEntry.status == 'winner')
             
        query = apply_filters(query, list_type, search_query)
        return query.count()

    # 2. STANDARD CASE
    if list_type == 'history_join':
        model = models.SystemListHistoryJoin
    elif list_type == 'history_leave':
        model = models.SystemListHistoryLeave
    elif list_type == 'posts':
        model = models.SystemListPost
    elif list_type == 'likes':
        model = models.SystemListLikes
    elif list_type == 'comments':
        model = models.SystemListComments
    elif list_type == 'reposts':
        model = models.SystemListReposts
    elif list_type == 'mailing':
        model = models.SystemListMailing
    elif list_type == 'authors': # NEW
        model = models.SystemListAuthor
    else:
        model = models.SystemListSubscriber

    query = db.query(model).filter(model.project_id == project_id)
    
    # Применяем те же фильтры, включая filter_can_write!
    query = apply_filters(query, list_type, search_query, filter_quality, filter_sex, filter_online, filter_can_write, filter_bdate_month, filter_platform, filter_age)
    
    return query.count()
