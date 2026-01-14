
import json
import time
import concurrent.futures
from datetime import datetime, timezone
from typing import List, Dict, Any

import crud
import models
from services import vk_service, task_monitor
from services.post_helpers import get_rounded_timestamp
from services.vk_api.api_client import call_vk_api as raw_vk_call
from database import SessionLocal
# Импортируем утилиты для получения токенов и скачивания юзеров
from .list_sync_utils import get_all_project_tokens, fetch_users_smart_parallel

EXECUTE_BATCH_SIZE = 200

def _fetch_batch_execute(tokens: List[str], chunk_index: int, owner_id: str, offset: int, count_to_fetch: int, project_id: str) -> List[Dict]:
    """
    Вспомогательная функция, выполняемая в отдельном потоке.
    """
    if not tokens:
        return []

    num_tokens = len(tokens)
    primary_index = chunk_index % num_tokens
    rotation_order = tokens[primary_index:] + tokens[:primary_index]

    iterations = (count_to_fetch + 99) // 100
    
    code = f"""
    var owner_id = {owner_id};
    var offset = {offset};
    var iterations = {iterations};
    var items = [];
    var i = 0;
    
    while (i < iterations) {{
        var resp = API.wall.get({{
            "owner_id": owner_id, 
            "count": 100, 
            "offset": offset + (i * 100),
            "extended": 1 
        }});
        if (resp.items) {{
            items = items + resp.items;
        }}
        i = i + 1;
    }}
    return items;
    """
    
    for token in rotation_order:
        try:
            response = raw_vk_call("execute", {"code": code, "access_token": token}, project_id=project_id)
            result_items = response if isinstance(response, list) else []

            # Строгая проверка на пустоту, если ожидались данные
            if not result_items and count_to_fetch > 0:
                raise Exception(f"Empty response from execute.")

            return result_items
        except Exception as e:
            time.sleep(0.5) 

    # Если все токены упали
    raise Exception(f"All tokens failed for post chunk offset {offset}")

def refresh_posts_task(task_id: str, project_id: str, user_token: str, limit: str = '1000'):
    """
    Фоновая задача обновления постов.
    Использует Split Session.
    """
    
    # --- PHASE 1: PREPARE ---
    project_vk_id = None
    project_name = "Unknown"
    available_tokens = []
    
    db = SessionLocal()
    try:
        project = crud.get_project_by_id(db, project_id)
        if not project:
            task_monitor.update_task(task_id, "error", error="Project not found")
            return
        project_vk_id = project.vkProjectId
        project_name = project.name

        available_tokens = get_all_project_tokens(db, user_token)
    finally:
        db.close()
        
    tokens = available_tokens
    
    if not tokens:
        task_monitor.update_task(task_id, "error", error="Нет доступных токенов")
        return

    # --- PHASE 2: DISCOVERY & FETCHING ---
    
    print(f"SERVICE: Starting PARALLEL sync of posts for '{project_name}'...")
    
    collected_author_ids = set() # Собираем ID авторов
    failed_chunks = [] # Очередь ретраев

    try:
        numeric_id = vk_service.resolve_vk_group_id(project_vk_id, tokens[0])
        owner_id = vk_service.vk_owner_id_string(numeric_id)

        # Разведка (Total Count)
        total_vk_count = 0
        count_success = False
        for token in tokens:
            try:
                init_resp = raw_vk_call('wall.get', {
                    'owner_id': owner_id, 'count': 1, 'access_token': token
                }, project_id=project_id)
                total_vk_count = init_resp.get('count', 0)
                count_success = True
                break
            except Exception:
                continue

        if not count_success:
             task_monitor.update_task(task_id, "error", error="Не удалось получить кол-во постов.")
             return

        target_count = total_vk_count
        if limit == '1000' and total_vk_count > 1000:
            target_count = 1000

        tasks_params = []
        current_offset = 0
        while current_offset < target_count:
            remaining = target_count - current_offset
            chunk_size = min(remaining, EXECUTE_BATCH_SIZE)
            tasks_params.append({"offset": current_offset, "count": chunk_size})
            current_offset += chunk_size

        total_fetched = 0
        max_workers = min(len(tokens), 10)
        
        # Вспомогательная функция для сохранения чанка постов
        def save_posts_chunk(items):
            posts_to_save = []
            local_author_ids = set()
            for post in items:
                image_url = None
                attachments = post.get('attachments', [])
                if attachments:
                    for att in attachments:
                        if att['type'] == 'photo' and 'sizes' in att.get('photo', {}):
                            sizes = att['photo']['sizes']
                            best_size = next((s for s in sizes if s.get('type') == 'x'), sizes[-1])
                            image_url = best_size.get('url')
                            break
                
                # --- ЛОГИКА ИЗВЛЕЧЕНИЯ АВТОРА ---
                post_author_id = None
                if 'post_author_data' in post and 'author' in post['post_author_data']:
                    post_author_id = post['post_author_data']['author']
                
                final_author_id = post_author_id 
                if not final_author_id:
                    final_author_id = post.get('signer_id')
                if not final_author_id:
                    from_id = post.get('from_id')
                    if from_id and from_id > 0:
                        final_author_id = from_id

                if final_author_id and final_author_id > 0:
                    local_author_ids.add(final_author_id)

                post_entry = {
                    "id": f"{project_id}_{post['id']}",
                    "project_id": project_id,
                    "vk_post_id": post['id'],
                    "date": datetime.fromtimestamp(post['date'], timezone.utc),
                    "text": post.get('text', ''),
                    "image_url": image_url,
                    "vk_link": f"https://vk.com/wall{owner_id}_{post['id']}",
                    "likes_count": post.get('likes', {}).get('count', 0),
                    "comments_count": post.get('comments', {}).get('count', 0),
                    "reposts_count": post.get('reposts', {}).get('count', 0),
                    "views_count": post.get('views', {}).get('count', 0),
                    "can_post_comment": bool(post.get('comments', {}).get('can_post', 0)),
                    "can_like": bool(post.get('likes', {}).get('can_like', 0)),
                    "user_likes": bool(post.get('likes', {}).get('user_likes', 0)),
                    "signer_id": post.get('signer_id'),
                    "post_author_id": post_author_id
                }
                posts_to_save.append(post_entry)
            
            if posts_to_save:
                db_chunk = SessionLocal()
                try:
                    crud.bulk_upsert_posts(db_chunk, posts_to_save)
                finally:
                    db_chunk.close()
            
            return len(posts_to_save), local_author_ids


        # --- ФАЗА 2.1: ПАРАЛЛЕЛЬНАЯ ЗАГРУЗКА ---
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_params = {}
            for i, params in enumerate(tasks_params):
                future = executor.submit(
                    _fetch_batch_execute, tokens, i, owner_id, params['offset'], params['count'], project_id
                )
                future_to_params[future] = params

            for future in concurrent.futures.as_completed(future_to_params):
                params = future_to_params[future]
                try:
                    items = future.result()
                    
                    saved_count, new_authors = save_posts_chunk(items)
                    total_fetched += saved_count
                    collected_author_ids.update(new_authors)
                    
                    task_monitor.update_task(task_id, "fetching", loaded=total_fetched, total=total_vk_count)
                    
                except Exception as exc:
                    print(f"   -> Post chunk processing FAILED (offset {params['offset']}): {exc}. Adding to retry.")
                    failed_chunks.append(params)

        # --- ФАЗА 2.2: ПОСЛЕДОВАТЕЛЬНЫЙ RETRY ---
        if failed_chunks:
            print(f"SERVICE: Starting RETRY for {len(failed_chunks)} post chunks...")
            task_monitor.update_task(task_id, "fetching", message=f"Докачка ошибок ({len(failed_chunks)})...", loaded=total_fetched, total=total_vk_count)
            
            for i, params in enumerate(failed_chunks):
                try:
                    time.sleep(1.0) # Пауза
                    items = _fetch_batch_execute(tokens, i, owner_id, params['offset'], params['count'], project_id)
                    
                    saved_count, new_authors = save_posts_chunk(items)
                    total_fetched += saved_count
                    collected_author_ids.update(new_authors)
                    
                    print(f"   -> Retry success: offset {params['offset']}, saved {saved_count}")
                    task_monitor.update_task(task_id, "fetching", loaded=total_fetched, total=total_vk_count)
                
                except Exception as e:
                    print(f"   -> Retry FAILED for offset {params['offset']}: {e}")

        # --- PHASE 4: SYNC AUTHORS ---
        if collected_author_ids:
            print(f"SERVICE: Collected {len(collected_author_ids)} unique author IDs. Fetching profiles...")
            task_monitor.update_task(task_id, "processing", message=f"Обновление авторов ({len(collected_author_ids)})...")
            try:
                # Скачиваем данные профилей авторов
                fields = 'sex,bdate,city,country,photo_100,domain,has_mobile,last_seen,is_closed,can_access_closed,deactivated'
                
                # Используем вспомогательную функцию для скачивания (она уже умеет чанкинг и ротацию)
                authors_profiles = fetch_users_smart_parallel(
                    list(collected_author_ids), 
                    tokens, 
                    fields, 
                    project_id
                )
                
                # Подготавливаем данные для БД
                authors_to_save = []
                for profile in authors_profiles:
                    authors_to_save.append({
                        "id": f"{project_id}_{profile['id']}",
                        "project_id": project_id,
                        "vk_user_id": profile['id'],
                        "first_name": profile.get('first_name'),
                        "last_name": profile.get('last_name'),
                        "sex": profile.get('sex'),
                        "photo_url": profile.get('photo_100'),
                        "domain": profile.get('domain'),
                        "bdate": profile.get('bdate'),
                        "city": profile.get('city', {}).get('title') if profile.get('city') else None,
                        "country": profile.get('country', {}).get('title') if profile.get('country') else None,
                        "has_mobile": bool(profile.get('has_mobile')),
                        "is_closed": profile.get('is_closed'),
                        "can_access_closed": profile.get('can_access_closed'),
                        "deactivated": profile.get('deactivated'),
                        "last_seen": profile.get('last_seen', {}).get('time') if profile.get('last_seen') else None,
                        "platform": profile.get('last_seen', {}).get('platform') if profile.get('last_seen') else None,
                        "event_date": datetime.now(timezone.utc), # Дата добавления в список
                        "source": "posts_sync"
                    })
                
                # Сохраняем
                db_authors = SessionLocal()
                try:
                    crud.bulk_upsert_authors(db_authors, authors_to_save)
                    # Обновляем счетчик
                    auth_count = db_authors.query(models.SystemListAuthor).filter(models.SystemListAuthor.project_id == project_id).count()
                    crud.update_list_meta(db_authors, project_id, {
                        "authors_count": auth_count,
                        "authors_last_updated": get_rounded_timestamp()
                    })
                finally:
                    db_authors.close()

            except Exception as e:
                print(f"Warning: Failed to sync authors: {e}")
        else:
            print("SERVICE: No authors found in the fetched posts.")

        # --- PHASE 5: FINALIZE POSTS ---
        threshold = int(target_count * 0.90)
        if total_fetched < threshold:
             task_monitor.update_task(task_id, "error", error=f"Слишком много ошибок. Скачано {total_fetched}/{target_count}.")
             return

        db_final = SessionLocal()
        try:
            timestamp = get_rounded_timestamp()
            stored_count = crud.get_stored_posts_count(db_final, project_id)
            crud.update_list_meta(db_final, project_id, {
                "posts_last_updated": timestamp,
                "posts_count": total_vk_count,
                "stored_posts_count": stored_count
            })
        finally:
            db_final.close()

        task_monitor.update_task(task_id, "done", message="Готово")

    except Exception as e:
        task_monitor.update_task(task_id, "error", error=str(e))
