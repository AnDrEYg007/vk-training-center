
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis
import json

# Импортируем наш централизованный объект настроек
from config import settings

# ===================================================================
# ДИНАМИЧЕСКИЙ ВЫБОР БАЗЫ ДАННЫХ
# ===================================================================
# Эта логика позволяет приложению работать как с PostgreSQL в "боевом"
# окружении, так и с локальной SQLite для разработки.
#
# 1. Если в переменных окружения (в .env или в настройках контейнера) 
#    задана переменная DATABASE_URL, будет использоваться PostgreSQL.
#    Это основной сценарий для развертывания в Yandex.Cloud.
#
# 2. Если DATABASE_URL не задана, приложение по умолчанию будет использовать
#    локальную базу данных SQLite в файле ./vk_planner.db (в текущей папке).
#    Это основной сценарий для локальной разработки, совместимый с Windows, macOS и Linux.
# ===================================================================

# ИЗМЕНЕНО: Путь к SQLite изменен на относительный для совместимости с Windows.
SQLALCHEMY_DATABASE_URL = settings.database_url if settings.database_url else "sqlite:///./vk_planner.db"

# SQLAlchemy 2.0+ требует, чтобы URL для psycopg2 начинался с 'postgresql+psycopg2://'
# Yandex.Cloud предоставляет URL, начинающийся с 'postgres://', поэтому мы его заменяем.
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

# Настройка аргументов подключения
connect_args = {}
engine_args = {}

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args["check_same_thread"] = False
else:
    # Для PostgreSQL добавляем настройки пула для предотвращения обрывов соединений
    # pool_pre_ping=True: Проверяет соединение перед выдачей (SELECT 1). Решает проблему "SSL SYSCALL error".
    # pool_recycle=1800: Пересоздает соединения каждые 30 минут, чтобы избежать таймаутов со стороны облака.
    # pool_size=10: Оптимизировано для многопроцессного запуска (4 workers * 10 = 40 conn).
    # max_overflow=20: Разрешаем временное превышение лимита при пиковых нагрузках.
    engine_args["pool_pre_ping"] = True
    engine_args["pool_recycle"] = 1800
    engine_args["pool_size"] = 10 
    engine_args["max_overflow"] = 20

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args=connect_args,
    **engine_args
)

# ФИКС: Добавляем поддержку регистронезависимого поиска (lower) для кириллицы в SQLite.
# По умолчанию SQLite lower() работает только с ASCII, что ломает поиск (ilike) для русского языка.
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        # Регистрируем функцию lower, использующую Python реализацию (корректный юникод)
        dbapi_connection.create_function("lower", 1, lambda s: s.lower() if s else s)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===================================================================
# REDIS CLIENT (SINGLETON)
# ===================================================================
# Используется для хранения горячих данных (статусы задач, флаги обновлений),
# которые должны быть доступны всем инстансам контейнера.
# ===================================================================
redis_client = None
if settings.redis_host:
    try:
        redis_client = redis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            password=settings.redis_password,
            decode_responses=True, # Автоматически декодировать bytes в str
            socket_timeout=5
        )
        redis_client.ping() # Проверка соединения
        print(f"✅ Redis connected successfully: {settings.redis_host}")
    except Exception as e:
        print(f"⚠️ Redis connection failed: {e}. Fallback to in-memory storage.")
        redis_client = None
else:
    print("ℹ️ Redis not configured. Using in-memory storage (not suitable for multi-instance deployment).")
