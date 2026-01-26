
from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class VkCallbackLog(Base):
    __tablename__ = "vk_callback_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Метаданные
    type = Column(String, index=True) # например, 'confirmation', 'wall_post_new'
    group_id = Column(Integer, index=True)
    
    # Полное тело запроса
    payload = Column(Text) # JSON string
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
