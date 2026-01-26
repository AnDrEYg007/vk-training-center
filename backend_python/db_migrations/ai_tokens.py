
from sqlalchemy import Engine, inspect, text
from models import AiToken, AiTokenLog

def migrate(engine: Engine):
    """Миграции для AI токенов и логов."""
    inspector = inspect(engine)

    # Создать таблицу ai_tokens
    if not inspector.has_table("ai_tokens"):
        print("Table 'ai_tokens' not found. Creating it...")
        AiToken.__table__.create(engine)
        print("Table 'ai_tokens' created successfully.")

    # Создать таблицу ai_token_logs
    if not inspector.has_table("ai_token_logs"):
        print("Table 'ai_token_logs' not found. Creating it...")
        AiTokenLog.__table__.create(engine)
        print("Table 'ai_token_logs' created successfully.")

    # Добавить колонки status, status_error, last_checked в ai_tokens
    columns = [col['name'] for col in inspector.get_columns('ai_tokens')]
    
    if 'status' not in columns:
        print("Adding 'status' column to 'ai_tokens'...")
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE ai_tokens ADD COLUMN status VARCHAR DEFAULT 'unknown' NOT NULL"))
            conn.commit()
        print("Column 'status' added successfully.")
    
    if 'status_error' not in columns:
        print("Adding 'status_error' column to 'ai_tokens'...")
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE ai_tokens ADD COLUMN status_error TEXT"))
            conn.commit()
        print("Column 'status_error' added successfully.")
    
    if 'last_checked' not in columns:
        print("Adding 'last_checked' column to 'ai_tokens'...")
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE ai_tokens ADD COLUMN last_checked TIMESTAMP WITH TIME ZONE"))
            conn.commit()
        print("Column 'last_checked' added successfully.")
