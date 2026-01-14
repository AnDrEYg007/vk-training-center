
# Этот файл теперь является хабом (Facade), который объединяет логику статистики.
# Сама реализация вынесена в специализированные модули stats_posts.py и stats_users.py.

from sqlalchemy.orm import Session
from typing import Dict, Optional
from .stats_posts import get_post_stats
from .stats_users import get_user_stats

def get_list_stats_data(
    db: Session, 
    project_id: str, 
    list_type: str, 
    period: str = 'all', 
    group_by: str = 'month',
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    filter_can_write: str = 'all'
) -> Dict:
    """
    Фасадная функция для получения статистики.
    Маршрутизирует запрос в соответствующий модуль в зависимости от типа списка.
    """
    
    # === СТАТИСТИКА ПОСТОВ ===
    if list_type == 'posts':
        return get_post_stats(db, project_id, period, group_by, date_from, date_to)

    # === СТАТИСТИКА ПОЛЬЗОВАТЕЛЕЙ (Subscriber / History / Interaction / Authors) ===
    else:
        # Теперь передаем параметры периода и группировки также и для юзеров
        # (в основном используется для Mailing графика)
        return get_user_stats(db, project_id, list_type, period, group_by, date_from, date_to, filter_can_write)
