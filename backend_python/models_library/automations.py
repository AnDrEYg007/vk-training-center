
from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey, DateTime, BigInteger
from sqlalchemy.sql import func
from database import Base

class ReviewContest(Base):
    __tablename__ = "review_contests"
    
    id = Column(String, primary_key=True, index=True) # UUID
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True, unique=True)
    
    # Основные настройки
    is_active = Column(Boolean, default=False)
    keywords = Column(String, nullable=True)
    start_date = Column(String, nullable=True) # ISO Date string
    
    # Условия завершения
    finish_condition = Column(String, default='date') # count, date, mixed
    target_count = Column(Integer, nullable=True)
    finish_date = Column(String, nullable=True) # Legacy/Direct date
    finish_day_of_week = Column(Integer, nullable=True) # 1-7
    finish_time = Column(String, nullable=True) # HH:MM
    
    # Настройки авто-бана
    auto_blacklist = Column(Boolean, default=False)
    auto_blacklist_duration = Column(Integer, default=7)
    
    # Шаблоны
    template_comment = Column(Text, nullable=True)
    template_winner_post = Column(Text, nullable=True)
    winner_post_images = Column(Text, nullable=True) # JSON list of photos
    template_dm = Column(Text, nullable=True)
    template_error_comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ReviewContestEntry(Base):
    __tablename__ = "review_contest_entries"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("review_contests.id", ondelete="CASCADE"), index=True)
    
    vk_post_id = Column(Integer, nullable=False)
    vk_owner_id = Column(Integer, nullable=False)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    user_photo = Column(String, nullable=True) # New
    
    post_link = Column(String, nullable=True)
    post_text = Column(Text, nullable=True)
    
    status = Column(String, default='new') # new, processing, commented, error, winner
    entry_number = Column(Integer, nullable=True)
    log = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PromoCode(Base):
    __tablename__ = "promo_codes"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("review_contests.id", ondelete="CASCADE"), index=True, nullable=True)
    general_contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True, nullable=True)
    
    code = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    is_issued = Column(Boolean, default=False)
    issued_at = Column(DateTime(timezone=True), nullable=True)
    
    # Денормализованные данные о том, кому выдано (чтобы быстро показывать в таблице)
    issued_to_user_id = Column(BigInteger, nullable=True)
    issued_to_user_name = Column(String, nullable=True)
    
    # Статус доставки сообщения (оставляем для совместимости, но основной источник теперь DeliveryLog)
    delivery_status = Column(String, nullable=True) 
    delivery_message = Column(Text, nullable=True) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ReviewContestDeliveryLog(Base):
    __tablename__ = "review_contest_delivery_logs"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("review_contests.id", ondelete="CASCADE"), index=True, nullable=True)
    general_contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True, nullable=True)
    
    # Кому отправляем
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    
    # Что отправляем (Snapshots)
    promo_code = Column(String, nullable=True) 
    prize_description = Column(String, nullable=True)
    message_text = Column(Text, nullable=False) # Сформированное сообщение
    
    # Ссылки на контекст (НОВОЕ)
    winner_post_link = Column(String, nullable=True) # Ссылка на пост победителя (отзыв)
    results_post_link = Column(String, nullable=True) # Ссылка на пост с итогами конкурса
    
    # Статус
    status = Column(String, default='pending') # sent, error
    error_details = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ReviewContestBlacklist(Base):
    __tablename__ = "review_contest_blacklist"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("review_contests.id", ondelete="CASCADE"), index=True, nullable=True)
    general_contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True, nullable=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True) # Имя для удобства отображения
    user_screen_name = Column(String, nullable=True) # screen_name или id123
    
    until_date = Column(DateTime(timezone=True), nullable=True) # Дата окончания бана. Если Null - навсегда.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
