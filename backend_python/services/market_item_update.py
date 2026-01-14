
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from typing import List, Optional
import json
import requests

import crud
import schemas
import models
from . import vk_service

def update_market_item(
    db: Session, 
    project_id: str, 
    item_data: schemas.MarketItem, 
    user_token: str, 
    file: Optional[UploadFile] = None,
    photo_url: Optional[str] = None # Новое поле для URL фото
) -> schemas.MarketItem:
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    token = user_token
    if not token:
        raise HTTPException(400, "User token is required to edit market items.")
    
    original_db_item = crud.get_market_item_by_vk_id(db, item_data.owner_id, item_data.id)
    if not original_db_item:
        raise HTTPException(404, "Original market item not found in DB cache.")
    
    try:
        numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        owner_id_str = vk_service.vk_owner_id_string(numeric_group_id)

        main_photo_id = None
        new_thumb_url = None
        
        # --- Логика загрузки фото ---
        # Приоритет: 1. Загруженный файл, 2. URL, 3. Ничего
        
        if file:
            print(f"SERVICE: Uploading new photo from FILE '{file.filename}' for item {item_data.id}...")
            file_bytes = file.file.read()
            filename = file.filename
        elif photo_url:
            print(f"SERVICE: Downloading new photo from URL '{photo_url}' for item {item_data.id}...")
            try:
                response = requests.get(photo_url, timeout=10)
                response.raise_for_status()
                file_bytes = response.content
                # Пытаемся угадать имя файла или ставим дефолтное
                filename = photo_url.split('/')[-1]
                if '?' in filename: filename = filename.split('?')[0]
                if not filename or '.' not in filename: filename = "image_from_url.jpg"
            except Exception as e:
                raise Exception(f"Failed to download image from URL: {e}")
        else:
            file_bytes = None
            filename = None

        if file_bytes:
            saved_photo_data = vk_service.upload_market_photo(
                group_id=numeric_group_id,
                file_bytes=file_bytes,
                file_name=filename,
                user_token=user_token
            )
            main_photo_id = saved_photo_data.get('id')
            if not main_photo_id:
                raise Exception("VK did not return a photo ID after saving.")
            
            sizes = saved_photo_data.get('sizes', [])
            for size_type in ['s', 'm', 'x']:
                for size in sizes:
                    if size.get('type') == size_type:
                        new_thumb_url = size.get('url')
                        break
                if new_thumb_url: break
            if not new_thumb_url and sizes: new_thumb_url = sizes[0].get('url')
            if not new_thumb_url: raise Exception("Could not find a valid thumbnail URL in photos.saveMarketPhoto response.")

            print(f"SERVICE: Photo uploaded successfully, new photo_id is {main_photo_id}, new thumb_url is {new_thumb_url}.")

        # --- Оптимизация: Проверяем, нужно ли вызывать market.edit ---
        has_core_changes = False
        original_price = json.loads(original_db_item.price) if original_db_item.price else {}
        original_category = json.loads(original_db_item.category) if original_db_item.category else {}
        category_changed = original_category.get('id') != item_data.category.get('id')

        if (original_db_item.title != item_data.title or
            original_db_item.description != item_data.description or
            original_db_item.sku != item_data.sku or
            original_price.get('amount') != item_data.price.amount or
            original_price.get('old_amount') != item_data.price.old_amount or
            category_changed or
            main_photo_id is not None):
            has_core_changes = True

        if has_core_changes:
            print(f"SERVICE: Core fields for item {item_data.id} have changed. Calling market.edit...")
            params = {
                'owner_id': item_data.owner_id,
                'item_id': item_data.id,
                'name': item_data.title,
                'price': int(item_data.price.amount) // 100,
                'category_id': item_data.category.get('id'),
                'access_token': token
            }
            if main_photo_id:
                params['main_photo_id'] = main_photo_id
            if item_data.description is not None:
                params['description'] = item_data.description
            if item_data.sku is not None:
                params['sku'] = item_data.sku
            if item_data.price.old_amount is not None:
                params['old_price'] = int(item_data.price.old_amount) // 100 if item_data.price.old_amount else 0

            vk_service.call_vk_api('market.edit', params)
        else:
            print(f"SERVICE: Core fields for item {item_data.id} have NOT changed. Skipping market.edit call.")
        
        # --- Проверяем изменения в подборках и обновляем счетчики ---
        original_album_ids = json.loads(original_db_item.album_ids) if original_db_item.album_ids else []
        new_album_ids = item_data.album_ids or []
        if set(original_album_ids) != set(new_album_ids):
            print(f"SERVICE: Album membership changed for item {item_data.id}. Updating albums in VK...")
            if original_album_ids:
                vk_service.call_vk_api('market.removeFromAlbum', {'owner_id': item_data.owner_id, 'item_id': item_data.id, 'album_ids': ",".join(map(str, original_album_ids)), 'access_token': token})
            if new_album_ids:
                vk_service.call_vk_api('market.addToAlbum', {'owner_id': item_data.owner_id, 'item_id': item_data.id, 'album_ids': ",".join(map(str, new_album_ids)), 'access_token': token})
            
            # Обновляем счетчики в кеше БД
            owner_id = item_data.owner_id
            if original_album_ids:
                old_album_pk = f"-{abs(owner_id)}_{original_album_ids[0]}"
                old_album_db = db.query(models.MarketAlbum).filter(models.MarketAlbum.id == old_album_pk).first()
                if old_album_db:
                    old_album_db.count = max(0, old_album_db.count - 1)
                    print(f"SERVICE: Decremented count for old album cache {old_album_pk}. New count: {old_album_db.count}")
            
            if new_album_ids:
                new_album_pk = f"-{abs(owner_id)}_{new_album_ids[0]}"
                new_album_db = db.query(models.MarketAlbum).filter(models.MarketAlbum.id == new_album_pk).first()
                if new_album_db:
                    new_album_db.count += 1
                    print(f"SERVICE: Incremented count for new album cache {new_album_pk}. New count: {new_album_db.count}")
        
        # --- Обновляем кеш в БД напрямую, как в исходной версии ---
        print(f"SERVICE: Updating local DB cache for item {item_data.id} directly.")
        original_db_item.title = item_data.title
        original_db_item.description = item_data.description
        original_db_item.price = json.dumps(item_data.price.model_dump())
        original_db_item.sku = item_data.sku
        original_db_item.album_ids = json.dumps(item_data.album_ids or [])
        # ИСПРАВЛЕНИЕ: Добавлено сохранение категории в локальную БД
        original_db_item.category = json.dumps(item_data.category)
        if new_thumb_url:
            original_db_item.thumb_photo = new_thumb_url
        
        db.commit()
        db.refresh(original_db_item)
        print(f"SERVICE: Local DB cache updated for item {item_data.id}.")
        
        return schemas.MarketItem.model_validate(original_db_item, from_attributes=True)
        
    except Exception as e:
        print(f"SERVICE ERROR: Failed to update market item: {e}")
        raise HTTPException(status_code=400, detail=str(e))


def update_market_items(db: Session, project_id: str, items_data: List[schemas.MarketItem], user_token: str):
    print(f"\n[SERVICE - market.update_items] START: Получен запрос на обновление {len(items_data)} товаров для проекта {project_id}.")
    for item in items_data:
        try:
            update_market_item(db, project_id, item, user_token, None)
        except Exception as e:
            print(f"[SERVICE - market.update_items] ERROR: Не удалось обновить товар {item.id} во время массового обновления: {e}")
            continue
    print(f"[SERVICE - market.update_items] END: Процесс массового обновления для проекта {project_id} завершен.")

def upload_market_item_photo(db: Session, project_id: str, item_id: int, file: UploadFile, user_token: str) -> schemas.MarketItem:
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    item = crud.get_market_item_by_vk_id(db, -int(project.vkProjectId), item_id)
    if not item:
        raise HTTPException(404, "Market item not found in DB cache.")

    try:
        numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        owner_id = vk_service.vk_owner_id_string(numeric_group_id)
        
        file_bytes = file.file.read()

        saved_photo_data = vk_service.upload_market_photo(
            group_id=numeric_group_id,
            file_bytes=file_bytes,
            file_name=file.filename,
            user_token=user_token
        )
        
        photo_id = saved_photo_data.get('id')
        if not photo_id:
            raise Exception("VK did not return a photo ID after saving.")
            
        vk_service.call_vk_api('market.edit', {
            'owner_id': owner_id,
            'item_id': item_id,
            'main_photo_id': photo_id,
            'access_token': user_token
        })
        
        sizes = saved_photo_data.get('sizes', [])
        thumb_url = None
        for size_type in ['s', 'm', 'x']:
            for size in sizes:
                if size.get('type') == size_type:
                    thumb_url = size.get('url')
                    break
            if thumb_url:
                break
        
        if not thumb_url and sizes:
            thumb_url = sizes[0].get('url')

        if not thumb_url:
            raise Exception("Could not find a valid thumbnail URL in photos.saveMarketPhoto response.")

        item.thumb_photo = thumb_url
        db.commit()
        db.refresh(item)
        
        return schemas.MarketItem.model_validate(item, from_attributes=True)

    except vk_service.VkApiError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"ERROR: An unexpected error occurred during market photo upload for item {item_id}: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during upload: {e}")
