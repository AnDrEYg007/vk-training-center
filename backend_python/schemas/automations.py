
from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime
import json
from .base_models import PhotoAttachment

class ReviewContestSettings(BaseModel):
    projectId: str
    isActive: bool
    keywords: str
    startDate: str
    
    finishCondition: str
    targetCount: Optional[int] = None
    finishDate: Optional[str] = None
    finishDayOfWeek: Optional[int] = None
    finishTime: Optional[str] = None
    
    autoBlacklist: Optional[bool] = False
    autoBlacklistDuration: Optional[int] = 7

    templateComment: str
    templateWinnerPost: str
    winnerPostImages: List[PhotoAttachment] = []
    templateDm: str
    templateErrorComment: str

    model_config = ConfigDict(from_attributes=True)

    @field_validator('winnerPostImages', mode='before')
    @classmethod
    def parse_json_images(cls, v):
        if isinstance(v, str):
            if not v: return []
            try:
                return json.loads(v)
            except:
                return []
        return v

class ContestEntryResponse(BaseModel):
    id: str
    vk_post_id: int
    user_name: Optional[str]
    user_photo: Optional[str]
    user_vk_id: int
    post_link: Optional[str]
    post_text: Optional[str]
    status: str
    entry_number: Optional[int]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Promo Codes ---

class PromoCodeBase(BaseModel):
    code: str
    description: Optional[str] = None

class CreatePromoCodesPayload(BaseModel):
    projectId: str
    codes: List[PromoCodeBase]

class PromoCodeResponse(BaseModel):
    id: str
    code: str
    description: Optional[str] = None
    is_issued: bool
    issued_at: Optional[datetime] = None
    issued_to_user_id: Optional[int] = None
    issued_to_user_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class DeletePromoCodePayload(BaseModel):
    promoId: str

class DeleteBulkPromoCodesPayload(BaseModel):
    promoIds: List[str]

class UpdatePromoCodePayload(BaseModel):
    id: str
    description: str

# --- Delivery Logs ---

class ContestDeliveryLogResponse(BaseModel):
    id: str
    user_vk_id: int
    user_name: Optional[str] = None
    promo_code: Optional[str] = None
    prize_description: Optional[str] = None
    message_text: str
    status: str # sent, error
    error_details: Optional[str] = None
    created_at: datetime
    
    winner_post_link: Optional[str] = None
    results_post_link: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class RetryDeliveryPayload(BaseModel):
    logId: str
    
# --- Blacklist ---

class AddBlacklistPayload(BaseModel):
    projectId: str
    urls: str # Список ссылок через перенос строки
    untilDate: Optional[str] = None # ISO date, if None - forever

class DeleteBlacklistPayload(BaseModel):
    itemId: str

class BlacklistEntryResponse(BaseModel):
    id: str
    user_vk_id: int
    user_name: Optional[str]
    user_screen_name: Optional[str]
    until_date: Optional[datetime]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
