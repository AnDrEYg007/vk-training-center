
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json

import schemas
import services.market_service as market_service
from database import SessionLocal
from config import settings

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/getData", response_model=schemas.MarketDataResponse)
def get_data(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    """
    Получает данные о товарах для проекта.
    Сначала проверяет свежесть кеша в БД. Если кеш свежий, возвращает его.
    Иначе, запускает полное обновление из VK.
    """
    return market_service.get_market_data(db, payload.projectId, settings.vk_user_token)

@router.post("/refreshAll", response_model=schemas.MarketDataResponse)
def refresh_all(payload: schemas.ProjectIdPayload, db: Session = Depends(get_db)):
    """Принудительно обновляет все данные о товарах из VK."""
    return market_service.refresh_all_market_data(db, payload.projectId, settings.vk_user_token)

@router.post("/getCategories", response_model=List[schemas.MarketCategory])
def get_categories(db: Session = Depends(get_db)):
    """Получает глобальный список категорий товаров."""
    return market_service.get_market_categories(db, settings.vk_user_token)

@router.post("/refreshCategories", response_model=schemas.GenericSuccess)
def refresh_categories(db: Session = Depends(get_db)):
    """Принудительно обновляет глобальный список категорий товаров из VK."""
    market_service.force_refresh_market_categories(db, settings.vk_user_token)
    return {"success": True}

@router.post("/createAlbum", response_model=schemas.MarketAlbum)
def create_album(payload: schemas.CreateAlbumPayload, db: Session = Depends(get_db)):
    """Создает новую подборку товаров."""
    return market_service.create_market_album(db, payload.projectId, payload.title, settings.vk_user_token)

@router.post("/createItem", response_model=schemas.MarketItem)
def create_item(
    projectId: str = Form(...),
    itemData: str = Form(...),
    file: Optional[UploadFile] = File(None),
    photoUrl: Optional[str] = Form(None),
    useDefaultImage: bool = Form(False),
    db: Session = Depends(get_db)
):
    """Создает один товар, опционально с файлом изображения или ссылкой."""
    try:
        item_pydantic = schemas.NewMarketItemPayload.model_validate_json(itemData)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid JSON format for itemData: {e}")
    return market_service.create_market_item(db, projectId, item_pydantic, settings.vk_user_token, file, photoUrl, useDefaultImage)

@router.post("/createItems", response_model=schemas.GenericSuccess)
def create_items(payload: schemas.CreateMarketItemsPayload, db: Session = Depends(get_db)):
    """Массово создает несколько товаров (без изображений)."""
    market_service.create_market_items(db, payload.projectId, payload.items, settings.vk_user_token)
    return {"success": True}

@router.post("/deleteItems", response_model=schemas.GenericSuccess)
def delete_items(payload: schemas.DeleteMarketItemsPayload, db: Session = Depends(get_db)):
    """Массово удаляет один или несколько товаров."""
    market_service.delete_market_items(db, payload.projectId, payload.itemIds, settings.vk_user_token)
    return {"success": True}


@router.post("/updateItem", response_model=schemas.MarketItem)
def update_item(
    projectId: str = Form(...),
    itemData: str = Form(...),
    file: Optional[UploadFile] = File(None),
    photoUrl: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Обновляет один товар.
    Можно передать новое фото либо как файл (file), либо как ссылку (photoUrl).
    """
    try:
        item_pydantic = schemas.MarketItem.model_validate_json(itemData)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid JSON format for itemData: {e}")
        
    return market_service.update_market_item(
        db, 
        projectId, 
        item_pydantic, 
        settings.vk_user_token, 
        file, 
        photoUrl
    )


@router.post("/updateItems", response_model=schemas.GenericSuccess)
def update_items(payload: schemas.UpdateMarketItemsPayload, db: Session = Depends(get_db)):
    """Массово обновляет несколько товаров."""
    market_service.update_market_items(db, payload.projectId, payload.items, settings.vk_user_token)
    return {"success": True}

@router.post("/uploadPhoto", response_model=schemas.MarketItem)
def upload_photo(
    file: UploadFile = File(...), 
    projectId: str = Form(...), 
    itemId: int = Form(...),
    db: Session = Depends(get_db)
):
    """Загружает новое главное фото для товара."""
    return market_service.upload_market_item_photo(db, projectId, itemId, file, settings.vk_user_token)
