# Обработчик подтверждения сервера (confirmation)

from sqlalchemy.orm import Session
from .base import BaseEventHandler
from ..models import CallbackEvent, HandlerResult


class ConfirmationHandler(BaseEventHandler):
    """
    Обработчик события подтверждения сервера.
    
    VK отправляет это событие при настройке Callback API,
    ожидая получить в ответ confirmation_code из настроек группы.
    """
    
    HANDLES_EVENTS = ["confirmation"]
    
    def handle(self, db: Session, event: CallbackEvent, project) -> HandlerResult:
        """
        Возвращает код подтверждения для группы.
        
        Note: Фактический ответ VK формируется в роутере,
        здесь мы только проверяем наличие кода и возвращаем его.
        """
        if not project:
            self._log(f"Project not found for group_id={event.group_id}", event)
            return HandlerResult(
                success=False,
                message="Project not found"
            )
        
        if not project.vk_confirmation_code:
            self._log(f"Confirmation code not set for project '{project.name}'", event)
            return HandlerResult(
                success=False,
                message="Confirmation code not configured"
            )
        
        code = project.vk_confirmation_code.strip()
        self._log(f"Returning confirmation code for project '{project.name}'", event)
        
        return HandlerResult(
            success=True,
            message="Confirmation code found",
            data={"confirmation_code": code}
        )
