
# Этот файл теперь выступает в роли "хаба" (Facade), объединяя функциональность
# нескольких специализированных сервисов для работы с товарами.
# Это обеспечивает обратную совместимость для существующих роутеров.

from .market_retrieval_service import (
    get_market_data,
    refresh_all_market_data,
    get_market_categories,
    force_refresh_market_categories,
    flatten_categories # Exposed for AI service
)
from .market_album_service import *
from .market_item_service import *
