
from sqlalchemy.orm import Session
from typing import List
import uuid
from fastapi import HTTPException

import crud
import schemas
import models
from services import vk_service
import crud.token_log_crud as log_crud
# Импортируем низкоуровневый клиент напрямую, чтобы обойти логику ротации токенов в vk_service
from services.vk_api.api_client import call_vk_api as raw_vk_call
from config import settings

def get_all_accounts(db: Session) -> List[schemas.SystemAccount]:
    accounts = crud.get_all_accounts(db)
    
    # Получаем статистику для всех аккаунтов одним запросом
    stats_map = log_crud.get_all_stats_map(db)
    
    result = []
    for acc in accounts:
        # Преобразуем в Pydantic модель
        account_model = schemas.SystemAccount.model_validate(acc, from_attributes=True)
        
        # Добавляем статистику, если есть
        if acc.id in stats_map:
            account_model.stats = stats_map[acc.id]
        else:
            account_model.stats = {'success': 0, 'error': 0}
            
        result.append(account_model)
        
    return result

def add_accounts_by_urls(db: Session, urls_string: str, user_token: str) -> int:
    """
    Принимает список ссылок, парсит их, получает данные из VK и сохраняет в БД.
    Возвращает количество добавленных аккаунтов.
    """
    # 1. Парсинг ссылок
    urls = [u.strip() for u in urls_string.splitlines() if u.strip()]
    if not urls:
        return 0

    # 2. Извлечение идентификаторов
    identifiers = []
    for url in urls:
        identifier = vk_service.extract_vk_group_identifier(url)
        if identifier:
            identifiers.append(identifier)
            
    if not identifiers:
        return 0

    # 3. Получение существующих ID чтобы не дублировать
    existing_ids = crud.get_existing_vk_ids(db)

    # 4. Запрос к VK API
    # Используем users.get, он умеет принимать и ID, и screen_name
    try:
        user_ids_str = ",".join(identifiers)
        response = vk_service.call_vk_api('users.get', {
            'user_ids': user_ids_str,
            'fields': 'photo_100',
            'access_token': user_token
        })
    except Exception as e:
        print(f"Error fetching users from VK: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch users from VK: {str(e)}")

    # 5. Подготовка данных для сохранения
    accounts_to_create = []
    
    for user_data in response:
        vk_id = user_data['id']
        
        # Пропускаем, если уже есть в базе
        if vk_id in existing_ids:
            continue
            
        # Исключаем повторы внутри одного запроса
        if any(a['vk_user_id'] == vk_id for a in accounts_to_create):
            continue

        full_name = f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip()
        
        accounts_to_create.append({
            "id": str(uuid.uuid4()),
            "vk_user_id": vk_id,
            "full_name": full_name,
            "profile_url": f"https://vk.com/id{vk_id}",
            "avatar_url": user_data.get('photo_100'),
            "token": None, # Токен добавляется вручную позже
            "status": "unknown"
        })

    # 6. Сохранение
    if accounts_to_create:
        crud.create_accounts(db, accounts_to_create)
        
    return len(accounts_to_create)

def update_account(db: Session, account_id: str, account_data: schemas.SystemAccount) -> schemas.SystemAccount:
    # Добавляем status и notes в список обновляемых полей
    updates = {
        "token": account_data.token,
        "status": account_data.status,
        "notes": getattr(account_data, 'notes', None) # Безопасное получение, если поля нет в схеме
    }
    
    updated_account = crud.update_account(db, account_id, updates)
    if not updated_account:
        raise HTTPException(status_code=404, detail="Account not found")
    return schemas.SystemAccount.model_validate(updated_account, from_attributes=True)

def delete_account(db: Session, account_id: str):
    success = crud.delete_account(db, account_id)
    if not success:
        raise HTTPException(status_code=404, detail="Account not found")

def verify_token(token: str) -> schemas.VerifyTokenResponse:
    """
    Проверяет токен, делая запрос к users.get с этим токеном.
    Возвращает данные пользователя, которому принадлежит токен.
    """
    try:
        # Очищаем токен от пробелов и кавычек на всякий случай
        clean_token = token.strip().strip('"').strip("'")

        # ВАЖНО: Используем raw_vk_call вместо vk_service.call_vk_api.
        # vk_service.call_vk_api содержит логику ротации токенов и может подменить
        # проверяемый токен на один из системных, что приведет к возврату неверного пользователя.
        response = raw_vk_call('users.get', {
            'fields': 'photo_100',
            'access_token': clean_token
        })
        
        if not response or len(response) == 0:
            raise Exception("VK API returned empty response")
            
        user_data = response[0]
        return schemas.VerifyTokenResponse(
            id=user_data['id'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            photo_100=user_data.get('photo_100')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid token or VK API error: {str(e)}")

def verify_env_token() -> schemas.VerifyTokenResponse:
    """
    Проверяет токен из переменных окружения.
    """
    token = settings.vk_user_token
    if not token:
        raise HTTPException(status_code=400, detail="ENV token is not configured")
        
    try:
        # Очищаем токен от пробелов и кавычек, которые могли попасть из .env
        clean_token = token.strip().strip('"').strip("'")
        
        # Используем raw_vk_call для проверки конкретного токена
        response = raw_vk_call('users.get', {
            'fields': 'photo_100',
            'access_token': clean_token
        })
        
        if not response or len(response) == 0:
            raise Exception("VK API returned empty response")
            
        user_data = response[0]
        return schemas.VerifyTokenResponse(
            id=user_data['id'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            photo_100=user_data.get('photo_100')
        )
    except Exception as e:
        print(f"ENV Token verification failed: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid ENV token or VK API error: {str(e)}")
