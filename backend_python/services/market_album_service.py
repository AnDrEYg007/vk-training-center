
from sqlalchemy.orm import Session
from fastapi import HTTPException
import time

import crud
import schemas
import models
from . import vk_service
from .post_helpers import get_rounded_timestamp

def create_market_album(db: Session, project_id: str, title: str, user_token: str) -> schemas.MarketAlbum:
    """
    Создает новую подборку товаров в VK и сохраняет её в локальную БД.
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    try:
        numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        owner_id = -numeric_group_id
        
        # 1. Создаем подборку в VK
        vk_response = vk_service.call_vk_api('market.addAlbum', {
            'owner_id': owner_id,
            'title': title,
            'access_token': user_token
        })
        
        market_album_id = vk_response.get('market_album_id')
        if not market_album_id:
             raise Exception("VK API did not return market_album_id.")
        
        print(f"SERVICE: Created market album '{title}' (id: {market_album_id}) in VK.")
        
        # 2. Создаем запись в локальной БД
        timestamp = get_rounded_timestamp()
        new_db_album = models.MarketAlbum(
            id=f"-{abs(owner_id)}_{market_album_id}", # составной ID: -ownerId_albumId
            project_id=project_id,
            title=title,
            count=0,
            updated_time=int(time.time()),
            last_updated=timestamp
        )
        
        created_album = crud.create_market_album(db, new_db_album)
        return schemas.MarketAlbum.model_validate(created_album, from_attributes=True)
        
    except vk_service.VkApiError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"SERVICE ERROR: Failed to create market album: {e}")
        raise HTTPException(status_code=500, detail=str(e))
