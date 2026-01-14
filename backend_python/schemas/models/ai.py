from pydantic import BaseModel, ConfigDict

class AiPromptPresetBase(BaseModel):
    name: str
    prompt: str

class AiPromptPresetCreate(AiPromptPresetBase):
    pass

class AiPromptPresetUpdate(AiPromptPresetBase):
    pass

class AiPromptPreset(AiPromptPresetBase):
    id: str
    project_id: str

    model_config = ConfigDict(from_attributes=True)