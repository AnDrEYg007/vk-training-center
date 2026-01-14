
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, not_
from typing import List, Optional, Any
import re
import time
import models
import services.automations.reviews.crud as crud_automations # Импорт для доступа к ReviewContestEntry

def _apply_filters(
    query: Any,
    list_type: str,
    search_query: Optional[str] = None,
    filter_quality: str = 'all',
    filter_sex: str = 'all',
    filter_online: str = 'any',
    filter_can_write: str = 'all'
) -> Any:
    """
    Внутренняя функция для применения фильтров к запросу SQLAlchemy.
    """
    
    # Определяем модель для корректного обращения к полям
    if list_type == 'mailing':
        model = models.SystemListMailing
    elif list_type == 'subscribers':
        model = models.SystemListSubscriber
    elif list_type == 'history_join':
        model = models.SystemListHistoryJoin
    elif list_type == 'history_leave':
        model = models.SystemListHistoryLeave
    elif list_type == 'likes':
        model = models.SystemListLikes
    elif list_type == 'comments':
        model = models.SystemListComments
    elif list_type == 'reposts':
        model = models.SystemListReposts
    elif list_type == 'reviews_participants' or list_type == 'reviews_winners' or list_type == 'reviews_posts':
        model = models.ReviewContestEntry
    else:
        model = models.SystemListSubscriber # Default fallback

    # 1. Применение фильтров качества, пола и онлайна (только для пользователей)
    if list_type != 'posts' and list_type != 'reviews_posts' and list_type != 'reviews_participants' and list_type != 'reviews_winners':
        # Качество (active, banned, deleted)
        if filter_quality == 'active':
            query = query.filter(model.deactivated.is_(None))
        elif filter_quality == 'banned':
            query = query.filter(model.deactivated == 'banned')
        elif filter_quality == 'deleted':
            query = query.filter(model.deactivated == 'deleted')
            
        # Пол (female, male, unknown)
        # sex: 1 = female, 2 = male, 0 = unknown
        if filter_sex == 'female':
            query = query.filter(model.sex == 1)
        elif filter_sex == 'male':
            query = query.filter(model.sex == 2)
        elif filter_sex == 'unknown':
            query = query.filter(or_(model.sex == 0, model.sex == None))
            
        # Онлайн (today, 3_days, week, month)
        if filter_online != 'any':
            now_ts = int(time.time())
            day_seconds = 86400
            threshold_ts = 0
            
            if filter_online == 'today':
                threshold_ts = now_ts - day_seconds
            elif filter_online == '3_days':
                threshold_ts = now_ts - (3 * day_seconds)
            elif filter_online == 'week':
                threshold_ts = now_ts - (7 * day_seconds)
            elif filter_online == 'month':
                threshold_ts = now_ts - (30 * day_seconds)
                
            if threshold_ts > 0:
                query = query.filter(model.last_seen >= threshold_ts)
                
        # Фильтр "Разрешено писать" (только для mailing)
        if list_type == 'mailing' and filter_can_write != 'all':
            # Используем переменную model, которая уже определена как SystemListMailing выше
            if filter_can_write == 'allowed':
                query = query.filter(model.can_access_closed.is_(True))
            elif filter_can_write == 'forbidden':
                # IS NOT TRUE покрывает и FALSE, и NULL (для старых или битых записей)
                query = query.filter(model.can_access_closed.isnot(True))

    # 2. Логика поиска (текст, ссылки, ID)
    if search_query and search_query.strip():
        search = search_query.strip()
        
        if list_type == 'posts':
            # Для постов ищем по тексту
            query = query.filter(models.SystemListPost.text.ilike(f"%{search}%"))
        elif list_type == 'reviews_posts':
             query = query.filter(models.ReviewContestEntry.post_text.ilike(f"%{search}%"))
        elif list_type == 'reviews_participants' or list_type == 'reviews_winners':
             # Ищем по имени или ID автора отзыва
            if search.isdigit():
                 query = query.filter(models.ReviewContestEntry.user_vk_id == int(search))
            else:
                 query = query.filter(models.ReviewContestEntry.user_name.ilike(f"%{search}%"))
        else:
            # Для пользователей сложнее: ссылка, ID или имя
            # Попытка извлечь ID или screen_name из ссылки
            link_match = re.search(r'(?:vk\.com\/)(id\d+|[\w\.]+)', search)
            
            if link_match:
                identifier = link_match.group(1)
                if identifier.startswith('id') and identifier[2:].isdigit():
                    clean_id = identifier[2:]
                    # Используем поле vk_user_id модели (оно есть у всех user-моделей)
                    query = query.filter(model.vk_user_id == int(clean_id))
                elif list_type == 'subscribers' or list_type == 'mailing' or list_type.startswith('history'): 
                    # Поле domain есть не у всех, но у основных есть
                    if hasattr(model, 'domain'):
                        query = query.filter(model.domain.ilike(f"%{identifier}%"))
            
            elif search.isdigit():
                query = query.filter(or_(
                    model.vk_user_id == int(search),
                    model.first_name.ilike(f"%{search}%"),
                    model.last_name.ilike(f"%{search}%")
                ))
                
            else:
                search_pattern = f"%{search}%"
                criteria = [
                    model.first_name.ilike(search_pattern),
                    model.last_name.ilike(search_pattern)
                ]
                if hasattr(model, 'domain'):
                    criteria.append(model.domain.ilike(search_pattern))
                    
                query = query.filter(or_(*criteria))
    
    return query


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
    filter_can_write: str = 'all'
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
        
        query = _apply_filters(query, list_type, search_query)
        
        offset = (page - 1) * page_size
        entries = query.order_by(models.ReviewContestEntry.created_at.desc()).offset(offset).limit(page_size).all()
        
        # MAPPING TO STANDARD MODELS
        mapped_items = []
        if list_type == 'reviews_posts':
            for entry in entries:
                # Мапим ReviewContestEntry -> SystemListPost
                mapped_items.append(models.SystemListPost(
                    id=entry.id,
                    project_id=project_id,
                    vk_post_id=entry.vk_post_id,
                    date=entry.created_at, # Используем дату создания записи как дату поста
                    text=entry.post_text,
                    image_url=None, # Нет фото в этой модели
                    vk_link=entry.post_link,
                    likes_count=0, comments_count=0, reposts_count=0, views_count=0, # Нет статистики
                    post_author_id=entry.user_vk_id
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
    else:
        model = models.SystemListSubscriber
        date_col = models.SystemListSubscriber.added_at

    query = db.query(model).filter(model.project_id == project_id)
    
    # Применяем фильтры
    query = _apply_filters(query, list_type, search_query, filter_quality, filter_sex, filter_online, filter_can_write)

    offset = (page - 1) * page_size
    return query.order_by(date_col.desc().nulls_last())\
                .offset(offset)\
                .limit(page_size)\
                .all()

def get_subscribers_count(
    db: Session, 
    project_id: str, 
    list_type: str, 
    search_query: Optional[str] = None,
    filter_quality: str = 'all',
    filter_sex: str = 'all',
    filter_online: str = 'any',
    filter_can_write: str = 'all'
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
             
        query = _apply_filters(query, list_type, search_query)
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
    else:
        model = models.SystemListSubscriber

    query = db.query(model).filter(model.project_id == project_id)
    
    # Применяем те же фильтры, включая filter_can_write!
    query = _apply_filters(query, list_type, search_query, filter_quality, filter_sex, filter_online, filter_can_write)
    
    return query.count()
