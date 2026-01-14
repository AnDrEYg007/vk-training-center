
from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict
from datetime import datetime

class AiToken(BaseModel):
    id: str
    description: Optional[str] = ""
    token: str
    
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
