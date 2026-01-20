
from pydantic import BaseModel, ConfigDict, field_validator, Field
from typing import List, Optional, Dict, Any
import json

# Импорт зависимостей из соседних модулей
from .media import PhotoAttachment, Attachment
from .tags import Tag

class PostBase(BaseModel):
    id: str
    date: str
    text: str
    images: List[PhotoAttachment]
    attachments: Optional[List[Attachment]] = []
    vkPostUrl: Optional[str] = None
    tags: List[Tag] = []
    
    # Поля для цикличности
    is_cyclic: Optional[bool] = False
    recurrence_type: Optional[str] = None
    recurrence_interval: Optional[int] = None
    recurrence_end_type: Optional[str] = 'infinite'
    recurrence_end_count: Optional[int] = None
    recurrence_end_date: Optional[str] = None
    recurrence_fixed_day: Optional[int] = None
    recurrence_is_last_day: Optional[bool] = False
    
    # ВАЖНО: Поле для параметров AI. Определено явно.
    # Используем Any, так как структура может меняться, но обычно это Dict.
    aiGenerationParams: Optional[Dict[str, Any]] = None

    # Новые поля для метаданных автоматизации
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True

    model_config = ConfigDict(from_attributes=True)
    
    @field_validator('images', 'attachments', mode='before')
    @classmethod
    def parse_json_string(cls, v):
        if isinstance(v, str):
            if not v:
                return []
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

class ScheduledPost(PostBase):
    pass

class SystemPost(BaseModel):
    id: str
    project_id: str
    publication_date: str
    text: str
    images: List[PhotoAttachment]
    attachments: Optional[List[Attachment]] = []
    status: str
    post_type: str
    
    # Поля цикличности
    is_cyclic: Optional[bool] = False
    recurrence_type: Optional[str] = None
    recurrence_interval: Optional[int] = None
    recurrence_end_type: Optional[str] = 'infinite'
    recurrence_end_count: Optional[int] = None
    recurrence_end_date: Optional[str] = None
    recurrence_fixed_day: Optional[int] = None
    recurrence_is_last_day: Optional[bool] = False
    
    # Сохраненные параметры AI (в БД это строка, здесь может быть распарсено или нет)
    ai_generation_params: Optional[str] = None

    # Новые поля
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True
    related_id: Optional[str] = None # Added for linking to other entities (e.g. general contest)

    model_config = ConfigDict(from_attributes=True)

    @field_validator('images', 'attachments', mode='before')
    @classmethod
    def parse_json_string(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            if not v:
                return []
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v

class SuggestedPost(BaseModel):
    id: str = Field(validation_alias='postId')
    authorId: str
    date: str
    text: str
    link: str
    imageUrl: List[str]
    authorLink: Optional[str] = None
    _groupName: Optional[str] = None
    _groupShort: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator('imageUrl', mode='before')
    @classmethod
    def parse_newline_string(cls, v):
        if isinstance(v, str):
            return v.split('\n') if v else []
        return v

class Note(BaseModel):
    id: str
    projectId: str
    date: str
    title: Optional[str] = None
    text: str
    color: str

    model_config = ConfigDict(from_attributes=True)
