from sqlalchemy import Column, String, Integer, Text, Boolean, BigInteger, ForeignKey
from database import Base

class MarketCategory(Base):
    __tablename__ = "market_categories"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    section_id = Column(Integer)
    section_name = Column(String)

class MarketAlbum(Base):
    __tablename__ = "market_albums"
    id = Column(String, primary_key=True) # -ownerId_albumId
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    title = Column(String)
    count = Column(Integer)
    updated_time = Column(BigInteger)
    last_updated = Column(String)

    @property
    def album_id(self) -> int:
        try:
            return int(self.id.split('_')[1])
        except (IndexError, ValueError):
            return 0

    @property
    def owner_id(self) -> int:
        try:
            return int(self.id.split('_')[0])
        except (IndexError, ValueError):
            return 0

class MarketItem(Base):
    __tablename__ = "market_items"
    id = Column(String, primary_key=True) # -ownerId_itemId
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    title = Column(String)
    description = Column(Text)
    price = Column(Text) # JSON
    category = Column(Text) # JSON
    thumb_photo = Column(String)
    availability = Column(Integer)
    date = Column(Integer) 
    album_ids = Column(Text) # JSON list of album IDs
    sku = Column(String, nullable=True)
    rating = Column(String, nullable=True)
    reviews_count = Column(Integer, nullable=True)
    is_deleted = Column(Boolean, default=False)
    last_updated = Column(String)

    @property
    def item_id(self) -> int:
        try:
            return int(self.id.split('_')[1])
        except (IndexError, ValueError):
            return 0

    @property
    def owner_id(self) -> int:
        try:
            return int(self.id.split('_')[0])
        except (IndexError, ValueError):
            return 0
