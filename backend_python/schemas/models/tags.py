from pydantic import BaseModel, ConfigDict
from typing import Optional

class TagBase(BaseModel):
    name: str
    keyword: str
    note: Optional[str] = None
    color: str

class TagCreate(TagBase):
    pass

class TagUpdate(TagBase):
    pass

class Tag(TagBase):
    id: str
    project_id: str

    model_config = ConfigDict(from_attributes=True)