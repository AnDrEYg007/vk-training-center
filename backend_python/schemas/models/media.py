from pydantic import BaseModel, ConfigDict, Field

class PhotoAttachment(BaseModel):
    id: str
    url: str

class Attachment(BaseModel):
    id: str
    type: str
    description: str

class Album(BaseModel):
    id: str # ownerId_albumId
    name: str = Field(validation_alias='title')
    size: int

    model_config = ConfigDict(from_attributes=True)

class Photo(BaseModel):
    id: str # ownerId_photoId
    url: str
    
    model_config = ConfigDict(from_attributes=True)