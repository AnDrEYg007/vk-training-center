from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    vk_id = Column(Integer, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    avatar = Column(String)
    
    # Store tokens securely in production! For now, plain text for MVP.
    access_token = Column(String)
    refresh_token = Column(String, nullable=True)
    device_id = Column(String, nullable=True)
