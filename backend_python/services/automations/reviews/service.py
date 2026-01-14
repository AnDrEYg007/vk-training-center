
# Этот файл теперь выступает в роли "хаба" (Facade), объединяя функциональность
# нескольких специализированных модулей для автоматизации конкурсов.

from .collector import collect_participants
from .processor import process_new_participants
from .finalizer import finalize_contest
from .retrieval import get_contest_entries, clear_contest_entries
from .execution import execute_scheduled_contest
from .blacklist_service import add_blacklist_users

__all__ = [
    'collect_participants',
    'process_new_participants',
    'finalize_contest',
    'get_contest_entries',
    'clear_contest_entries',
    'execute_scheduled_contest',
    'add_blacklist_users'
]
