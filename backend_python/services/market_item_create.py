
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from typing import List, Optional
import requests
import time
import json
import os

import crud
import schemas
import models
from . import vk_service
from .post_helpers import get_rounded_timestamp

def create_market_item(
    db: Session, 
    project_id: str, 
    item_data: schemas.NewMarketItemPayload, 
    user_token: str, 
    file: Optional[UploadFile] = None,
    photo_url: Optional[str] = None,
    use_default_image: bool = False
) -> schemas.MarketItem:
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    print(f"SERVICE [create_market_item]: Starting creation for project {project.name} (ID: {project_id})")
    print(f"  > Item: {item_data.name}, Price: {item_data.price}")

    try:
        numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        owner_id = -numeric_group_id

        # 1. Загрузка фото
        main_photo_id = None
        file_bytes = None
        filename = None
        thumb_photo = ""
        
        if file:
            print(f"  > Source: FILE ({file.filename})")
            file_bytes = file.file.read()
            filename = file.filename
        elif photo_url:
            print(f"  > Source: URL ({photo_url})")
            try:
                response = requests.get(photo_url, timeout=15)
                response.raise_for_status()
                file_bytes = response.content
                filename = photo_url.split('/')[-1].split('?')[0] or "image_from_url.jpg"
            except Exception as e:
                print(f"  > ERROR downloading image: {e}")
                raise HTTPException(400, f"Failed to download image from URL: {e}")
        elif use_default_image:
            print(f"  > Source: DEFAULT IMAGE")
            default_path = os.path.join(os.path.dirname(__file__), "..", "assets", "default_product.jpg")
            if not os.path.exists(default_path):
                # Fallback check relative to CWD if running from root
                default_path = os.path.join("assets", "default_product.jpg")
                
            if os.path.exists(default_path):
                try:
                    with open(default_path, "rb") as f:
                        file_bytes = f.read()
                    filename = "default_product.jpg"
                except Exception as e:
                    print(f"  > ERROR reading default image: {e}")
                    raise HTTPException(500, f"Failed to read default image: {e}")
            else:
                print(f"  > ERROR: Default image not found at {default_path}")
                raise HTTPException(404, "Default image asset missing on server.")
        else:
            print("  > ERROR: No photo source provided")
            raise HTTPException(400, "Main photo (file or url) is required for creating a market item.")
        
        if file_bytes:
            print(f"  > Uploading {len(file_bytes)} bytes to VK...")
            saved_photo_data = vk_service.upload_market_photo(
                group_id=numeric_group_id,
                file_bytes=file_bytes,
                file_name=filename,
                user_token=user_token
            )
            main_photo_id = saved_photo_data.get('id')
            if not main_photo_id:
                raise Exception("VK did not return a photo ID after saving.")
            
            # Extract thumb url
            sizes = saved_photo_data.get('sizes', [])
            if sizes:
                # Try to find a specific large size type first for reliability
                best_size = next((s for s in sizes if s.get('type') == 'x'), None)
                if not best_size:
                    best_size = sorted(sizes, key=lambda s: s['width'], reverse=True)[0]
                thumb_photo = best_size.get('url', '')

            print(f"  > Photo uploaded. ID: {main_photo_id}")

        # 2. Создание товара
        params = {
            'owner_id': owner_id,
            'name': item_data.name,
            'description': item_data.description,
            'category_id': item_data.category_id,
            'price': item_data.price / 100.0, # VK принимает рубли
            'main_photo_id': main_photo_id,
            'access_token': user_token
        }
        
        if item_data.old_price:
            params['old_price'] = item_data.old_price / 100.0
            
        if item_data.sku:
            params['sku'] = item_data.sku
            
        print(f"  > Sending market.add to VK...")
        vk_response = vk_service.call_vk_api('market.add', params)
        new_item_id = vk_response.get('market_item_id')
        
        if not new_item_id:
             raise Exception("VK API did not return market_item_id.")
             
        print(f"  > SUCCESS: Created market item {new_item_id} in VK.")
        
        # 3. Добавление в подборку (если указана)
        album_ids_list = []
        if item_data.album_id:
             print(f"  > Adding to album {item_data.album_id}...")
             vk_service.call_vk_api('market.addToAlbum', {
                'owner_id': owner_id,
                'item_id': new_item_id,
                'album_ids': item_data.album_id,
                'access_token': user_token
            })
             album_ids_list.append(item_data.album_id)

        # 4. Сохранение в локальную БД (Кеш)
        timestamp = get_rounded_timestamp()
        
        # Для сохранения нам нужна полная структура категории. 
        # VK market.add принимает ID, но в базу мы сохраняем JSON.
        # Попытаемся найти категорию в нашем кеше категорий.
        category_obj = {}
        all_categories = crud.get_all_market_categories(db)
        found_cat = next((c for c in all_categories if c.id == item_data.category_id), None)
        if found_cat:
            category_obj = {
                "id": found_cat.id,
                "name": found_cat.name,
                "section": {
                    "id": found_cat.section_id,
                    "name": found_cat.section_name
                }
            }

        price_obj = {
            "amount": str(item_data.price),
            "currency": {"id": 643, "name": "RUB"}, # Default to RUB
            "text": f"{item_data.price / 100} ₽"
        }
        if item_data.old_price:
            price_obj["old_amount"] = str(item_data.old_price)

        new_db_item = models.MarketItem(
            id=f"-{abs(owner_id)}_{new_item_id}",
            project_id=project_id,
            title=item_data.name,
            description=item_data.description,
            price=json.dumps(price_obj),
            category=json.dumps(category_obj),
            thumb_photo=thumb_photo,
            availability=0, # 0 = доступен
            date=int(time.time()),
            album_ids=json.dumps(album_ids_list),
            sku=item_data.sku,
            rating=None,
            reviews_count=0,
            last_updated=timestamp
        )
        
        db.add(new_db_item)
        db.commit()
        db.refresh(new_db_item)
        
        print(f"  > Item cached in DB: {new_db_item.id}")
        
        return schemas.MarketItem.model_validate(new_db_item, from_attributes=True)
             
    except vk_service.VkApiError as e:
        print(f"  > VK API ERROR: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"  > SERVICE ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def create_market_items(db: Session, project_id: str, items: List[schemas.NewMarketItemPayload], user_token: str):
    """
    Массовое создание товаров (только URL).
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    
    print(f"SERVICE: Batch creating {len(items)} items for project {project_id}...")
    
    success_count = 0
    errors = []

    for item_data in items:
        try:
            print(f"  -> Creating item '{item_data.name}'...")
            
            create_market_item(
                db=db,
                project_id=project_id,
                item_data=item_data,
                user_token=user_token,
                file=None,
                photo_url=item_data.photoUrl,
                use_default_image=item_data.useDefaultImage or False
            )
            success_count += 1
            
        except Exception as e:
            error_msg = f"Failed to create item '{item_data.name}': {e}"
            print(f"  -> ERROR: {error_msg}")
            errors.append(error_msg)
    
    print(f"SERVICE: Batch creation finished. Success: {success_count}, Errors: {len(errors)}")
    
    if len(errors) > 0 and success_count == 0:
        raise HTTPException(status_code=500, detail=f"Batch creation failed completely. First error: {errors[0]}")
    elif len(errors) > 0:
        print(f"WARNING: Partial success. Errors encountered: {errors}")

    return {"success": True}
