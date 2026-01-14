
from sqlalchemy import Engine, inspect, MetaData, Table, Column, String, Text
from .utils import check_and_add_column
from models import ProjectContextField, ProjectContextValue, ProjectContextFieldVisibility

def migrate(engine: Engine):
    """Миграции, связанные с таблицей projects и контекстом."""
    inspector = inspect(engine)
    
    # Миграция 1: Добавить поле vk_confirmation_code
    check_and_add_column(engine, 'projects', 'vk_confirmation_code', 'VARCHAR')
    
    # Миграция 4: Добавить поля для отслеживания времени обновления
    check_and_add_column(engine, 'projects', 'last_published_update', 'VARCHAR')
    check_and_add_column(engine, 'projects', 'last_scheduled_update', 'VARCHAR')
    
    # Миграция 10: Добавить поле archived
    check_and_add_column(
        engine,
        'projects',
        'archived',
        'BOOLEAN DEFAULT FALSE NOT NULL' if 'sqlite' in engine.url.drivername else 'BOOLEAN DEFAULT FALSE'
    )
    
    # Миграция 11: Добавить поле sort_order
    check_and_add_column(engine, 'projects', 'sort_order', 'INTEGER')
    
    # Миграция 15: Добавить поле last_market_update
    check_and_add_column(engine, 'projects', 'last_market_update', 'VARCHAR')

    # Миграция 34: Добавить поле additional_community_tokens
    check_and_add_column(engine, 'projects', 'additional_community_tokens', 'TEXT')
    
    # Миграция 46: Добавить поле avatar_url
    check_and_add_column(engine, 'projects', 'avatar_url', 'VARCHAR')

    # Миграция 36 (Project Context): Создание таблиц
    if not inspector.has_table("project_context_fields"):
        print("Table 'project_context_fields' not found. Creating it...")
        ProjectContextField.__table__.create(engine)
        print("Table 'project_context_fields' created successfully.")
        
    if not inspector.has_table("project_context_values"):
        print("Table 'project_context_values' not found. Creating it...")
        ProjectContextValue.__table__.create(engine)
        print("Table 'project_context_values' created successfully.")

    # Миграция 37 (Project Context Visibility)
    check_and_add_column(
        engine,
        'project_context_fields',
        'is_global',
        'BOOLEAN DEFAULT TRUE NOT NULL' if 'sqlite' in engine.url.drivername else 'BOOLEAN DEFAULT TRUE'
    )

    if not inspector.has_table("project_context_field_visibility"):
        print("Table 'project_context_field_visibility' not found. Creating it...")
        ProjectContextFieldVisibility.__table__.create(engine)
        print("Table 'project_context_field_visibility' created successfully.")
