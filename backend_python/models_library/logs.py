
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base

class TokenLog(Base):
    __tablename__ = "token_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Чей это был токен?
    account_id = Column(String, ForeignKey("system_accounts.id", ondelete="SET NULL"), nullable=True, index=True)
    is_env_token = Column(Boolean, default=False)
    
    # Контекст запроса
    project_id = Column(String, nullable=True, index=True) # ID проекта, если известен
    method = Column(String, index=True) # например, wall.get
    
    # Результат
    status = Column(String) # 'success' | 'error'
    error_details = Column(Text, nullable=True)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
