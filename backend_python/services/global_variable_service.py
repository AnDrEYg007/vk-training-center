from sqlalchemy.orm import Session
from typing import List, Dict
import re

import crud
from schemas import GlobalVariableDefinition, GetGlobalVariablesForProjectResponse, ProjectGlobalVariableValue

def get_all_definitions(db: Session) -> List[GlobalVariableDefinition]:
    defs = crud.get_all_definitions(db)
    return [GlobalVariableDefinition.model_validate(d, from_attributes=True) for d in defs]

def update_all_definitions(db: Session, definitions_data: List[GlobalVariableDefinition]):
    crud.update_all_definitions(db, definitions_data)

def get_for_project(db: Session, project_id: str) -> GetGlobalVariablesForProjectResponse:
    defs = crud.get_all_definitions(db)
    values = crud.get_values_by_project_id(db, project_id)
    return GetGlobalVariablesForProjectResponse(
        definitions=[GlobalVariableDefinition.model_validate(d, from_attributes=True) for d in defs],
        values=[ProjectGlobalVariableValue.model_validate(v, from_attributes=True) for v in values]
    )

def update_for_project(db: Session, project_id: str, values_data: List[Dict[str, str]]):
    crud.update_values_for_project(db, project_id, values_data)

def substitute_global_variables(db: Session, text: str, project_id: str) -> str:
    """
    Находит плейсхолдеры {global_key} в тексте и заменяет их на значения для данного проекта.
    Если значение для проекта не найдено, заменяет на пустую строку.
    """
    if not text or '{global_' not in text:
        return text

    print(f"SERVICE: Substituting global variables for project {project_id}...")

    # Получаем все определения и значения для проекта за один раз для эффективности
    definitions = crud.get_all_definitions(db)
    project_values = crud.get_values_by_project_id(db, project_id)

    if not definitions:
        print("SERVICE: No global variable definitions found. Skipping substitution.")
        return text

    # Создаем удобные словари для быстрого поиска
    definitions_map = {d.placeholder_key: d.id for d in definitions}
    values_map = {v.definition_id: v.value for v in project_values}

    def replace_match(match):
        placeholder_key = match.group(1)
        definition_id = definitions_map.get(placeholder_key)
        
        if definition_id:
            # Если для этого проекта есть значение, используем его. Иначе - пустая строка.
            value = values_map.get(definition_id, '')
            print(f"  -> Found placeholder '{{global_{placeholder_key}}}'. Replacing with '{value}'.")
            return value
        
        # УЛУЧШЕНИЕ: Если определение для плейсхолдера было удалено,
        # заменяем его на пустую строку, чтобы избежать публикации "мусора" вида {global_...}
        print(f"  -> Found placeholder '{{global_{placeholder_key}}}' but no matching definition was found (it may have been deleted). Replacing with an empty string for safety.")
        return ''

    # Используем регулярное выражение для поиска всех плейсхолдеров {global_...}
    substituted_text = re.sub(r'\{global_(\w+)\}', replace_match, text)
    
    print("SERVICE: Substitution complete.")
    return substituted_text