
from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
import json

class GroupAdmin(BaseModel):
    id: int
    first_name: str
    last_name: str
    role: str # creator, administrator, editor, moderator
    status: str # active, inactive
    permissions: List[str] = []

class AdministeredGroup(BaseModel):
    id: int
    name: str
    screen_name: Optional[str] = None
    photo_200: Optional[str] = None
    members_count: Optional[int] = 0
    activity: Optional[str] = None
    description: Optional[str] = None
    admin_sources: List[str] = []
    last_updated: Optional[datetime] = None
    
    # New fields
    creator_id: Optional[int] = None
    creator_name: Optional[str] = None
    admins_data: List[GroupAdmin] = []

    model_config = ConfigDict(from_attributes=True)

    @field_validator('admin_sources', mode='before')
    @classmethod
    def parse_json_sources(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return []
        return v
        
    @field_validator('admins_data', mode='before')
    @classmethod
    def parse_json_admins(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return []
        return v
