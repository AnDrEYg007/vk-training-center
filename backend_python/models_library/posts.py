
from sqlalchemy import Column, String, Text, ForeignKey, Boolean, Integer, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from .associations import published_post_tags_association, scheduled_post_tags_association

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, index=True)
    projectId = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    date = Column(String)
    text = Column(Text)
    images = Column(Text)
    attachments = Column(Text, nullable=True)
    vkPostUrl = Column(String, nullable=True)
    _lastUpdated = Column(String)

    tags = relationship("Tag", secondary=published_post_tags_association, back_populates="published_posts")

class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"
    id = Column(String, primary_key=True, index=True)
    projectId = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    date = Column(String)
    text = Column(Text)
    images = Column(Text)
    attachments = Column(Text, nullable=True)
    vkPostUrl = Column(String, nullable=True)
    _lastUpdated = Column(String)

    tags = relationship("Tag", secondary=scheduled_post_tags_association, back_populates="scheduled_posts")

class SystemPost(Base):
    __tablename__ = "system_posts"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    publication_date = Column(String, index=True)
    text = Column(Text)
    images = Column(Text) # JSON array of PhotoAttachment
    attachments = Column(Text, nullable=True) # JSON array of Attachment
    status = Column(String, default='pending_publication') # pending_publication, publishing, error, possible_error
    post_type = Column(String, default='regular') 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    vk_post_id = Column(String, nullable=True) # ID опубликованного поста в VK
    
    related_id = Column(String, nullable=True, index=True) # ID связанной сущности (например, конкурса)

    # Поля для циклических публикаций
    is_cyclic = Column(Boolean, default=False, nullable=False)
    recurrence_type = Column(String, nullable=True)
    recurrence_interval = Column(Integer, nullable=True)
    
    # Поля для расширенной настройки цикличности
    recurrence_end_type = Column(String, default='infinite') 
    recurrence_end_count = Column(Integer, nullable=True)
    recurrence_end_date = Column(String, nullable=True)
    recurrence_fixed_day = Column(Integer, nullable=True) 
    recurrence_is_last_day = Column(Boolean, default=False, nullable=False)
    
    # Поле для хранения параметров AI генерации
    ai_generation_params = Column(Text, nullable=True) # JSON

    # Новые поля для управления автоматизацией (Title, Description, Active)
    title = Column(String, nullable=True) # Название механики (например "Меню на завтра")
    description = Column(Text, nullable=True) # Описание для себя
    is_active = Column(Boolean, default=True, nullable=False) # Вкл/Выкл

class SuggestedPost(Base):
    __tablename__ = "suggested_posts"
    postId = Column(String, primary_key=True, index=True) # owner_id + id
    authorId = Column(String)
    projectId = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    date = Column(String)
    text = Column(Text)
    link = Column(String)
    imageUrl = Column(Text)
    authorLink = Column(String, nullable=True)
    _groupName = Column(String, nullable=True)
    _groupShort = Column(String, nullable=True)
    _lastUpdated = Column(String)

class Note(Base):
    __tablename__ = "notes"
    id = Column(String, primary_key=True, index=True)
    projectId = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    date = Column(String)
    title = Column(String, nullable=True)
    text = Column(Text)
    color = Column(String)
