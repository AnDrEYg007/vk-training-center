
import json
import concurrent.futures
from datetime import datetime
from typing import Dict, List

import crud
import models
from services import vk_service, task_monitor
from services.lists.list_sync_utils import get_all_project_tokens, filter_admin_tokens, fetch_users_smart_parallel
from services.post_helpers import get_rounded_timestamp
from database import SessionLocal

from .config import MULTI_POST_BATCH_SIZE, LIKES_INNER_COUNT, LIKES_ITERATIONS, COMMENTS_INNER_COUNT, COMMENTS_ITERATIONS, INTERACTIONS_MAX_WORKERS
from .workers import _fetch_multi_post_batch, _fetch_deep_scan_batch
from .data_processor import process_interaction_items

def refresh_interactions_task(task_id: str, project_id: str, date_from_iso: str, date_to_iso: str, user_token: str, interaction_type: str = 'all'):
    """
    Фоновая задача сбора взаимодействий с Split Session.
    """
    
    # --- PHASE 1: READ & PREPARE ---
    posts = []
    unique_tokens = []
    project_name = "Unknown"
    project_vk_id = ""
    
    db = SessionLocal()
    try:
        project = crud.get_project_by_id(db, project_id)
        if not project:
            task_monitor.update_task(task_id, "error", error="Project not found")
            return
        project_name = project.name
        project_vk_id = project.vkProjectId

        unique_tokens = get_all_project_tokens(db, user_token)
        if not unique_tokens:
            task_monitor.update_task(task_id, "error", error="Нет токенов")
            return

        try:
            dt_from = datetime.fromisoformat(date_from_iso.replace('Z', '+00:00'))
            dt_to = datetime.fromisoformat(date_to_iso.replace('Z', '+00:00'))
        except ValueError:
            task_monitor.update_task(task_id, "error", error="Invalid date format")
            return

        posts = db.query(models.SystemListPost).filter(
            models.SystemListPost.project_id == project_id,
            models.SystemListPost.date >= dt_from,
            models.SystemListPost.date <= dt_to
        ).order_by(models.SystemListPost.date.desc()).all()
    finally:
        db.close()

    if not posts:
        task_monitor.update_task(task_id, "done", message="Нет постов за период")
        return
    
    print(f"SERVICE: Interaction Sync for '{project_name}'. Found {len(posts)} posts.")

    # --- PHASE 2: FETCHING (No DB Connection) ---
    
    numeric_group_id = vk_service.resolve_vk_group_id(project_vk_id, unique_tokens[0])
    owner_id = -numeric_group_id
    
    # Специальная логика для репостов: фильтруем только админские токены
    admin_tokens: List[str] = []
    if interaction_type == 'all' or interaction_type == 'reposts':
        task_monitor.update_task(task_id, "fetching", message="Проверка прав (Admin)...", loaded=0, total=0)
        admin_tokens = filter_admin_tokens(unique_tokens, numeric_group_id)
        if not admin_tokens and interaction_type == 'reposts':
             task_monitor.update_task(task_id, "error", error="Нет токенов с правами администратора для сбора репостов.")
             return

    likes_acc: Dict[int, Dict] = {}
    comments_acc: Dict[int, Dict] = {}
    reposts_acc: Dict[int, Dict] = {}

    types_to_process = []
    if interaction_type in ['all', 'likes']: types_to_process.append('likes')
    if interaction_type in ['all', 'comments']: types_to_process.append('comments')
    if interaction_type in ['all', 'reposts']: types_to_process.append('reposts')

    post_chunks = [posts[i:i + MULTI_POST_BATCH_SIZE] for i in range(0, len(posts), MULTI_POST_BATCH_SIZE)]
    
    # Ограничиваем количество одновременных потоков для execute, чтобы не ловить Code 6
    max_workers = min(len(unique_tokens), INTERACTIONS_MAX_WORKERS)
    
    total_steps = len(post_chunks) * len(types_to_process)
    current_step = 0
    deep_scan_queue = []

    # === PHASE 2.1: FAST SCAN ===
    task_monitor.update_task(task_id, "fetching", message="Фаза 1: Быстрое сканирование...", loaded=0, total=total_steps)

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        for chunk_idx, chunk in enumerate(post_chunks):
            for type_ in types_to_process:
                # Выбираем пул токенов в зависимости от типа
                tokens_for_task = admin_tokens if type_ == 'reposts' else unique_tokens
                
                # Если токенов для репостов нет, пропускаем этот тип
                if type_ == 'reposts' and not tokens_for_task:
                    print(f"Skipping reposts for chunk {chunk_idx} due to lack of admin tokens.")
                    current_step += 1
                    continue

                future = executor.submit(
                    _fetch_multi_post_batch, tokens_for_task, chunk_idx, chunk, type_, owner_id, project_id
                )
                futures.append((future, chunk, type_))

        for future, chunk, type_ in futures:
            try:
                results = future.result() 
                for res in results:
                    pid = res.get('post_id')
                    
                    raw_count = res.get('count')
                    try:
                        count = int(raw_count) if raw_count is not None else 0
                    except (TypeError, ValueError):
                        count = 0
                        
                    items = res.get('items') or []
                    
                    post_obj = next((p for p in chunk if p.vk_post_id == pid), None)
                    if not post_obj: continue

                    profiles_raw = res.get('profiles') or []
                    profiles_map = {p['id']: p for p in profiles_raw}
                    
                    process_interaction_items(items, profiles_map, type_, post_obj, likes_acc, comments_acc, reposts_acc)
                    
                    limit = 1000 if type_ in ['likes', 'reposts'] else 100
                    if count > limit:
                        deep_scan_queue.append((post_obj, type_, limit, count))
            except Exception as e:
                print(f"Batch processing error: {e}")
            
            current_step += 1
            task_monitor.update_task(task_id, "fetching", loaded=current_step, total=total_steps)

    # === PHASE 2.2: DEEP SCAN ===
    if deep_scan_queue:
        task_monitor.update_task(task_id, "fetching", message=f"Фаза 2: Докачка ({len(deep_scan_queue)} постов)...")
        
        jobs = []
        for post_obj, type_, start_offset, total_count in deep_scan_queue:
            step = LIKES_INNER_COUNT * LIKES_ITERATIONS 
            if type_ == 'comments': step = COMMENTS_INNER_COUNT * COMMENTS_ITERATIONS
            
            current_offset = start_offset
            while current_offset < total_count:
                count_to_fetch = min(step, total_count - current_offset)
                jobs.append({
                    'post': post_obj,
                    'type': type_,
                    'offset': current_offset,
                    'count': count_to_fetch
                })
                current_offset += step

        completed_jobs = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_job = {}
            for i, job in enumerate(jobs):
                type_ = job['type']
                tokens_for_task = admin_tokens if type_ == 'reposts' else unique_tokens
                
                if type_ == 'reposts' and not tokens_for_task:
                     completed_jobs += 1
                     continue

                future = executor.submit(
                    _fetch_deep_scan_batch,
                    tokens_for_task, i, owner_id, job['post'].vk_post_id,
                    type_, job['offset'], job['count'], project_id
                )
                future_to_job[future] = job
            
            for future in concurrent.futures.as_completed(future_to_job):
                job = future_to_job[future]
                try:
                    res = future.result() or {}
                    items = res.get('items') or []
                    profiles_raw = res.get('profiles') or []
                    profiles_map = {p['id']: p for p in profiles_raw}
                    
                    process_interaction_items(items, profiles_map, job['type'], job['post'], likes_acc, comments_acc, reposts_acc)
                except Exception as e:
                    print(f"Deep scan job failed: {e}")
                
                completed_jobs += 1
                task_monitor.update_task(task_id, "fetching", loaded=completed_jobs, total=len(jobs))

    # --- PHASE 3: WRITE BASIC DATA ---
    db = SessionLocal()
    try:
        task_monitor.update_task(task_id, "processing", message="Сохранение в БД...")
        
        def prepare_for_db(data_map, project_id):
            result = []
            for uid, data in data_map.items():
                data['id'] = f"{project_id}_{uid}"
                data['project_id'] = project_id
                data['post_ids'] = json.dumps(list(data['post_ids']))
                result.append(data)
            return result

        if likes_acc:
            crud.bulk_upsert_interactions(db, project_id, 'likes', prepare_for_db(likes_acc, project_id))
        if comments_acc:
            crud.bulk_upsert_interactions(db, project_id, 'comments', prepare_for_db(comments_acc, project_id))
        if reposts_acc:
            crud.bulk_upsert_interactions(db, project_id, 'reposts', prepare_for_db(reposts_acc, project_id))
            
    except Exception as e:
        print(f"Error saving basic interaction data: {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
        return # Выходим, если базовое сохранение не удалось
    finally:
        db.close()

    # --- PHASE 4: PROFILE ENRICHMENT (Докачка данных) ---
    # VK API (особенно wall.getReposts) часто возвращает "урезанные" объекты пользователей без city/bdate/platform.
    # Чтобы статистика работала, нам нужно принудительно обновить их через users.get.
    
    all_involved_ids = set()
    if likes_acc: all_involved_ids.update(likes_acc.keys())
    if comments_acc: all_involved_ids.update(comments_acc.keys())
    if reposts_acc: all_involved_ids.update(reposts_acc.keys())
    
    if all_involved_ids:
        task_monitor.update_task(task_id, "processing", message=f"Догрузка профилей ({len(all_involved_ids)})...")
        print(f"SERVICE: Enriching profiles for {len(all_involved_ids)} interaction users...")
        
        try:
            fields = 'sex,bdate,city,country,photo_100,domain,has_mobile,last_seen,deactivated,is_closed,can_access_closed,platform'
            # Используем fetch_users_smart_parallel для быстрого сбора
            enriched_profiles = fetch_users_smart_parallel(list(all_involved_ids), unique_tokens, fields, project_id)
            
            updates = []
            for u in enriched_profiles:
                updates.append({
                    'vk_user_id': u['id'],
                    'first_name': u.get('first_name'),
                    'last_name': u.get('last_name'),
                    'sex': u.get('sex'),
                    'photo_url': u.get('photo_100'),
                    'domain': u.get('domain'),
                    'bdate': u.get('bdate'),
                    'city': u.get('city', {}).get('title') if u.get('city') else None,
                    'country': u.get('country', {}).get('title') if u.get('country') else None,
                    'has_mobile': bool(u.get('has_mobile')),
                    'deactivated': u.get('deactivated'),
                    'last_seen': u.get('last_seen', {}).get('time') if u.get('last_seen') else None,
                    'platform': u.get('last_seen', {}).get('platform') if u.get('last_seen') else None,
                    'is_closed': u.get('is_closed'),
                    'can_access_closed': u.get('can_access_closed')
                })
            
            # Применяем обновления ко всем таблицам, где есть эти пользователи
            if updates:
                db_enrich = SessionLocal()
                try:
                    if likes_acc: crud.bulk_update_interaction_users(db_enrich, project_id, 'likes', updates)
                    if comments_acc: crud.bulk_update_interaction_users(db_enrich, project_id, 'comments', updates)
                    if reposts_acc: crud.bulk_update_interaction_users(db_enrich, project_id, 'reposts', updates)
                    db_enrich.commit()
                finally:
                    db_enrich.close()

        except Exception as e:
            print(f"Error enriching interaction profiles: {e}")
            # Не фейлим задачу целиком, так как базовые данные уже есть
    
    # --- PHASE 5: META UPDATE ---
    db = SessionLocal()
    try:
        count_likes = db.query(models.SystemListLikes).filter(models.SystemListLikes.project_id == project_id).count()
        count_comments = db.query(models.SystemListComments).filter(models.SystemListComments.project_id == project_id).count()
        count_reposts = db.query(models.SystemListReposts).filter(models.SystemListReposts.project_id == project_id).count()
        
        timestamp = get_rounded_timestamp()
        
        meta_updates = {
            "likes_count": count_likes,
            "comments_count": count_comments,
            "reposts_count": count_reposts,
        }
        
        if interaction_type in ['all', 'likes']: meta_updates["likes_last_updated"] = timestamp
        if interaction_type in ['all', 'comments']: meta_updates["comments_last_updated"] = timestamp
        if interaction_type in ['all', 'reposts']: meta_updates["reposts_last_updated"] = timestamp
        
        crud.update_list_meta(db, project_id, meta_updates)
        task_monitor.update_task(task_id, "done", message=f"Готово")

    except Exception as e:
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
