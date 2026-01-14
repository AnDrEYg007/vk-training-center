from typing import List, Dict, Optional
from datetime import datetime

def _extract_photos(attachments: Optional[List[Dict]]) -> List[Dict]:
    if not attachments: return []
    
    photos = []
    for att in attachments:
        if att['type'] == 'photo' and 'sizes' in att.get('photo', {}):
            best_size = sorted(att['photo']['sizes'], key=lambda s: s['width'] * s['height'], reverse=True)[0]
            photos.append({
                "id": f"photo{att['photo']['owner_id']}_{att['photo']['id']}",
                "url": best_size['url']
            })
    return photos

def _extract_other_attachments(attachments: Optional[List[Dict]]) -> List[Dict]:
    if not attachments: return []
    
    other_atts = []
    supported_types = {'poll', 'doc', 'video', 'audio', 'link'}
    for att in attachments:
        att_type = att['type']
        if att_type not in supported_types: continue

        desc, att_id = "", ""
        try:
            if att_type == 'poll':
                desc = f"Опрос: {att['poll']['question']}"
                att_id = f"poll{att['poll']['owner_id']}_{att['poll']['id']}"
            elif att_type == 'doc':
                desc = f"Документ: {att['doc']['title']}"
                att_id = f"doc{att['doc']['owner_id']}_{att['doc']['id']}"
            elif att_type == 'video':
                desc = f"Видео: {att['video']['title']}"
                att_id = f"video{att['video']['owner_id']}_{att['video']['id']}"
            elif att_type == 'audio':
                desc = f"Аудио: {att['audio']['artist']} - {att['audio']['title']}"
                att_id = f"audio{att['audio']['owner_id']}_{att['audio']['id']}"
            elif att_type == 'link':
                desc = f"Ссылка: {att['link'].get('title') or att['link'].get('caption', '')}"
                att_id = att['link']['url']
            if desc and att_id:
                other_atts.append({"id": att_id, "type": att_type, "description": desc})
        except KeyError:
            continue
    return other_atts

def format_vk_post(vk_post: Dict, is_published: bool) -> Dict:
    owner_id = vk_post['owner_id']
    post_id = vk_post['id']
    post_date = int(vk_post['date'])
    
    return {
        "id": f"{owner_id}_{post_id}",
        "date": datetime.utcfromtimestamp(post_date).isoformat() + 'Z',
        "text": vk_post.get('text', ''),
        "images": _extract_photos(vk_post.get('attachments')),
        "attachments": _extract_other_attachments(vk_post.get('attachments')),
        "vkPostUrl": f"https://vk.com/wall{owner_id}_{post_id}" + ("?postponed=1" if not is_published else "")
    }

def format_suggested_vk_post(vk_post: Dict, internal_project_id: str) -> Dict:
    owner_id = vk_post['owner_id']
    post_id = vk_post['id']
    post_date = int(vk_post['date'])
    
    return {
        "id": f"{owner_id}_{post_id}",
        "authorId": str(owner_id),
        "projectId": internal_project_id,
        "date": datetime.utcfromtimestamp(post_date).isoformat() + 'Z',
        "text": vk_post.get('text', ''),
        # Добавлен параметр ?w=wall... для открытия поста в слое
        "link": f"https://vk.com/wall{owner_id}_{post_id}?w=wall{owner_id}_{post_id}",
        "imageUrl": [p['url'] for p in _extract_photos(vk_post.get('attachments'))],
        "authorLink": f"https://vk.com/public{abs(owner_id)}",
    }
    
def format_album_data(vk_album: Dict, owner_id: str) -> Dict:
    """Formats VK album object to our internal schema."""
    return {
        "id": f"{owner_id}_{vk_album['id']}",
        "title": vk_album['title'],
        "size": vk_album['size']
    }

def format_photo_data(vk_photo: Dict) -> Dict:
    """Formats VK photo object to our internal schema, finding the best URL."""
    sizes = vk_photo.get('sizes', [])
    best_size = sorted(sizes, key=lambda s: s['width'], reverse=True)[0] if sizes else {}
    
    return {
        "id": f"{vk_photo['owner_id']}_{vk_photo['id']}",
        "url": best_size.get('url', ''),
        "date": vk_photo['date']
    }
    
# --- Новые форматтеры для товаров ---

def format_market_album(vk_album: Dict) -> Dict:
    """Форматирует объект подборки VK в нашу внутреннюю схему."""
    return {
        "id": vk_album['id'],
        "owner_id": vk_album['owner_id'],
        "title": vk_album['title'],
        "count": vk_album['count'],
        "updated_time": vk_album['updated_time'],
    }

def format_market_item(vk_item: Dict) -> Dict:
    """Форматирует объект товара VK в нашу внутреннюю схему."""
    return {
        "id": vk_item['id'],
        "owner_id": vk_item['owner_id'],
        "title": vk_item['title'],
        "description": vk_item['description'],
        "price": vk_item['price'],
        "category": vk_item['category'],
        "date": vk_item['date'],
        "thumb_photo": vk_item['thumb_photo'],
        "availability": vk_item['availability'],
        "is_deleted": vk_item.get('is_deleted', False),
        "album_ids": vk_item.get('album_ids', []),
        "sku": vk_item.get('sku'),
        "rating": vk_item.get('rating'),
        "reviews_count": vk_item.get('reviews_count'),
    }