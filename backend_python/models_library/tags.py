from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from .associations import published_post_tags_association, scheduled_post_tags_association

class Tag(Base):
    __tablename__ = "tags"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    name = Column(String, nullable=False)
    keyword = Column(String, nullable=False, index=True)
    note = Column(Text, nullable=True)
    color = Column(String, nullable=False)

    published_posts = relationship("Post", secondary=published_post_tags_association, back_populates="tags")
    scheduled_posts = relationship("ScheduledPost", secondary=scheduled_post_tags_association, back_populates="tags")