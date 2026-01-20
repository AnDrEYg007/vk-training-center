from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime
from .automations import PromoCodeBase, PromoCodeResponse, ContestDeliveryLogResponse, BlacklistEntryResponse

class GeneralContestBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None # Internal Description
    is_active: Optional[bool] = False
    
    # Start Settings
    start_type: Optional[str] = 'new_post' # new_post | existing_post
    existing_post_link: Optional[str] = None
    
    # Post Content (Scenario A)
    post_text: Optional[str] = None
    post_media: Optional[str] = None # JSON string
    start_date: Optional[datetime] = None
    
    # Logic
    conditions_schema: Optional[str] = None # JSON string
    
    # Finish Settings
    finish_type: Optional[str] = 'date'
    finish_date: Optional[datetime] = None
    finish_duration_hours: Optional[int] = None
    
    # Winners
    winners_count: Optional[int] = 1
    one_prize_per_person: Optional[bool] = True
    
    # Auto-Restart
    is_cyclic: Optional[bool] = False
    restart_type: Optional[str] = 'manual'
    restart_settings: Optional[str] = None # JSON string
    
    # Templates
    template_result_post: Optional[str] = None
    template_dm: Optional[str] = None
    template_fallback_comment: Optional[str] = None

class GeneralContestCreate(GeneralContestBase):
    project_id: str

class GeneralContestUpdate(GeneralContestBase):
    pass

class GeneralContestCycleResponse(BaseModel):
    id: str
    contest_id: str
    status: str
    
    start_scheduled_post_id: Optional[str] = None
    end_scheduled_post_id: Optional[str] = None
    
    vk_start_post_id: Optional[int] = None
    vk_result_post_id: Optional[int] = None
    
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    
    participants_count: int = 0
    winners_snapshot: Optional[str] = None
    
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class GeneralContestStats(BaseModel):
    participants: int = 0
    promocodes_available: int = 0
    promocodes_total: int = 0
    # Status is now derived from the active cycle
    status: str = 'paused_manual' 
    active_cycle_id: Optional[str] = None
    dms_sent_count: int = 0

class GeneralContestResponse(GeneralContestBase):
    id: str
    project_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Rich info
    stats: Optional[GeneralContestStats] = None
    active_cycle: Optional[GeneralContestCycleResponse] = None

    class Config:
        from_attributes = True

class GeneralContestEntryResponse(BaseModel):
    id: str
    cycle_id: str
    user_vk_id: int
    user_name: Optional[str] = None
    user_photo: Optional[str] = None
    validation_data: Optional[str] = None
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
    note: Optional[str] = None

class GeneralContestBlacklistAdd(BaseModel):
    project_id: str 
    payload: BlacklistPayload

class GeneralContestBlacklistDelete(BaseModel):
    entry_id: str

class GeneralContestDeliveryRetry(BaseModel):
    log_id: str

class GeneralContestDeliveryRetryAll(BaseModel):
    contest_id: str


class GeneralContestBlacklistDelete(BaseModel):
    entry_id: str

# --- Delivery ---
class GeneralContestDeliveryRetry(BaseModel):
    log_id: str

class GeneralContestDeliveryRetryAll(BaseModel):
    contest_id: str

