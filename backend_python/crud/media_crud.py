from sqlalchemy.orm import Session

import models

# ===============================================
# GALLERY (ALBUMS & PHOTOS)
# ===============================================

def get_albums_by_project(db: Session, project_id: str) -> list[models.Album]:
    return db.query(models.Album).filter(models.Album.project_id == project_id).order_by(models.Album.title).all()

def get_album_by_id(db: Session, album_id: str) -> models.Album:
    return db.query(models.Album).filter(models.Album.id == album_id).first()

def update_album_photos_timestamp(db: Session, album_id: str, timestamp: str):
    db_album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if db_album:
        db_album.photos_last_updated = timestamp
        db.commit()

def replace_albums_for_project(db: Session, project_id: str, albums_data: list[dict], timestamp: str):
    db.query(models.Album).filter(models.Album.project_id == project_id).delete(synchronize_session=False)
    if albums_data:
        new_albums = [models.Album(
            id=album['id'],
            project_id=project_id,
            title=album['title'],
            size=album['size'],
            last_updated=timestamp
        ) for album in albums_data]
        db.add_all(new_albums)
    db.commit()

def get_photos_by_album(db: Session, album_id: str, page: int, page_size: int) -> list[models.Photo]:
    offset = (page - 1) * page_size
    return db.query(models.Photo).filter(models.Photo.album_id == album_id).order_by(models.Photo.date.desc()).offset(offset).limit(page_size).all()

def count_photos_in_album(db: Session, album_id: str) -> int:
    return db.query(models.Photo).filter(models.Photo.album_id == album_id).count()

def replace_photos_for_album(db: Session, album_id: str, project_id: str, photos_data: list[dict]):
    db.query(models.Photo).filter(models.Photo.album_id == album_id).delete(synchronize_session=False)
    if photos_data:
        new_photos = [models.Photo(
            id=photo['id'],
            project_id=project_id,
            album_id=album_id,
            url=photo['url'],
            date=photo['date']
        ) for photo in photos_data]
        db.add_all(new_photos)
    db.commit()
