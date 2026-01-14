
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Dict
from datetime import datetime, timezone, timedelta
import time # Добавлен импорт

import crud
import schemas
import models
from . import vk_service
from .post_helpers import get_rounded_timestamp
from config import settings

def get_market_data(db: Session, project_id: str, user_token: str) -> dict:
    """
    Проверяет свежесть кеша товаров. Если кеш свежий (сегодняшний),
    возвращает данные из БД. В противном случае, запускает полное обновление из VK.
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, f"Project with id {project_id} not found.")

    is_stale = True
    if project.last_market_update:
        try:
            update_datetime = datetime.fromisoformat(project.last_market_update.replace('Z', '+00:00'))
            today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
            if update_datetime >= today_start:
                is_stale = False
        except (ValueError, TypeError):
            is_stale = True

    if is_stale:
        print(f"SERVICE: Market data for project {project_id} is stale or missing. Refreshing from VK...")
        return refresh_all_market_data(db, project_id, user_token)
    else:
        print(f"SERVICE: Market data for project {project_id} is fresh. Loading from DB cache...")
        albums = crud.get_market_albums_by_project(db, project_id)
        items = crud.get_market_items_by_project(db, project_id)
        categories = crud.get_all_market_categories(db)
        return {
            "albums": [schemas.MarketAlbum.model_validate(a, from_attributes=True) for a in albums],
            "items": [schemas.MarketItem.model_validate(i, from_attributes=True) for i in items],
            "categories": [schemas.MarketCategory.model_validate(c, from_attributes=True) for c in categories]
        }

def refresh_all_market_data(db: Session, project_id: str, user_token: str) -> dict:
    print(f"SERVICE: Refreshing ALL market data for project {project_id} (Optimized Flow)...")
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, f"Project with id {project_id} not found.")

    timestamp = get_rounded_timestamp()
    try:
        # 1. Обновляем категории (если нужно)
        get_market_categories(db, user_token)

        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        owner_id = vk_service.vk_owner_id_string(numeric_id)

        # 2. Загружаем и сохраняем все альбомы (1 запрос)
        print(f"  -> Fetching albums...")
        vk_albums = vk_service.call_vk_api('market.getAlbums', {
            'owner_id': owner_id, 
            'count': 100, 
            'access_token': user_token
        })
        crud.replace_market_albums_for_project(db, project_id, vk_albums.get('items', []), timestamp)

        # 3. Загружаем ВСЕ товары с пагинацией (N/200 запросов)
        # Используем extended=1, чтобы получить поле 'albums_ids' для каждого товара сразу
        all_items = []
        offset = 0
        step = 200 # Максимум для market.get
        
        print(f"  -> Fetching items...")
        while True:
            # ПРОАКТИВНАЯ ЗАЩИТА ОТ CODE 6:
            # Делаем небольшую паузу между страницами, чтобы не превышать RPS (Requests Per Second)
            time.sleep(0.35)

            vk_items_response = vk_service.call_vk_api('market.get', {
                'owner_id': owner_id, 
                'count': step, 
                'offset': offset, 
                'extended': 1, # ВАЖНО: Возвращает поле albums_ids
                'access_token': user_token
            })
            
            items_batch = vk_items_response.get('items', [])
            if not items_batch:
                break
                
            for item in items_batch:
                # VK возвращает ключ 'albums_ids' (множественное число), 
                # а наша схема ожидает 'album_ids' (как в документации к MarketItem)
                item['album_ids'] = item.get('albums_ids', [])
                all_items.append(item)
            
            total_count = vk_items_response.get('count', 0)
            print(f"     Fetched {len(items_batch)} items (Total: {len(all_items)}/{total_count})")
            
            offset += step
            if offset >= total_count:
                break

        # 4. Сохраняем все товары в БД одним махом
        # Это происходит ТОЛЬКО если цикл выше завершился успешно.
        # Если цикл упадет с ошибкой, старые данные не будут затерты.
        crud.replace_market_items_for_project(db, project_id, all_items, timestamp)
        
        # 5. Обновляем метку времени
        crud.update_project_last_update_time(db, project_id, 'market', timestamp)
        
        # 6. Возвращаем свежие данные из БД
        albums = crud.get_market_albums_by_project(db, project_id)
        items = crud.get_market_items_by_project(db, project_id)
        categories = crud.get_all_market_categories(db)
        
        return {
            "albums": [schemas.MarketAlbum.model_validate(a, from_attributes=True) for a in albums],
            "items": [schemas.MarketItem.model_validate(i, from_attributes=True) for i in items],
            "categories": [schemas.MarketCategory.model_validate(c, from_attributes=True) for c in categories]
        }

    except vk_service.VkApiError as e:
        if e.code == 7:
            print(f"ERROR: Market Access Denied (Code 7) for {project_id}")
            raise HTTPException(
                status_code=403, 
                detail="Ошибка доступа к товарам (Код 7). Вероятно, в настройках этого сообщества ВКонтакте отключен раздел 'Товары'. Пожалуйста, зайдите в управление сообществом -> Разделы и включите 'Товары'."
            )
        print(f"ERROR: VK API Error refreshing market data for {project_id}: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print(f"ERROR: Failed to refresh market data for {project_id} from VK: {e}.")
        raise HTTPException(status_code=400, detail=str(e))


def flatten_categories(items: List[Dict], section_id: int = None, section_name: str = None, parent_prefix: str = "") -> List[Dict]:
    """
    Рекурсивно преобразует дерево категорий (v5.199+) в плоский список.
    Формирует составные названия типа "Женщинам / Одежда / Блузы".
    """
    flat_list = []
    for item in items:
        item_id = item.get('id')
        item_name = item.get('name')
        children = item.get('children', [])
        
        # Если это верхний уровень (нет section_id), то текущий элемент и есть Секция
        curr_section_id = section_id if section_id else item_id
        curr_section_name = section_name if section_name else item_name
        
        # Формируем отображаемое имя
        if section_id:
            # Если мы внутри секции, добавляем префикс родителя
            if parent_prefix:
                display_name = f"{parent_prefix} / {item_name}"
            else:
                display_name = item_name
        else:
            # Это корень (Секция)
            display_name = item_name
            
        if children:
            # Если есть дети, рекурсивно спускаемся
            # Если мы на уровне секции (section_id is None), то prefix для детей пустой (чтобы не дублировать имя секции)
            # Иначе накапливаем путь
            next_prefix = display_name if section_id else ""
            
            flat_list.extend(flatten_categories(
                children, 
                curr_section_id, 
                curr_section_name, 
                next_prefix
            ))
        else:
            # Это лист (конечная категория) или пустая секция
            # Если это корень без детей (parent_prefix пустой), берем его имя как есть
            final_name = display_name
            if not parent_prefix and not section_id:
                final_name = item_name

            flat_list.append({
                "id": item_id,
                "name": final_name,
                "section": {
                    "id": curr_section_id,
                    "name": curr_section_name
                }
            })
    return flat_list


def get_market_categories(db: Session, user_token: str) -> List[Dict]:
    category_count = crud.get_market_categories_count(db)
    if category_count == 0:
        print("SERVICE: Market categories cache is empty. Fetching from VK...")
        try:
            # Используем дефолтную версию (5.199) или выше.
            # count больше не поддерживается, VK возвращает дерево.
            vk_categories_response = vk_service.call_vk_api('market.getCategories', {
                'access_token': user_token
            })
            
            items_tree = vk_categories_response.get('items', [])
            flat_items = flatten_categories(items_tree)
            
            if flat_items:
                crud.replace_market_categories(db, flat_items)
                print(f"SERVICE: Successfully cached {len(flat_items)} market categories (flattened).")
            else:
                print("SERVICE: VK returned empty list of categories.")
        except Exception as e:
            print(f"SERVICE: WARNING - Failed to cache market categories: {e}")
            return []
    
    return crud.get_all_market_categories(db)

def force_refresh_market_categories(db: Session, user_token: str):
    """Принудительно обновляет категории товаров из VK."""
    print("SERVICE: Force refreshing market categories from VK...")
    try:
        # Используем дефолтную версию (5.199)
        vk_categories_response = vk_service.call_vk_api('market.getCategories', {
            'access_token': user_token
        })
        
        items_tree = vk_categories_response.get('items', [])
        flat_items = flatten_categories(items_tree)
        
        if flat_items:
            crud.replace_market_categories(db, flat_items)
            print(f"SERVICE: Successfully refreshed {len(flat_items)} market categories (flattened).")
        else:
            print("SERVICE: VK returned no categories.")
    except Exception as e:
        print(f"SERVICE ERROR: Failed to force refresh market categories: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to refresh categories: {e}")
