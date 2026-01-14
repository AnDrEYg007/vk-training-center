
# Этот файл теперь выступает в роли "хаба" (Facade), объединяя функциональность
# из подпакета `subscribers`. Это обеспечивает обратную совместимость.

from .subscribers.sync_task import refresh_subscribers_task
from .subscribers.details_task import refresh_subscriber_details_task

__all__ = [
    'refresh_subscribers_task',
    'refresh_subscriber_details_task'
]
