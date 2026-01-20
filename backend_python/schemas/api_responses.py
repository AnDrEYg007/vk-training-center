from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from .base_models import Project, ScheduledPost, SuggestedPost, Note, Variable, Album, Photo, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue, MarketAlbum, MarketItem, MarketCategory, SystemListSubscriber, SystemListMailingItem, SystemListHistoryItem, ProjectListMeta, SystemListPost, SystemListInteraction, TokenLog, ProjectContextField, ProjectContextValue, AiTokenLog, SystemListAuthor

# Helper for contest status
class ContestStatus(BaseModel):
    isActive: bool
    promoCount: int

# API Responses
class InitialDataResponse(BaseModel):
    projects: List[Project]
    allPosts: Dict = {}
    suggestedPostCounts: Dict[str, int]
    reviewsContestStatuses: Dict[str, ContestStatus] = {} # {projectId: {isActive, promoCount}}

class AllPostsForProjectsResponse(BaseModel):
    allPosts: Dict[str, List[ScheduledPost]]
    allScheduledPosts: Dict[str, List[ScheduledPost]]
    allSuggestedPosts: Dict[str, List[SuggestedPost]]
    allSystemPosts: Dict[str, List[SystemPost]]
    allNotes: Dict[str, List[Note]]
    allStories: Dict[str, List[Dict[str, Any]]] = {} # Новое поле для историй

class ForceRefreshResponse(BaseModel):
    projects: List[Project]
    suggestedPostCounts: Dict[str, int]

class UpdateStatusResponse(BaseModel):
    stalePublished: List[str]
    staleScheduled: List[str]
    staleSuggested: List[str]

class VariablesResponse(BaseModel):
    variables: List[Variable]
    
class AiVariableSetupResponse(BaseModel):
    filled: List[Variable]
    new: List[Variable]

class AlbumResponse(BaseModel):
    albums: List[Album]

class PhotosResponse(BaseModel):
    photos: List[Photo]
    hasMore: bool

class GenericSuccess(BaseModel):
    success: bool = True

class ScheduleRefreshResponse(BaseModel):
    published: List[ScheduledPost]
    scheduled: List[ScheduledPost]
    
class DeletePublishedPostResponse(GenericSuccess):
    message: Optional[str] = None
    
class CorrectedTextResponse(BaseModel):
    correctedText: str

class GeneratedTextResponse(BaseModel):
    generatedText: str

class GeneratedBatchTextResponse(BaseModel):
    variations: List[str]
    
class PostCountResponse(BaseModel):
    count: int

# --- Automation Responses ---
class FinalizeContestResponse(BaseModel):
    success: bool
    skipped: bool = False
    message: Optional[str] = None
    winner_name: Optional[str] = None
    post_link: Optional[str] = None
    error_reason: Optional[str] = None

# --- Management Responses ---
class AddProjectsByUrlsResponse(BaseModel):
    added: int
    skipped: int
    errors: int

class SyncAdministeredGroupsResponse(BaseModel):
    success: bool
    total_groups: int
    tokens_scanned: int
    errors: int

# --- Auth Responses ---
class LoginResponse(BaseModel):
    success: bool
    username: str
    role: str
    
# --- Market Responses ---
class MarketDataResponse(BaseModel):
    albums: List[MarketAlbum]
    items: List[MarketItem]
    categories: List[MarketCategory]

class BulkSuggestionResult(BaseModel):
    itemId: int
    category: MarketCategory

class CorrectedDescriptionResult(BaseModel):
    itemId: int
    correctedText: str


# --- Global Variable Responses ---
class GetGlobalVariablesForProjectResponse(BaseModel):
    definitions: List[GlobalVariableDefinition]
    values: List[ProjectGlobalVariableValue]

# --- Lists Responses ---
class SystemListSubscribersResponse(BaseModel):
    meta: ProjectListMeta
    items: List[SystemListSubscriber]
    total_count: int
    page: int
    page_size: int

class SystemListMailingResponse(BaseModel):
    meta: ProjectListMeta
    items: List[SystemListMailingItem]
    total_count: int
    page: int
    page_size: int

class SystemListHistoryResponse(BaseModel):
    meta: ProjectListMeta
    items: List[SystemListHistoryItem]
    total_count: int
    page: int
    page_size: int
    
class SystemListPostsResponse(BaseModel):
    meta: ProjectListMeta
    items: List[SystemListPost]
    total_count: int
    page: int
    page_size: int
    
class SystemListInteractionsResponse(BaseModel):
    meta: ProjectListMeta
    items: List[SystemListInteraction]
    total_count: int
    page: int
    page_size: int

class SystemListAuthorsResponse(BaseModel):
    meta: ProjectListMeta
    items: List[SystemListAuthor] # NEW
    total_count: int
    page: int
    page_size: int

class SystemListMetaResponse(BaseModel):
    meta: ProjectListMeta

# Helper models for Post Stats
class PostChartData(BaseModel):
    date: str # "YYYY-MM"
    count: int
    likes: int
    comments: int
    reposts: int
    views: int

class PostTopItem(BaseModel):
    id: str
    vk_link: str
    value: int

class PostStats(BaseModel):
    total_likes: int
    total_comments: int
    total_reposts: int
    total_views: int
    avg_likes: float
    avg_comments: float
    avg_reposts: float
    avg_views: float
    top_likes: Optional[PostTopItem] = None
    top_comments: Optional[PostTopItem] = None
    top_reposts: Optional[PostTopItem] = None
    top_views: Optional[PostTopItem] = None
    chart_data: List[PostChartData] = []

# Helper model for Mailing Stats
class MailingStats(BaseModel):
    allowed_count: int = 0
    forbidden_count: int = 0
    active_allowed_count: int = 0 # Целевая аудитория (активные и разрешено писать)

class LifetimeStats(BaseModel):
    total_avg: float
    allowed_avg: float
    forbidden_avg: float

class ListStatsResponse(BaseModel):
    total_users: int = 0
    banned_count: int = 0
    deleted_count: int = 0
    active_count: int = 0
    gender_stats: Dict[str, int] = {}
    online_stats: Dict[str, int] = {}
    geo_stats: Dict[str, int] = {}
    
    # Новые блоки статистики
    bdate_stats: Dict[str, int] = {} # "1", "2" ... "13" (unknown)
    platform_stats: Dict[str, int] = {} # "1", "2", "unknown" keys
    age_stats: Dict[str, int] = {} # NEW "u16", "16-20", etc.

    # Новое поле: Статистика последнего контакта (для Mailing)
    last_contact_stats: Optional[Dict[str, int]] = None
    
    # Новое поле: Lifetime stats
    lifetime_stats: Optional[LifetimeStats] = None

    # Новое поле: Данные графика для рассылки (FC - First Contact)
    mailing_chart_data: List[PostChartData] = []

    # Optional stats for posts list
    post_stats: Optional[PostStats] = None
    # Optional stats for mailing list
    mailing_stats: Optional[MailingStats] = None

# --- Task Responses ---
class TaskStartResponse(BaseModel):
    taskId: str

class TaskStatusResponse(BaseModel):
    taskId: str
    status: str # 'pending', 'fetching', 'processing', 'done', 'error'
    loaded: Optional[int] = 0
    total: Optional[int] = 0
    message: Optional[str] = None
    error: Optional[str] = None
    result: Optional[Any] = None
    updated_at: Optional[float] = None
    meta: Optional[Dict[str, str]] = None

class TaskListResponse(BaseModel):
    tasks: List[TaskStatusResponse]

# --- System Accounts Responses ---
class VerifyTokenResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    photo_100: Optional[str] = None

class GetLogsResponse(BaseModel):
    items: List[TokenLog]
    total_count: int
    page: int
    page_size: int

# --- Log Stats Responses ---
class LogStatItem(BaseModel):
    method: str
    project_id: Optional[str] = None
    status: str
    count: int
    last_used: Optional[str] = None # ISO date

class AccountStatsResponse(BaseModel):
    total_requests: int
    success_count: int
    error_count: int
    items: List[LogStatItem]

class ChartDataPoint(BaseModel):
    date: str
    methods: Dict[str, int] # method_name -> count

class AccountChartResponse(BaseModel):
    data: List[ChartDataPoint]

# --- Project Context Responses (NEW) ---
class ProjectContextResponse(BaseModel):
    fields: List[ProjectContextField]
    values: List[ProjectContextValue]

class ProjectSpecificContextResponse(BaseModel):
    project_id: str
    values: Dict[str, str] # { "Название поля": "Значение" }

# --- AI Logs Responses ---
class GetAiLogsResponse(BaseModel):
    items: List[AiTokenLog]
    total_count: int
    page: int
    page_size: int