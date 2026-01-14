
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

import schemas
import services.ai_token_service as ai_token_service
import services.ai_log_service as ai_log_service
from database import SessionLocal

router = APIRouter(prefix="/ai-tokens", tags=["AI Tokens"])

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
