from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# Используем __init__.py для импорта, чтобы сохранить консистентность
import schemas
import services.market_ai_service as market_ai_service
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/suggestCategory", response_model=schemas.MarketCategory)
def suggest_market_category(payload: schemas.SuggestMarketCategoryPayload, db: Session = Depends(get_db)):
    """
    Использует AI для подбора наиболее подходящей категории товара на основе его названия и описания.
    """
    return market_ai_service.suggest_market_category(db, payload)

@router.post("/bulkSuggestCategory", response_model=List[schemas.BulkSuggestionResult])
def bulk_suggest_market_category(payload: schemas.BulkSuggestMarketCategoryPayload, db: Session = Depends(get_db)):
    """
    Использует AI для подбора категорий для списка товаров.
    """
    return market_ai_service.bulk_suggest_market_category(db, payload)

@router.post("/bulkCorrectDescriptions", response_model=List[schemas.CorrectedDescriptionResult])
def bulk_correct_descriptions(payload: schemas.BulkCorrectDescriptionsPayload, db: Session = Depends(get_db)):
    """
    Использует AI для исправления орфографии и пунктуации в описаниях списка товаров.
    """
    return market_ai_service.bulk_correct_descriptions(db, payload)

@router.post("/bulkCorrectTitles", response_model=List[schemas.CorrectedDescriptionResult])
def bulk_correct_titles(payload: schemas.BulkCorrectTitlesPayload, db: Session = Depends(get_db)):
    """
    Использует AI для исправления орфографии и пунктуации в названиях списка товаров.
    """
    return market_ai_service.bulk_correct_titles(db, payload)