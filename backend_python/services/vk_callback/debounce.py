# Debounce механизм для VK Callback событий
#
# Защита от дублирования действий при быстрых последовательных событиях.
# Например, при редактировании отложенного поста VK шлет 2 события подряд:
# wall_schedule_post_delete + wall_schedule_post_new
# Мы не хотим делать 2 обновления — достаточно одного.
#
# Также включает механизм Cooldown для игнорирования событий во время
# внутренних операций (например, массового удаления постов).

import time
import threading
from typing import Dict, Callable, Optional
from dataclasses import dataclass
from datetime import datetime


# =============================================================================
# COOLDOWN — Игнорирование событий во время внутренних операций
# =============================================================================

_cooldowns: Dict[str, float] = {}  # key = "{group_id}:{event_type}" -> timestamp окончания
_cooldown_lock = threading.Lock()


def set_event_cooldown(group_id: int, event_type: str, seconds: float = 30.0):
    """
    Установить cooldown для конкретного типа события.
    
    Используется ПЕРЕД началом внутренней операции (например, массового удаления).
    Все callback события этого типа будут игнорироваться до истечения cooldown.
    
    Args:
        group_id: ID группы VK
        event_type: Тип события VK (например, 'wall_schedule_post_delete')
        seconds: Длительность cooldown в секундах
    """
    key = f"{group_id}:{event_type}"
    with _cooldown_lock:
        _cooldowns[key] = time.time() + seconds
    print(f"COOLDOWN: Set '{event_type}' for group {group_id} ({seconds}s)")


def clear_event_cooldown(group_id: int, event_type: str):
    """Снять cooldown раньше времени (после завершения операции)."""
    key = f"{group_id}:{event_type}"
    with _cooldown_lock:
        if key in _cooldowns:
            del _cooldowns[key]
            print(f"COOLDOWN: Cleared '{event_type}' for group {group_id}")


def is_event_on_cooldown(group_id: int, event_type: str) -> bool:
    """
    Проверить, активен ли cooldown для данного типа события.
    
    Returns:
        True если событие должно быть проигнорировано
    """
    key = f"{group_id}:{event_type}"
    with _cooldown_lock:
        deadline = _cooldowns.get(key, 0)
        if deadline > time.time():
            return True
        # Истёк — удаляем
        _cooldowns.pop(key, None)
        return False


# =============================================================================
# DEBOUNCE — Накопление быстрых событий
# =============================================================================


@dataclass
class PendingAction:
    """Отложенное действие."""
    group_id: int
    action_type: str  # Тип действия (например, 'refresh_scheduled', 'refresh_published')
    scheduled_at: float  # Когда запланировано выполнение
    event_ids: list[str]  # ID событий, которые вызвали это действие


class EventDebouncer:
    """
    Debouncer для событий VK Callback.
    
    Накапливает быстрые последовательные события одного типа и выполняет
    одно действие с задержкой, чтобы избежать дублирования.
    """
    
    def __init__(self, delay_seconds: float = 2.0):
        """
        Args:
            delay_seconds: Задержка перед выполнением действия.
                          Если за это время придет еще событие — таймер сбрасывается.
        """
        self.delay_seconds = delay_seconds
        self._pending: Dict[str, PendingAction] = {}  # key = "{group_id}:{action_type}"
        self._lock = threading.Lock()
        self._timers: Dict[str, threading.Timer] = {}
        
    def _get_key(self, group_id: int, action_type: str) -> str:
        """Ключ для идентификации действия."""
        return f"{group_id}:{action_type}"
    
    def schedule_action(
        self, 
        group_id: int, 
        action_type: str, 
        event_id: Optional[str],
        callback: Callable
    ) -> bool:
        """
        Запланировать действие с debounce.
        
        Если такое действие уже запланировано — таймер сбрасывается.
        Возвращает True, если это новое действие (первое в серии).
        
        Args:
            group_id: ID группы VK
            action_type: Тип действия (refresh_scheduled, refresh_published, etc.)
            event_id: ID события VK (для логирования)
            callback: Функция, которую нужно вызвать
        """
        key = self._get_key(group_id, action_type)
        is_new = False
        
        with self._lock:
            # Отменяем предыдущий таймер, если есть
            if key in self._timers:
                self._timers[key].cancel()
                # Добавляем event_id к существующему действию
                if key in self._pending and event_id:
                    self._pending[key].event_ids.append(event_id)
            else:
                is_new = True
                # Создаем новое отложенное действие
                self._pending[key] = PendingAction(
                    group_id=group_id,
                    action_type=action_type,
                    scheduled_at=time.time() + self.delay_seconds,
                    event_ids=[event_id] if event_id else []
                )
            
            # Создаем новый таймер
            timer = threading.Timer(
                self.delay_seconds, 
                self._execute_action, 
                args=[key, callback]
            )
            self._timers[key] = timer
            timer.start()
            
        action_word = "Scheduled new" if is_new else "Rescheduled"
        print(f"DEBOUNCER: {action_word} action '{action_type}' for group {group_id} (delay: {self.delay_seconds}s)")
        
        return is_new
    
    def _execute_action(self, key: str, callback: Callable):
        """Выполнить отложенное действие."""
        with self._lock:
            pending = self._pending.pop(key, None)
            self._timers.pop(key, None)
        
        if pending:
            event_count = len(pending.event_ids)
            print(f"DEBOUNCER: Executing '{pending.action_type}' for group {pending.group_id} (triggered by {event_count} events)")
            try:
                callback()
            except Exception as e:
                print(f"DEBOUNCER ERROR: Failed to execute '{pending.action_type}': {e}")
    
    def cancel_action(self, group_id: int, action_type: str) -> bool:
        """Отменить запланированное действие."""
        key = self._get_key(group_id, action_type)
        
        with self._lock:
            if key in self._timers:
                self._timers[key].cancel()
                del self._timers[key]
                self._pending.pop(key, None)
                print(f"DEBOUNCER: Cancelled action '{action_type}' for group {group_id}")
                return True
        return False
    
    def has_pending(self, group_id: int, action_type: str) -> bool:
        """Проверить, есть ли запланированное действие."""
        key = self._get_key(group_id, action_type)
        return key in self._pending


# Глобальный экземпляр debouncer'а
# Задержка 2 секунды — достаточно для накопления связанных событий
_debouncer = EventDebouncer(delay_seconds=2.0)


def get_debouncer() -> EventDebouncer:
    """Получить глобальный debouncer."""
    return _debouncer


# Экспорт функций cooldown для удобства
__all__ = [
    'EventDebouncer',
    'get_debouncer',
    'set_event_cooldown',
    'clear_event_cooldown',
    'is_event_on_cooldown',
]
