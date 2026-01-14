
from sqlalchemy import Engine
from db_migrations import (
    projects,
    tags,
    media,
    posts,
    settings,
    market,
    lists,
    system,
    ai_tokens,
    automations,
    automations_general
)

def run_migrations(engine: Engine):
    """
    Главная функция для запуска всех необходимых миграций.
    Вызывает модульные миграции в строгом порядке.
    """
    print("Running database migrations...")
    
    projects.migrate(engine)
    tags.migrate(engine)
    media.migrate(engine)
    posts.migrate(engine)
    settings.migrate(engine)
    market.migrate(engine)
    lists.migrate(engine)
    system.migrate(engine)
    ai_tokens.migrate(engine)
    automations.migrate(engine)
    automations_general.migrate(engine)

    print("Migrations complete.")
