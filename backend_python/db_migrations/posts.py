
from sqlalchemy import Engine, inspect
from .utils import check_and_add_column
from models import SystemPost

def migrate(engine: Engine):
    """Миграции для всех типов постов."""
    inspector = inspect(engine)
    
    # Миграция 7: Создать таблицу system_posts для системных публикаций
    if not inspector.has_table("system_posts"):
        print("Table 'system_posts' not found. Creating it...")
        SystemPost.__table__.create(engine)
        print("Table 'system_posts' created successfully.")
        
    # Миграция 8: Добавить поле vk_post_id в таблицу system_posts
    check_and_add_column(engine, 'system_posts', 'vk_post_id', 'VARCHAR')

    # Миграция 9: Добавить поле vkPostUrl в таблицы posts и scheduled_posts
    check_and_add_column(engine, 'posts', 'vkPostUrl', 'VARCHAR')
    check_and_add_column(engine, 'scheduled_posts', 'vkPostUrl', 'VARCHAR')

    # Миграция 18: Добавить поля для циклических публикаций в system_posts
    check_and_add_column(
        engine,
        'system_posts',
        'is_cyclic',
        'BOOLEAN DEFAULT FALSE NOT NULL' if 'sqlite' in engine.url.drivername else 'BOOLEAN DEFAULT FALSE'
    )
    check_and_add_column(engine, 'system_posts', 'recurrence_type', 'VARCHAR')
    check_and_add_column(engine, 'system_posts', 'recurrence_interval', 'INTEGER')
    
    # Миграция 19: Добавить поля для расширенной настройки цикличности
    check_and_add_column(engine, 'system_posts', 'recurrence_end_type', 'VARCHAR DEFAULT \'infinite\'')
    check_and_add_column(engine, 'system_posts', 'recurrence_end_count', 'INTEGER')
    check_and_add_column(engine, 'system_posts', 'recurrence_end_date', 'VARCHAR')
    check_and_add_column(engine, 'system_posts', 'recurrence_fixed_day', 'INTEGER')
    check_and_add_column(
        engine, 
        'system_posts', 
        'recurrence_is_last_day', 
        'BOOLEAN DEFAULT FALSE NOT NULL' if 'sqlite' in engine.url.drivername else 'BOOLEAN DEFAULT FALSE'
    )
    
    # Миграция 47: Добавить поле ai_generation_params
    check_and_add_column(engine, 'system_posts', 'ai_generation_params', 'TEXT')

    # Миграция 48: Добавить поля названия, описания и активности для системных постов
    check_and_add_column(engine, 'system_posts', 'title', 'VARCHAR')
    check_and_add_column(engine, 'system_posts', 'description', 'TEXT')
    check_and_add_column(
        engine, 
        'system_posts', 
        'is_active', 
        'BOOLEAN DEFAULT TRUE NOT NULL' if 'sqlite' in engine.url.drivername else 'BOOLEAN DEFAULT TRUE'
    )

    # Миграция 49: Добавить поле related_id для связи с другими сущностями (например, конкурсами)
    check_and_add_column(engine, 'system_posts', 'related_id', 'VARCHAR')
