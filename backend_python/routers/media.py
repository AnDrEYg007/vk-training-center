from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

import schemas
import services.media_service as media_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/uploadPhoto", response_model=schemas.PhotoAttachment)
def upload_photo(
    file: UploadFile = File(...), 
    projectId: str = Form(...), 
    db: Session = Depends(get_db)
):
    """
    Загружает фото для проекта. Файл отправляется через multipart/form-data.
    Фото загружается в альбом на стене группы VK.
    """
    return media_service.upload_photo(db, projectId, file)

@router.post("/getAlbums", response_model=List[schemas.Album])
def get_albums(payload: schemas.AlbumPayload, db: Session = Depends(get_db)):
    """
    Получает список альбомов для проекта.
    Сначала пытается загрузить из кеша (БД). Если кеш пуст,
    автоматически загружает из VK, сохраняет в кеш и возвращает.
    """
    return media_service.get_albums(db, payload.projectId)

@router.post("/refreshAlbums", response_model=List[schemas.Album])
def refresh_albums(payload: schemas.AlbumRefreshPayload, db: Session = Depends(get_db)):
    """
    Принудительно обновляет список альбомов для проекта из VK,
    перезаписывая кеш в БД.
    """
    return media_service.refresh_albums(db, payload.projectId)

@router.post("/getPhotos", response_model=schemas.PhotosResponse)
def get_photos(payload: schemas.PhotosPayload, db: Session = Depends(get_db)):
    """
    Получает страницу с фотографиями из альбома.
    Сначала пытается загрузить из кеша (БД). Если для первой страницы кеш пуст,
    автоматически загружает ВСЕ фото из VK, сохраняет в кеш и возвращает первую страницу.
    """
    return media_service.get_photos(db, payload.projectId, payload.albumId, payload.page)

@router.post("/refreshPhotos", response_model=schemas.PhotosResponse)
def refresh_photos(payload: schemas.PhotosRefreshPayload, db: Session = Depends(get_db)):
    """
    Принудительно обновляет ВСЕ фотографии для альбома из VK,
    перезаписывая кеш в БД, и возвращает первую страницу.
    """
    return media_service.refresh_photos(db, payload.projectId, payload.albumId)

@router.post("/createAlbum", response_model=schemas.Album)
def create_album(
    payload: schemas.CreateAlbumPayload, 
    db: Session = Depends(get_db)
):
    """
    Создает новый фотоальбом в сообществе VK.
    """
    return media_service.create_album(db, payload.projectId, payload.title)

@router.post("/uploadPhotoToAlbum", response_model=schemas.Photo)
def upload_photo_to_album(
    file: UploadFile = File(...),
    projectId: str = Form(...),
    albumId: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Загружает фото в конкретный альбом VK.
    """
    return media_service.upload_photo_to_album(db, projectId, albumId, file)