# Обработчики событий стены (wall_post_*, wall_schedule_post_*)
#
# Эти события приходят когда:
# - wall_post_new: Пост опубликован (сразу или из отложки)
# - wall_schedule_post_new: Создан новый отложенный пост
# - wall_schedule_post_delete: Удален отложенный пост (или отредактирован — VK шлет delete+new)

from sqlalchemy.orm import Session
from .base import BaseEventHandler
from ..models import CallbackEvent, HandlerResult, WallPostObject, SchedulePostObject
from ..debounce import get_debouncer, is_event_on_cooldown

# Импорты сервисов для обновления данных
from services.post_retrieval import refresh_scheduled_posts, refresh_published_posts
from services import update_tracker
from config import settings


class WallPostNewHandler(BaseEventHandler):
    """
    Обработчик события wall_post_new.
    
    Событие приходит когда пост опубликован:
    - Сразу при создании
    - Из отложки (вручную или по таймеру)
    
    Действие: Обновляем последние 10 опубликованных постов.
    """
    
    HANDLES_EVENTS = ["wall_post_new"]
    
    def handle(self, db: Session, event: CallbackEvent, project) -> HandlerResult:
        if not project:
            return HandlerResult(success=False, message="Project not found")
        
        obj = event.object or {}
        post_type = obj.get("post_type", "post")
        postponed_id = obj.get("postponed_id")
        
        # Если это предложенный пост — пропускаем (для него отдельный handler)
        if post_type == "suggest":
            self._log(f"Skipping suggested post (handled by separate handler)", event)
            return HandlerResult(
                success=True,
                message="Suggested post - skipped",
                action_taken="none"
            )
        
        # Логируем информацию о посте
        if postponed_id:
            self._log(f"Published from scheduled (postponed_id={postponed_id})", event)
        else:
            self._log(f"New published post", event)
        
        # Используем debounce для избежания дублирования
        debouncer = get_debouncer()
        
        def do_refresh():
            """Функция обновления, вызываемая после debounce."""
            try:
                # Создаем новую сессию для отложенного выполнения
                from database import SessionLocal
                with SessionLocal() as refresh_db:
                    self._log(f"Refreshing published posts for project '{project.name}'", event)
                    refresh_published_posts(refresh_db, project.id, settings.vk_user_token)
                    update_tracker.add_updated_project(project.id)
                    self._log(f"Successfully refreshed published posts", event)
            except Exception as e:
                self._log(f"ERROR refreshing published posts: {e}", event)
        
        # Планируем обновление с debounce
        is_new = debouncer.schedule_action(
            group_id=event.group_id,
            action_type="refresh_published",
            event_id=event.event_id,
            callback=do_refresh
        )
        
        return HandlerResult(
            success=True,
            message="Published posts refresh scheduled",
            action_taken="scheduled_refresh_published" if is_new else "debounced",
            data={"postponed_id": postponed_id}
        )


class WallSchedulePostNewHandler(BaseEventHandler):
    """
    Обработчик события wall_schedule_post_new.
    
    Событие приходит когда:
    - Создан новый отложенный пост
    - Отредактирован отложенный пост (после delete приходит new)
    
    Действие: Обновляем отложенные посты.
    """
    
    HANDLES_EVENTS = ["wall_schedule_post_new"]
    
    def handle(self, db: Session, event: CallbackEvent, project) -> HandlerResult:
        if not project:
            return HandlerResult(success=False, message="Project not found")
        
        obj = event.object or {}
        post_id = obj.get("id")
        schedule_time = obj.get("schedule_time")
        
        self._log(f"New scheduled post: id={post_id}, schedule_time={schedule_time}", event)
        
        # Используем debounce — при редактировании VK шлет delete+new подряд
        debouncer = get_debouncer()
        
        def do_refresh():
            """Функция обновления, вызываемая после debounce."""
            try:
                from database import SessionLocal
                with SessionLocal() as refresh_db:
                    self._log(f"Refreshing scheduled posts for project '{project.name}'", event)
                    refresh_scheduled_posts(refresh_db, project.id, settings.vk_user_token)
                    update_tracker.add_updated_project(project.id)
                    self._log(f"Successfully refreshed scheduled posts", event)
            except Exception as e:
                self._log(f"ERROR refreshing scheduled posts: {e}", event)
        
        # Планируем обновление с debounce
        is_new = debouncer.schedule_action(
            group_id=event.group_id,
            action_type="refresh_scheduled",
            event_id=event.event_id,
            callback=do_refresh
        )
        
        return HandlerResult(
            success=True,
            message="Scheduled posts refresh scheduled",
            action_taken="scheduled_refresh_scheduled" if is_new else "debounced",
            data={"post_id": post_id, "schedule_time": schedule_time}
        )


class WallSchedulePostDeleteHandler(BaseEventHandler):
    """
    Обработчик события wall_schedule_post_delete.
    
    Событие приходит когда:
    - Отложенный пост удален
    - Отложенный пост отредактирован (VK шлет delete, потом new)
    - Отложенный пост опубликован (удаляется из очереди)
    
    Действие: Обновляем отложенные посты (с debounce).
    
    ВАЖНО: Это событие игнорируется во время внутренних операций удаления
    (когда установлен cooldown), чтобы избежать дублирования обновлений.
    """
    
    HANDLES_EVENTS = ["wall_schedule_post_delete"]
    
    def handle(self, db: Session, event: CallbackEvent, project) -> HandlerResult:
        if not project:
            return HandlerResult(success=False, message="Project not found")
        
        # COOLDOWN CHECK: Игнорируем событие, если идёт внутренняя операция удаления
        if is_event_on_cooldown(event.group_id, "wall_schedule_post_delete"):
            self._log(f"Skipped - internal delete operation in progress (cooldown)", event)
            return HandlerResult(
                success=True,
                message="Skipped due to cooldown (internal operation)",
                action_taken="skipped_cooldown"
            )
        
        obj = event.object or {}
        post_id = obj.get("id")
        schedule_time = obj.get("schedule_time")
        
        self._log(f"Deleted scheduled post: id={post_id}, was_scheduled_for={schedule_time}", event)
        
        # Используем debounce — при редактировании VK шлет delete+new подряд
        # Также при публикации шлет wall_post_new + wall_schedule_post_delete
        debouncer = get_debouncer()
        
        def do_refresh():
            """Функция обновления, вызываемая после debounce."""
            try:
                from database import SessionLocal
                with SessionLocal() as refresh_db:
                    self._log(f"Refreshing scheduled posts for project '{project.name}'", event)
                    refresh_scheduled_posts(refresh_db, project.id, settings.vk_user_token)
                    update_tracker.add_updated_project(project.id)
                    self._log(f"Successfully refreshed scheduled posts", event)
            except Exception as e:
                self._log(f"ERROR refreshing scheduled posts: {e}", event)
        
        # Планируем обновление с debounce
        is_new = debouncer.schedule_action(
            group_id=event.group_id,
            action_type="refresh_scheduled",
            event_id=event.event_id,
            callback=do_refresh
        )
        
        return HandlerResult(
            success=True,
            message="Scheduled posts refresh scheduled",
            action_taken="scheduled_refresh_scheduled" if is_new else "debounced",
            data={"post_id": post_id, "schedule_time": schedule_time}
        )


# Список всех обработчиков стены для регистрации в dispatcher
WALL_HANDLERS = [
    WallPostNewHandler(),
    WallSchedulePostNewHandler(),
    WallSchedulePostDeleteHandler(),
]
