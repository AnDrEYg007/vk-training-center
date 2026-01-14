
from typing import Dict, List, Set
import models

def process_phase_1_results(
    results: List[Dict], 
    chunk: List[models.SystemListPost], 
    likes_acc: Dict[int, Dict], 
    comments_acc: Dict[int, Dict], 
    reposts_acc: Dict[int, Dict],
    deep_scan_queue: List
):
    """
    Обрабатывает результаты пакетного запроса (Фаза 1).
    Агрегирует данные в аккумуляторы и наполняет очередь для глубокого сканирования.
    """
    # В текущей реализации эта функция является заглушкой,
    # так как вся логика обработки перенесена в вызывающий код (sync_task.py),
    # который вызывает process_interaction_items для каждого результата.
    pass

def process_interaction_items(
    items: List[Dict],
    profiles_map: Dict[int, Dict],
    type_: str,
    post_obj: models.SystemListPost,
    likes_acc: Dict[int, Dict], 
    comments_acc: Dict[int, Dict], 
    reposts_acc: Dict[int, Dict]
):
    """
    Универсальная функция обновления аккумулятора.
    Маппит данные из ответа VK (post/comment/repost items + profiles) в структуру БД.
    """
    
    target_acc = likes_acc if type_ == 'likes' else (comments_acc if type_ == 'comments' else reposts_acc)
    
    for item in items:
        uid = 0
        user_data = {}
        
        if type_ == 'likes':
            # В likes.getList с extended=1 элементы в items и есть объекты пользователей
            uid = item.get('id')
            user_data = item
        elif type_ == 'comments' or type_ == 'reposts':
            # В comments/reposts элементы - это посты/комменты, а инфо о юзере в profiles
            uid = item.get('from_id')
            # from_id может быть отрицательным (группа), такие пропускаем
            if uid and uid > 0:
                user_data = profiles_map.get(uid, {})
        
        # Пропускаем группы (id < 0) и пустые ID
        if not uid or uid < 0: continue
        
        # Извлекаем расширенные данные
        # Безопасная обработка вложенных структур (city, country, last_seen)
        city_title = None
        if user_data.get('city') and isinstance(user_data.get('city'), dict):
            city_title = user_data.get('city').get('title')
            
        country_title = None
        if user_data.get('country') and isinstance(user_data.get('country'), dict):
            country_title = user_data.get('country').get('title')
            
        last_seen_time = None
        platform = None
        if user_data.get('last_seen') and isinstance(user_data.get('last_seen'), dict):
            last_seen_time = user_data.get('last_seen').get('time')
            platform = user_data.get('last_seen').get('platform')

        # Структура данных для сохранения
        entry_data = {
            'vk_user_id': uid,
            'first_name': user_data.get('first_name', 'Unknown'),
            'last_name': user_data.get('last_name', ''),
            'photo_url': user_data.get('photo_100'),
            'sex': user_data.get('sex'),
            'domain': user_data.get('domain'),
            'bdate': user_data.get('bdate'),
            'city': city_title,
            'country': country_title,
            'has_mobile': bool(user_data.get('has_mobile')),
            'last_seen': last_seen_time,
            'platform': platform,
            'deactivated': user_data.get('deactivated'),
            'is_closed': user_data.get('is_closed'),
            'can_access_closed': user_data.get('can_access_closed'),
            # Поля активности
            'post_ids': set(),
            'last_interaction_date': post_obj.date,
            'last_post_id': post_obj.id
        }
        
        if uid not in target_acc:
            # Новый пользователь в аккумуляторе
            target_acc[uid] = entry_data
        else:
            # Пользователь уже есть в аккумуляторе (несколько действий за проход)
            # Обновляем метаданные активности
            existing = target_acc[uid]
            if post_obj.date > existing['last_interaction_date']:
                existing['last_interaction_date'] = post_obj.date
                existing['last_post_id'] = post_obj.id
            
            # Обновляем профиль данными из более свежего события (если они есть)
            # Это полезно, если в одном батче попались данные с разной полнотой
            if entry_data['first_name'] and entry_data['first_name'] != 'Unknown':
                 existing['first_name'] = entry_data['first_name']
                 existing['last_name'] = entry_data['last_name']
                 existing['photo_url'] = entry_data['photo_url']
                 # Обновляем детальные поля, если они пришли не пустыми
                 if entry_data['city']: existing['city'] = entry_data['city']
                 if entry_data['bdate']: existing['bdate'] = entry_data['bdate']
                 if entry_data['platform']: existing['platform'] = entry_data['platform']
                 if entry_data['last_seen']: existing['last_seen'] = entry_data['last_seen']

        # Добавляем ID поста в сет
        target_acc[uid]['post_ids'].add(post_obj.vk_post_id)
