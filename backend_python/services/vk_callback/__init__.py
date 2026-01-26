# VK Callback API Event System
# 
# Модульная система для обработки событий от VK Callback API.
# 
# Архитектура:
# - dispatcher.py  - Главный диспетчер, маршрутизирует события к обработчикам
# - models.py      - Типы данных и Pydantic модели для событий
# - debounce.py    - Защита от дублирования действий при быстрых последовательных событиях
# - handlers/      - Папка с обработчиками событий, сгруппированными по типам
#   - wall.py      - Обработчики wall_post_*, wall_schedule_post_*
#   - confirmation.py - Обработчик подтверждения сервера
#   - base.py      - Базовый класс обработчика
#
# Использование:
#   from services.vk_callback import dispatch_event
#   await dispatch_event(db, event_type, group_id, payload)

from .dispatcher import dispatch_event
from .models import CallbackEvent, EventType

__all__ = [
    'dispatch_event',
    'CallbackEvent',
    'EventType',
]
