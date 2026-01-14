
from sqlalchemy import Column, String, BigInteger, Text
from database import Base

class SystemAccount(Base):
    __tablename__ = "system_accounts"
    
    id = Column(String, primary_key=True, index=True) # UUID
    vk_user_id = Column(BigInteger, unique=True, index=True) # Реальный ID VK
    
    full_name = Column(String)
    profile_url = Column(String)
    avatar_url = Column(String, nullable=True)
    token = Column(String, nullable=True) # Поле для токена (заполняется вручную)
    notes = Column(Text, nullable=True)
    status = Column(String, default='unknown') # active, error, unknown
