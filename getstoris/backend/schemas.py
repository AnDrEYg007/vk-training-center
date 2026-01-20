from pydantic import BaseModel
from typing import Optional, List

class VKAuthData(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    device_id: str
    user_id: int
    expires_in: int

class UserBase(BaseModel):
    vk_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: Optional[str] = None

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class VKGroup(BaseModel):
    id: int
    name: str
    screen_name: Optional[str] = None
    photo_100: Optional[str] = None
    is_admin: bool = False
