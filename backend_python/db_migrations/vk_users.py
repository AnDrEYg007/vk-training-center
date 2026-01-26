"""
Миграция для создания таблицы vk_users.
Хранит авторизованных через VK OAuth пользователей.
"""

from sqlalchemy import text
from database import SessionLocal, SQLALCHEMY_DATABASE_URL

# Определяем тип базы данных
IS_SQLITE = "sqlite" in SQLALCHEMY_DATABASE_URL

def migrate():
    """Создает таблицу vk_users если её нет."""
    db = SessionLocal()
    try:
        # Проверяем, существует ли таблица (разный синтаксис для SQLite и PostgreSQL)
        if IS_SQLITE:
            result = db.execute(text(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='vk_users'"
            ))
            table_exists = result.scalar() is not None
        else:
            result = db.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vk_users')"
            ))
            table_exists = result.scalar()
        
        if not table_exists:
            print("🔄 Creating vk_users table...")
            db.execute(text("""
                CREATE TABLE vk_users (
                    vk_user_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    photo_url TEXT,
                    email TEXT,
                    access_token TEXT,
                    refresh_token TEXT,
                    token_expires_at TIMESTAMP,
                    scope TEXT,
                    app_id TEXT,
                    is_active BOOLEAN DEFAULT 1,
                    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            db.commit()
            print("✅ vk_users table created successfully!")
        else:
            print("ℹ️ vk_users table already exists, skipping...")
            
    except Exception as e:
        print(f"❌ Migration error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate()
