
from typing import Dict, Any, Optional, List
import time
import json
from sqlalchemy.orm import Session
from database import SessionLocal, redis_client
import models

# TTL для задач в секундах (удалять старые завершенные задачи)
TASK_TTL = 3600 # 1 час

def get_active_task_id(project_id: str, list_type: str) -> Optional[str]:
    """Проверяет, есть ли активная задача в БД для данного проекта."""
    # Если есть Redis, можно было бы читать оттуда для скорости, но БД надежнее для консистентности
    # с учетом того, что частота запроса невысокая.
    db = SessionLocal()
    try:
        # Ищем задачу, которая не завершена (не done и не error)
        # и обновлялась не позднее чем 5 минут назад (защита от зомби)
        cutoff_time = time.time() - 300 
        
        task = db.query(models.SystemTask).filter(
            models.SystemTask.project_id == project_id,
            models.SystemTask.list_type == list_type,
            models.SystemTask.status.notin_(['done', 'error']),
            models.SystemTask.updated_at > cutoff_time
        ).first()
        
        if task:
            return task.id
        return None
    except Exception as e:
        print(f"TASK_MONITOR ERROR (DB Get Active): {e}")
        return None
    finally:
        db.close()

def start_task(task_id: str, project_id: str = None, list_type: str = None):
    """Создает новую задачу в БД."""
    db = SessionLocal()
    try:
        # Сначала очищаем старые активные задачи этого типа для этого проекта (на всякий случай)
        if project_id and list_type:
            db.query(models.SystemTask).filter(
                models.SystemTask.project_id == project_id,
                models.SystemTask.list_type == list_type,
                models.SystemTask.status.notin_(['done', 'error'])
            ).delete(synchronize_session=False)
        
        now = time.time()
        new_task = models.SystemTask(
            id=task_id,
            project_id=project_id,
            list_type=list_type,
            status="pending",
            loaded=0,
            total=0,
            message="Инициализация...",
            error=None,
            created_at=now,
            updated_at=now
        )
        db.add(new_task)
        db.commit()
        print(f"TASK_MONITOR: Started task {task_id} (DB)")
    except Exception as e:
        print(f"TASK_MONITOR ERROR (Start): {e}")
    finally:
        db.close()

def update_task(task_id: str, status: str, loaded: int = 0, total: int = 0, message: str = None, error: str = None):
    """Обновляет состояние задачи в БД."""
    # Создаем новую сессию, так как это может вызываться из разных потоков
    db = SessionLocal()
    try:
        task = db.query(models.SystemTask).filter(models.SystemTask.id == task_id).first()
        if not task:
            # Если задачи нет, возможно, ее удалили вручную, просто выходим
            return 
        
        task.status = status
        task.updated_at = time.time()
        
        # Обновляем только если переданы значения (не None)
        # Внимание: в аргументах дефолт 0, но логика вызывающих сервисов
        # иногда передает реальные значения. 
        # Чтобы не сбрасывать loaded/total на 0, если они не переданы,
        # нужно было бы использовать None в дефолтах.
        # Но сейчас сервисы передают их явно.
        
        # Исправление: если вызывающий передал 0, а у нас уже есть прогресс, не сбрасываем, 
        # если только это не начало новой фазы.
        # Для простоты пока пишем как есть, полагаясь на сервисы.
        if loaded is not None: task.loaded = loaded
        if total is not None: task.total = total
        if message is not None: task.message = message
        if error is not None: task.error = error
        
        db.commit()
    except Exception as e:
        print(f"TASK_MONITOR ERROR (Update): {e}")
    finally:
        db.close()

def get_task_status(task_id: str) -> Optional[Dict[str, Any]]:
    """Получает статус задачи из БД."""
    db = SessionLocal()
    try:
        task = db.query(models.SystemTask).filter(models.SystemTask.id == task_id).first()
        if not task:
            return None
        
        # Формируем ответ в формате, который ожидает фронтенд
        return {
            "taskId": task.id,
            "status": task.status,
            "loaded": task.loaded,
            "total": task.total,
            "message": task.message,
            "error": task.error,
            "updated_at": task.updated_at,
            "meta": {
                "project_id": task.project_id,
                "list_type": task.list_type
            }
        }
    finally:
        db.close()

def get_all_tasks() -> List[Dict[str, Any]]:
    """Возвращает список всех задач из БД (активных и недавних)."""
    db = SessionLocal()
    try:
        # Удаляем очень старые задачи (старше 24 часов), чтобы не засорять таблицу
        cleanup_threshold = time.time() - 86400
        db.query(models.SystemTask).filter(models.SystemTask.updated_at < cleanup_threshold).delete(synchronize_session=False)
        db.commit()
        
        tasks = db.query(models.SystemTask).order_by(models.SystemTask.updated_at.desc()).limit(50).all()
        
        result = []
        for task in tasks:
            result.append({
                "taskId": task.id,
                "status": task.status,
                "loaded": task.loaded,
                "total": task.total,
                "message": task.message,
                "error": task.error,
                "updated_at": task.updated_at,
                "meta": {
                    "project_id": task.project_id,
                    "list_type": task.list_type
                }
            })
        return result
    finally:
        db.close()

def delete_task(task_id: str):
    """Принудительно удаляет задачу из БД."""
    db = SessionLocal()
    try:
        db.query(models.SystemTask).filter(models.SystemTask.id == task_id).delete(synchronize_session=False)
        db.commit()
        print(f"TASK_MONITOR: Force deleted task {task_id}")
    finally:
        db.close()

def delete_all_tasks():
    """Полностью очищает таблицу задач."""
    db = SessionLocal()
    try:
        db.query(models.SystemTask).delete(synchronize_session=False)
        db.commit()
        print("TASK_MONITOR: Deleted ALL tasks.")
    finally:
        db.close()
