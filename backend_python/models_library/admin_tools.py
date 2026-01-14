
from sqlalchemy import Column, Integer, String, Text, BigInteger, DateTime
from sqlalchemy.sql import func
from database import Base

class AdministeredGroup(Base):
    __tablename__ = "administered_groups"
    
    id = Column(BigInteger, primary_key=True, index=True) # VK Group ID
    
    name = Column(String)
    screen_name = Column(String)
    photo_200 = Column(String, nullable=True)
    
    members_count = Column(Integer, default=0)
    activity = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    # JSON list of account names/IDs that manage this group
    # e.g., ["ENV Token", "Ivan Ivanov (System)"]
    admin_sources = Column(Text, default="[]") 
    
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Новые поля для хранения информации об администраторах
    creator_id = Column(BigInteger, nullable=True)
    creator_name = Column(String, nullable=True)
    
    # JSON список всех администраторов (действующих и бывших)
    # Структура: [{id, first_name, last_name, role, status='active'|'inactive', permissions=[]}, ...]
    admins_data = Column(Text, nullable=True, default="[]")
