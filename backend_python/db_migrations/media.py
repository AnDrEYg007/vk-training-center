
from sqlalchemy import Engine, inspect
from .utils import check_and_add_column
from models import Album, Photo

def migrate(engine: Engine):
    """Миграции для галереи и медиа."""
    inspector = inspect(engine)

    # Миграция 5: Создать таблицы для кеша галереи
    if not inspector.has_table("albums"):
        print("Table 'albums' not found. Creating it...")
        Album.__table__.create(engine)
        print("Table 'albums' created successfully.")
        
    if not inspector.has_table("photos"):
        print("Table 'photos' not found. Creating it...")
        Photo.__table__.create(engine)
        print("Table 'photos' created successfully.")

    # Миграция 6: Добавить поле photos_last_updated в таблицу albums
    check_and_add_column(engine, 'albums', 'photos_last_updated', 'VARCHAR')
