
from sqlalchemy import Engine, inspect, MetaData, Table, Column, String, Text
from models import published_post_tags_association, scheduled_post_tags_association

def migrate(engine: Engine):
    """Миграции, связанные с тегами."""
    inspector = inspect(engine)
    
    # Миграция 2: Создать таблицу tags
    if not inspector.has_table("tags"):
        print("Table 'tags' not found. Creating it...")
        meta = MetaData()
        Table(
            "tags", meta,
            Column("id", String, primary_key=True),
            Column("project_id", String, index=True),
            Column("name", String, nullable=False),
            Column("keyword", String, nullable=False, index=True),
            Column("note", Text, nullable=True),
            Column("color", String, nullable=False)
        )
        meta.create_all(engine)
        print("Table 'tags' created successfully.")
        
    # Миграция 3: Создать ассоциативные таблицы для тегов
    if not inspector.has_table("published_post_tags"):
        print("Table 'published_post_tags' not found. Creating it...")
        published_post_tags_association.create(bind=engine)
        print("Table 'published_post_tags' created successfully.")
    
    if not inspector.has_table("scheduled_post_tags"):
        print("Table 'scheduled_post_tags' not found. Creating it...")
        scheduled_post_tags_association.create(bind=engine)
        print("Table 'scheduled_post_tags' created successfully.")
