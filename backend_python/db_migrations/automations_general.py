from sqlalchemy import Engine, inspect, text
from models_library.general_contests import (
    GeneralContest,
    GeneralContestEntry,
    GeneralContestCycle,
    GeneralContestPromoCode, 
    GeneralContestDeliveryLog, 
    GeneralContestBlacklist
)

def migrate(engine: Engine):
    """Миграции для универсальных конкурсов (новые таблицы)."""
    inspector = inspect(engine)
    
    # Check general_contests TABLE and COLUMNS
    if not inspector.has_table("general_contests"):
        print("Table 'general_contests' not found. Creating it...")
        GeneralContest.__table__.create(engine)
    else:
        # Check for missing columns in general_contests
        existing_columns = [c['name'] for c in inspector.get_columns("general_contests")]
        columns_to_check = [
            ("description", "TEXT"),
            ("is_cyclic", "BOOLEAN DEFAULT 0"),
            ("restart_type", "VARCHAR"),
            ("restart_settings", "TEXT"),
            ("template_result_post", "TEXT"),
            ("template_dm", "TEXT"),
            ("template_fallback_comment", "TEXT"),
            ("finish_duration_hours", "INTEGER"),
            ("one_prize_per_person", "BOOLEAN DEFAULT 1"),
            ("conditions_schema", "TEXT"),
            ("finish_type", "VARCHAR"),
            ("start_type", "VARCHAR DEFAULT 'new_post'"),
            ("existing_post_link", "VARCHAR"),
            ("name", "VARCHAR"),
            ("post_text", "TEXT"),
            ("post_media", "TEXT"),
            ("start_date", "DATETIME"),
            ("finish_date", "DATETIME"),
            ("winners_count", "INTEGER DEFAULT 1"),
            ("is_active", "BOOLEAN DEFAULT 0")
        ]
        
        with engine.connect() as conn:
            for col_name, col_type in columns_to_check:
                if col_name not in existing_columns:
                    print(f"Adding missing column '{col_name}' to 'general_contests'...")
                    try:
                        conn.execute(text(f"ALTER TABLE general_contests ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                        print(f"Error adding column {col_name}: {e}")

    # Check Cycles table
    if not inspector.has_table("general_contest_cycles"):
        print("Table 'general_contest_cycles' not found. Creating it...")
        GeneralContestCycle.__table__.create(engine)
        print("Table 'general_contest_cycles' created successfully.")

    # Check Entries table
    if not inspector.has_table("general_contest_entries"):
        print("Table 'general_contest_entries' not found. Creating it...")
        GeneralContestEntry.__table__.create(engine)

    # Check Promocodes table
    if not inspector.has_table("general_contest_promocodes"):
        print("Table 'general_contest_promocodes' not found. Creating it...")
        GeneralContestPromoCode.__table__.create(engine)
        print("Table 'general_contest_promocodes' created successfully.")
    else:
        # Check for missing columns in general_contest_promocodes
        existing_columns_promo = [c['name'] for c in inspector.get_columns("general_contest_promocodes")]
        columns_to_check_promo = [
             ("issued_in_cycle_id", "VARCHAR"),
             ("issued_to_user_id", "BIGINT"),
             ("issued_to_user_name", "VARCHAR"),
             ("issued_at", "DATETIME")
        ]
        with engine.connect() as conn:
            for col_name, col_type in columns_to_check_promo:
                if col_name not in existing_columns_promo:
                    print(f"Adding missing column '{col_name}' to 'general_contest_promocodes'...")
                    try:
                        conn.execute(text(f"ALTER TABLE general_contest_promocodes ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                         print(f"Error adding column {col_name} to promo codes: {e}")

    if not inspector.has_table("general_contest_delivery_logs"):
        print("Table 'general_contest_delivery_logs' not found. Creating it...")
        GeneralContestDeliveryLog.__table__.create(engine)
        print("Table 'general_contest_delivery_logs' created successfully.")

    if not inspector.has_table("general_contest_blacklist"):
        print("Table 'general_contest_blacklist' not found. Creating it...")
        GeneralContestBlacklist.__table__.create(engine)
        print("Table 'general_contest_blacklist' created successfully.")
