
from sqlalchemy import Engine, inspect
from .utils import check_and_add_column
from models import MarketAlbum, MarketItem, MarketCategory

def migrate(engine: Engine):
    """Миграции для модуля товаров."""
    inspector = inspect(engine)

    # Миграция 14: Создать таблицы для товаров
    if not inspector.has_table("market_albums"):
        print("Table 'market_albums' not found. Creating it...")
        MarketAlbum.__table__.create(engine)
        print("Table 'market_albums' created successfully.")
    
    if not inspector.has_table("market_items"):
        print("Table 'market_items' not found. Creating it...")
        MarketItem.__table__.create(engine)
        print("Table 'market_items' created successfully.")

    # Миграция 16: Добавить поля sku, rating, reviews_count в market_items
    check_and_add_column(engine, 'market_items', 'sku', 'VARCHAR')
    check_and_add_column(engine, 'market_items', 'rating', 'VARCHAR')
    check_and_add_column(engine, 'market_items', 'reviews_count', 'INTEGER')
    
    # Миграция 17: Создать таблицу для категорий товаров
    if not inspector.has_table("market_categories"):
        print("Table 'market_categories' not found. Creating it...")
        MarketCategory.__table__.create(engine)
        print("Table 'market_categories' created successfully.")

    # Миграция 26: Добавить пропущенные поля в market_items (is_deleted, last_updated)
    check_and_add_column(
        engine, 
        'market_items', 
        'is_deleted', 
        'BOOLEAN DEFAULT FALSE NOT NULL' if 'sqlite' in engine.url.drivername else 'BOOLEAN DEFAULT FALSE'
    )
    check_and_add_column(engine, 'market_items', 'last_updated', 'VARCHAR')
