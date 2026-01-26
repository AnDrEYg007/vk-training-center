# Регистрация обработчиков событий VK Callback

from .base import BaseEventHandler
from .confirmation import ConfirmationHandler
from .wall import WALL_HANDLERS

# Все доступные обработчики
ALL_HANDLERS: list[BaseEventHandler] = [
    ConfirmationHandler(),
    *WALL_HANDLERS,
]

__all__ = [
    'BaseEventHandler',
    'ConfirmationHandler',
    'ALL_HANDLERS',
]
