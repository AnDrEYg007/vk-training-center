
from sqlalchemy.orm import Session
import json

import models
from schemas import MarketAlbum, MarketItem

# ===============================================
# MARKET CATEGORIES
# ===============================================

def get_market_categories_count(db: Session) -> int:
    return db.query(models.MarketCategory).count()

def get_all_market_categories(db: Session) -> list[models.MarketCategory]:
    """Возвращает все категории товаров из кеша, отсортированные по секциям и названиям."""
    return db.query(models.MarketCategory).order_by(models.MarketCategory.section_name, models.MarketCategory.name).all()

def replace_market_categories(db: Session, categories_data: list[dict]):
    """
    Заменяет все категории товаров в базе данных.
    Принимает плоский список категорий от VK API (без extended=1).
    Использует merge для безопасного обновления.
    """
    if not categories_data:
        return

    # 1. Собираем ID новых категорий
    incoming_ids = [cat['id'] for cat in categories_data]

    # 2. Удаляем старые, которых нет в новом списке
    db.query(models.MarketCategory).filter(
        models.MarketCategory.id.notin_(incoming_ids)
    ).delete(synchronize_session=False)

    # 3. Обновляем или создаем новые (Upsert)
    for category in categories_data:
        section = category.get('section')
        if section:
            db_obj = models.MarketCategory(
                id=category['id'],
                name=category['name'],
                section_id=section['id'],
                section_name=section['name']
            )
            db.merge(db_obj)
    
    db.commit()


# ===============================================
# MARKET ALBUMS
# ===============================================

def get_market_albums_by_project(db: Session, project_id: str) -> list[models.MarketAlbum]:
    return db.query(models.MarketAlbum).filter(models.MarketAlbum.project_id == project_id).all()

def replace_market_albums_for_project(db: Session, project_id: str, albums_data: list[dict], timestamp: str):
    """
    Безопасная синхронизация альбомов.
    Удаляет только отсутствующие, существующие обновляет через merge.
    """
    # 1. Формируем список ID, которые пришли от VK
    incoming_ids = []
    for album in albums_data:
        # Формируем ID так же, как в модели: -ownerId_albumId
        pk = f"-{abs(album['owner_id'])}_{album['id']}"
        incoming_ids.append(pk)

    # 2. Удаляем из БД альбомы этого проекта, которых НЕТ в новом списке
    if incoming_ids:
        db.query(models.MarketAlbum).filter(
            models.MarketAlbum.project_id == project_id,
            models.MarketAlbum.id.notin_(incoming_ids)
        ).delete(synchronize_session=False)
    else:
        # Если список пуст, удаляем все альбомы проекта
        db.query(models.MarketAlbum).filter(
            models.MarketAlbum.project_id == project_id
        ).delete(synchronize_session=False)

    # 3. Обновляем или вставляем новые (Merge)
    for album in albums_data:
        pk = f"-{abs(album['owner_id'])}_{album['id']}"
        db_album = models.MarketAlbum(
            id=pk,
            project_id=project_id,
            title=album['title'],
            count=album['count'],
            updated_time=album['updated_time'],
            last_updated=timestamp
        )
        db.merge(db_album)

    db.commit()

def create_market_album(db: Session, album: models.MarketAlbum) -> models.MarketAlbum:
    """Создает новую подборку товаров в БД."""
    db.add(album)
    db.commit()
    db.refresh(album)
    return album

def decrement_market_album_count(db: Session, album_pk: str):
    """Уменьшает счетчик товаров в подборке на 1."""
    album = db.query(models.MarketAlbum).filter(models.MarketAlbum.id == album_pk).first()
    if album and album.count > 0:
        album.count -= 1
        db.commit()

# ===============================================
# MARKET ITEMS
# ===============================================

def get_market_items_by_project(db: Session, project_id: str) -> list[models.MarketItem]:
    return db.query(models.MarketItem).filter(models.MarketItem.project_id == project_id).all()

def get_market_items_count_by_project(db: Session, project_id: str) -> int:
    return db.query(models.MarketItem).filter(models.MarketItem.project_id == project_id).count()

def get_market_item_by_vk_id(db: Session, owner_id: int, item_id: int) -> models.MarketItem:
    """Находит один товар по его составному VK ID."""
    pk_id = f"-{abs(owner_id)}_{item_id}"
    return db.query(models.MarketItem).filter(models.MarketItem.id == pk_id).first()

def replace_market_items_for_project(db: Session, project_id: str, items_data: list[dict], timestamp: str):
    """
    Безопасная синхронизация товаров.
    Удаляет только отсутствующие, существующие обновляет через merge.
    """
    # 1. Формируем список ID, которые пришли от VK
    incoming_ids = []
    for item in items_data:
        pk = f"-{abs(item['owner_id'])}_{item['id']}"
        incoming_ids.append(pk)

    # 2. Удаляем из БД товары этого проекта, которых НЕТ в новом списке
    if incoming_ids:
        db.query(models.MarketItem).filter(
            models.MarketItem.project_id == project_id,
            models.MarketItem.id.notin_(incoming_ids)
        ).delete(synchronize_session=False)
    else:
        db.query(models.MarketItem).filter(
            models.MarketItem.project_id == project_id
        ).delete(synchronize_session=False)

    # 3. Обновляем или вставляем новые (Merge)
    for item in items_data:
        pk = f"-{abs(item['owner_id'])}_{item['id']}"
        
        db_item = models.MarketItem(
            id=pk,
            project_id=project_id,
            title=item['title'],
            description=item['description'],
            price=json.dumps(item['price']),
            category=json.dumps(item['category']),
            thumb_photo=item.get('thumb_photo', ''), # Безопасное получение
            availability=item['availability'],
            date=item.get('date', 0), # Безопасное получение даты
            album_ids=json.dumps(item.get('album_ids', [])),
            sku=item.get('sku'),
            rating=str(item.get('rating')) if item.get('rating') is not None else None,
            reviews_count=item.get('reviews_count'),
            last_updated=timestamp
        )
        db.merge(db_item)
        
    db.commit()

def update_market_item(db: Session, item_data: MarketItem) -> models.MarketItem:
    item_id = f"-{abs(item_data.owner_id)}_{item_data.id}"
    db_item = db.query(models.MarketItem).filter(models.MarketItem.id == item_id).first()
    if not db_item:
        return None
    
    # ЛОГИРОВАНИЕ 7: Внутри CRUD
    print(f"[CRUD - market.update_item] > Найден товар {item_id} в БД. Применение обновлений перед коммитом...")
    print(f"[CRUD - market.update_item] >> Старое название: '{db_item.title}', Новое: '{item_data.title}'")
    print(f"[CRUD - market.update_item] >> Старый артикул: '{db_item.sku}', Новый: '{item_data.sku}'")
    
    db_item.title = item_data.title
    db_item.description = item_data.description
    db_item.price = json.dumps(item_data.price.model_dump())
    db_item.sku = item_data.sku
    db_item.album_ids = json.dumps(item_data.album_ids or [])
    # ИСПРАВЛЕНИЕ: Добавлено сохранение категории в локальную БД
    db_item.category = json.dumps(item_data.category)
    
    db.commit()
    print(f"[CRUD - market.update_item] > Коммит для товара {item_id} успешно выполнен.")
    db.refresh(db_item)
    return db_item

def delete_market_item(db: Session, item_pk: str):
    """Удаляет товар из БД по его составному ID."""
    db.query(models.MarketItem).filter(models.MarketItem.id == item_pk).delete()
    db.commit()
