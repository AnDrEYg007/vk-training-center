from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
import json

import crud
import models
from . import vk_service

def delete_market_items(db: Session, project_id: str, item_ids: List[int], user_token: str):
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
        
    numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
    owner_id = -numeric_group_id
    
    print(f"SERVICE: Deleting {len(item_ids)} market items for project {project_id}...")
    
    for item_id in item_ids:
        # 1. Сначала получаем товар из БД, чтобы узнать, в каких он подборках
        db_item = crud.get_market_item_by_vk_id(db, owner_id, item_id)
        affected_album_ids = []
        
        if db_item and db_item.album_ids:
            try:
                affected_album_ids = json.loads(db_item.album_ids)
            except Exception:
                pass

        # 2. Удаляем из VK
        try:
            vk_service.call_vk_api('market.delete', {
                'owner_id': owner_id,
                'item_id': item_id,
                'access_token': user_token
            })
            print(f"  -> Successfully deleted item {item_id} from VK.")
        except Exception as e:
            print(f"  -> ERROR deleting item {item_id} from VK: {e}")
            # Если не удалось удалить из VK, лучше не удалять из БД, 
            # чтобы не создавать рассинхрон.
            continue

        # 3. Удаляем из локальной БД
        item_pk = f"{owner_id}_{item_id}"
        crud.delete_market_item(db, item_pk)

        # 4. Обновляем счетчики подборок в БД
        for alb_id in affected_album_ids:
            album_pk = f"{owner_id}_{alb_id}"
            crud.decrement_market_album_count(db, album_pk)
            print(f"  -> Decremented count for album {alb_id}")
            
    db.commit()
    print("SERVICE: Bulk deletion completed.")