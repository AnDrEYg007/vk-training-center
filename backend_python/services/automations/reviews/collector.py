
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import uuid

import crud
import models
import services.automations.reviews.crud as crud_automations
from services import vk_service
from config import settings

def collect_participants(db: Session, project_id: str) -> dict:
    """
    Сканирует SystemListPost, находит подходящие посты, 
    дозапрашивает данные об авторах из VK и сохраняет участников.
    """
    
    # 0. Проверка свежести базы постов (SystemListPost)
    # Если база старая (> 12 часов) или отсутствует, обновляем последние 100 постов,
    # чтобы гарантировать наличие свежих отзывов.
    meta = crud.get_list_meta(db, project_id)
    is_stale = True
    
    if meta.posts_last_updated:
        try:
            # Обработка формата ISO
            last_update_str = meta.posts_last_updated
            if 'T' in last_update_str:
                last_update = datetime.fromisoformat(last_update_str.replace('Z', '+00:00'))
            else:
                 # Fallback для старых форматов или если что-то пошло не так
                 try:
                     last_update = datetime.strptime(last_update_str, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
                 except:
                     last_update = datetime.min.replace(tzinfo=timezone.utc)
            
            if datetime.now(timezone.utc) - last_update < timedelta(hours=12):
                is_stale = False
        except Exception as e:
             print(f"CONTEST: Date parse error in freshness check: {e}")
             is_stale = True
    
    if is_stale:
        print(f"CONTEST: Posts cache is stale or missing for project {project_id}. Triggering refresh (100 latest)...")
        # Импортируем здесь, чтобы избежать циклических зависимостей
        from services import post_retrieval_service
        try:
            post_retrieval_service.refresh_published_posts(db, project_id, settings.vk_user_token)
            print("CONTEST: Refresh completed successfully.")
        except Exception as e:
            print(f"CONTEST: Warning - Refresh failed: {e}. Proceeding with existing cache.")


    # 1. Получаем настройки конкурса
    contest = crud_automations.get_contest_settings(db, project_id)
    if not contest:
        return {"added": 0, "message": "Настройки конкурса не найдены"}
    
    if not contest.keywords or not contest.start_date:
        return {"added": 0, "message": "Не заданы ключевые слова или дата старта"}

    # 2. Подготовка фильтров
    keyword = contest.keywords.strip().lower()
    # Обработка формата даты
    try:
        if 'T' in contest.start_date:
             start_dt = datetime.fromisoformat(contest.start_date.replace('Z', '+00:00'))
        else:
             # Fallback для YYYY-MM-DD
             start_dt = datetime.strptime(contest.start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except ValueError:
        return {"added": 0, "message": "Некорректный формат даты старта в настройках"}
    
    # 3. Ищем кандидатов в локальной базе постов (SystemListPost)
    print(f"CONTEST: Searching candidates in SystemListPost for project {project_id}...")
    candidates = db.query(models.SystemListPost).filter(
        models.SystemListPost.project_id == project_id,
        models.SystemListPost.date >= start_dt,
        models.SystemListPost.text.ilike(f"%{keyword}%")
    ).all()
    
    if not candidates:
        return {"added": 0, "message": "Посты по критериям не найдены в базе"}

    # 4. Фильтруем тех, кто уже участвует
    existing_entries = db.query(models.ReviewContestEntry.vk_post_id).filter(
        models.ReviewContestEntry.contest_id == contest.id
    ).all()
    existing_vk_ids = {e[0] for e in existing_entries}
    
    new_candidates = [p for p in candidates if p.vk_post_id not in existing_vk_ids]
    
    if not new_candidates:
        return {"added": 0, "message": "Все подходящие посты уже добавлены"}

    print(f"CONTEST: Found {len(new_candidates)} new candidates. Fetching authors from VK...")

    # 5. Получаем данные об авторах из VK
    numeric_group_id = vk_service.resolve_vk_group_id(crud.get_project_by_id(db, project_id).vkProjectId, settings.vk_user_token)
    
    # --- НОВАЯ ЛОГИКА ОПРЕДЕЛЕНИЯ АВТОРА ---
    # Мы разделяем кандидатов на тех, у кого автор УЖЕ известен (в post_author_id или signer_id),
    # и тех, у кого нет ни того, ни другого (нужен запрос к VK).
    
    candidates_with_known_author = []
    candidates_need_fetch = []
    
    for p in new_candidates:
        # Приоритет: post_author_id -> signer_id
        author_id = p.post_author_id if p.post_author_id else p.signer_id
        
        if author_id and author_id > 0:
            candidates_with_known_author.append((p, author_id))
        else:
            candidates_need_fetch.append(p)
    
    prepared_data = {} # {vk_post_id: {author_id, ...}}
    user_ids_to_fetch = set()

    # 5.1. Обработка тех, у кого автор известен из базы
    for p, author_id in candidates_with_known_author:
        user_ids_to_fetch.add(author_id)
        prepared_data[p.vk_post_id] = {
            'author_id': author_id,
            'post_id': p.vk_post_id,
            'owner_id': -numeric_group_id,
            'text': p.text
        }

    # 5.2. Обработка тех, у кого автор неизвестен (запрос к wall.getById)
    if candidates_need_fetch:
        post_ids_str = [f"-{numeric_group_id}_{p.vk_post_id}" for p in candidates_need_fetch]
        chunk_size = 100
        all_vk_posts = []
        
        for i in range(0, len(post_ids_str), chunk_size):
            chunk = post_ids_str[i:i + chunk_size]
            try:
                response = vk_service.call_vk_api('wall.getById', {
                    'posts': ",".join(chunk),
                    'access_token': settings.vk_user_token
                })
                all_vk_posts.extend(response if isinstance(response, list) else [])
            except Exception as e:
                print(f"CONTEST: Error fetching posts from VK: {e}")
                continue
                
        for vk_post in all_vk_posts:
            # Приоритет: post_author_data.author -> signer_id -> from_id
            author_id = None
            if 'post_author_data' in vk_post and 'author' in vk_post['post_author_data']:
                author_id = vk_post['post_author_data']['author']
            elif vk_post.get('signer_id'):
                author_id = vk_post.get('signer_id')
            else:
                author_id = vk_post.get('from_id')

            if author_id and author_id > 0:
                user_ids_to_fetch.add(author_id)
                prepared_data[vk_post['id']] = {
                    'author_id': author_id,
                    'post_id': vk_post['id'],
                    'owner_id': vk_post['owner_id'],
                    'text': vk_post.get('text', '')
                }

    # 6. Получаем имена пользователей
    users_map = {}
    if user_ids_to_fetch:
        user_ids_list = list(user_ids_to_fetch)
        chunk_size_users = 1000
        for i in range(0, len(user_ids_list), chunk_size_users):
            chunk_users = user_ids_list[i:i + chunk_size_users]
            try:
                users_resp = vk_service.call_vk_api('users.get', {
                    'user_ids': ",".join(map(str, chunk_users)),
                    'fields': 'photo_100',
                    'access_token': settings.vk_user_token
                })
                for u in users_resp:
                    users_map[u['id']] = u
            except Exception as e:
                print(f"CONTEST: Error fetching users: {e}")

    # 7. Создаем записи
    added_count = 0
    
    for vk_post_id, data in prepared_data.items():
        user = users_map.get(data['author_id'])
        if not user: continue
        
        user_name = f"{user.get('first_name', '')} {user.get('last_name', '')}"
        
        new_entry = models.ReviewContestEntry(
            id=str(uuid.uuid4()),
            contest_id=contest.id,
            vk_post_id=data['post_id'],
            vk_owner_id=data['owner_id'],
            user_vk_id=data['author_id'],
            user_name=user_name,
            user_photo=user.get('photo_100'),
            post_link=f"https://vk.com/wall{data['owner_id']}_{data['post_id']}",
            post_text=data['text'],
            status='new',
            created_at=datetime.utcnow()
        )
        db.add(new_entry)
        added_count += 1
        
    db.commit()
    
    # 8. Обновляем метаданные списков (счетчики)
    if added_count > 0:
        # Участники (не new)
        participants_count = db.query(models.ReviewContestEntry).filter(
            models.ReviewContestEntry.contest_id == contest.id,
            models.ReviewContestEntry.status != 'new'
        ).count()
        # Посты (всего)
        posts_count = db.query(models.ReviewContestEntry).filter(
            models.ReviewContestEntry.contest_id == contest.id
        ).count()
        
        crud.update_list_meta(db, project_id, {
            "reviews_participants_count": participants_count,
            "reviews_posts_count": posts_count
        })

    return {
        "added": added_count, 
        "message": f"Добавлено {added_count} новых участников"
    }
