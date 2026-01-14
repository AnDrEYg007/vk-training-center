
from sqlalchemy import Engine, inspect
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
