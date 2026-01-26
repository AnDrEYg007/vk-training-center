
from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, List
from datetime import datetime

class AiToken(BaseModel):
    id: str
    description: Optional[str] = ""
    token: str
    
    # Статус проверки токена
    status: Optional[str] = "unknown"  # 'active' | 'error' | 'unknown'
    status_error: Optional[str] = None
    last_checked: Optional[datetime] = None
    
    # Статистика использования (injects in service)
    stats: Optional[Dict[str, int]] = None

    model_config = ConfigDict(from_attributes=True)

class AiTokenLog(BaseModel):
    id: int
    token_id: Optional[str] = None
    is_env_token: bool
    model_name: str
    status: str
    error_details: Optional[str] = None
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Схемы для верификации токенов
class AiTokenVerifyResult(BaseModel):
    """Результат проверки одного токена."""
    token_id: str
    description: Optional[str] = None
    is_valid: bool
    error: Optional[str] = None
    models_count: int = 0

class VerifyAiTokensResponse(BaseModel):
    """Ответ с результатами проверки всех токенов."""
    results: List[AiTokenVerifyResult]
