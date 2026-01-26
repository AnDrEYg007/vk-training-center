"""
Модель для хранения авторизованных VK пользователей.
Используется для отслеживания пользователей, которые прошли VK OAuth авторизацию.
"""

from sqlalchemy import Column, String, Text, DateTime, Boolean
from database import Base
from datetime import datetime


class VkUser(Base):
    """
    VK пользователь, авторизованный через OAuth.
    
    Attributes:
        vk_user_id: ID пользователя в VK
        first_name: Имя
        last_name: Фамилия
        photo_url: URL аватарки
        email: Email (если есть доступ)
        access_token: Токен доступа (зашифрованный)
        refresh_token: Токен обновления (если есть)
        token_expires_at: Время истечения токена
        scope: Разрешения, которые дал пользователь
        app_id: ID VK приложения, через которое авторизовался
        is_active: Активен ли пользователь
        last_login: Последний вход
        created_at: Дата первой авторизации
    """
    __tablename__ = "vk_users"
    
    vk_user_id = Column(String, primary_key=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Токены (в продакшне стоит зашифровать через EncryptedString)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    
    # Метаданные авторизации
    scope = Column(String, nullable=True)
    app_id = Column(String, nullable=True)
    
    # Статус
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
