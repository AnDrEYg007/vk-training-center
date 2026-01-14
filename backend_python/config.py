
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Используем синтаксис Pydantic V2+ для конфигурации.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

    vk_user_token: str
    gemini_api_key: str
    admin_username: str = "admin"
    admin_password: str = "admin"
    
    # Ключ шифрования для чувствительных данных (Fernet Key)
    encryption_key: Optional[str] = None
    
    # НОВОЕ: Переменная для ротации ключа. Если задана, при старте произойдет перешифровка.
    encryption_key_new: Optional[str] = None
    
    # Добавляем опциональное поле для URL базы данных.
    database_url: Optional[str] = None
    
    # НОВОЕ: Опциональный URL для прокси-сервера для запросов к Gemini
    gemini_proxy_url: Optional[str] = None

    # НОВОЕ: Настройки Redis для синхронизации между воркерами/контейнерами
    redis_host: Optional[str] = None
    redis_port: int = 6379
    redis_password: Optional[str] = None

settings = Settings()
