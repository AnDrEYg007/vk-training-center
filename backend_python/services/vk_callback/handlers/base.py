# Базовые классы и утилиты для обработчиков событий

from abc import ABC, abstractmethod
from sqlalchemy.orm import Session
from ..models import CallbackEvent, HandlerResult


class BaseEventHandler(ABC):
    """
    Базовый класс для обработчиков событий VK Callback.
    
    Каждый обработчик отвечает за определенную группу событий
    и реализует логику их обработки.
    """
    
    # Список типов событий, которые обрабатывает этот handler
    HANDLES_EVENTS: list[str] = []
    
    @classmethod
    def can_handle(cls, event_type: str) -> bool:
        """Проверить, может ли этот handler обработать событие."""
        return event_type in cls.HANDLES_EVENTS
    
    @abstractmethod
    def handle(self, db: Session, event: CallbackEvent, project) -> HandlerResult:
        """
        Обработать событие.
        
        Args:
            db: Сессия базы данных
            event: Событие для обработки
            project: Проект (модель из БД), к которому относится событие
            
        Returns:
            HandlerResult с результатом обработки
        """
        pass
    
    def _log(self, message: str, event: CallbackEvent):
        """Логирование с контекстом события."""
        handler_name = self.__class__.__name__
        print(f"[{handler_name}] group={event.group_id}: {message}")
