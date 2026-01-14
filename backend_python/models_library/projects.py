
from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from .types import EncryptedString

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, index=True)
    vkProjectId = Column(String)
    vkGroupShortName = Column(String)
    vkGroupName = Column(String)
    vkLink = Column(String)
    
    # Новое поле для аватарки
    avatar_url = Column(String, nullable=True)
    
    name = Column(String)
    team = Column(String, nullable=True)
    disabled = Column(Boolean, default=False)
    archived = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)
    variables = Column(Text, nullable=True)
    vk_confirmation_code = Column(String, nullable=True)
    
    # Зашифрованный токен сообщества
    communityToken = Column(EncryptedString, nullable=True)
    
    # Зашифрованный JSON-список дополнительных токенов
    additional_community_tokens = Column(EncryptedString, nullable=True) 
    
    sort_order = Column(Integer, nullable=True, index=True)
    
    last_published_update = Column(String, nullable=True)
    last_scheduled_update = Column(String, nullable=True)
    last_market_update = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    full_name = Column(String)
    username = Column(String, unique=True, index=True)
    password = Column(String)

# Новые модели для Контекста Проекта
class ProjectContextField(Base):
    __tablename__ = "project_context_fields"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False) # Название колонки (Бренд, Тональность)
    description = Column(String, nullable=True) # Описание (опционально)
    is_global = Column(Boolean, default=True, nullable=False) # Глобальное поле или нет

class ProjectContextFieldVisibility(Base):
    __tablename__ = "project_context_field_visibility"
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True)
    field_id = Column(String, ForeignKey("project_context_fields.id", ondelete="CASCADE"), primary_key=True)

class ProjectContextValue(Base):
    __tablename__ = "project_context_values"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    field_id = Column(String, ForeignKey("project_context_fields.id", ondelete="CASCADE"), index=True)
    value = Column(Text, nullable=True)
