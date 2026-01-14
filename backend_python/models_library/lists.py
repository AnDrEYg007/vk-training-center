
from sqlalchemy import Column, String, Integer, Boolean, BigInteger, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base

class ProjectListMeta(Base):
    __tablename__ = "project_list_meta"
    id = Column(String, primary_key=True) # project_id
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    subscribers_last_updated = Column(String, nullable=True)
    subscribers_count = Column(Integer, default=0)
    
    history_join_last_updated = Column(String, nullable=True)
    history_join_count = Column(Integer, default=0)
    
    history_leave_last_updated = Column(String, nullable=True)
    history_leave_count = Column(Integer, default=0)
    
    # Новый счетчик для рассылки
    mailing_last_updated = Column(String, nullable=True)
    mailing_count = Column(Integer, default=0)

    posts_last_updated = Column(String, nullable=True)
    posts_count = Column(Integer, default=0) # Количество в VK
    stored_posts_count = Column(Integer, default=0) # Количество, сохраненное в нашей БД
    
    # Взаимодействия (счетчики и время)
    likes_count = Column(Integer, default=0)
    likes_last_updated = Column(String, nullable=True)
    
    comments_count = Column(Integer, default=0)
    comments_last_updated = Column(String, nullable=True)
    
    reposts_count = Column(Integer, default=0)
    reposts_last_updated = Column(String, nullable=True)

    # Автоматизации: Конкурс отзывов
    reviews_participants_count = Column(Integer, default=0)
    reviews_winners_count = Column(Integer, default=0)
    reviews_posts_count = Column(Integer, default=0)

    # NEW: Авторы постов
    authors_count = Column(Integer, default=0)
    authors_last_updated = Column(String, nullable=True)


class SystemListSubscriber(Base):
    __tablename__ = "system_list_subscribers"
    id = Column(String, primary_key=True) # project_id_userid
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    vk_user_id = Column(BigInteger, index=True)
    
    first_name = Column(String)
    last_name = Column(String)
    sex = Column(Integer) # 1 female, 2 male, 0 unknown
    photo_url = Column(String, nullable=True)
    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True)
    deactivated = Column(String, nullable=True) 
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type
    
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    source = Column(String, default='manual') 

# NEW: Модель для авторов постов (аналогична подписчикам и истории)
class SystemListAuthor(Base):
    __tablename__ = "system_list_authors"
    # Используем составной ключ project_id_userid для уникальности
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    vk_user_id = Column(BigInteger, index=True)
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type
    
    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    can_access_closed = Column(Boolean, nullable=True)
    
    # Дата первого обнаружения как автора (аналог added_at или event_date)
    event_date = Column(DateTime(timezone=True))
    source = Column(String, default='posts_sync')

class SystemListMailing(Base):
    """Пользователи, у которых есть диалог с сообществом (В рассылке)"""
    __tablename__ = "system_list_mailing"
    id = Column(String, primary_key=True) # project_id_userid
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    vk_user_id = Column(BigInteger, index=True)
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    
    # Статусы и доп поля
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type

    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True) # Мапится из can_write.allowed
    
    last_message_date = Column(DateTime(timezone=True)) # Дата последнего сообщения
    conversation_status = Column(String, nullable=True) # active, blocked, etc
    
    # Добавлены поля для отслеживания сбора
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    source = Column(String, default='manual')

    # NEW: Данные анализа (Первый контакт)
    first_message_date = Column(DateTime(timezone=True), nullable=True)
    first_message_from_id = Column(BigInteger, nullable=True)

class SystemListHistoryJoin(Base):
    __tablename__ = "system_list_history_join"
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    vk_user_id = Column(BigInteger, index=True)
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type
    
    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True)
    
    event_date = Column(DateTime(timezone=True))
    source = Column(String, default='manual')

class SystemListHistoryLeave(Base):
    __tablename__ = "system_list_history_leave"
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    vk_user_id = Column(BigInteger, index=True)
    
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type

    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True)

    event_date = Column(DateTime(timezone=True))
    source = Column(String, default='manual')

class SystemListPost(Base):
    __tablename__ = "system_list_posts"
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    vk_post_id = Column(BigInteger, index=True)
    
    date = Column(DateTime(timezone=True))
    text = Column(Text, nullable=True)
    image_url = Column(String, nullable=True) 
    vk_link = Column(String)
    
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    reposts_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    
    can_post_comment = Column(Boolean, default=True)
    can_like = Column(Boolean, default=True)
    user_likes = Column(Boolean, default=False)
    
    # ID автора поста (если есть подпись)
    signer_id = Column(BigInteger, nullable=True)
    # NEW: ID автора поста из объекта post_author_data (приоритетный)
    post_author_id = Column(BigInteger, nullable=True)
    
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class SystemListLikes(Base):
    __tablename__ = "system_list_likes"
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    vk_user_id = Column(BigInteger, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type
    
    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True)
    
    last_interaction_date = Column(DateTime(timezone=True))
    last_post_id = Column(String, nullable=True) 
    interaction_count = Column(Integer, default=0)
    post_ids = Column(Text) 

class SystemListComments(Base):
    __tablename__ = "system_list_comments"
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    vk_user_id = Column(BigInteger, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type
    
    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True)
    
    last_interaction_date = Column(DateTime(timezone=True))
    last_post_id = Column(String, nullable=True)
    interaction_count = Column(Integer, default=0)
    post_ids = Column(Text) 

class SystemListReposts(Base):
    __tablename__ = "system_list_reposts"
    id = Column(String, primary_key=True) 
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    vk_user_id = Column(BigInteger, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    sex = Column(Integer, nullable=True)
    photo_url = Column(String, nullable=True)
    deactivated = Column(String, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    platform = Column(Integer, nullable=True) # 1-7 device type

    domain = Column(String, nullable=True)
    bdate = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    has_mobile = Column(Boolean, nullable=True)
    is_closed = Column(Boolean, default=False)
    # Убрано default=True
    can_access_closed = Column(Boolean, nullable=True)
    
    last_interaction_date = Column(DateTime(timezone=True))
    last_post_id = Column(String, nullable=True)
    interaction_count = Column(Integer, default=0)
    post_ids = Column(Text)
