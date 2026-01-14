
from typing import List, Dict, Any
from .token_manager import call_vk_api, publish_with_fallback

def create_album(owner_id: str, title: str, token: str) -> Dict:
    """Creates a new photo album."""
    # Используем publish_with_fallback для надежности при создании
    return publish_with_fallback({
        'owner_id': owner_id,
        'title': title
    }, method='photos.createAlbum', preferred_token=token)

def get_albums(owner_id: str, token: str) -> List[Dict]:
    """Fetches all photo albums."""
    # Используем call_vk_api с ротацией (для чтения)
    response = call_vk_api('photos.getAlbums', {
        'owner_id': owner_id,
        'need_system': 1,
        'access_token': token
    })
    return response.get('items', [])

def get_all_photos_from_album(owner_id: str, album_id: str, token: str) -> List[Dict]:
    """Fetches ALL photos from a specific album, handling pagination."""
    all_photos = []
    offset = 0
    count = 1000
    
    # Для чтения используем стандартный call_vk_api с ротацией
    while True:
        response = call_vk_api('photos.get', {
            'owner_id': owner_id,
            'album_id': album_id,
            'photo_sizes': 1,
            'offset': offset,
            'count': count,
            'access_token': token
        })
        items = response.get('items', [])
        all_photos.extend(items)
        
        if len(items) < count:
            break
        offset += count
        
    return all_photos

def get_latest_wall_posts(owner_id: str, token: str, count: int = 20) -> List[Dict]:
    """
    Fetches the latest few posts from a wall.
    """
    response = call_vk_api('wall.get', {
        'owner_id': owner_id,
        'count': count,
        'access_token': token
    })
    return response.get('items', [])

def create_comment(owner_id: int, post_id: int, message: str, token: str, from_group: int = 1) -> Dict:
    """
    Adds a comment to a post.
    Using publish_with_fallback to ensure it works even if some tokens are blocked.
    """
    params = {
        'owner_id': owner_id,
        'post_id': post_id,
        'message': message,
        'from_group': from_group
    }
    return publish_with_fallback(params, method='wall.createComment', preferred_token=token)
