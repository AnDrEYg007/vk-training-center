
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base
from .types import EncryptedString

class AiToken(Base):
    __tablename__ = "ai_tokens"
    
    id = Column(String, primary_key=True, index=True) # UUID
    description = Column(String, nullable=True) # Описание (для чего токен)
    
    # Зашифрованный API ключ Gemini
    token = Column(EncryptedString, nullable=False)
    
    # Статус проверки токена: 'active' | 'error' | 'unknown'
    status = Column(String, default='unknown', nullable=False)
    # Сообщение об ошибке (если status='error')
    status_error = Column(Text, nullable=True)
    # Время последней проверки
    last_checked = Column(DateTime(timezone=True), nullable=True)

class AiTokenLog(Base):
    __tablename__ = "ai_token_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    token_id = Column(String, ForeignKey("ai_tokens.id", ondelete="SET NULL"), nullable=True, index=True)
    is_env_token = Column(Boolean, default=False)
    
    model_name = Column(String, index=True) # gemini-2.5-flash, gemma-2b, etc.
    status = Column(String) # 'success' | 'error'
    error_details = Column(Text, nullable=True)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)