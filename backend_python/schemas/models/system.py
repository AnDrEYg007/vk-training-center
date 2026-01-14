from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict
from datetime import datetime

class SystemAccount(BaseModel):
    id: str
    vk_user_id: Optional[int] = None
    full_name: Optional[str] = None
    profile_url: str
    avatar_url: Optional[str] = None
    token: Optional[str] = None
    status: Optional[str] = 'unknown'
    
    # Статистика использования
    stats: Optional[Dict[str, int]] = None
    
    model_config = ConfigDict(from_attributes=True)

class TokenLog(BaseModel):
    id: int
    account_id: Optional[str] = None
    is_env_token: bool
    project_id: Optional[str] = None
    method: str
    status: str
    error_details: Optional[str] = None
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)