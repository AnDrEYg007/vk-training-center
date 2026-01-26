
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime, timezone
import httpx

import schemas
import services.ai_token_service as ai_token_service
import services.ai_log_service as ai_log_service
from database import SessionLocal
import models

router = APIRouter(prefix="/ai-tokens", tags=["AI Tokens"])

# URL для проверки токенов Google Gemini API
GEMINI_MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TokenIdPayload(BaseModel):
    tokenId: str

@router.post("/getAll", response_model=List[schemas.AiToken])
def get_all_tokens(db: Session = Depends(get_db)):
    return ai_token_service.get_all_tokens(db)

@router.post("/updateAll", response_model=schemas.GenericSuccess)
def update_all_tokens(payload: schemas.UpdateAiTokensPayload, db: Session = Depends(get_db)):
    ai_token_service.update_tokens(db, payload.tokens)
    return {"success": True}

@router.post("/delete", response_model=schemas.GenericSuccess)
def delete_token(payload: schemas.DeleteAiTokenPayload, db: Session = Depends(get_db)):
    ai_token_service.delete_token(db, payload.tokenId)
    return {"success": True}

@router.post("/verify", response_model=schemas.VerifyAiTokensResponse)
async def verify_tokens(db: Session = Depends(get_db)):
    """
    Проверяет все AI токены на валидность через Google Gemini API.
    Делает запрос /v1beta/models с каждым ключом, сохраняет статус в БД и возвращает результаты.
    """
    tokens = ai_token_service.get_all_tokens(db)
    results = []
    now = datetime.now(timezone.utc)
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        for token in tokens:
            is_valid = False
            error_msg = None
            models_count = 0
            
            try:
                # Делаем запрос к Google API для проверки ключа
                response = await client.get(
                    GEMINI_MODELS_URL,
                    params={"key": token.token}
                )
                
                if response.status_code == 200:
                    # Токен валидный - получили список моделей
                    data = response.json()
                    models_count = len(data.get("models", []))
                    is_valid = True
                else:
                    # Токен невалидный - получили ошибку
                    error_data = response.json()
                    error_msg = error_data.get("error", {}).get("message", "Unknown error")
                    error_status = error_data.get("error", {}).get("status", "UNKNOWN")
                    error_msg = f"{error_status}: {error_msg}"
                    
            except httpx.TimeoutException:
                error_msg = "TIMEOUT: Превышено время ожидания ответа"
            except Exception as e:
                error_msg = f"ERROR: {str(e)}"
            
            # Сохраняем статус в БД
            db_token = db.query(models.AiToken).filter(models.AiToken.id == token.id).first()
            if db_token:
                db_token.status = 'active' if is_valid else 'error'
                db_token.status_error = error_msg
                db_token.last_checked = now
            
            results.append({
                "token_id": token.id,
                "description": token.description,
                "is_valid": is_valid,
                "error": error_msg,
                "models_count": models_count
            })
    
    # Коммитим изменения статусов в БД
    db.commit()
    
    return {"results": results}

# --- LOGS & STATS ---

@router.post("/logs/get", response_model=schemas.GetAiLogsResponse)
def get_logs(payload: schemas.GetAiLogsPayload, db: Session = Depends(get_db)):
    """Получает логи AI токенов с пагинацией и фильтрацией."""
    return ai_log_service.get_logs(
        db, 
        page=payload.page, 
        page_size=payload.pageSize,
        token_ids=payload.tokenIds,
        search_query=payload.searchQuery,
        status=payload.status
    )

@router.post("/logs/clear", response_model=schemas.GenericSuccess)
def clear_logs(payload: schemas.ClearAiLogsPayload, db: Session = Depends(get_db)):
    """Очищает логи (все или для конкретного токена)."""
    ai_log_service.clear_logs(db, payload.tokenId)
    return {"success": True}

@router.post("/logs/delete", response_model=schemas.GenericSuccess)
def delete_log(payload: schemas.DeleteAiLogPayload, db: Session = Depends(get_db)):
    """Удаляет одну запись лога AI по ID."""
    ai_log_service.delete_log(db, payload.logId)
    return {"success": True}

@router.post("/logs/delete-batch", response_model=schemas.GenericSuccess)
def delete_logs_batch(payload: schemas.DeleteAiLogsBatchPayload, db: Session = Depends(get_db)):
    """Удаляет несколько записей логов AI по списку ID."""
    ai_log_service.delete_logs_batch(db, payload.logIds)
    return {"success": True}

@router.post("/stats", response_model=schemas.AccountStatsResponse)
def get_token_stats(payload: TokenIdPayload, db: Session = Depends(get_db)):
    """Получает агрегированную статистику по AI токену."""
    return ai_log_service.get_stats(db, payload.tokenId)

@router.post("/stats/chart", response_model=schemas.AccountChartResponse)
def get_token_chart_data(payload: schemas.AccountChartPayload, db: Session = Depends(get_db)):
    """Получает данные для графика."""
    data = ai_log_service.get_chart_data(
        db, 
        payload.accountId, # Здесь accountId - это tokenId
        payload.granularity, 
        payload.metric
    )
    return {"data": data}
