from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime
from .automations import PromoCodeBase, PromoCodeResponse, ContestDeliveryLogResponse, BlacklistEntryResponse

class GeneralContestBase(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = False
    post_text: Optional[str] = None
    post_media: Optional[str] = None # JSON string
    start_date: Optional[datetime] = None
    conditions_schema: Optional[str] = None # JSON string
    finish_type: Optional[str] = 'date'
    finish_date: Optional[datetime] = None
    finish_duration_hours: Optional[int] = None
    winners_count: Optional[int] = 1
    one_prize_per_person: Optional[bool] = True
    is_cyclic: Optional[bool] = False
    restart_delay_hours: Optional[int] = 24
    template_result_post: Optional[str] = None
    template_dm: Optional[str] = None
    template_fallback_comment: Optional[str] = None

class GeneralContestCreate(GeneralContestBase):
    project_id: str

class GeneralContestUpdate(GeneralContestBase):
    pass

class GeneralContestStats(BaseModel):
    participants: int = 0
    promocodes_available: int = 0
    promocodes_total: int = 0
    status: str = 'paused_manual' 
    start_post_status: Optional[str] = None
    result_post_status: Optional[str] = None
    dms_sent_count: int = 0

class GeneralContestResponse(GeneralContestBase):
    id: str
    project_id: str
    current_start_post_id: Optional[str] = None
    current_result_post_id: Optional[str] = None
    last_vk_post_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    stats: Optional[GeneralContestStats] = None

    class Config:
        from_attributes = True

class GeneralContestEntryResponse(BaseModel):
    id: str
    contest_id: str
    user_vk_id: int
    user_name: Optional[str] = None
    user_photo: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GeneralContestListRequest(BaseModel):
    project_id: str

class GeneralContestIdRequest(BaseModel):
    contest_id: str

class GeneralContestUpdatePayload(BaseModel):
    contest_id: str
    contest: GeneralContestUpdate

# --- Promocodes ---
class GeneralContestPromoCodeCreate(BaseModel):
    contest_id: str
    codes: List[PromoCodeBase]

class GeneralContestPromoCodeDelete(BaseModel):
    promo_id: str

class GeneralContestPromoCodeDeleteBulk(BaseModel):
    promo_ids: List[str]

class GeneralContestPromoCodeUpdate(BaseModel):
    id: str
    description: str

class GeneralContestClear(BaseModel):
    contest_id: str

# --- Blacklist ---
class BlacklistPayload(BaseModel):
    user_vk_id: int
    until_date: Optional[str] = None
    reason: Optional[str] = None

class GeneralContestBlacklistAdd(BaseModel):
    contest_id: str
    payload: BlacklistPayload

class GeneralContestBlacklistDelete(BaseModel):
    entry_id: str

# --- Delivery ---
class GeneralContestDeliveryRetry(BaseModel):
    log_id: str

class GeneralContestDeliveryRetryAll(BaseModel):
    contest_id: str

