from pydantic import BaseModel, ConfigDict
from typing import Optional

class GlobalVariableDefinition(BaseModel):
    id: str
    name: str
    placeholder_key: str
    note: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ProjectGlobalVariableValue(BaseModel):
    id: str
    project_id: str
    definition_id: str
    value: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)