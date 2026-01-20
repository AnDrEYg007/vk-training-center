
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Any, Dict, Optional, List
import json
import re

import crud
# Используем относительные импорты для модулей внутри того же пакета
from . import vk_service
# ИЗМЕНЕНО: Импорты перенесены внутрь функций для разрыва циклической зависимости
import schemas

# Системный промпт по умолчанию для генератора текста
DEFAULT_SYSTEM_PROMPT = """Ты — опытный и креативный SMM-менеджер, который пишет лаконичные, яркие и вовлекающие тексты для постов в социальных сетях, преимущественно для ВКонтакте.
Добавляй эмоджи если уместно, разбивай текст на заголовок и абзацы по смыслу. 

Запрещено писать хештеги, использовать ссылки, html и md форматирование.

Присылай готовый текст для вставки, без предисловий и заключений."""

# Новые системные промпты для быстрых действий
FIX_ERRORS_SYSTEM_PROMPT = """Ты — дотошный и внимательный корректор. Твоя единственная задача — исправлять орфографические, пунктуационные и грамматические ошибки в предоставленном тексте. Также убери лишние пробелы и исправь опечатки. Вместо явных финансовых сокращений типо руб. ставить знак ₽. Старайся убирать лишние, неуместные скобки открытия или закрытия.

ВАЖНО: Если текст написан сплошным блоком, обязательно разбей его на абзацы.  Между смысловыми блоками делай **ДВОЙНОЙ перенос строки** (пустую строку) для улучшения читаемости.

СТРОГО ЗАПРЕЩЕНО:
- Изменять смысл и содержание текста.
- Перефразировать предложения или менять формулировки (кроме случаев исправления ошибок).
- Добавлять или удалять информацию (слова, ссылки, хештеги, эмодзи).
Ты должен вернуть только исправленный текст без каких-либо предисловий, комментариев или форматирования."""

REWRITE_SYSTEM_PROMPT = """Ты — опытный SMM-копирайтер, мастер рерайтинга. Твоя задача — переписать (сделать рерайт) предложенного текста поста для ВКонтакте. Цель — сделать текст более свежим и динамичным, изменив его словесную конструкцию, но полностью сохранив исходный смысл и ключевые элементы.

ТЫ ОБЯЗАН СТРОГО СОХРАНИТЬ БЕЗ ИЗМЕНЕНИЙ:
1.  **Основной смысл:** Вся суть, логика и ключевые сообщения текста должны остаться прежними.
2.  **Ключевые сущности:** Даты, время, названия брендов/моделей (например, "Subaru Forester 2016"), номера телефонов, адреса, технические термины, цены, имена и т.д.
3.  **Эмодзи:** Все существующие в тексте эмодзи (смайлики). Сохраняй их расположение и эмоциональный акцент.
4.  **Ссылки и Упоминания:** Все существующие конструкции ссылок `[ссылка|текст]` и упоминаний `@id (текст)`. Это неотъемлемая, ключевая часть текста.
5.  **Хештеги:** Все существующие хештеги, включая упоминания групп (`#тег@group`).

ЧТО НУЖНО ИЗМЕНИТЬ:
-   **Словесные конструкции:** Подбирай синонимы, перефразируй предложения, меняй их порядок, чтобы текст читался по-новому.
-   **Стиль:** Сохраняй и усиливай энергичный, яркий и вовлекающий стиль SMM-поста.
-   **Структура (ВАЖНО):** Обязательно разбивай текст на абзацы. Между абзацами делай **ДВОЙНОЙ перенос строки** (пустую строку), чтобы текст был максимально "воздушным" и читабельным.

СТРОГО ЗАПРЕЩЕНО:
-   Добавлять **новые** хештеги, ссылки или эмодзи, которых не было в исходном тексте.
-   Использовать любое другое форматирование (HTML, Markdown), кроме уже существующих в тексте конструкций `[ссылка|текст]`.
-   Добавлять любые предисловия, заключения или комментарии от себя.

Присылай только готовый, переписанный текст.
"""

SHORTEN_SYSTEM_PROMPT = """Ты — системная инструкция, оптимизатор текста. Твоя задача — сократить объем текста примерно на 15-25%. Сохрани все смыслы, структуру, логику и тональность. Не сокращай слишком сильно, текст должен остаться подробным, но стать немного лаконичнее.

ВАЖНО: Сохраняй или создавай структуру абзацев. Между абзацами делай **ДВОЙНОЙ перенос строки** (пустую строку), чтобы текст не сливался.

Если ты понимаешь, что сокращение даже на 15% приведет к потере смыслов, верни сообщение: 'Уже некуда сокращать, будет потеря данных или других важных элементов'. Не добавляй никаких предисловий или комментариев."""

EXPAND_SYSTEM_PROMPT = """Ты — системная инструкция, оптимизатор текста. Твоя задача — немного расширить объем текста (примерно на 15-25%). Добавь уточняющие детали, эпитеты или более развернутые формулировки, но строго сохраняй исходные смыслы, структуру, логику и тональность. Не добавляй "воды" и новой информации, которой не было в изначальном смысле.

ВАЖНО: Структурируй текст. Разбивай его на логические абзацы. Между каждым абзацем делай **ДВОЙНОЙ перенос строки** (пустую строку), чтобы визуально отделить части текста друг от друга.

Не нужно писать трактаты, просто сделай текст немного объемнее и выразительнее. Не добавляй никаких предисловий или комментариев."""

ADD_EMOJI_SYSTEM_PROMPT = """Ты — редактор текста. Твоя задача — вернуть ровно тот же текст, который тебе предоставили, но аккуратно добавить немного уместных по контексту эмоджи там, где это необходимо для улучшения читаемости и эмоциональной окраски.
СТРОГО ЗАПРЕЩЕНО: изменять, удалять или перефразировать исходный текст. Ты можешь только добавлять эмоджи.
ЛИМИТ: Количество новых эмоджи должно составлять примерно 20-30% от уже имеющихся в тексте. Не перебарщивай.
Пример: если в тексте 10 эмоджи, добавь всего 2-3 новых. Если эмоджи нет или очень мало, добавь 1-2 самых подходящих."""

REMOVE_EMOJI_SYSTEM_PROMPT = """Ты — редактор текста. Твоя задача — вернуть ровно тот же текст, который тебе предоставили, но убрать из него наиболее неуместные или избыточные эмоджи. СТРОГО ЗАПРЕЩЕНО: изменять, удалять или перефразировать исходный текст. Ты можешь только удалять эмоджи. Твоя цель — сократить количество эмоджи примерно на 20-50%, убирая самые неподходящие. Например: из 10 эмоджи оставь 7-8, из 5 оставь 2-3, из 2 оставь 1."""


def generate_text_from_prompt(prompt: str, system_prompt: Optional[str] = None) -> str:
    """
    Генерирует текст для поста с помощью Gemini.
    Если system_prompt не предоставлен, используется дефолтный.
    """
    # ИЗМЕНЕНО: Отложенный импорт для разрыва циклической зависимости
    from .gemini_service import generate_text

    final_system_prompt = system_prompt if system_prompt and system_prompt.strip() else DEFAULT_SYSTEM_PROMPT
    try:
        # Генерация постов - это CREATIVE стратегия (Gemini > Gemma)
        return generate_text(prompt, final_system_prompt, strategy='CREATIVE')
    except Exception as e:
        print(f"ОШИБКА во время генерации текста: {e}")
        raise HTTPException(status_code=500, detail=f"Не удалось сгенерировать текст: {e}")

def generate_batch_post_text(prompt: str, count: int, system_prompt: Optional[str] = None) -> List[str]:
    """
    Генерирует {count} вариаций текста поста на основе промпта.
    """
    from .gemini_service import generate_text

    if count < 2:
        return [generate_text_from_prompt(prompt, system_prompt)]

    final_system_prompt = system_prompt if system_prompt and system_prompt.strip() else DEFAULT_SYSTEM_PROMPT
    
    batch_prompt = f"""
    Твоя задача — сгенерировать {count} УНИКАЛЬНЫХ вариаций текста поста на основе запроса пользователя.
    
    СИСТЕМНАЯ ИНСТРУКЦИЯ (СТИЛЬ И РОЛЬ):
    {final_system_prompt}
    
    ЗАПРОС ПОЛЬЗОВАТЕЛЯ И КОНТЕКСТ:
    {prompt}
    
    ВАЖНЫЕ ТРЕБОВАНИЯ:
    1. Каждый из {count} вариантов должен отличаться по формулировкам, структуре или акцентам, но сохранять суть запроса.
    2. Избегай дублирования.
    3. Верни результат СТРОГО в формате JSON-массива строк (список текстов).
    
    Пример формата ответа:
    [
      "Текст первого поста...",
      "Текст второго варианта..."
    ]
    """
    
    try:
        # ВАЖНО: Используем CREATIVE стратегию (Gemini 2.5), так как нужна качественная генерация текста.
        # Модели Gemma (ANALYTICAL) могут быть слишком сухими для этой задачи.
        raw_response = generate_text(batch_prompt, strategy='CREATIVE')
        
        json_text = ""
        json_match = re.search(r"```json\s*([\s\S]*?)\s*```", raw_response)
        if json_match:
            json_text = json_match.group(1).strip()
        else:
            # Fallback: ищем массив
            start_index = raw_response.find('[')
            end_index = raw_response.rfind(']')
            if start_index != -1 and end_index != -1 and end_index > start_index:
                json_text = raw_response[start_index:end_index+1].strip()
            else:
                json_text = raw_response.strip()
        
        variations = json.loads(json_text)
        
        if not isinstance(variations, list):
             raise Exception("AI returned incorrect format (not a list).")
             
        # Если вернулось меньше вариантов, чем просили, это не критично, вернем сколько есть
        return [str(v) for v in variations]

    except Exception as e:
        print(f"ОШИБКА во время пакетной генерации текста: {e}")
        # Fallback: генерируем один вариант и дублируем его, чтобы не ломать UI
        # Или возвращаем ошибку
        raise HTTPException(status_code=500, detail=f"Не удалось сгенерировать вариации: {e}")


def _get_community_info_from_vk_response(vk_response: Any) -> Dict:
    """
    Надежно извлекает объект с информацией о сообществе из ответа vk_service.
    """
    community_info = None
    if isinstance(vk_response, list) and len(vk_response) > 0:
        community_info = vk_response[0]
    # Обрабатываем структуру {"groups": [...]}
    elif isinstance(vk_response, dict) and 'groups' in vk_response and isinstance(vk_response['groups'], list) and len(vk_response['groups']) > 0:
        community_info = vk_response['groups'][0]
    elif isinstance(vk_response, dict):
        # Обрабатывает случаи, когда ответ - это сам объект группы или словарь с ключом 'group'
        community_info = vk_response.get('group', vk_response) 
    
    if not community_info or not isinstance(community_info, dict):
        raise Exception(f"VK_API_ERROR: groups.getById вернул пустой или некорректный ответ. Получено: {vk_response}")
    
    return community_info

def correct_suggested_text(db: Session, text: str, project_id: str, user_token: str) -> str:
    # ИЗМЕНЕНО: Отложенный импорт для разрыва циклической зависимости
    from .gemini_service import get_corrected_text

    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    try:
        # 1. Получаем информацию о группе из VK (нужен screen_name и site)
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        vk_response = vk_service.call_vk_api('groups.getById', {
            'group_id': numeric_id,
            'fields': 'screen_name,site',
            'access_token': user_token,
        })
        
        group_info = _get_community_info_from_vk_response(vk_response)
        
        print(f"ℹ️ VK group info for AI correction:\n{json.dumps(vk_response, indent=2, ensure_ascii=False)}")
        
        # 2. Получаем ссылку DLVRY из переменных проекта в нашей БД
        variables = crud.get_project_variables(db, project_id)
        dlvry_link = ""
        for var in variables:
            if var.get('name', '').strip().lower() == 'dlvry':
                dlvry_link = var.get('value', '').strip()
                break
        
        print(f"ℹ️ Found DLVRY link for project {project_id}: '{dlvry_link}'")

        # 3. Вызываем Gemini с полным контекстом. get_corrected_text использует ANALYTICAL внутри.
        return get_corrected_text(text, group_info, dlvry_link)
    except Exception as e:
        print(f"ОШИБКА во время коррекции текста для проекта {project_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Не удалось скорректировать текст: {e}")

def run_ai_variable_setup(db: Session, payload: schemas.AiVariablePayload, user_token: str) -> dict:
    # ИЗМЕНЕНО: Отложенный импорт для разрыва циклической зависимости
    from .gemini_service import get_ai_variables

    project = crud.get_project_by_id(db, payload.projectId)
    if not project:
        raise HTTPException(404, "Project not found")
        
    try:
        numeric_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        fields = 'description,status,addresses,links,contacts,site'
        
        vk_response = vk_service.call_vk_api('groups.getById', {
            'group_id': str(numeric_id),
            'fields': fields,
            'access_token': user_token,
        })

        community_info = _get_community_info_from_vk_response(vk_response)
        
        print(f"ℹ️ VK group info for AI prompt:\n{json.dumps(community_info, indent=2, ensure_ascii=False)}")

        # get_ai_variables использует ANALYTICAL
        return get_ai_variables(community_info, [v.model_dump() for v in payload.emptyVariables])
    except Exception as e:
        print(f"ОШИБКА во время AI-настройки для проекта {payload.projectId}: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка во время AI-настройки: {e}")

def process_post_text(text: str, action: str) -> str:
    """
    Обрабатывает текст поста с помощью AI по заданному действию.
    """
    from .gemini_service import generate_text

    system_instruction = None
    user_prompt = text  # Пользовательский промпт - это просто сам текст для обработки
    strategy = 'CREATIVE' # Default

    if action == 'rewrite':
        system_instruction = REWRITE_SYSTEM_PROMPT
        strategy = 'CREATIVE'
    elif action == 'fix_errors':
        system_instruction = FIX_ERRORS_SYSTEM_PROMPT
        strategy = 'ANALYTICAL' # Исправление ошибок - строгая задача
    elif action == 'shorten':
        system_instruction = SHORTEN_SYSTEM_PROMPT
        strategy = 'ANALYTICAL' # Сокращение - ближе к аналитике/структуре
    elif action == 'expand':
        system_instruction = EXPAND_SYSTEM_PROMPT
        strategy = 'CREATIVE'
    elif action == 'add_emoji':
        system_instruction = ADD_EMOJI_SYSTEM_PROMPT
        strategy = 'CREATIVE'
    elif action == 'remove_emoji':
        system_instruction = REMOVE_EMOJI_SYSTEM_PROMPT
        strategy = 'ANALYTICAL' # Удаление - строгая задача
    else:
        raise HTTPException(status_code=400, detail="Invalid action specified.")
    
    try:
        # Инструкции теперь передаются через системный промпт
        return generate_text(user_prompt, system_instruction, strategy=strategy)
    except Exception as e:
        print(f"ОШИБКА во время обработки текста (action: {action}): {e}")
        raise HTTPException(status_code=500, detail=f"Не удалось обработать текст: {e}")
