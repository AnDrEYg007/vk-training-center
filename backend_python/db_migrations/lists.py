
from sqlalchemy import Engine, inspect
from .utils import check_and_add_column
from models import (
    ProjectListMeta,
    SystemListSubscriber,
    SystemListHistoryJoin,
    SystemListHistoryLeave,
    SystemListPost,
    SystemListLikes,
    SystemListComments,
    SystemListReposts,
    SystemListMailing,
    SystemListAuthor # NEW
)

def migrate(engine: Engine):
    """Миграции для системных списков."""
    inspector = inspect(engine)

    # Миграция 20: Создать основные таблицы списков
    if not inspector.has_table("project_list_meta"):
        print("Table 'project_list_meta' not found. Creating it...")
        ProjectListMeta.__table__.create(engine)
        print("Table 'project_list_meta' created successfully.")

    if not inspector.has_table("system_list_subscribers"):
        print("Table 'system_list_subscribers' not found. Creating it...")
        SystemListSubscriber.__table__.create(engine)
        print("Table 'system_list_subscribers' created successfully.")

    if not inspector.has_table("system_list_history_join"):
        print("Table 'system_list_history_join' not found. Creating it...")
        SystemListHistoryJoin.__table__.create(engine)
        print("Table 'system_list_history_join' created successfully.")

    if not inspector.has_table("system_list_history_leave"):
        print("Table 'system_list_history_leave' not found. Creating it...")
        SystemListHistoryLeave.__table__.create(engine)
        print("Table 'system_list_history_leave' created successfully.")
        
    # Миграция 21: Добавить поля счетчиков в project_list_meta
    check_and_add_column(engine, 'project_list_meta', 'subscribers_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'history_join_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'history_leave_count', 'INTEGER DEFAULT 0')

    # Миграция 22: Добавить поля deactivated и last_seen в таблицы истории
    check_and_add_column(engine, 'system_list_history_join', 'deactivated', 'VARCHAR')
    check_and_add_column(engine, 'system_list_history_join', 'last_seen', 'BIGINT')
    check_and_add_column(engine, 'system_list_history_leave', 'deactivated', 'VARCHAR')
    check_and_add_column(engine, 'system_list_history_leave', 'last_seen', 'BIGINT')
    
    # Миграция 23: Создать таблицу system_list_posts и добавить поля в project_list_meta
    if not inspector.has_table("system_list_posts"):
        print("Table 'system_list_posts' not found. Creating it...")
        SystemListPost.__table__.create(engine)
        print("Table 'system_list_posts' created successfully.")
    
    check_and_add_column(engine, 'project_list_meta', 'posts_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'posts_last_updated', 'VARCHAR')
    
    # Миграция 24: Создать таблицы для взаимодействий (Лайки, Комменты, Репосты)
    if not inspector.has_table("system_list_likes"):
        print("Table 'system_list_likes' not found. Creating it...")
        SystemListLikes.__table__.create(engine)
        print("Table 'system_list_likes' created successfully.")

    if not inspector.has_table("system_list_comments"):
        print("Table 'system_list_comments' not found. Creating it...")
        SystemListComments.__table__.create(engine)
        print("Table 'system_list_comments' created successfully.")

    if not inspector.has_table("system_list_reposts"):
        print("Table 'system_list_reposts' not found. Creating it...")
        SystemListReposts.__table__.create(engine)
        print("Table 'system_list_reposts' created successfully.")
        
    # Добавить мета-поля для взаимодействий
    check_and_add_column(engine, 'project_list_meta', 'likes_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'comments_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'reposts_count', 'INTEGER DEFAULT 0')
    
    # Миграция 25: Добавить недостающие поля в таблицы взаимодействий
    for table in ['system_list_likes', 'system_list_comments', 'system_list_reposts']:
        check_and_add_column(engine, table, 'domain', 'VARCHAR')
        check_and_add_column(engine, table, 'bdate', 'VARCHAR')
        check_and_add_column(engine, table, 'city', 'VARCHAR')
        check_and_add_column(engine, table, 'country', 'VARCHAR')
        check_and_add_column(engine, table, 'has_mobile', 'BOOLEAN')
        check_and_add_column(engine, table, 'is_closed', 'BOOLEAN DEFAULT FALSE')
        check_and_add_column(engine, table, 'can_access_closed', 'BOOLEAN DEFAULT TRUE')

    # Миграция 27: Добавить расширенные поля в таблицы истории
    for table in ['system_list_history_join', 'system_list_history_leave']:
        check_and_add_column(engine, table, 'domain', 'VARCHAR')
        check_and_add_column(engine, table, 'bdate', 'VARCHAR')
        check_and_add_column(engine, table, 'city', 'VARCHAR')
        check_and_add_column(engine, table, 'country', 'VARCHAR')
        check_and_add_column(engine, table, 'has_mobile', 'BOOLEAN')
        check_and_add_column(engine, table, 'is_closed', 'BOOLEAN DEFAULT FALSE')
        check_and_add_column(engine, table, 'can_access_closed', 'BOOLEAN DEFAULT TRUE')

    # Миграция 28: Добавить поле stored_posts_count в project_list_meta
    check_and_add_column(engine, 'project_list_meta', 'stored_posts_count', 'INTEGER DEFAULT 0')
    
    # Миграция 32: Создать таблицу system_list_mailing и добавить поля в project_list_meta
    if not inspector.has_table("system_list_mailing"):
        print("Table 'system_list_mailing' not found. Creating it...")
        SystemListMailing.__table__.create(engine)
        print("Table 'system_list_mailing' created successfully.")
        
    check_and_add_column(engine, 'project_list_meta', 'mailing_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'mailing_last_updated', 'VARCHAR')

    # Миграция 35: Добавить поля времени обновления для взаимодействий
    check_and_add_column(engine, 'project_list_meta', 'likes_last_updated', 'VARCHAR')
    check_and_add_column(engine, 'project_list_meta', 'comments_last_updated', 'VARCHAR')
    check_and_add_column(engine, 'project_list_meta', 'reposts_last_updated', 'VARCHAR')

    # Миграция 38: Добавить поле signer_id в system_list_posts
    check_and_add_column(engine, 'system_list_posts', 'signer_id', 'BIGINT')
    
    # Миграция 39: Добавить поле post_author_id в system_list_posts
    check_and_add_column(engine, 'system_list_posts', 'post_author_id', 'BIGINT')

    # Миграция 40: Добавить счетчики для автоматизаций (конкурсы)
    check_and_add_column(engine, 'project_list_meta', 'reviews_participants_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'reviews_winners_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'reviews_posts_count', 'INTEGER DEFAULT 0')

    # Миграция 41: Создать таблицу system_list_authors и добавить поля в project_list_meta
    if not inspector.has_table("system_list_authors"):
        print("Table 'system_list_authors' not found. Creating it...")
        SystemListAuthor.__table__.create(engine)
        print("Table 'system_list_authors' created successfully.")

    check_and_add_column(engine, 'project_list_meta', 'authors_count', 'INTEGER DEFAULT 0')
    check_and_add_column(engine, 'project_list_meta', 'authors_last_updated', 'VARCHAR')

    # Миграция 42: Добавить поле platform (ID устройства)
    tables_to_update = [
        'system_list_subscribers',
        'system_list_mailing',
        'system_list_history_join',
        'system_list_history_leave',
        'system_list_likes',
        'system_list_comments',
        'system_list_reposts',
        'system_list_authors'
    ]
    for table in tables_to_update:
        check_and_add_column(engine, table, 'platform', 'INTEGER')

    # Миграция 43: Добавить поля added_at и source в system_list_mailing
    check_and_add_column(engine, 'system_list_mailing', 'added_at', 'TIMESTAMP')
    check_and_add_column(engine, 'system_list_mailing', 'source', 'VARCHAR DEFAULT \'manual\'')
    
    # Миграция 44: Добавить поля анализа первого сообщения для mailing
    # TIMESTAMP и BIGINT для Postgres
    check_and_add_column(engine, 'system_list_mailing', 'first_message_date', 'TIMESTAMP')
    check_and_add_column(engine, 'system_list_mailing', 'first_message_from_id', 'BIGINT')
