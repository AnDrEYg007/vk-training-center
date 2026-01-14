
from sqlalchemy import or_, and_
from typing import Optional, Any
import re
import time
import datetime
import models

def apply_filters(
    query: Any,
    list_type: str,
    search_query: Optional[str] = None,
    filter_quality: str = 'all',
    filter_sex: str = 'all',
    filter_online: str = 'any',
    filter_can_write: str = 'all',
    filter_bdate_month: str = 'any', # NEW
    filter_platform: str = 'any', # NEW
    filter_age: str = 'any' # NEW
) -> Any:
    """
    Применяет фильтры к запросу SQLAlchemy в зависимости от типа списка и параметров.
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
    elif list_type == 'authors': # NEW
        model = models.SystemListAuthor
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
        
        # Платформа
        if filter_platform != 'any' and hasattr(model, 'platform'):
            if filter_platform.isdigit():
                 query = query.filter(model.platform == int(filter_platform))
            elif filter_platform == 'unknown':
                 query = query.filter(model.platform.is_(None))
        
        # Месяц рождения
        if filter_bdate_month != 'any' and hasattr(model, 'bdate'):
             if filter_bdate_month == 'unknown':
                  query = query.filter(model.bdate.is_(None))
             elif filter_bdate_month.isdigit():
                  m = filter_bdate_month
                  query = query.filter(or_(
                      model.bdate.like(f'%.{m}.%'),
                      model.bdate.like(f'%.{m}')
                  ))
        
        # Возраст
        if filter_age != 'any' and hasattr(model, 'bdate'):
            if filter_age == 'unknown':
                # Те, у кого нет bdate или bdate без года
                # bdate без года выглядит как "D.M" (2 части), с годом "D.M.YYYY" (3 части)
                query = query.filter(or_(
                    model.bdate.is_(None),
                    model.bdate.notlike('%.%.%') # Нет двух точек
                ))
            else:
                current_year = datetime.datetime.now().year
                min_age = 0
                max_age = 1000
                
                if filter_age == 'u16':
                    max_age = 16
                elif filter_age == '16-20':
                    min_age = 16
                    max_age = 20
                elif filter_age == '20-25':
                    min_age = 20
                    max_age = 25
                elif filter_age == '25-30':
                    min_age = 25
                    max_age = 30
                elif filter_age == '30-35':
                    min_age = 30
                    max_age = 35
                elif filter_age == '35-40':
                    min_age = 35
                    max_age = 40
                elif filter_age == '40-45':
                    min_age = 40
                    max_age = 45
                elif filter_age == '45p':
                    min_age = 45
                
                # Переводим возраст в года рождения
                # Если возраст < 16, значит год рождения > current_year - 16
                # Если 16 <= возраст < 20, значит год рождения <= current - 16 AND > current - 20
                
                # Пример: 2025 год. 
                # u16: age < 16 -> born > 2009 (2010...)
                # 16-20: 16 <= age < 20 -> born <= 2009 AND born > 2005 (2006..2009)
                
                year_max = current_year - min_age # Максимальный год рождения (для минимального возраста)
                year_min = current_year - max_age + 1 # Минимальный год (для макс. возраста, исключая границу)
                
                # Поскольку SQL LIKE для даты строкой сложен для диапазонов,
                # сгенерируем список годов и сделаем OR LIKE
                
                years_to_check = []
                # Ограничим диапазон разумными пределами, если max_age очень большой
                start_check = year_min if year_min > 1900 else 1900 
                end_check = year_max 
                
                if filter_age == 'u16':
                    # Проверяем последние 16 лет
                    start_check = current_year - 16 + 1
                    end_check = current_year
                elif filter_age == '45p':
                    # Проверяем до 1900 года
                    start_check = 1900
                    end_check = current_year - 45
                
                # Создаем условия LIKE для каждого года
                year_conditions = []
                for y in range(start_check, end_check + 1):
                    year_conditions.append(model.bdate.like(f'%{y}'))
                
                if year_conditions:
                    query = query.filter(or_(*year_conditions))
                else:
                    # Невозможный диапазон, ничего не возвращаем
                    query = query.filter(model.id == 'impossible')

        # Фильтр "Разрешено писать" (только для mailing)
        if list_type == 'mailing' and filter_can_write != 'all':
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
                    query = query.filter(model.vk_user_id == int(clean_id))
                elif list_type == 'subscribers' or list_type == 'mailing' or list_type.startswith('history') or list_type == 'authors': 
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
