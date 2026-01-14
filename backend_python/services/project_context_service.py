
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import uuid
import json
import re
import crud.project_context_crud as context_crud
import crud
import schemas
import models
from fastapi import HTTPException
from services import vk_service, gemini_service, market_service, post_service
from config import settings

def get_context_structure(db: Session):
    # Импорт внутри функции, чтобы избежать циклических зависимостей
    import services.initialization_service as init_service
    
    # Запускаем инициализацию предзаданных полей.
    init_service.init_all_data(db)
    
    # Получаем актуальный список полей
    fields = context_crud.get_all_fields(db)
    return fields

def create_field(db: Session, name: str, description: str = None, is_global: bool = True, project_ids: List[str] = None):
    return context_crud.create_field(db, name, description, is_global, project_ids)

def update_field(db: Session, field_id: str, payload: schemas.UpdateContextFieldPayload):
    updated_field = context_crud.update_field(db, field_id, payload)
    if not updated_field:
        raise HTTPException(status_code=404, detail="Field not found")
    return updated_field

def delete_field(db: Session, field_id: str):
    context_crud.delete_field(db, field_id)

def get_all_data(db: Session) -> schemas.ProjectContextResponse:
    fields = get_context_structure(db)
    values = context_crud.get_all_values(db)
    return schemas.ProjectContextResponse(
        fields=fields,
        values=[schemas.ProjectContextValue.model_validate(v, from_attributes=True) for v in values]
    )

def update_values(db: Session, values: List[Dict]):
    context_crud.update_values(db, values)

def get_project_context(db: Session, project_id: str) -> schemas.ProjectSpecificContextResponse:
    all_fields = get_context_structure(db)
    
    available_fields = [
        f for f in all_fields 
        if f.is_global or (f.project_ids and project_id in f.project_ids)
    ]
    
    values = context_crud.get_values_by_project(db, project_id)
    result_map = {}
    fields_map = {f.id: f.name for f in available_fields}
    
    for v in values:
        field_name = fields_map.get(v.field_id)
        if field_name and v.value:
            result_map[field_name] = v.value
            
    return schemas.ProjectSpecificContextResponse(
        project_id=project_id,
        values=result_map
    )

def _get_vk_info(db: Session, project_id: str) -> tuple[dict, dict]:
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    user_token = settings.vk_user_token
    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        
        vk_info_resp = vk_service.call_vk_api('groups.getById', {
            'group_id': numeric_id,
            'fields': 'description,activity,status,contacts,links,site',
            'access_token': user_token
        })
        
        group_info = None
        if isinstance(vk_info_resp, list) and len(vk_info_resp) > 0:
            group_info = vk_info_resp[0]
        elif isinstance(vk_info_resp, dict) and 'groups' in vk_info_resp:
             group_info = vk_info_resp['groups'][0]
             
        if not group_info:
            raise Exception("Failed to fetch group info from VK")

        try:
            vk_addr_resp = vk_service.call_vk_api('groups.getAddresses', {
                'group_id': numeric_id,
                'fields': 'city,country,address,phone',
                'access_token': user_token
            })
            addresses = vk_addr_resp
        except Exception:
            addresses = {} 

        return group_info, addresses
    except vk_service.VkApiError as e:
        raise HTTPException(400, f"VK API Error: {e}")

def _validate_ai_value(field_name: str, value: str) -> bool:
    """
    Валидирует значение от AI на соответствие строгим правилам формата ссылок.
    Возвращает True, если значение валидно, иначе False.
    """
    if not field_name:
        return False
        
    val = value.strip()
    name_lower = field_name.lower().strip()

    if name_lower == "сайт":
        # Ссылка на сайт не должна быть ссылкой на приложение доставки VK
        if "vk.com/app" in val:
            return False
    
    elif name_lower == "android":
        # Должна начинаться строго на Google Play
        if not val.startswith("https://play.google.com/store/apps/details?"):
            return False
            
    elif name_lower == "ios":
        # Должна быть ссылкой на App Store
        # Пример: https://apps.apple.com/ru/app/id123456 или /us/app/
        if not val.startswith("https://apps.apple.com/"):
            return False
        if "/app/" not in val:
            return False
            
    elif name_lower == "dlvry":
        # Должна быть ссылкой на приложение доставки ВКонтакте. 
        # Она ОБЯЗАНА иметь вид `https://vk.com/app6408974_-XXXXXXXX`.
        if not re.match(r'^https://vk\.com/app6408974_-?\d+$', val):
            return False
            
    elif name_lower == "зона доставки":
        # 1. Должна быть ссылкой
        if not val.startswith("http"):
            return False
        
        # 2. Должна содержать домены карт
        is_yandex = "yandex" in val
        is_google = "google" in val or "goo.gl" in val
        is_2gis = "2gis" in val
        
        if not (is_yandex or is_google or is_2gis):
            return False

    return True

def ai_autofill_project(db: Session, project_id: str) -> List[Dict]:
    group_info, addresses = _get_vk_info(db, project_id)
    
    all_fields = get_context_structure(db)
    
    # Получаем уже существующие значения для этого проекта
    existing_values = context_crud.get_values_by_project(db, project_id)
    filled_field_ids = {v.field_id for v in existing_values if v.value and v.value.strip()}

    excluded_field_names = {
        "Тональность бренда",
        "Описание компании",
        "Описание товаров и услуг"
    }
    
    # Фильтруем поля: исключаем заполненные И исключаем "нарративные" поля (описание, тональность)
    available_fields = [
        f for f in all_fields 
        if (f.is_global or (f.project_ids and project_id in f.project_ids))
        and f.name not in excluded_field_names
        and f.id not in filled_field_ids
    ]

    if not available_fields:
        return []

    try:
        ai_result = gemini_service.get_project_context_ai_fill(group_info, addresses, available_fields)
        
        # Создаем мапу ID -> Name для валидации
        field_name_map = {f.id: f.name for f in available_fields}
        # Создаем обратную мапу Name(lower) -> ID для страховки, если AI вернул имя вместо ID
        field_id_map = {f.name.lower().strip(): f.id for f in available_fields}

        suggestions = []
        for item in ai_result:
            # AI может вернуть field_id или field_name
            raw_field_id = str(item.get('field_id', item.get('field_name', ''))).strip()
            value = item.get('value')
            
            real_field_id = None
            field_name = None

            # 1. Пробуем найти по ID (нормальное поведение)
            if raw_field_id in field_name_map:
                real_field_id = raw_field_id
                field_name = field_name_map[real_field_id]
            # 2. Если не нашли, пробуем найти по Имени (AI ошибся и вернул имя вместо ID)
            elif raw_field_id.lower() in field_id_map:
                real_field_id = field_id_map[raw_field_id.lower()]
                field_name = field_name_map[real_field_id]
            
            if real_field_id:
                if value:
                    # Если поле найдено и есть значение - валидируем
                    if _validate_ai_value(field_name, value):
                        suggestions.append({
                            "id": f"temp-{uuid.uuid4()}",
                            "project_id": project_id,
                            "field_id": real_field_id,
                            "value": value
                        })
                    else:
                        print(f"AI Autofill: Filtered out invalid value for '{field_name}': {value}")
                else:
                    # Если ID найден, но значения нет (AI вернул null) - это нормально, просто пропускаем
                    pass
            else:
                 # Если ID совсем левый (не совпал ни с ID, ни с именем)
                 print(f"AI Autofill: Unknown field identifier '{raw_field_id}' returned by AI. Value: {value}")
                    
        return suggestions
    except Exception as e:
        print(f"AI Autofill Error: {e}")
        raise HTTPException(500, f"AI Autofill failed: {e}")

# --- New Handlers ---

def _get_existing_context_str(db: Session, project_id: str) -> str:
    ctx = get_project_context(db, project_id)
    return json.dumps(ctx.values, ensure_ascii=False)

def generate_company_desc(db: Session, project_id: str) -> str:
    # 1. Данные из VK
    group_info, addresses = _get_vk_info(db, project_id)
    # 2. Существующий контекст
    existing_context = _get_existing_context_str(db, project_id)
    
    # 3. Тексты постов (добавляем для глубины анализа)
    user_token = settings.vk_user_token
    posts = crud.get_posts_by_project_id(db, project_id)
    # Если постов мало, подгружаем
    if len(posts) < 10:
        try:
            post_service.refresh_published_posts(db, project_id, user_token)
            posts = crud.get_posts_by_project_id(db, project_id)
        except Exception as e:
            print(f"Warning: Failed to fetch posts for company desc: {e}")

    # Берем последние 50
    posts = sorted(posts, key=lambda x: x.date, reverse=True)[:50]
    post_texts = [p.text for p in posts if p.text]

    try:
        return gemini_service.generate_company_description(group_info, existing_context, post_texts)
    except Exception as e:
         raise HTTPException(500, f"AI Company Desc failed: {e}")

def generate_products_desc(db: Session, project_id: str) -> str:
    # 1. Существующий контекст
    existing_context = _get_existing_context_str(db, project_id)
    
    # 2. Товары
    user_token = settings.vk_user_token
    # Проверяем и обновляем если нужно (умное кеширование внутри)
    market_data = market_service.get_market_data(db, project_id, user_token)
    
    # Формируем упрощенный список товаров для промпта
    simple_items = []
    for item in market_data.get('items', []):
        simple_items.append({
            "title": item.title,
            "description": item.description,
            "category": item.category.get('name') if item.category else ""
        })
    
    simple_albums = [{"title": a.title} for a in market_data.get('albums', [])]

    try:
        return gemini_service.generate_products_description(existing_context, simple_albums, simple_items)
    except Exception as e:
        raise HTTPException(500, f"AI Products Desc failed: {e}")

def generate_tone(db: Session, project_id: str) -> str:
    # 1. Существующий контекст
    existing_context = _get_existing_context_str(db, project_id)
    
    # 2. Посты
    user_token = settings.vk_user_token
    
    # Получаем посты. Если их мало в кеше, обновляем
    posts = crud.get_posts_by_project_id(db, project_id)
    if len(posts) < 10:
        post_service.refresh_published_posts(db, project_id, user_token)
        posts = crud.get_posts_by_project_id(db, project_id)
    
    # Берем последние 50
    posts = sorted(posts, key=lambda x: x.date, reverse=True)[:50]
    
    texts = [p.text for p in posts if p.text]
    
    if not texts:
        raise HTTPException(400, "Not enough posts to analyze tone.")

    try:
        return gemini_service.generate_brand_tone(existing_context, texts)
    except Exception as e:
        raise HTTPException(500, f"AI Tone failed: {e}")
