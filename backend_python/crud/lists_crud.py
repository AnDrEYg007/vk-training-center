
# Этот файл теперь выступает в роли "хаба" (Facade), объединяя функциональность
# нескольких модулей из пакета `crud.lists`.
# Это обеспечивает обратную совместимость для остальной части приложения.

from .lists.meta import get_list_meta, update_list_meta
from .lists.stats import get_list_stats_data
from .lists.retrieval import get_subscribers, get_subscribers_count
from .lists.subscribers import (
    get_all_subscriber_vk_ids,
    bulk_add_subscribers,
    bulk_delete_subscribers,
    bulk_update_subscriber_details,
    get_subscribers_by_vk_ids,
    delete_all_subscribers # New
)
from .lists.history import (
    bulk_add_history_join,
    bulk_add_history_leave,
    get_all_history_vk_ids,
    bulk_update_history_details,
    delete_all_history_join, # New
    delete_all_history_leave # New
)
from .lists.posts import (
    bulk_upsert_posts,
    get_stored_posts_count,
    delete_all_posts # New
)
from .lists.interactions import (
    get_interactions, 
    bulk_upsert_interactions,
    get_all_interaction_vk_ids,
    bulk_update_interaction_users,
    delete_all_interactions # New
)
from .lists.mailing import (
    bulk_upsert_mailing,
    get_all_mailing_vk_ids,
    delete_all_mailing # New
)
# NEW
from .lists.authors import (
    bulk_upsert_authors,
    delete_all_authors
)

# Импорт для системных аккаунтов
from .system_accounts.account_crud import (
    get_all_accounts,
    get_existing_vk_ids,
    create_accounts,
    update_account,
    delete_account,
    get_active_account_tokens
)

# Импорт для автоматизаций
from .automations import (
    get_contest_settings,
    upsert_contest_settings,
    get_promocodes,
    bulk_create_promocodes,
    delete_promocode,
    delete_promocodes_bulk,
    update_promocode_description
)
