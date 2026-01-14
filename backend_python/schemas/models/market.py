from pydantic import BaseModel, ConfigDict, Field, AliasChoices, field_validator
from typing import List, Optional
import json

class MarketCategory(BaseModel):
    id: int
    name: str
    section_id: int
    section_name: str

    model_config = ConfigDict(from_attributes=True)

class MarketPrice(BaseModel):
    amount: str
    currency: dict
    text: str
    old_amount: Optional[str] = None
    
class MarketAlbum(BaseModel):
    id: int = Field(validation_alias='album_id')
    owner_id: int
    title: str
    count: int
    updated_time: int
    
    model_config = ConfigDict(from_attributes=True)

class MarketItem(BaseModel):
    id: int = Field(validation_alias=AliasChoices('item_id', 'id'))
    owner_id: int
    title: str = Field(..., min_length=4)
    description: str = Field(..., min_length=10)
    price: MarketPrice
    category: dict
    date: int
    thumb_photo: str
    availability: int
    album_ids: List[int] = []
    is_deleted: Optional[bool] = None
    sku: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator('price', 'category', mode='before')
    @classmethod
    def parse_json_dict_string(cls, v):
        if isinstance(v, str):
            return json.loads(v) if v else {}
        return v
    
    @field_validator('album_ids', mode='before')
    @classmethod
    def parse_json_list_string(cls, v):
        if isinstance(v, str):
            return json.loads(v) if v else []
        return v