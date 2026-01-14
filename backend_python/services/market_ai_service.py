
from sqlalchemy.orm import Session
from fastapi import HTTPException
import json
import re
from typing import List, Dict

import crud
import models
from services import vk_service, gemini_service
# Используем относительный импорт, чтобы избежать конфликтов
from . import market_retrieval_service
import schemas
from config import settings

def _get_all_market_categories(db: Session) -> List[models.MarketCategory]:
    """Вспомогательная функция для получения всех категорий с фоллбэком на загрузку из VK."""
    all_categories = crud.get_all_market_categories(db)
    if not all_categories:
        try:
            print("SERVICE (Market AI Helper): No categories in cache, attempting to fetch from VK...")
            # Используем дефолтную версию (5.199) и новую логику
            vk_cats_response = vk_service.call_vk_api('market.getCategories', {
                'access_token': settings.vk_user_token
            })
            
            items_tree = vk_cats_response.get('items', [])
            # Используем функцию flatten из retrieval service (публичную)
            flat_items = market_retrieval_service.flatten_categories(items_tree)
            
            if flat_items:
                crud.replace_market_categories(db, flat_items)
                all_categories = crud.get_all_market_categories(db)
            
            if not all_categories:
                raise Exception("Market categories not found and could not be fetched from VK.")
        except Exception as e:
            raise Exception(f"Failed to fetch market categories: {e}")
    return all_categories

def _suggest_single_category(db: Session, project_id: str, title: str, description: str) -> schemas.MarketCategory:
    """
    Основная логика для подбора категории для одного товара с помощью AI в два этапа.
    """
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise Exception(f"Project with ID {project_id} not found.")

    all_categories = _get_all_market_categories(db)

    # --- ЭТАП 1: Выбор родительских секций ---
    sections = {cat.section_id: cat.section_name for cat in all_categories}
    sections_text = "\n".join([f"- {name} (id: {id})" for id, name in sections.items()])
    prompt_step1 = f"""
    Проанализируй название и описание товара для сообщества "{project.name}" и выбери 2-3 наиболее подходящие **родительские секции** для него из списка ниже.
    В ответе верни только JSON-массив объектов с ключами "id" и "name" для выбранных секций. Не добавляй никаких пояснений или markdown.

    Сообщество: "{project.name}"
    Название товара: "{title}"
    Описание товара: "{description}"

    Список доступных родительских секций:
    {sections_text}
    """

    print("SERVICE (Market AI Helper): Step 1 - Requesting parent sections from AI...")
    # ANALYTICAL: Работа с категориями и JSON
    raw_response_step1 = gemini_service.generate_text(prompt_step1, strategy='ANALYTICAL')
    json_match_step1 = re.search(r'\[[\s\S]*\]', raw_response_step1)
    if not json_match_step1:
        raise Exception("AI did not return a valid JSON array for sections.")
    
    selected_sections = json.loads(json_match_step1.group(0))
    selected_section_ids = {s['id'] for s in selected_sections}
    print(f"SERVICE (Market AI Helper): Step 1 - AI suggested section IDs: {selected_section_ids}")

    # --- ЭТАП 2: Выбор финальной подкатегории ---
    filtered_categories = [cat for cat in all_categories if cat.section_id in selected_section_ids]
    if not filtered_categories:
         print("SERVICE (Market AI Helper): Warning - no subcategories found for AI-selected sections. Falling back to all categories.")
         filtered_categories = all_categories

    categories_text_step2 = "\n".join([f"- {cat.name} (id: {cat.id})" for cat in filtered_categories])
    prompt_step2 = f"""
    Проанализируй название и описание товара для сообщества "{project.name}" и выбери **одну** наиболее подходящую **финальную категорию** из списка ниже.
    В ответе верни только JSON-объект с ключами "id" и "name" для выбранной категории. Не добавляй никаких пояснений или markdown.

    Сообщество: "{project.name}"
    Название товара: "{title}"
    Описание товара: "{description}"

    Список доступных подкатегорий:
    {categories_text_step2}
    """
    
    print("SERVICE (Market AI Helper): Step 2 - Requesting final category from AI...")
    # ANALYTICAL
    raw_response_step2 = gemini_service.generate_text(prompt_step2, strategy='ANALYTICAL')
    json_match_step2 = re.search(r'\{[\s\S]*\}', raw_response_step2)
    if not json_match_step2:
        raise Exception("AI did not return a valid JSON object for the final category.")
    
    category_json = json.loads(json_match_step2.group(0))
    category_id = category_json.get('id')
    selected_category = next((cat for cat in all_categories if cat.id == category_id), None)
    
    if not selected_category:
        raise Exception(f"AI returned an invalid or non-existent category ID in step 2: {category_id}")
        
    print(f"SERVICE (Market AI Helper): Step 2 - AI successfully suggested category '{selected_category.name}' (ID: {selected_category.id})")
    return schemas.MarketCategory.model_validate(selected_category, from_attributes=True)


def suggest_market_category(db: Session, payload: schemas.SuggestMarketCategoryPayload) -> schemas.MarketCategory:
    """Обертка для подбора категории для одного товара."""
    try:
        return _suggest_single_category(db, payload.projectId, payload.title, payload.description)
    except Exception as e:
        print(f"ERROR during AI category suggestion (Single): {e}")
        raise HTTPException(status_code=500, detail=f"AI category suggestion failed: {e}")

def bulk_suggest_market_category(db: Session, payload: schemas.BulkSuggestMarketCategoryPayload) -> List[schemas.BulkSuggestionResult]:
    """Подбирает категории для списка товаров с помощью двух пакетных запросов к AI."""
    print(f"SERVICE (Market AI): Starting BATCH suggestion for {len(payload.items)} items for project {payload.projectId}...")
    
    if not payload.items:
        return []

    try:
        project = crud.get_project_by_id(db, payload.projectId)
        if not project:
            raise Exception(f"Project with ID {payload.projectId} not found.")

        all_categories = _get_all_market_categories(db)
        
        # --- ЭТАП 1: Пакетный подбор родительских секций ---
        sections = {cat.section_id: cat.section_name for cat in all_categories}
        sections_text = "\n".join([f"- {name} (id: {id})" for id, name in sections.items()])
        items_text_step1 = "\n".join([f"  - Товар ID {item.id}: '{item.title}'" for item in payload.items])

        prompt_step1 = f"""
        Проанализируй список товаров для сообщества "{project.name}" и для КАЖДОГО из них подбери ДВЕ наиболее подходящие родительские секции из списка ниже.
        В ответе верни ТОЛЬКО JSON-объект, где ключ - это ID товара (число), а значение - МАССИВ из ДВУХ ID выбранных родительских секций (числа).
        Пример: {{"123": [45, 47], "124": [46, 48]}}

        СООБЩЕСТВО: "{project.name}"

        СПИСОК ТОВАРОВ:
        {items_text_step1}

        СПИСОК ДОСТУПНЫХ РОДИТЕЛЬСКИХ СЕКЦИЙ:
        {sections_text}
        """

        print("SERVICE (Market AI BATCH): Step 1 - Requesting parent sections from AI...")
        # ANALYTICAL
        raw_response_step1 = gemini_service.generate_text(prompt_step1, strategy='ANALYTICAL')
        json_match_step1 = re.search(r'\{[\s\S]*\}', raw_response_step1)
        if not json_match_step1:
            raise Exception("AI did not return a valid JSON object for sections in step 1.")
        
        item_to_sections_map: Dict[int, List[int]] = {int(k): v for k, v in json.loads(json_match_step1.group(0)).items()}
        print(f"SERVICE (Market AI BATCH): Step 1 - AI suggested section map: {item_to_sections_map}")

        # --- ЭТАП 2: УЛУЧШЕННЫЙ Пакетный подбор финальных подкатегорий ---
        
        # 1. Собираем ВСЕ УНИКАЛЬНЫЕ родительские секции, предложенные AI
        unique_suggested_section_ids = set()
        for section_ids in item_to_sections_map.values():
            unique_suggested_section_ids.update(section_ids)
        
        # 2. Формируем РАСШИРЕННЫЙ список подкатегорий, включив в него ВСЕ дочерние категории из ВСЕХ предложенных секций
        filtered_categories = [c for c in all_categories if c.section_id in unique_suggested_section_ids]
        
        if not filtered_categories:
            print("SERVICE (Market AI BATCH): Warning - no subcategories found for any suggested sections. Falling back to all categories.")
            filtered_categories = all_categories

        # 3. Формируем один большой промпт для второго шага
        categories_text_step2 = "\n".join([f"    - {cat.name} (id: {cat.id})" for cat in filtered_categories])
        items_text_step2 = "\n".join([f"  - Товар ID {item.id}: '{item.title}'" for item in payload.items])

        prompt_step2 = f"""
        Проанализируй список товаров для сообщества "{project.name}" и для КАЖДОГО из них подбери ОДНУ наиболее подходящую финальную подкатегорию из списка ниже.
        В ответе верни ТОЛЬКО JSON-объект, где ключ - это ID товара (число), а значение - ID выбранной подкатегории (число).
        Пример: {{"123": 4501, "124": 4602}}

        СООБЩЕСТВО: "{project.name}"

        СПИСОК ТОВАРОВ:
        {items_text_step2}

        СПИСОК ДОСТУПНЫХ ПОДКАТЕГОРИЙ (из всех релевантных секций):
        {categories_text_step2}
        """

        print("SERVICE (Market AI BATCH): Step 2 - Requesting final categories from AI with EXTENDED context...")
        # ANALYTICAL
        raw_response_step2 = gemini_service.generate_text(prompt_step2, strategy='ANALYTICAL')
        json_match_step2 = re.search(r'\{[\s\S]*\}', raw_response_step2)
        if not json_match_step2:
            raise Exception("AI did not return a valid JSON object for final categories in step 2.")
            
        item_to_category_map: Dict[int, int] = {int(k): int(v) for k, v in json.loads(json_match_step2.group(0)).items()}
        print(f"SERVICE (Market AI BATCH): Step 2 - AI suggested final category map: {item_to_category_map}")

        # --- Формирование финального результата ---
        all_categories_map = {c.id: c for c in all_categories}
        results = []
        for item_id_str, category_id in item_to_category_map.items():
            item_id = int(item_id_str)
            category_model = all_categories_map.get(category_id)
            if category_model:
                results.append(schemas.BulkSuggestionResult(
                    itemId=item_id,
                    category=schemas.MarketCategory.model_validate(category_model, from_attributes=True)
                ))
            else:
                print(f"WARNING: AI returned a non-existent category ID {category_id} for item {item_id}. Skipping.")

        print(f"SERVICE (Market AI BATCH): Batch suggestion finished. Successfully processed {len(results)} items.")
        return results

    except Exception as e:
        print(f"ERROR during AI bulk category suggestion: {e}")
        # В случае ошибки пакетной обработки, возвращаемся к медленному, но надежному поэлементному методу.
        print("Falling back to item-by-item suggestion...")
        results = []
        for item in payload.items:
            try:
                print(f"  -> Fallback: Suggesting for item ID {item.id} ('{item.title[:30]}...')")
                suggested_category = _suggest_single_category(db, payload.projectId, item.title, item.description)
                results.append(schemas.BulkSuggestionResult(itemId=item.id, category=suggested_category))
            except Exception as single_e:
                print(f"  -> ERROR suggesting for item ID {item.id} during fallback: {single_e}. Skipping this item.")
                continue
        print(f"SERVICE (Market AI): Fallback suggestion finished. Successfully processed {len(results)} items.")
        return results

def bulk_correct_descriptions(db: Session, payload: schemas.BulkCorrectDescriptionsPayload) -> List[schemas.CorrectedDescriptionResult]:
    """
    Исправляет орфографию и пунктуацию в описаниях для списка товаров с помощью одного пакетного запроса к AI.
    """
    if not payload.items:
        return []

    try:
        # Формируем промпт, который просит AI обработать каждый элемент и вернуть JSON
        items_text = "\n".join([f'"{item.id}": "{item.description}"' for item in payload.items])
        
        prompt = f"""
        Ты — редактор текстов. Твоя задача — исправить орфографические, пунктуационные и стилистические ошибки в предоставленных описаниях товаров. 
        Не меняй смысл и не добавляй новую информацию. Только корректура в соответствии с правилами русского языка.
        В ответе верни ТОЛЬКО JSON-объект, где ключ — это ID товара (число из запроса), а значение — исправленный текст (строка).
        
        Пример ответа: {{"123": "Исправленное описание для товара 123.", "456": "Исправленное описание для товара 456."}}
        
        Вот описания для обработки:
        {items_text}
        """

        print(f"SERVICE (Market AI BATCH): Requesting bulk description correction from AI for {len(payload.items)} items...")
        # ANALYTICAL - Работа с JSON и корректура
        raw_response = gemini_service.generate_text(prompt, strategy='ANALYTICAL')
        
        json_match = re.search(r'\{[\s\S]*\}', raw_response)
        if not json_match:
            raise Exception("AI did not return a valid JSON object for corrected descriptions.")
            
        corrected_data: Dict[str, str] = json.loads(json_match.group(0))
        
        results = []
        for item_id_str, corrected_text in corrected_data.items():
            results.append(schemas.CorrectedDescriptionResult(
                itemId=int(item_id_str),
                correctedText=corrected_text
            ))

        print(f"SERVICE (Market AI BATCH): Bulk correction finished. Successfully processed {len(results)} items.")
        return results

    except Exception as e:
        print(f"ERROR during AI bulk description correction: {e}")
        raise HTTPException(status_code=500, detail=f"AI bulk description correction failed: {e}")

def bulk_correct_titles(db: Session, payload: schemas.BulkCorrectTitlesPayload) -> List[schemas.CorrectedDescriptionResult]:
    """
    Исправляет орфографию и пунктуацию в названиях для списка товаров с помощью одного пакетного запроса к AI.
    """
    if not payload.items:
        return []

    try:
        # Формируем промпт, который просит AI обработать каждый элемент и вернуть JSON
        items_text = "\n".join([f'"{item.id}": "{item.title}"' for item in payload.items])
        
        prompt = f"""
        Ты — редактор текстов. Твоя задача — исправить орфографические, пунктуационные и стилистические ошибки в предоставленных НАЗВАНИЯХ товаров. 
        Названия должны быть короткими и емкими. Не меняй смысл и не добавляй новую информацию. Только корректура в соответствии с правилами русского языка.
        В ответе верни ТОЛЬКО JSON-объект, где ключ — это ID товара (число из запроса), а значение — исправленное название (строка).
        
        Пример ответа: {{"123": "Исправленное название для товара 123.", "456": "Исправленное название для товара 456."}}
        
        Вот названия для обработки:
        {items_text}
        """

        print(f"SERVICE (Market AI BATCH): Requesting bulk title correction from AI for {len(payload.items)} items...")
        # ANALYTICAL
        raw_response = gemini_service.generate_text(prompt, strategy='ANALYTICAL')
        
        json_match = re.search(r'\{[\s\S]*\}', raw_response)
        if not json_match:
            raise Exception("AI did not return a valid JSON object for corrected titles.")
            
        corrected_data: Dict[str, str] = json.loads(json_match.group(0))
        
        results = []
        for item_id_str, corrected_text in corrected_data.items():
            results.append(schemas.CorrectedDescriptionResult(
                itemId=int(item_id_str),
                correctedText=corrected_text
            ))

        print(f"SERVICE (Market AI BATCH): Bulk title correction finished. Successfully processed {len(results)} items.")
        return results

    except Exception as e:
        print(f"ERROR during AI bulk title correction: {e}")
        raise HTTPException(status_code=500, detail=f"AI bulk title correction failed: {e}")
