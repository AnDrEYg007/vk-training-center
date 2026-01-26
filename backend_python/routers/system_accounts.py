
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

import schemas
import services.system_accounts.account_service as account_service
import services.token_log_service as log_service
from database import SessionLocal
from config import settings

router = APIRouter(prefix="/system-accounts", tags=["System Accounts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AccountIdPayload(BaseModel):
    accountId: str

@router.post("/getAll", response_model=List[schemas.SystemAccount])
def get_all_accounts(db: Session = Depends(get_db)):
    """Возвращает все системные аккаунты."""
    return account_service.get_all_accounts(db)

@router.post("/addByUrls", response_model=schemas.GenericSuccess)
def add_by_urls(payload: schemas.AddSystemAccountsPayload, db: Session = Depends(get_db)):
    """Добавляет аккаунты по списку ссылок, автоматически подтягивая данные из VK."""
    count = account_service.add_accounts_by_urls(db, payload.urls, settings.vk_user_token)
    return {"success": True}

@router.post("/update", response_model=schemas.SystemAccount)
def update_account(payload: schemas.UpdateSystemAccountPayload, db: Session = Depends(get_db)):
    """Обновляет данные аккаунта (например, токен)."""
    return account_service.update_account(db, payload.account.id, payload.account)

@router.post("/delete", response_model=schemas.GenericSuccess)
def delete_account(payload: schemas.DeleteSystemAccountPayload, db: Session = Depends(get_db)):
    """Удаляет системный аккаунт."""
    account_service.delete_account(db, payload.accountId)
    return {"success": True}

@router.post("/verifyToken", response_model=schemas.VerifyTokenResponse)
def verify_token(payload: schemas.VerifyTokenPayload):
    """Проверяет валидность токена и возвращает данные пользователя."""
    return account_service.verify_token(payload.token)

@router.post("/verifyEnv", response_model=schemas.VerifyTokenResponse)
def verify_env_token():
    """Проверяет валидность токена из переменных окружения."""
    return account_service.verify_env_token()

# --- Logs Endpoints ---

@router.post("/logs/get", response_model=schemas.GetLogsResponse)
def get_logs(payload: schemas.GetLogsPayload, db: Session = Depends(get_db)):
    """Получает логи использования токенов с пагинацией и фильтрацией."""
    return log_service.get_logs(
        db, 
        page=payload.page, 
        page_size=payload.pageSize,
        account_ids=payload.accountIds,
        search_query=payload.searchQuery,
        status=payload.status
    )

@router.post("/logs/clear", response_model=schemas.GenericSuccess)
def clear_logs(payload: schemas.ClearLogsPayload, db: Session = Depends(get_db)):
    """Очищает логи (все или для конкретного аккаунта)."""
    log_service.clear_logs(db, payload.accountId)
    return {"success": True}

@router.post("/logs/delete", response_model=schemas.GenericSuccess)
def delete_log(payload: schemas.DeleteLogPayload, db: Session = Depends(get_db)):
    """Удаляет одну запись лога по ID."""
    log_service.delete_log(db, payload.logId)
    return {"success": True}

@router.post("/logs/delete-batch", response_model=schemas.GenericSuccess)
def delete_logs_batch(payload: schemas.DeleteLogsBatchPayload, db: Session = Depends(get_db)):
    """Удаляет несколько записей логов по списку ID."""
    log_service.delete_logs_batch(db, payload.logIds)
    return {"success": True}

@router.post("/stats", response_model=schemas.AccountStatsResponse)
def get_account_stats(payload: AccountIdPayload, db: Session = Depends(get_db)):
    """Получает агрегированную статистику по аккаунту."""
    return log_service.get_stats(db, payload.accountId)

@router.post("/stats/chart", response_model=schemas.AccountChartResponse)
def get_account_chart_data(payload: schemas.AccountChartPayload, db: Session = Depends(get_db)):
    """Получает данные для построения графика использования токена."""
    data = log_service.get_chart_data(
        db, 
        payload.accountId, 
        payload.granularity, 
        payload.projectId, 
        payload.metric
    )
    return {"data": data}
