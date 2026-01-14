
# Этот файл теперь является "хабом" (Facade), который ре-экспортирует функции
# из модульного пакета `services.post_retrieval`.
# Это позволяет сохранить обратную совместимость с существующим кодом,
# который импортирует `services.post_retrieval_service`.

from services.post_retrieval import (
    get_all_data_for_projects,
    get_project_update_status,
    get_published_posts,
    refresh_published_posts,
    get_scheduled_posts,
    get_scheduled_post_count,
    refresh_scheduled_posts,
    refresh_all_schedule_data,
    get_suggested_posts,
    refresh_suggested_posts,
    _apply_tags_to_db_posts
)

__all__ = [
    'get_all_data_for_projects',
    'get_project_update_status',
    'get_published_posts',
    'refresh_published_posts',
    'get_scheduled_posts',
    'get_scheduled_post_count',
    'refresh_scheduled_posts',
    'refresh_all_schedule_data',
    'get_suggested_posts',
    'refresh_suggested_posts',
    '_apply_tags_to_db_posts'
]
