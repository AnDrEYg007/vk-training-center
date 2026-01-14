
from sqlalchemy import Engine, inspect
from .utils import check_and_add_column
from models import SystemAccount, TokenLog, SystemTask, AdministeredGroup

def migrate(engine: Engine):
    """Миграции для системных аккаунтов, логов и задач."""
    inspector = inspect(engine)

    # Миграция 29: Создать таблицу system_accounts
    if not inspector.has_table("system_accounts"):
        print("Table 'system_accounts' not found. Creating it...")
        SystemAccount.__table__.create(engine)
        print("Table 'system_accounts' created successfully.")
    
    # Миграция 30: Добавить поле status в таблицу system_accounts
    check_and_add_column(
        engine,
        'system_accounts',
        'status',
        'VARCHAR DEFAULT \'unknown\''
    )
    
    # Миграция 31: Создать таблицу token_logs
    if not inspector.has_table("token_logs"):
        print("Table 'token_logs' not found. Creating it...")
        TokenLog.__table__.create(engine)
        print("Table 'token_logs' created successfully.")

    # Миграция 33: Создать таблицу system_tasks (Task Monitor в БД)
    if not inspector.has_table("system_tasks"):
        print("Table 'system_tasks' not found. Creating it...")
        SystemTask.__table__.create(engine)
        print("Table 'system_tasks' created successfully.")

    # Миграция 34: Создать таблицу administered_groups
    if not inspector.has_table("administered_groups"):
        print("Table 'administered_groups' not found. Creating it...")
        AdministeredGroup.__table__.create(engine)
        print("Table 'administered_groups' created successfully.")
        
    # Миграция 45: Добавить поля для хранения администраторов групп
    check_and_add_column(engine, 'administered_groups', 'creator_id', 'BIGINT')
    check_and_add_column(engine, 'administered_groups', 'creator_name', 'VARCHAR')
    check_and_add_column(engine, 'administered_groups', 'admins_data', 'TEXT')
