
from sqlalchemy import Engine, inspect
from models import ReviewContest, PromoCode, ReviewContestEntry, ReviewContestDeliveryLog, ReviewContestBlacklist
from models_library.general_contests import GeneralContest, GeneralContestEntry
from .utils import check_and_add_column

def migrate(engine: Engine):
    """Миграции для автоматизаций."""
    inspector = inspect(engine)

    if not inspector.has_table("review_contests"):
        print("Table 'review_contests' not found. Creating it...")
        ReviewContest.__table__.create(engine)
        print("Table 'review_contests' created successfully.")

    if not inspector.has_table("general_contests"):
        print("Table 'general_contests' not found. Creating it...")
        GeneralContest.__table__.create(engine)
        print("Table 'general_contests' created successfully.")

    if not inspector.has_table("general_contest_entries"):
        print("Table 'general_contest_entries' not found. Creating it...")
        GeneralContestEntry.__table__.create(engine)
        print("Table 'general_contest_entries' created successfully.")

    if not inspector.has_table("promo_codes"):
        print("Table 'promo_codes' not found. Creating it...")
        PromoCode.__table__.create(engine)
        print("Table 'promo_codes' created successfully.")

    if not inspector.has_table("review_contest_entries"):
        print("Table 'review_contest_entries' not found. Creating it...")
        ReviewContestEntry.__table__.create(engine)
        print("Table 'review_contest_entries' created successfully.")

    if not inspector.has_table("review_contest_delivery_logs"):
        print("Table 'review_contest_delivery_logs' not found. Creating it...")
        ReviewContestDeliveryLog.__table__.create(engine)
        print("Table 'review_contest_delivery_logs' created successfully.")
        
    if not inspector.has_table("review_contest_blacklist"):
        print("Table 'review_contest_blacklist' not found. Creating it...")
        ReviewContestBlacklist.__table__.create(engine)
        print("Table 'review_contest_blacklist' created successfully.")

    # Миграция: Добавление полей статуса доставки
    check_and_add_column(engine, 'promo_codes', 'delivery_status', 'VARCHAR')
    check_and_add_column(engine, 'promo_codes', 'delivery_message', 'TEXT')

    # Миграция: Добавление ссылок на посты в логи доставки (Winner Post & Results Post)
    check_and_add_column(engine, 'review_contest_delivery_logs', 'winner_post_link', 'VARCHAR')
    check_and_add_column(engine, 'review_contest_delivery_logs', 'results_post_link', 'VARCHAR')

    # Миграция: Настройки авто-бана
    check_and_add_column(engine, 'review_contests', 'auto_blacklist', 'BOOLEAN DEFAULT FALSE')
    check_and_add_column(engine, 'review_contests', 'auto_blacklist_duration', 'INTEGER DEFAULT 7')

    # Миграция: General Contests Support (Polymorphism)
    check_and_add_column(engine, 'promo_codes', 'general_contest_id', 'VARCHAR')
    check_and_add_column(engine, 'review_contest_delivery_logs', 'general_contest_id', 'VARCHAR')
    check_and_add_column(engine, 'review_contest_blacklist', 'general_contest_id', 'VARCHAR')

