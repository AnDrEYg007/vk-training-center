
from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List
import json

class Project(BaseModel):
    id: str
    name: str
    vkProjectId: str
    vkGroupShortName: str
    vkGroupName: str
    vkLink: str
    
    # Новое поле
    avatar_url: Optional[str] = None
    
    notes: Optional[str] = None
    team: Optional[str] = None
    disabled: Optional[bool] = False
    archived: Optional[bool] = False
    variables: Optional[str] = None
    vk_confirmation_code: Optional[str] = None
    communityToken: Optional[str] = None
    additional_community_tokens: Optional[List[str]] = []
    sort_order: Optional[int] = None
    last_market_update: Optional[str] = None 
    
    model_config = ConfigDict(from_attributes=True)

    @field_validator('additional_community_tokens', mode='before')
    @classmethod
    def parse_json_tokens(cls, v):
        if isinstance(v, str):
            if not v:
                return []
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

class User(BaseModel):
    id: str
    full_name: str
    username: str
    password: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class Variable(BaseModel):
    name: str
    value: str
