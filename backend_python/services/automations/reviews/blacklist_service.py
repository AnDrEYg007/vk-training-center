
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone
import crud
import services.automations.reviews.crud as crud_automations
from services import vk_service
from config import settings

def add_blacklist_users(db: Session, project_id: str, urls_string: str, until_date_str: str = None) -> int:
    """
    Парсит ссылки, получает данные пользователей из VK и добавляет их в ЧС.
    """
    # 1. Проверяем наличие конкурса (создаем черновик, если нет, чтобы привязать ЧС)
    contest = crud_automations.get_contest_settings(db, project_id)
    if not contest:
        # Создаем пустой конфиг, чтобы было к чему вязать
        # Это крайний случай, обычно настройки уже есть
        raise HTTPException(404, "Сначала сохраните настройки конкурса.")

    # 2. Парсим ссылки
    lines = [line.strip() for line in urls_string.splitlines() if line.strip()]
    if not lines:
        return 0

    identifiers = []
    for line in lines:
        identifier = vk_service.extract_vk_group_identifier(line)
        if identifier:
            identifiers.append(identifier)
            
    if not identifiers:
        raise HTTPException(400, "Не удалось извлечь корректные ID или имена пользователей из ссылок.")

    # 3. Запрашиваем данные пользователей через VK API (users.get)
    try:
        user_ids_str = ",".join(identifiers)
        vk_response = vk_service.call_vk_api('users.get', {
            'user_ids': user_ids_str,
            'fields': 'screen_name',
            'access_token': settings.vk_user_token
        })
    except Exception as e:
        raise HTTPException(400, f"Ошибка VK API при проверке пользователей: {str(e)}")

    if not vk_response:
        raise HTTPException(400, "VK не вернул данных по указанным ссылкам.")

    # 4. Подготовка данных
    users_to_add = []
    for u in vk_response:
        users_to_add.append({
            'id': u['id'],
            'name': f"{u.get('first_name', '')} {u.get('last_name', '')}".strip(),
            'screen_name': u.get('screen_name')
        })

    # 5. Обработка даты
    until_date = None
    if until_date_str:
        try:
            # Принимаем ISO строку (2025-10-10) и делаем ее концом дня UTC
            dt = datetime.strptime(until_date_str, "%Y-%m-%d")
            until_date = dt.replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)
        except ValueError:
            pass # Если дата кривая, будет None (навсегда), или можно рейзить ошибку

    # 6. Сохранение
    crud_automations.add_to_blacklist(db, contest.id, users_to_add, until_date)
    
    return len(users_to_add)
