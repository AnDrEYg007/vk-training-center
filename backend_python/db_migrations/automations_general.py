from sqlalchemy import Engine, inspect
from models_library.general_contests import GeneralContestPromoCode, GeneralContestDeliveryLog, GeneralContestBlacklist

def migrate(engine: Engine):
    """Миграции для универсальных конкурсов (новые таблицы)."""
    inspector = inspect(engine)
    
    if not inspector.has_table("general_contest_promocodes"):
        print("Table 'general_contest_promocodes' not found. Creating it...")
        GeneralContestPromoCode.__table__.create(engine)
        print("Table 'general_contest_promocodes' created successfully.")

    if not inspector.has_table("general_contest_delivery_logs"):
        print("Table 'general_contest_delivery_logs' not found. Creating it...")
        GeneralContestDeliveryLog.__table__.create(engine)
        print("Table 'general_contest_delivery_logs' created successfully.")

    if not inspector.has_table("general_contest_blacklist"):
        print("Table 'general_contest_blacklist' not found. Creating it...")
        GeneralContestBlacklist.__table__.create(engine)
        print("Table 'general_contest_blacklist' created successfully.")
