
# Этот файл теперь является хабом (Facade) для всех базовых моделей.
# Логика моделей вынесена в отдельные файлы в папке schemas/models/.
# Мы импортируем их сюда, чтобы сохранить обратную совместимость с остальной частью проекта,
# которая импортирует их как `from schemas.base_models import ...`

from .models.media import PhotoAttachment, Attachment, Album, Photo
from .models.tags import TagBase, TagCreate, TagUpdate, Tag
from .models.ai import AiPromptPresetBase, AiPromptPresetCreate, AiPromptPresetUpdate, AiPromptPreset
from .models.projects import Project, User, Variable
from .models.posts import PostBase, ScheduledPost, SystemPost, SuggestedPost, Note
from .models.settings import GlobalVariableDefinition, ProjectGlobalVariableValue
from .models.market import MarketCategory, MarketPrice, MarketAlbum, MarketItem
from .models.lists import (
    ListMemberBase, 
    SystemListSubscriber,
    SystemListMailingItem,
    SystemListHistoryItem, 
    SystemListPost, 
    SystemListInteraction,
    SystemListAuthor,
    ProjectListMeta
)
from .models.system import SystemAccount, TokenLog
from .models.ai_tokens import AiToken, AiTokenLog, AiTokenVerifyResult, VerifyAiTokensResponse

# Новые схемы
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class ProjectContextField(BaseModel):
    id: str
    name: str
    description: str | None = None
    is_global: bool = True
    project_ids: List[str] = [] # IDs проектов, которым доступно поле (если is_global=False)

    model_config = ConfigDict(from_attributes=True)

class ProjectContextValue(BaseModel):
    id: str
    project_id: str
    field_id: str
    value: str | None = None
    model_config = ConfigDict(from_attributes=True)

# Экспорт для чистоты (не обязательно в Python, но полезно для понимания)
__all__ = [
    "PhotoAttachment", "Attachment", "Album", "Photo",
    "TagBase", "TagCreate", "TagUpdate", "Tag",
    "AiPromptPresetBase", "AiPromptPresetCreate", "AiPromptPresetUpdate", "AiPromptPreset",
    "Project", "User", "Variable",
    "PostBase", "ScheduledPost", "SystemPost", "SuggestedPost", "Note",
    "GlobalVariableDefinition", "ProjectGlobalVariableValue",
    "MarketCategory", "MarketPrice", "MarketAlbum", "MarketItem",
    "ListMemberBase", "SystemListSubscriber", "SystemListMailingItem", "SystemListHistoryItem", "SystemListPost", "SystemListInteraction", "SystemListAuthor", "ProjectListMeta",
    "SystemAccount", "TokenLog",
    "ProjectContextField", "ProjectContextValue",
    "AiToken", "AiTokenLog"
]
