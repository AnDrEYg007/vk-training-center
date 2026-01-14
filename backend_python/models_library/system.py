
from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Float, BigInteger
from sqlalchemy.sql import func
from database import Base
from .types import EncryptedString

class SystemAccount(Base):
    __tablename__ = "system_accounts"
    
    id = Column(String, primary_key=True, index=True) # UUID
    vk_user_id = Column(BigInteger, unique=True, index=True) # Реальный ID VK
    
    full_name = Column(String)
    profile_url = Column(String)
    avatar_url = Column(String, nullable=True)
    
    # Зашифрованный токен пользователя
    token = Column(EncryptedString, nullable=True)
    
    notes = Column(Text, nullable=True)
    status = Column(String, default='unknown') # active, error, unknown

class TokenLog(Base):
    __tablename__ = "token_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Чей это был токен?
    account_id = Column(String, nullable=True, index=True) # ForeignKey("system_accounts.id") убран для гибкости
    is_env_token = Column(Boolean, default=False)
    
    # Контекст запроса
    project_id = Column(String, nullable=True, index=True) # ID проекта, если известен
    method = Column(String, index=True) # например, wall.get
    
    # Результат
    status = Column(String) # 'success' | 'error'
    error_details = Column(Text, nullable=True)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class SystemTask(Base):
    __tablename__ = "system_tasks"

    id = Column(String, primary_key=True, index=True) # Task UUID
    
    # Метаданные
    project_id = Column(String, nullable=True, index=True)
    list_type = Column(String, nullable=True) # subscribers, posts, etc.
    
    # Состояние
    status = Column(String) # pending, fetching, processing, done, error
    loaded = Column(Integer, default=0)
    total = Column(Integer, default=0)
    message = Column(String, nullable=True)
    error = Column(Text, nullable=True)
    
    # Время
    created_at = Column(Float) # timestamp
    updated_at = Column(Float) # timestamp