from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey, DateTime, BigInteger
from sqlalchemy.sql import func
from database import Base

class GeneralContest(Base):
    __tablename__ = "general_contests"
    
    id = Column(String, primary_key=True, index=True) # UUID
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    # Основные настройки
    name = Column(String, nullable=True) # Название для себя
    is_active = Column(Boolean, default=False)
    
    # Секция "Конкурсный пост"
    post_text = Column(Text, nullable=True)
    post_media = Column(Text, nullable=True) # JSON list of media
    start_date = Column(DateTime(timezone=True), nullable=True)
    
    # Секция "Условия и Итоги"
    conditions_schema = Column(Text, nullable=True) # JSON structure of conditions
    
    # Тайминг
    finish_type = Column(String, default='date') # date, duration
    finish_date = Column(DateTime(timezone=True), nullable=True)
    finish_duration_hours = Column(Integer, nullable=True)
    
    # Победители
    winners_count = Column(Integer, default=1)
    one_prize_per_person = Column(Boolean, default=True)
    
    # Цикличность
    is_cyclic = Column(Boolean, default=False)
    restart_delay_hours = Column(Integer, default=24)
    
    # Шаблоны сообщений
    template_result_post = Column(Text, nullable=True)
    template_dm = Column(Text, nullable=True)
    template_fallback_comment = Column(Text, nullable=True)
    
    # Связь с текущим циклом
    current_start_post_id = Column(String, nullable=True) # ID SystemPost
    current_result_post_id = Column(String, nullable=True) # ID SystemPost
    last_vk_post_id = Column(Integer, nullable=True) # ID реального поста в VK
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GeneralContestEntry(Base):
    __tablename__ = "general_contest_entries"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    user_photo = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneralContestPromoCode(Base):
    __tablename__ = "general_contest_promocodes"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True)
    
    code = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    is_issued = Column(Boolean, default=False)
    issued_at = Column(DateTime(timezone=True), nullable=True)
    
    issued_to_user_id = Column(BigInteger, nullable=True)
    issued_to_user_name = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneralContestDeliveryLog(Base):
    __tablename__ = "general_contest_delivery_logs"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    
    promo_code = Column(String, nullable=True) 
    prize_description = Column(String, nullable=True)
    message_text = Column(Text, nullable=False)
    
    results_post_link = Column(String, nullable=True)
    
    status = Column(String, default='pending') # sent, error
    error_details = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneralContestBlacklist(Base):
    __tablename__ = "general_contest_blacklist"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    user_screen_name = Column(String, nullable=True)
    
    until_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
