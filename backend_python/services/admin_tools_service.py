
from sqlalchemy.orm import Session
from typing import List, Dict, Set, Tuple
from fastapi import HTTPException
import json
import re
import time
import concurrent.futures
import models
import crud
from config import settings
from services.vk_api.api_client import call_vk_api as raw_vk_call
from database import SessionLocal
import services.task_monitor as task_monitor

def get_all_administered_groups(db: Session) -> List[models.AdministeredGroup]:
    """Retrieves all administered groups from the database."""
    return db.query(models.AdministeredGroup).order_by(models.AdministeredGroup.name).all()

def sync_administered_groups(db: Session) -> Dict:
    """
    Scans all available tokens (ENV + System Accounts) for groups where they have admin rights.
    Updates existing records, adds new ones, and clears admin sources for lost groups.
    """
    print("SERVICE: Starting sync of administered groups...")
    
    # 1. Collect tokens with metadata
    tokens_map = {} # token -> "Account Name"
    
    # ENV Token
    if settings.vk_user_token:
        tokens_map[settings.vk_user_token] = "ENV Token (Основной)"
        
    # System Accounts
    system_accounts = crud.get_all_accounts(db)
    for acc in system_accounts:
        if acc.token and acc.status == 'active':
            tokens_map[acc.token] = f"{acc.full_name} (ID: {acc.vk_user_id})"

    if not tokens_map:
        return {"success": False, "message": "No active tokens found"}

    print(f"SERVICE: Found {len(tokens_map)} tokens to scan.")

    # 2. Fetch data from VK
    # Map: group_id -> { group_data, admin_sources: set() }
    aggregated_groups = {}
    
    processed_count = 0
    errors_count = 0

    for token, source_name in tokens_map.items():
        try:
            # groups.get with filter=admin
            response = raw_vk_call('groups.get', {
                'filter': 'admin',
                'extended': 1,
                'fields': 'members_count,activity,description,screen_name',
                'access_token': token,
                'count': 1000 # Max limit usually
            })
            
            items = response.get('items', [])
            print(f"  -> Token '{source_name}': found {len(items)} groups.")
            
            for group in items:
                gid = group['id']
                if gid not in aggregated_groups:
                    aggregated_groups[gid] = {
                        'data': group,
                        'sources': set()
                    }
                aggregated_groups[gid]['sources'].add(source_name)
            
            processed_count += 1
            
        except Exception as e:
            print(f"  -> Error scanning with token '{source_name}': {e}")
            errors_count += 1

    # 3. Update DB (Upsert + Mark Lost)
    try:
        # Получаем все текущие группы из БД, чтобы найти "потерянные"
        existing_groups_query = db.query(models.AdministeredGroup).all()
        existing_ids = {g.id for g in existing_groups_query}
        found_ids = set(aggregated_groups.keys())

        # А. Обновляем/Вставляем найденные группы
        for gid, info in aggregated_groups.items():
            g_data = info['data']
            sources_list = sorted(list(info['sources']))
            
            # Получаем существующий объект или создаем новый
            db_obj = db.query(models.AdministeredGroup).filter(models.AdministeredGroup.id == gid).first()
            
            if not db_obj:
                db_obj = models.AdministeredGroup(id=gid)
                db.add(db_obj)
            
            db_obj.name = g_data.get('name', 'Unknown')
            db_obj.screen_name = g_data.get('screen_name')
            db_obj.photo_200 = g_data.get('photo_200')
            db_obj.members_count = g_data.get('members_count', 0)
            db_obj.activity = g_data.get('activity')
            db_obj.description = g_data.get('description')
            db_obj.admin_sources = json.dumps(sources_list, ensure_ascii=False)

        # Б. Обрабатываем группы, доступ к которым потерян
        lost_ids = existing_ids - found_ids
        if lost_ids:
            print(f"SERVICE: Lost access to {len(lost_ids)} groups. Marking as lost.")
            db.query(models.AdministeredGroup).filter(
                models.AdministeredGroup.id.in_(lost_ids)
            ).update({
                models.AdministeredGroup.admin_sources: "[]"
            }, synchronize_session=False)

        db.commit()
        
        total_groups_in_db = db.query(models.AdministeredGroup).count()
        print(f"SERVICE: Sync complete. Total groups in DB: {total_groups_in_db}.")
        
        return {
            "success": True, 
            "total_groups": total_groups_in_db,
            "tokens_scanned": processed_count,
            "errors": errors_count
        }

    except Exception as e:
        db.rollback()
        print(f"SERVICE: DB Error saving administered groups: {e}")
        raise e

def sync_group_admins(db: Session, group_id: int) -> models.AdministeredGroup:
    """
    Fetches the list of administrators for a specific group.
    """
    print(f"SERVICE: Starting admins sync for group {group_id}...")
    
    group = db.query(models.AdministeredGroup).filter(models.AdministeredGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found in database.")

    # 1. Collect all potential tokens
    tokens = []
    if settings.vk_user_token:
        tokens.append(settings.vk_user_token)
    
    system_tokens = crud.get_active_account_tokens(db)
    tokens.extend(system_tokens)
    
    unique_tokens = list(set([t for t in tokens if t]))
    
    if not unique_tokens:
        raise HTTPException(status_code=400, detail="No active tokens found.")

    managers_data = None
    
    # 2. Try to fetch managers with each token
    for token in unique_tokens:
        try:
            # groups.getMembers with filter=managers returns the list of admins including the creator
            response = raw_vk_call('groups.getMembers', {
                'group_id': group_id,
                'filter': 'managers',
                'fields': 'role,permissions',
                'access_token': token
            })
            
            if response and 'items' in response:
                managers_data = response['items']
                break
        except Exception as e:
            continue

    if managers_data is None:
        raise HTTPException(status_code=403, detail="None of the available tokens have access to view group managers.")

    # 3. Process data (Helper function)
    return _process_and_save_admins(db, group, managers_data)

def _process_and_save_admins(db: Session, group: models.AdministeredGroup, managers_data: List[Dict]) -> models.AdministeredGroup:
    """Вспомогательная функция для сохранения админов в БД."""
    try:
        # Load existing admins to preserve history
        existing_admins_json = json.loads(group.admins_data) if group.admins_data else []
        existing_admins_map = {a['id']: a for a in existing_admins_json}
        
        new_admins_list = []
        
        creator_id = None
        creator_name = None

        # Process current managers from VK
        for manager in managers_data:
            user_id = manager['id']
            role = manager.get('role', 'unknown')
            
            if role == 'creator':
                creator_id = user_id
                creator_name = f"{manager.get('first_name', '')} {manager.get('last_name', '')}".strip()
            
            admin_obj = {
                'id': user_id,
                'first_name': manager.get('first_name', ''),
                'last_name': manager.get('last_name', ''),
                'role': role,
                'status': 'active',
                'permissions': manager.get('permissions', [])
            }
            
            new_admins_list.append(admin_obj)
            
            if user_id in existing_admins_map:
                del existing_admins_map[user_id]

        # Process remaining (inactive) admins
        for old_id, old_admin in existing_admins_map.items():
            old_admin['status'] = 'inactive'
            new_admins_list.append(old_admin)

        group.creator_id = creator_id
        group.creator_name = creator_name
        group.admins_data = json.dumps(new_admins_list, ensure_ascii=False)
        
        db.commit()
        db.refresh(group)
        return group
        
    except Exception as e:
        print(f"SERVICE: Error processing admin data: {e}")
        raise e

# --- BULK SYNC LOGIC ---

def _worker_fetch_admins(token: str, group_ids: List[int], task_id: str, processed_counter: Dict, total_groups: int) -> Tuple[List[Tuple[int, List[Dict]]], List[int]]:
    """
    Воркер: обрабатывает список групп одним токеном.
    Возвращает: (success_results, failed_group_ids)
    success_results: [(group_id, managers_data), ...]
    """
    successes = []
    failures = []
    
    for gid in group_ids:
        try:
            # Имитация задержки для предотвращения rate limit
            time.sleep(0.35)
            
            response = raw_vk_call('groups.getMembers', {
                'group_id': gid,
                'filter': 'managers',
                'fields': 'role,permissions',
                'access_token': token
            })
            
            if response and 'items' in response:
                successes.append((gid, response['items']))
            else:
                failures.append(gid)
        except Exception as e:
            # print(f"  [Worker] Failed gid {gid} with token ...{token[-4:]}: {e}")
            failures.append(gid)
        
        # Обновляем прогресс (thread-safe не гарантируется идеально, но для UI достаточно)
        processed_counter['val'] += 1
        if processed_counter['val'] % 5 == 0:
            task_monitor.update_task(task_id, "processing", loaded=processed_counter['val'], total=total_groups)

    return successes, failures

def refresh_all_group_admins_task(task_id: str):
    """
    Фоновая задача для умного сбора админов со всех групп.
    1. Распределяет нагрузку по токенам.
    2. Выполняет запросы параллельно.
    3. Обрабатывает ошибки (Retry).
    4. Сохраняет результаты.
    """
    db = SessionLocal()
    try:
        # 1. Загрузка данных
        all_groups = db.query(models.AdministeredGroup).all()
        # Фильтруем группы без токенов
        active_groups = [g for g in all_groups if g.admin_sources and g.admin_sources != "[]"]
        
        if not active_groups:
             task_monitor.update_task(task_id, "done", message="Нет групп с доступными токенами.")
             return

        # 2. Карта токенов (Name -> Token)
        name_to_token = {}
        # ENV
        if settings.vk_user_token:
            name_to_token["ENV Token (Основной)"] = settings.vk_user_token
        # System
        accounts = crud.get_all_accounts(db)
        for acc in accounts:
            if acc.token and acc.status == 'active':
                key = f"{acc.full_name} (ID: {acc.vk_user_id})"
                name_to_token[key] = acc.token

        # 3. Балансировка нагрузки (Smart Distribution)
        # Queues: { token: [group_id, group_id, ...] }
        token_queues: Dict[str, List[int]] = {t: [] for t in name_to_token.values()}
        group_to_valid_tokens: Dict[int, List[str]] = {}

        print(f"TASK {task_id}: Balancing load for {len(active_groups)} groups across {len(token_queues)} tokens...")
        task_monitor.update_task(task_id, "processing", message="Балансировка нагрузки...", total=len(active_groups))

        for group in active_groups:
            try:
                source_names = json.loads(group.admin_sources)
                valid_tokens = []
                for name in source_names:
                    if name in name_to_token:
                        valid_tokens.append(name_to_token[name])
                
                if not valid_tokens:
                    continue
                
                group_to_valid_tokens[group.id] = valid_tokens
                
                # Выбираем токен с самой короткой очередью
                best_token = min(valid_tokens, key=lambda t: len(token_queues[t]))
                token_queues[best_token].append(group.id)
                
            except Exception as e:
                print(f"Error distributing group {group.id}: {e}")

        # Удаляем пустые очереди
        token_queues = {k: v for k, v in token_queues.items() if v}
        
        if not token_queues:
             task_monitor.update_task(task_id, "error", error="Не удалось распределить токены.")
             return

        # 4. Параллельное выполнение (Phase 1)
        total_groups = len(active_groups)
        processed_counter = {'val': 0}
        
        success_results = [] # [(gid, managers_data), ...]
        failed_group_ids = []

        max_workers = min(len(token_queues), 10)
        
        task_monitor.update_task(task_id, "processing", message=f"Сбор данных ({max_workers} потоков)...", loaded=0, total=total_groups)

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = []
            for token, gids in token_queues.items():
                futures.append(executor.submit(_worker_fetch_admins, token, gids, task_id, processed_counter, total_groups))
            
            for future in concurrent.futures.as_completed(futures):
                try:
                    s_res, f_gids = future.result()
                    success_results.extend(s_res)
                    failed_group_ids.extend(f_gids)
                except Exception as e:
                    print(f"Thread error: {e}")

        # 5. Retry Logic (Phase 2)
        if failed_group_ids:
            print(f"TASK {task_id}: Retrying {len(failed_group_ids)} failed groups...")
            task_monitor.update_task(task_id, "processing", message=f"Докачка ошибок ({len(failed_group_ids)})...")
            
            for gid in failed_group_ids:
                # Пробуем все доступные токены для этой группы
                tokens = group_to_valid_tokens.get(gid, [])
                success = False
                for token in tokens:
                    try:
                        time.sleep(0.5) # Пауза
                        response = raw_vk_call('groups.getMembers', {
                            'group_id': gid,
                            'filter': 'managers',
                            'fields': 'role,permissions',
                            'access_token': token
                        })
                        if response and 'items' in response:
                            success_results.append((gid, response['items']))
                            success = True
                            break
                    except:
                        continue
                
                if not success:
                    print(f"  -> Group {gid} completely failed all tokens.")

        # 6. Сохранение в БД (Phase 3)
        task_monitor.update_task(task_id, "processing", message="Сохранение результатов...", loaded=len(success_results), total=total_groups)
        
        saved_count = 0
        for gid, managers_data in success_results:
            group = db.query(models.AdministeredGroup).filter(models.AdministeredGroup.id == gid).first()
            if group:
                _process_and_save_admins(db, group, managers_data)
                saved_count += 1
                
        task_monitor.update_task(task_id, "done", message=f"Обновлено {saved_count} групп")
        
    except Exception as e:
        print(f"TASK CRITICAL ERROR: {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
