
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

from .base_models import Project, ScheduledPost, Note, Variable, TagCreate, TagUpdate, SystemPost, User, AiPromptPresetCreate, AiPromptPresetUpdate, GlobalVariableDefinition, MarketItem, SystemAccount, AiToken

# API Payloads
class ProjectIdPayload(BaseModel):
    projectId: str

class ProjectIdsPayload(BaseModel):
    projectIds: List[str]
    
class UpdateProjectPayload(BaseModel):
    project: Project

class SavePostPayload(BaseModel):
    post: ScheduledPost
    projectId: str
    publishNow: Optional[bool] = False
    scheduleInVk: Optional[bool] = False

class PublishPostPayload(BaseModel):
    post: ScheduledPost
    projectId: str

class DeletePostPayload(BaseModel):
    postId: str
    projectId: str
    
class CorrectTextPayload(BaseModel):
    text: str
    projectId: str

class AiVariablePayload(BaseModel):
    projectId: str
    emptyVariables: List[Variable]

# Новая схема для генерации текста
class GenerateTextPayload(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None

# Схема для пакетной генерации (AI Вариации)
class GenerateBatchTextPayload(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None
    count: int = 1

# Новая схема для обработки текста поста
class ProcessTextPayload(BaseModel):
    text: str
    action: str # 'rewrite' or 'fix_errors'
    projectId: str # Зарезервировано для будущего контекста


# Media Payloads
class CreateAlbumPayload(BaseModel):
    projectId: str
    title: str

class AlbumPayload(BaseModel):
    projectId: str

class PhotosPayload(BaseModel):
    projectId: str
    albumId: str
    page: int

class AlbumRefreshPayload(BaseModel):
    projectId: str

class PhotosRefreshPayload(BaseModel):
    projectId: str
    albumId: str


class SaveNotePayload(BaseModel):
    note: Note
    projectId: str

class DeleteNotePayload(BaseModel):
    noteId: str

class VkCallbackRequest(BaseModel):
    type: str
    object: Optional[Dict[str, Any]] = None
    group_id: int
    secret: Optional[str] = None

# --- Management Payloads ---
class UpdateProjectsPayload(BaseModel):
    projects: List[Project]

class AddProjectsByUrlsPayload(BaseModel):
    urls: str

# --- Tag Payloads ---
class CreateTagPayload(BaseModel):
    projectId: str
    tag: TagCreate

class UpdateTagPayload(BaseModel):
    tag: TagUpdate
    
# --- Market Payloads ---
class UpdateMarketItemPayload(BaseModel):
    projectId: str
    item: MarketItem

class UpdateMarketItemsPayload(BaseModel):
    projectId: str
    items: List[MarketItem]

# Новые схемы для создания/удаления товаров
class NewMarketItemPayload(BaseModel):
    name: str = Field(..., min_length=4)
    description: str = Field(..., min_length=10)
    category_id: int = Field(..., alias='categoryId')
    price: int
    old_price: Optional[int] = Field(None, alias='old_price')
    sku: Optional[str] = None
    album_id: Optional[int] = Field(None, alias='albumId')
    photoUrl: Optional[str] = None # URL фото, если не загружается файлом
    
class CreateMarketItemsPayload(BaseModel):
    projectId: str
    items: List[NewMarketItemPayload]

class DeleteMarketItemsPayload(BaseModel):
    projectId: str
    itemIds: List[int]

# --- AI Market Payloads ---
class SuggestMarketCategoryPayload(BaseModel):
    projectId: str
    title: str
    description: str

class SimpleMarketItem(BaseModel):
    id: int
    title: str
    description: str

class BulkSuggestMarketCategoryPayload(BaseModel):
    projectId: str
    items: List[SimpleMarketItem]

# Новые схемы для массовой коррекции описаний
class SimpleItemDescription(BaseModel):
    id: int
    description: str

class BulkCorrectDescriptionsPayload(BaseModel):
    items: List[SimpleItemDescription]

# Новые схемы для массовой коррекции названий
class SimpleItemTitle(BaseModel):
    id: int
    title: str

class BulkCorrectTitlesPayload(BaseModel):
    items: List[SimpleItemTitle]


# --- AI Prompt Preset Payloads ---
class CreateAiPromptPresetPayload(BaseModel):
    projectId: str
    preset: AiPromptPresetCreate

class UpdateAiPromptPresetPayload(BaseModel):
    preset: AiPromptPresetUpdate
    
# --- System Post Payloads ---
class SystemPostIdPayload(BaseModel):
    systemPostId: str

class UpdateSystemPostPayload(BaseModel):
    post: SystemPost
    
class SimplePostIdPayload(BaseModel):
    postId: str

# --- Auth & User Payloads ---
class LoginPayload(BaseModel):
    username: str
    password: str

class UpdateUsersPayload(BaseModel):
    users: List[User]

# --- Global Variable Payloads ---
class UpdateAllDefinitionsPayload(BaseModel):
    definitions: List[GlobalVariableDefinition]

class UpdateValuesForProjectPayload(BaseModel):
    projectId: str
    values: List[Dict[str, str]] # [{'definition_id': '...', 'value': '...'}]

# --- Lists Payloads ---
class SystemListPayload(BaseModel):
    projectId: str
    listType: str = 'subscribers' # subscribers, history_join, history_leave, likes, comments, reposts
    page: int = 1
    searchQuery: Optional[str] = None
    # Фильтры
    filterQuality: Optional[str] = 'all' # all, active, banned, deleted
    filterSex: Optional[str] = 'all' # all, female, male, unknown
    filterOnline: Optional[str] = 'any' # any, today, 3_days, week, month
    # Дополнительные фильтры
    filterCanWrite: Optional[str] = 'all' # all, allowed, forbidden (только для mailing)
    filterBdateMonth: Optional[str] = 'any' # any, 1, 2, ... 12, unknown
    filterPlatform: Optional[str] = 'any' # any, 1 (mobile), 2 (iphone), 4 (android), 7 (web)
    filterAge: Optional[str] = 'any' # NEW
    
    # Статистика
    statsPeriod: Optional[str] = 'all' # week, month, quarter, year, all, custom
    statsGroupBy: Optional[str] = 'month' # day, week, month, quarter, year
    statsDateFrom: Optional[str] = None # YYYY-MM-DD for custom period
    statsDateTo: Optional[str] = None # YYYY-MM-DD for custom period

class AnalyzeMailingPayload(BaseModel):
    projectId: str
    mode: str = 'missing' # 'missing' (Light) or 'full' (Heavy)

class RefreshInteractionsPayload(BaseModel):
    projectId: str
    dateFrom: str # ISO date string
    dateTo: str # ISO date string
    interactionType: str = 'all' # 'all', 'likes', 'comments', 'reposts'

class RefreshPostsPayload(BaseModel):
    projectId: str
    limit: Optional[str] = '1000' # '1000' or 'all'

# --- System Accounts Payloads ---
class AddSystemAccountsPayload(BaseModel):
    urls: str

class UpdateSystemAccountPayload(BaseModel):
    account: SystemAccount

class DeleteSystemAccountPayload(BaseModel):
    accountId: str

class VerifyTokenPayload(BaseModel):
    token: str
    
# --- Logs Payloads ---
class GetLogsPayload(BaseModel):
    accountIds: Optional[List[str]] = None # Список ID или 'env'. Если None/пусто -> все.
    searchQuery: Optional[str] = None
    status: Optional[str] = 'all' # 'all', 'success', 'error'
    page: int = 1
    pageSize: int = 50
    
class ClearLogsPayload(BaseModel):
    accountId: Optional[str] = None # Опционально: очистить только для одного. Если None -> очистить все (или по фильтру)

class AccountChartPayload(BaseModel):
    accountId: str
    granularity: str # 'hour', 'day', 'week', 'month'
    projectId: Optional[str] = None # Фильтр по проекту
    metric: str # 'total', 'success', 'error'

# --- Project Context Payloads (NEW) ---
class CreateContextFieldPayload(BaseModel):
    name: str
    description: Optional[str] = None
    is_global: bool = True
    project_ids: Optional[List[str]] = None

class UpdateContextFieldPayload(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_global: Optional[bool] = None
    project_ids: Optional[List[str]] = None

class UpdateContextValuesPayload(BaseModel):
    # List of { project_id, field_id, value }
    values: List[Dict[str, Any]]

# --- Bulk Actions ---
class BulkRefreshPayload(BaseModel):
    viewType: str = 'schedule' # 'schedule' | 'suggested' | 'products'

# --- AI Tokens Payloads ---
class UpdateAiTokensPayload(BaseModel):
    tokens: List[AiToken]

class DeleteAiTokenPayload(BaseModel):
    tokenId: str

class GetAiLogsPayload(BaseModel):
    tokenIds: Optional[List[str]] = None 
    searchQuery: Optional[str] = None
    status: Optional[str] = 'all' 
    page: int = 1
    pageSize: int = 50

class ClearAiLogsPayload(BaseModel):
    tokenId: Optional[str] = None