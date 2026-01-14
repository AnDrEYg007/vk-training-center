
from sqlalchemy import inspect, text, Engine

def check_and_add_column(engine: Engine, table_name: str, column_name: str, column_definition: str):
    """
    Проверяет наличие колонки в таблице и добавляет ее, если она отсутствует.
    """
    inspector = inspect(engine)
    
    # Проверка существования таблицы перед проверкой колонки
    if not inspector.has_table(table_name):
        return

    columns = inspector.get_columns(table_name)
    column_names = {c['name'] for c in columns}
    
    if column_name not in column_names:
        print(f"Column '{column_name}' not found in table '{table_name}'. Adding it...")
        try:
            with engine.connect() as connection:
                # Для SQLite и PostgreSQL синтаксис немного разный, особенно для DEFAULT
                if 'sqlite' in engine.url.drivername:
                    connection.execute(text(f'ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}'))
                else: # PostgreSQL
                    connection.execute(text(f'ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}'))
                connection.commit()
            print(f"Column '{column_name}' added successfully to '{table_name}'.")
        except Exception as e:
            print(f"Error adding column '{column_name}' to table '{table_name}': {e}")
