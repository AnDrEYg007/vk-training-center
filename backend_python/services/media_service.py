
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from typing import List
from datetime import datetime, timedelta, timezone

import crud
import models
from . import vk_service
from config import settings
from schemas import PhotoAttachment, Album, Photo

GALLERY_PAGE_SIZE = 9

def _get_rounded_timestamp() -> str:
    now = datetime.utcnow()
    return now.strftime('%Y-%m-%dT%H:%M:%S.000Z')

def upload_photo(db: Session, project_id: str, file: UploadFile) -> PhotoAttachment:
    """
    Service function to handle photo upload logic.
    1. Fetches project details.
    2. Resolves VK group ID.
    3. Reads file bytes.
    4. Calls vk_service to perform the 3-step upload.
    5. Formats the response into a PhotoAttachment object.
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
        
        file_bytes = file.file.read()

        saved_photo_data = vk_service.upload_wall_photo(
            group_id=numeric_id,
            file_bytes=file_bytes,
            file_name=file.filename,
            user_token=settings.vk_user_token
        )

        owner_id = saved_photo_data.get('owner_id')
        photo_id = saved_photo_data.get('id')
        
        # VK returns multiple sizes, find the largest one for the best quality.
        if not saved_photo_data.get('sizes'):
            raise HTTPException(status_code=500, detail="VK API did not return photo sizes after saving.")
            
        sizes = saved_photo_data.get('sizes', [])
        
        # Try to find a specific large size type first for reliability
        best_size = next((s for s in sizes if s.get('type') == 'y'), None)
        if not best_size:
            best_size = next((s for s in sizes if s.get('type') == 'x'), None)
        # Fallback to sorting by width if specific types are not found
        if not best_size:
            best_size = sorted(sizes, key=lambda s: s['width'], reverse=True)[0]

        photo_url = best_size.get('url')

        if not all([owner_id, photo_id, photo_url]):
             raise HTTPException(status_code=500, detail="VK API returned incomplete photo data after saving.")

        attachment_id = f"photo{owner_id}_{photo_id}"

        return PhotoAttachment(id=attachment_id, url=photo_url)

    except vk_service.VkApiError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"ERROR: An unexpected error occurred during photo upload for project {project_id}: {e}")
        # Re-raise as HTTPException to be sent to the client
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during upload: {e}")

# --- Gallery Logic ---

def create_album(db: Session, project_id: str, title: str) -> Album:
    project = crud.get_project_by_id(db, project_id)
    if not project: 
        raise HTTPException(404, "Project not found")

    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
        owner_id_str = vk_service.vk_owner_id_string(numeric_id)

        # Используем фасад vk_service.create_album, который реализует publish_with_fallback (ротацию)
        created_album_vk = vk_service.create_album(
            owner_id=owner_id_str,
            title=title,
            token=settings.vk_user_token
        )
        
        # Убедимся, что альбом создан в сообществе
        response_owner_id = created_album_vk.get('owner_id')
        expected_owner_id = -numeric_id
        if not response_owner_id or int(response_owner_id) != expected_owner_id:
            raise Exception(f"VK API создал альбом для пользователя (owner_id: {response_owner_id}), а не для сообщества (ожидался {expected_owner_id}). Проверьте права токена пользователя в группе {numeric_id}.")

        owner_id_str_from_response = str(response_owner_id)
        
        # Форматируем и возвращаем как объект нашей схемы
        formatted_album = vk_service.format_album_data(created_album_vk, owner_id_str_from_response)
        
        # Добавляем новый альбом в кеш (БД)
        timestamp = _get_rounded_timestamp()
        db_album = models.Album(
            id=formatted_album['id'],
            project_id=project_id,
            title=formatted_album['title'],
            size=formatted_album['size'],
            last_updated=timestamp
        )
        db.add(db_album)
        db.commit()

        return Album(**formatted_album)

    except vk_service.VkApiError as e:
        raise HTTPException(400, f"VK API Error: {e}")
    except Exception as e:
        raise HTTPException(500, f"An unexpected error occurred: {e}")


def upload_photo_to_album(db: Session, project_id: str, album_id: str, file: UploadFile) -> Photo:
    project = crud.get_project_by_id(db, project_id)
    if not project: raise HTTPException(404, "Project not found")

    try:
        numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
        numeric_album_id = int(album_id.split('_')[1]) # album_id is ownerId_albumId

        file_bytes = file.file.read()

        # Используем фасадный метод, который уже содержит логику ротации токенов (ATOMIC upload)
        saved_photo_data = vk_service.upload_album_photo(
            group_id=numeric_group_id,
            album_id=numeric_album_id,
            file_bytes=file_bytes,
            file_name=file.filename,
            user_token=settings.vk_user_token
        )

        formatted_photo = vk_service.format_photo_data(saved_photo_data)
        
        # After successful upload, we should update our cache
        # Add the photo to the DB.
        db_photo = models.Photo(
            id=formatted_photo['id'],
            project_id=project_id,
            album_id=album_id,
            url=formatted_photo['url'],
            date=saved_photo_data['date']
        )
        db.add(db_photo)
        
        # Also update album size in cache
        db_album = crud.get_album_by_id(db, album_id)
        if db_album:
            db_album.size += 1
        
        db.commit()

        return Photo(**formatted_photo)

    except vk_service.VkApiError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"ERROR: An unexpected error occurred during photo upload to album for project {project_id}: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during upload: {e}")


def get_albums(db: Session, project_id: str) -> List[Album]:
    albums = crud.get_albums_by_project(db, project_id)
    if not albums:
        print(f"SERVICE: No cached albums for project {project_id}. Fetching from VK...")
        return refresh_albums(db, project_id)
    return [Album.model_validate(a, from_attributes=True) for a in albums]

def refresh_albums(db: Session, project_id: str) -> List[Album]:
    project = crud.get_project_by_id(db, project_id)
    if not project: raise HTTPException(404, "Project not found")
    
    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
        owner_id_str = vk_service.vk_owner_id_string(numeric_id)

        # vk_service.get_albums использует call_vk_api, который имеет встроенную ротацию (read-rotation)
        vk_albums = vk_service.get_albums(owner_id_str, settings.vk_user_token)
        formatted_albums = [vk_service.format_album_data(a, owner_id_str) for a in vk_albums]
        
        crud.replace_albums_for_project(db, project_id, formatted_albums, _get_rounded_timestamp())
        
        return [Album(**a) for a in formatted_albums]
    except vk_service.VkApiError as e:
        raise HTTPException(400, f"VK API Error: {e}")
    except Exception as e:
        raise HTTPException(500, f"An unexpected error occurred: {e}")


def get_photos(db: Session, project_id: str, album_id: str, page: int) -> dict:
    if page == 1:
        count = crud.count_photos_in_album(db, album_id)
        if count == 0:
            album = crud.get_album_by_id(db, album_id)
            # Если альбом недавно проверялся и пуст, не делаем повторный запрос к VK
            if album and album.photos_last_updated:
                last_checked_dt = datetime.fromisoformat(album.photos_last_updated.replace('Z', '+00:00'))
                if datetime.now(timezone.utc) - last_checked_dt.replace(tzinfo=timezone.utc) < timedelta(hours=12):
                    print(f"SERVICE: Album {album_id} was recently checked and is empty. Returning cached empty state.")
                    return {"photos": [], "hasMore": False}

            print(f"SERVICE: No cached photos for album {album_id} (or cache is stale). Fetching ALL from VK...")
            return refresh_photos(db, project_id, album_id)

    photos_from_db = crud.get_photos_by_album(db, album_id, page, GALLERY_PAGE_SIZE)
    total_photos = crud.count_photos_in_album(db, album_id)
    has_more = (page * GALLERY_PAGE_SIZE) < total_photos
    
    return {
        "photos": [Photo.model_validate(p, from_attributes=True) for p in photos_from_db],
        "hasMore": has_more
    }

def refresh_photos(db: Session, project_id: str, album_id: str) -> dict:
    project = crud.get_project_by_id(db, project_id)
    if not project: raise HTTPException(404, "Project not found")

    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
        owner_id_str = vk_service.vk_owner_id_string(numeric_id)
        # album_id от VK - это только число, owner_id мы знаем
        vk_album_id = album_id.split('_')[1]

        # Использует call_vk_api с ротацией
        vk_photos = vk_service.get_all_photos_from_album(owner_id_str, vk_album_id, settings.vk_user_token)
        formatted_photos = [vk_service.format_photo_data(p) for p in vk_photos]
        
        crud.replace_photos_for_album(db, album_id, project_id, formatted_photos)

        # Обновляем метку времени проверки фотографий для этого альбома
        timestamp = _get_rounded_timestamp()
        crud.update_album_photos_timestamp(db, album_id, timestamp)
        
        # Возвращаем первую страницу с результатами напрямую, чтобы избежать рекурсии
        photos_page = formatted_photos[:GALLERY_PAGE_SIZE]
        has_more = len(formatted_photos) > GALLERY_PAGE_SIZE

        return {
            "photos": [Photo(**p) for p in photos_page],
            "hasMore": has_more
        }

    except vk_service.VkApiError as e:
        # При ошибке доступа тоже обновляем метку, чтобы не долбить VK API
        timestamp = _get_rounded_timestamp()
        crud.update_album_photos_timestamp(db, album_id, timestamp)
        raise HTTPException(400, f"VK API Error: {e}")
    except Exception as e:
        raise HTTPException(500, f"An unexpected error occurred: {e}")
