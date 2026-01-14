from sqlalchemy import Column, String, Integer, ForeignKey
from database import Base

class Album(Base):
    __tablename__ = "albums"
    id = Column(String, primary_key=True) # ownerId_albumId
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    title = Column(String)
    size = Column(Integer)
    last_updated = Column(String)
    photos_last_updated = Column(String, nullable=True)

class Photo(Base):
    __tablename__ = "photos"
    id = Column(String, primary_key=True) # ownerId_photoId
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    album_id = Column(String, ForeignKey("albums.id", ondelete="CASCADE"), index=True) # ownerId_albumId
    url = Column(String)
    date = Column(Integer)