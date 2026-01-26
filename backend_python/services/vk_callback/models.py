# VK Callback Event Models
# 
# Типы данных и Pydantic модели для VK Callback событий.

from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime


class EventType(str, Enum):
    """Типы событий VK Callback API, которые мы обрабатываем."""
    
    # Подтверждение сервера
    CONFIRMATION = "confirmation"
    
    # События стены (публикации)
    WALL_POST_NEW = "wall_post_new"  # Новый пост опубликован
    WALL_REPOST = "wall_repost"  # Репост
    
    # События отложенных постов
    WALL_SCHEDULE_POST_NEW = "wall_schedule_post_new"  # Создан отложенный пост
    WALL_SCHEDULE_POST_DELETE = "wall_schedule_post_delete"  # Удален/отредактирован отложенный пост
    
    # События предложенных постов
    WALL_POST_SUGGEST = "wall_post_suggest"  # Предложен пост (suggest)
    
    # Сообщения (для будущего расширения)
    MESSAGE_NEW = "message_new"
    
    # Неизвестное событие
    UNKNOWN = "unknown"


class CallbackEvent(BaseModel):
    """Модель события VK Callback."""
    
    type: str
    group_id: int
    event_id: Optional[str] = None  # Уникальный ID события от VK
    v: Optional[str] = None  # Версия API
    object: Optional[dict] = None  # Данные события
    secret: Optional[str] = None  # Secret key (если настроен)
    
    # Внутренние поля
    received_at: datetime = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.received_at is None:
            self.received_at = datetime.utcnow()
    
    @property
    def event_type(self) -> EventType:
        """Получить типизированный EventType из строки."""
        try:
            return EventType(self.type)
        except ValueError:
            return EventType.UNKNOWN
    
    @property
    def is_wall_event(self) -> bool:
        """Проверить, является ли это событием стены."""
        return self.type.startswith("wall_")
    
    @property
    def is_schedule_event(self) -> bool:
        """Проверить, является ли это событием отложенных постов."""
        return "schedule" in self.type


class WallPostObject(BaseModel):
    """Объект поста в событии wall_post_new."""
    id: int
    owner_id: int
    from_id: Optional[int] = None
    created_by: Optional[int] = None
    date: int
    text: Optional[str] = None
    post_type: Optional[str] = None
    attachments: Optional[list] = None
    postponed_id: Optional[int] = None  # ID из отложки, если был опубликован из неё
    
    @property
    def was_scheduled(self) -> bool:
        """Был ли этот пост в отложке до публикации."""
        return self.postponed_id is not None


class SchedulePostObject(BaseModel):
    """Объект отложенного поста в событиях wall_schedule_post_*."""
    id: int
    schedule_time: int  # Unix timestamp планируемой публикации


class HandlerResult(BaseModel):
    """Результат обработки события."""
    success: bool
    message: Optional[str] = None
    action_taken: Optional[str] = None  # Описание выполненного действия
    data: Optional[dict] = None  # Дополнительные данные
