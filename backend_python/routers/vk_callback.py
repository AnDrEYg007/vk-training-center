from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from models_library.projects import Project
from models_library.logs import VkCallbackLog
import logging
import json

# Импорт новой модульной системы обработки событий
from services.vk_callback import dispatch_event

router = APIRouter()
logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Эндпоинт для VK Callback API
@router.post("/callback", include_in_schema=False)
@router.post("", include_in_schema=False)
@router.post("/", include_in_schema=False)
async def vk_callback_handler(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
    except:
        # VK иногда шлет запросы, которые не совсем JSON или с пустым телом при проверке
        print("VK Callback: Failed to parse JSON")
        raise HTTPException(status_code=400, detail="Invalid JSON")
        
    print(f"VK Callback request: {body}")
    
    event_type = body.get("type")
    group_id = body.get("group_id")
    
    if not event_type or not group_id:
        # Если это не структура VK, то просто игнорируем
        return PlainTextResponse("ok")

    # --- ЛОГИРОВАНИЕ ЗАПРОСА В БД ---
    try:
        # Пытаемся сохранить лог. Если база недоступна или что-то пошло не так,
        # это не должно уронить основной процесс ответа VK.
        log_entry = VkCallbackLog(
            type=str(event_type),
            group_id=int(group_id),
            payload=json.dumps(body, ensure_ascii=False)
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"ERROR saving callback log: {e}")
    # --------------------------------

    # 1. Обработка подтверждения (confirmation)
    if event_type == "confirmation":
        # Используем новый dispatcher для получения кода подтверждения
        result, confirmation_code = dispatch_event(db, event_type, group_id, body)
        if confirmation_code:
            print(f"Returning confirmation code: '{confirmation_code}'")
            return PlainTextResponse(content=confirmation_code)
        
        # Fallback на старую логику если dispatcher не нашел
        print(f"Processing confirmation for group_id: {group_id} (type: {type(group_id)})")
        search_id = str(group_id)
        project = db.query(Project).filter(Project.vkProjectId == search_id).first()
        
        if project:
            print(f"Project found: {project.id}, vkProjectId: {project.vkProjectId}")
            print(f"Confirmation code in DB: '{project.vk_confirmation_code}'")
            if project.vk_confirmation_code:
                clean_code = project.vk_confirmation_code.strip()
                print(f"Returning clean code: '{clean_code}'")
                return PlainTextResponse(content=clean_code)
            else:
                print("Project found but vk_confirmation_code is None or empty")
        else:
            print(f"Project NOT found for vkProjectId: '{search_id}'")
            project_neg = db.query(Project).filter(Project.vkProjectId == f"-{search_id}").first()
            if project_neg:
                print(f"Found project with negative ID: {project_neg.id}")
                if project_neg.vk_confirmation_code:
                    return PlainTextResponse(content=project_neg.vk_confirmation_code.strip())

        print(f"Confirmation code not found for group {group_id}")
        return PlainTextResponse(content="code_not_found") 

    # 2. Обработка всех остальных событий через dispatcher
    # Dispatcher сам найдет нужный handler и выполнит действие
    result, _ = dispatch_event(db, event_type, group_id, body)
    
    if result:
        print(f"Event '{event_type}' processed: {result.message} (action: {result.action_taken})")
        
    # Возвращаем "ok" для всех типов событий, чтобы VK не слал повторы
    return PlainTextResponse(content="ok")

@router.get("/logs")
def get_callback_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Возвращает последние логи Callback API с названиями групп"""
    logs = db.query(VkCallbackLog).order_by(VkCallbackLog.timestamp.desc()).limit(limit).all()
    
    # Добавляем информацию о группах из проектов
    result = []
    for log in logs:
        log_dict = {
            "id": log.id,
            "type": log.type,
            "group_id": log.group_id,
            "payload": log.payload,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "group_name": None  # По умолчанию
        }
        
        # Ищем проект с таким vkProjectId
        project = db.query(Project).filter(Project.vkProjectId == str(log.group_id)).first()
        if project:
            log_dict["group_name"] = project.vkGroupName or project.vkGroupShortName or project.name
        
        result.append(log_dict)
    
    return result

@router.delete("/logs")
def delete_all_callback_logs(db: Session = Depends(get_db)):
    """Удаляет все логи Callback API"""
    count = db.query(VkCallbackLog).delete()
    db.commit()
    return {"deleted": count}

@router.delete("/logs/{log_id}")
def delete_callback_log(log_id: int, db: Session = Depends(get_db)):
    """Удаляет конкретный лог по ID"""
    log = db.query(VkCallbackLog).filter(VkCallbackLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"deleted": 1}

@router.post("/logs/delete-batch")
def delete_batch_callback_logs(ids: list[int], db: Session = Depends(get_db)):
    """Удаляет несколько логов по списку ID"""
    count = db.query(VkCallbackLog).filter(VkCallbackLog.id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return {"deleted": count}
