
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict

# Импортируем все необходимые схемы из корневого пакета schemas
import schemas

import services.ai_service as ai_service
from database import SessionLocal
from config import settings

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/generatePostText", response_model=schemas.GeneratedTextResponse)
def generate_post_text(payload: schemas.GenerateTextPayload, db: Session = Depends(get_db)):
    """
    Генерирует текст для поста с помощью Gemini.
    Принимает основной промпт и опциональный системный промпт.
    """
    generated_text = ai_service.generate_text_from_prompt(
        prompt=payload.prompt,
        system_prompt=payload.system_prompt
    )
    return {"generatedText": generated_text}

@router.post("/generateBatchPostTexts", response_model=schemas.GeneratedBatchTextResponse)
def generate_batch_post_texts(payload: schemas.GenerateBatchTextPayload, db: Session = Depends(get_db)):
    """
    Генерирует {count} уникальных вариаций текста поста.
    """
    variations = ai_service.generate_batch_post_text(
        prompt=payload.prompt,
        count=payload.count,
        system_prompt=payload.system_prompt
    )
    return {"variations": variations}

@router.post("/defaultSystemPrompt", response_model=Dict[str, str])
def get_default_system_prompt():
    """Возвращает системный промпт по умолчанию для генератора текста."""
    return {"default_prompt": ai_service.DEFAULT_SYSTEM_PROMPT}


@router.post("/correctSuggestedPostText", response_model=schemas.CorrectedTextResponse)
def correct_text(payload: schemas.CorrectTextPayload, db: Session = Depends(get_db)):
    corrected_text = ai_service.correct_suggested_text(db, payload.text, payload.projectId, settings.vk_user_token)
    return {"correctedText": corrected_text}

@router.post("/runAiVariableSetup", response_model=schemas.AiVariableSetupResponse)
def run_ai_variable_setup(payload: schemas.AiVariablePayload, db: Session = Depends(get_db)):
    return ai_service.run_ai_variable_setup(db, payload, settings.vk_user_token)

@router.post("/processPostText", response_model=schemas.GeneratedTextResponse)
def process_post_text(payload: schemas.ProcessTextPayload, db: Session = Depends(get_db)):
    """
    Обрабатывает текст поста с помощью AI по заданному действию (рерайт, исправление ошибок).
    """
    processed_text = ai_service.process_post_text(
        text=payload.text,
        action=payload.action
    )
    return {"generatedText": processed_text}
