
from sqlalchemy import Engine, inspect
from models import AiPromptPreset, GlobalVariableDefinition, ProjectGlobalVariableValue

def migrate(engine: Engine):
    """Миграции для настроек, AI и переменных."""
    inspector = inspect(engine)

    # Миграция 12: Создать таблицу ai_prompt_presets
    if not inspector.has_table("ai_prompt_presets"):
        print("Table 'ai_prompt_presets' not found. Creating it...")
        AiPromptPreset.__table__.create(engine)
        print("Table 'ai_prompt_presets' created successfully.")
    
    # Миграция 13: Создать таблицы для глобальных переменных
    if not inspector.has_table("global_variable_definitions"):
        print("Table 'global_variable_definitions' not found. Creating it...")
        GlobalVariableDefinition.__table__.create(engine)
        print("Table 'global_variable_definitions' created successfully.")
        
    if not inspector.has_table("project_global_variable_values"):
        print("Table 'project_global_variable_values' not found. Creating it...")
        ProjectGlobalVariableValue.__table__.create(engine)
        print("Table 'project_global_variable_values' created successfully.")
