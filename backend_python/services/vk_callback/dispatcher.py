# VK Callback Event Dispatcher
#
# Главный диспетчер событий — принимает событие от VK и направляет
# к соответствующему обработчику.

from sqlalchemy.orm import Session
from typing import Optional
from fastapi.responses import PlainTextResponse

from .models import CallbackEvent, HandlerResult, EventType
from .handlers import ALL_HANDLERS
import crud


def dispatch_event(
    db: Session, 
    event_type: str, 
    group_id: int, 
    payload: dict
) -> tuple[HandlerResult, Optional[str]]:
    """
    Диспетчер событий VK Callback.
    
    Принимает событие от VK, находит подходящий обработчик и выполняет его.
    
    Args:
        db: Сессия базы данных
        event_type: Тип события (строка от VK)
        group_id: ID группы VK
        payload: Полный payload события
        
    Returns:
        tuple[HandlerResult, Optional[str]]:
            - HandlerResult с результатом обработки
            - Опциональный код подтверждения (для confirmation события)
    """
    print(f"DISPATCHER: Received event '{event_type}' for group {group_id}")
    
    # Создаем объект события
    event = CallbackEvent(
        type=event_type,
        group_id=group_id,
        event_id=payload.get("event_id"),
        v=payload.get("v"),
        object=payload.get("object"),
        secret=payload.get("secret")
    )
    
    # Находим проект по group_id
    # vkProjectId в базе хранится как строка
    project = crud.get_project_by_vk_id(db, group_id)
    
    if not project and event_type != "confirmation":
        print(f"DISPATCHER: Project not found for group_id={group_id}, event will be logged but not processed")
        return HandlerResult(
            success=False,
            message=f"Project not found for group_id={group_id}"
        ), None
    
    # Ищем подходящий обработчик
    handler = None
    for h in ALL_HANDLERS:
        if h.can_handle(event_type):
            handler = h
            break
    
    if not handler:
        print(f"DISPATCHER: No handler found for event type '{event_type}'")
        return HandlerResult(
            success=True,
            message=f"No handler for event type '{event_type}' (ignored)",
            action_taken="ignored"
        ), None
    
    # Выполняем обработчик
    handler_name = handler.__class__.__name__
    print(f"DISPATCHER: Routing to {handler_name}")
    
    try:
        result = handler.handle(db, event, project)
        
        # Для confirmation события возвращаем код
        confirmation_code = None
        if event_type == "confirmation" and result.success and result.data:
            confirmation_code = result.data.get("confirmation_code")
        
        print(f"DISPATCHER: {handler_name} completed: {result.message}")
        return result, confirmation_code
        
    except Exception as e:
        print(f"DISPATCHER ERROR: {handler_name} failed: {e}")
        import traceback
        traceback.print_exc()
        return HandlerResult(
            success=False,
            message=f"Handler error: {str(e)}"
        ), None


def get_registered_event_types() -> list[str]:
    """Получить список всех зарегистрированных типов событий."""
    event_types = []
    for handler in ALL_HANDLERS:
        event_types.extend(handler.HANDLES_EVENTS)
    return event_types
