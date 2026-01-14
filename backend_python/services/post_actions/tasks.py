
from database import SessionLocal
import crud
import schemas
from services import task_monitor
from .save_vk import save_to_vk_schedule
from .delete import delete_scheduled_post

def schedule_post_task(task_id: str, payload: schemas.SavePostPayload, delete_original_id: str, user_token: str):
    """
    Фоновая задача для сохранения поста в отложку VK.
    Используется для Drag-and-Drop и обычного сохранения, чтобы избежать таймаутов при ротации токенов.
    """
    db = SessionLocal()
    try:
        task_monitor.update_task(task_id, "processing", message="Сохранение в VK...")
        
        print(f"TASK {task_id}: Starting background scheduling for project {payload.projectId}...")
        
        # 1. Выполняем сохранение (это может занять время из-за ротации)
        saved_post = save_to_vk_schedule(db, payload, user_token)
        
        # 2. Если это был перенос (Drag-and-Drop Move), удаляем старый пост
        # ВАЖНО: Проверяем, не совпадает ли ID сохраненного поста с ID удаляемого.
        # Если они совпадают, значит был выполнен wall.edit (перенос даты существующего поста),
        # и удалять его НЕ НУЖНО. Удаляем только если ID отличаются (например, перенос из системного в VK).
        if delete_original_id and saved_post.id != delete_original_id:
            task_monitor.update_task(task_id, "processing", message="Удаление исходного поста...")
            print(f"TASK {task_id}: Deleting original post {delete_original_id}...")
            try:
                # Определяем тип старого поста (системный или VK) по ID
                # Если ID числовой или owner_id_id - это VK/Scheduled.
                # Если UUID - это System.
                # Проще проверить наличие в системных
                system_post = crud.get_system_post_by_id(db, delete_original_id)
                if system_post:
                    crud.delete_system_post(db, delete_original_id)
                    print(f"TASK {task_id}: Deleted system post {delete_original_id}")
                else:
                    # Пытаемся удалить как отложенный
                    delete_scheduled_post(db, schemas.DeletePostPayload(postId=delete_original_id, projectId=payload.projectId), user_token)
                    print(f"TASK {task_id}: Deleted scheduled post {delete_original_id}")
            except Exception as del_err:
                print(f"TASK {task_id}: Warning - Failed to delete original post: {del_err}")
                # Не фейлим задачу полностью, так как новый пост создан
        elif delete_original_id:
            print(f"TASK {task_id}: Skipped deletion because saved post ID matches original ID ({delete_original_id}). Assuming in-place update (move).")

        task_monitor.update_task(task_id, "done", message="Успешно сохранено")

    except Exception as e:
        print(f"TASK {task_id} ERROR: {e}")
        task_monitor.update_task(task_id, "error", error=str(e))
    finally:
        db.close()
