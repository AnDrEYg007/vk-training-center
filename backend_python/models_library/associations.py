from sqlalchemy import Table, Column, String, ForeignKey
from database import Base

# Ассоциативная таблица для связи опубликованных постов и тегов (многие-ко-многим)
published_post_tags_association = Table(
    'published_post_tags', Base.metadata,
    Column('post_id', String, ForeignKey('posts.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', String, ForeignKey('tags.id', ondelete="CASCADE"), primary_key=True)
)

# Ассоциативная таблица для связи отложенных постов и тегов (многие-ко-многим)
scheduled_post_tags_association = Table(
    'scheduled_post_tags', Base.metadata,
    Column('post_id', String, ForeignKey('scheduled_posts.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', String, ForeignKey('tags.id', ondelete="CASCADE"), primary_key=True)
)