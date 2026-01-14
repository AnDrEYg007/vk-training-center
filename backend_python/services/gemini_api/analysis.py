
import json
import re
from .client import generate_text

def get_ai_variables(community_info: dict, empty_variables: list) -> dict:
    prompt = f"""
    Ты — умный ассистент, помогающий настроить переменные для контент-планировщика сообщества ВКонтакте.

    Твоя задача — проанализировать JSON-данные сообщества VK и заполнить значения для предоставленного списка ПУСТЫХ переменных.

    Вот JSON-данные сообщества VK:
    ```json
    {json.dumps(community_info, indent=2, ensure_ascii=False)}
    ```

    Вот список существующих пустых переменных, которые нужно заполнить:
    ```json
    {json.dumps(empty_variables, indent=2, ensure_ascii=False)}
    ```

    ТВОЯ ЗАДАЧА:
    1.  **Заполнить переменные**: Проанализируй JSON-данные сообщества и заполни как можно больше ПУСТЫХ переменных из списка выше. Используй информацию из полей: description, status, addresses, links, contacts, site.
    
    2.  **Правила заполнения**:
        a. **Строго**: Используй только реальные данные из исходного JSON. Не придумывай и не создавай новых значений, ссылок или данных, которых нет в предоставленном JSON.
        b. **Адреса**: Если находишь адрес, используй его для заполнения переменной с именем "Адрес".
        c. **Контакты**: Если находишь телефон или email, используй их для заполнения соответствующих переменных.
        d. **Сайт**: Если находишь сайт, используй его для заполнения переменной "Сайт".

    3.  **Не предлагать новые переменные**: Категорически запрещено предлагать новые переменные. Твоя задача — только заполнить существующие.

    4.  **Вернуть результат**: Верни ЕДИНЫЙ JSON-объект в формате {{"filled":[{{"name":"...","value":"..."}},...],"new":[]}}. 
        - В ключ "filled" помести только те переменные из исходного списка, для которых ты смог найти значение.
        - Ключ "new" **всегда** должен быть пустым массивом `[]`.
    """
    
    # Используем аналитическую стратегию (Gemma), так как нужна работа с JSON и строгое следование правилам
    raw_response = generate_text(prompt, strategy='ANALYTICAL')

    json_text = ""
    try:
        json_match = re.search(r"```json\s*([\s\S]*?)\s*```", raw_response)
        if json_match:
            json_text = json_match.group(1).strip()
        else:
            start_index = raw_response.find('{')
            end_index = raw_response.rfind('}')
            if start_index != -1 and end_index != -1 and end_index > start_index:
                json_text = raw_response[start_index:end_index+1].strip()
            else:
                json_text = raw_response.strip()

        return json.loads(json_text)
    except json.JSONDecodeError:
        raise Exception("Failed to parse JSON from Gemini response.")

def get_project_context_ai_fill(vk_data: dict, addresses: dict, context_fields: list) -> list:
    fields_for_prompt = [{"id": f.id, "name": f.name, "description": f.description} for f in context_fields]

    field_instructions = """
    ПРАВИЛА И ВАЛИДАЦИЯ (СТРОГО):
    1. **Android**: Ищи ссылку на Google Play. Она ОБЯЗАНА начинаться с `https://play.google.com/store/apps/details?`. Любые другие ссылки игнорируй.
    2. **IOS**: Ищи ссылку на App Store. Она ОБЯЗАНА иметь вид `https://apps.apple.com/` (обычно `/ru/app/` или `/us/app/`). Другие ссылки запрещены.
    3. **Dlvry**: Ищи ссылку на приложение доставки ВКонтакте. Она ОБЯЗАНА иметь вид `https://vk.com/app6408974_-XXXXXXXX`, где X - цифры ID группы. Другие ссылки запрещены.
    4. **Сайт**: Ссылка на веб-сайт. ВАЖНО: Ссылка НЕ должна вести на `vk.com/app6408974` и `https://vk.com` (это приложение доставки, а не сайт). Если видишь такую ссылку, не пиши её в поле "Сайт".
    5. **Зона доставки**: Ссылка на карту. Принимаются ТОЛЬКО ссылки на Яндекс Карты или Google Maps или `2gis.ru`. Если ссылок на карты нет - оставь поле пустым. НЕ пиши сюда текстовое описание районов.
    6. **Название бренда**: Найди чистое название без лишних слов вроде "Доставка", если возможно.
    7. **Вид деятельности**: Используй поле `activity` или сформируй на основе описания.
    8. **Адрес**: Сформируй список адресов из блока `addresses`.
    9. **График работы**: Найди информацию о времени работы.
    10. **Телефоны**: Найди телефоны в `contacts` или `description`.
    11. **Описание**: Сформируй краткое, емкое описание на основе поля `description`.
    """

    prompt = f"""
    Ты — умный ассистент для SMM-менеджера. Твоя задача — проанализировать данные о сообществе ВКонтакте и автоматически заполнить поля "Контекста проекта". Эти поля в дальнейшем будут использоваться нейросетью для генерации постов, поэтому информация должна быть точной и полезной.

    ВХОДНЫЕ ДАННЫЕ:
    1. Информация о группе VK (JSON):
    ```json
    {json.dumps(vk_data, indent=2, ensure_ascii=False)}
    ```
    2. Адреса (JSON):
    ```json
    {json.dumps(addresses, indent=2, ensure_ascii=False)}
    ```

    СПИСОК ПОЛЕЙ ДЛЯ ЗАПОЛНЕНИЯ (JSON):
    ```json
    {json.dumps(fields_for_prompt, indent=2, ensure_ascii=False)}
    ```

    ТВОЯ ЗАДАЧА:
    Для каждого поля из списка найди или сформулируй подходящее значение на основе данных из VK.
    
    {field_instructions}

    ДЛЯ НЕОБЯЗАТЕЛЬНЫХ ПОЛЕЙ (которых нет в списке правил выше):
    Посмотри их название и описание. Если найдешь соответствующую информацию в данных VK — заполни. Если не найдешь — игнорируй (не возвращай в JSON или верни null).

    ФОРМАТ ОТВЕТА:
    Верни ТОЛЬКО JSON-массив объектов. Каждый объект должен содержать `field_id` (из входного списка) и найденное `value` (строка).
    
    ВАЖНО: Если ты не уверен в `field_id`, можешь вернуть `field_name` вместо него, но лучше используй ID.
    
    Пример:
    [
      {{ "field_id": "123", "value": "Суши Тайм" }},
      {{ "field_id": "456", "value": "+7 (999) 000-00-00" }}
    ]
    """
    
    print("SERVICE: Sending AI Context Autofill request...")
    # Аналитика -> ANALYTICAL strategy
    raw_response = generate_text(prompt, strategy='ANALYTICAL')
    
    json_text = ""
    try:
        json_match = re.search(r"```json\s*([\s\S]*?)\s*```", raw_response)
        if json_match:
            json_text = json_match.group(1).strip()
        else:
            start_index = raw_response.find('[')
            end_index = raw_response.rfind(']')
            if start_index != -1 and end_index != -1 and end_index > start_index:
                json_text = raw_response[start_index:end_index+1].strip()
            else:
                json_text = raw_response.strip()

        return json.loads(json_text)
    except json.JSONDecodeError:
        print(f"❌ ERROR parsing AI Context response. Text:\n{json_text}")
        raise Exception("AI returned invalid JSON for context autofill.")
