from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey, DateTime, BigInteger
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class GeneralContest(Base):
    __tablename__ = "general_contests"
    
    id = Column(String, primary_key=True, index=True) # UUID
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    # 1. Основные настройки и Идентификация
    name = Column(String, nullable=True) # Название для себя (Internal Name)
    description = Column(Text, nullable=True) # Описание для себя (Internal Description)
    is_active = Column(Boolean, default=False) # Глобальный переключатель активности
    
    # 2. Настройки Старта (Источник)
    start_type = Column(String, default="new_post") # 'new_post' | 'existing_post'
    existing_post_link = Column(String, nullable=True) # Для сценария Б
    
    # 3. Контент Поста (Шаблон для Сценария А)
    post_text = Column(Text, nullable=True)
    post_media = Column(Text, nullable=True) # JSON list of media
    start_date = Column(DateTime(timezone=True), nullable=True) # Когда первый раз запустить (если new_post)
    
    # 4. Условия и Механика
    conditions_schema = Column(Text, nullable=True) # JSON: { groups: [...], type: 'AND/OR' }
    
    # 5. Тайминг Завершения
    finish_type = Column(String, default='date') # 'date' | 'duration'
    finish_date = Column(DateTime(timezone=True), nullable=True) # Конкретная дата (для One-time)
    finish_duration_hours = Column(Integer, nullable=True) # Длительность цикла в часах
    
    # 6. Победители
    winners_count = Column(Integer, default=1)
    one_prize_per_person = Column(Boolean, default=True)
    
    # 7. Цикличность и Перезапуск
    is_cyclic = Column(Boolean, default=False)
    restart_type = Column(String, default='manual') # 'manual', 'interval', 'daily', 'weekly'
    restart_settings = Column(Text, nullable=True) # JSON: { cron_days: [], interval_hours: 24, time: "18:00" }
    
    # 8. Шаблоны сообщений (Итоги)
    template_result_post = Column(Text, nullable=True) # Текст поста итогов
    template_dm = Column(Text, nullable=True) # Сообщение победителю
    template_fallback_comment = Column(Text, nullable=True) # Если ЛС закрыта
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GeneralContestCycle(Base):
    __tablename__ = "general_contest_cycles"

    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True)
    
    # Жизненный цикл конкретного розыгрыша
    status = Column(String, default='created') # created, active, evaluating, finished, archived
    
    # Связь с Планировщиком (ScheduledPost)
    start_scheduled_post_id = Column(String, nullable=True) 
    end_scheduled_post_id = Column(String, nullable=True) # ID поста-триггера
    
    # Реальные данные ВКонтакте
    vk_start_post_id = Column(BigInteger, nullable=True) # ID поста, где собираем лайки/комменты
    vk_result_post_id = Column(BigInteger, nullable=True) # ID поста с итогами
    
    # Хронология
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    
    # Результаты
    participants_count = Column(Integer, default=0)
    winners_snapshot = Column(Text, nullable=True) # JSON: Полная копия победителей с призами
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GeneralContestEntry(Base):
    """Участник конкретного цикла"""
    __tablename__ = "general_contest_entries"
    
    id = Column(String, primary_key=True, index=True) # UUID
    cycle_id = Column(String, ForeignKey("general_contest_cycles.id", ondelete="CASCADE"), index=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    user_photo = Column(String, nullable=True)
    
    # Детали валидации (какие условия выполнил)
    validation_data = Column(Text, nullable=True) # JSON: { "liked": true, "reposted": false ... }
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneralContestPromoCode(Base):
    """База призов/промокодов"""
    __tablename__ = "general_contest_promocodes"
    
    id = Column(String, primary_key=True, index=True) # UUID
    contest_id = Column(String, ForeignKey("general_contests.id", ondelete="CASCADE"), index=True)
    
    code = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    is_issued = Column(Boolean, default=False)
    issued_at = Column(DateTime(timezone=True), nullable=True)
    
    # Привязка к циклу и пользователю
    issued_in_cycle_id = Column(String, ForeignKey("general_contest_cycles.id", ondelete="SET NULL"), nullable=True)
    issued_to_user_id = Column(BigInteger, nullable=True)
    issued_to_user_name = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneralContestDeliveryLog(Base):
    """Лог отправки призов"""
    __tablename__ = "general_contest_delivery_logs"
    
    id = Column(String, primary_key=True, index=True) # UUID
    cycle_id = Column(String, ForeignKey("general_contest_cycles.id", ondelete="CASCADE"), index=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    user_name = Column(String, nullable=True)
    
    promo_code = Column(String, nullable=True) 
    prize_description = Column(String, nullable=True)
    
    message_text = Column(Text, nullable=False)
    results_post_link = Column(String, nullable=True)
    
    status = Column(String, default='pending') # pending, sent, error
    error_details = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneralContestBlacklist(Base):
    __tablename__ = "general_contest_blacklist"
    
    id = Column(String, primary_key=True, index=True) # UUID
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    
    user_vk_id = Column(BigInteger, nullable=False)
    note = Column(String, nullable=True) # Why banned
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
