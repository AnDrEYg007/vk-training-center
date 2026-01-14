
from sqlalchemy.orm import Session
import uuid
import models

# Список предзаданных полей контекста
PREDEFINED_CONTEXT_FIELDS = [
    {"name": "Название бренда", "description": "Официальное название бренда или компании."},
    {"name": "Вид деятельности", "description": "Ниша, чем занимается компания (например: доставка суши, автосервис)."},
    {"name": "IOS", "description": "Ссылка на приложение в App Store."},
    {"name": "Android", "description": "Ссылка на приложение в Google Play."},
    {"name": "Сайт", "description": "Ссылка на официальный веб-сайт."},
    {"name": "Зона доставки", "description": "География работы или зоны доставки."},
    {"name": "Адрес", "description": "Физический адрес точки или офиса."},
    {"name": "График работы", "description": "Режим работы, часы, выходные."},
    {"name": "Телефоны", "description": "Контактные номера телефонов."},
    {"name": "Тональность бренда", "description": "Tone of Voice (стиль общения с клиентами: дружелюбный, официальный, дерзкий и т.д.)."},
    {"name": "Описание компании", "description": "Краткая информация о компании, история, миссия."},
    {"name": "Описание товаров и услуг", "description": "Общее описание основных товаров и услуг."},
]

def _init_project_context_fields(db: Session):
    """
    Проверяет и создает предзаданные поля контекста проекта.
    """
    print("INIT: Checking predefined Project Context fields...")
    count = 0
    for field_data in PREDEFINED_CONTEXT_FIELDS:
        # Проверяем существование по имени
        exists = db.query(models.ProjectContextField).filter(models.ProjectContextField.name == field_data["name"]).first()
        
        if not exists:
            new_field = models.ProjectContextField(
                id=str(uuid.uuid4()),
                name=field_data["name"],
                description=field_data["description"],
                is_global=True
            )
            db.add(new_field)
            count += 1
    
    if count > 0:
        db.commit()
        print(f"INIT: Created {count} new context fields.")
    else:
        print("INIT: All context fields already exist.")

def _init_global_variables(db: Session):
    """
    Здесь можно разместить логику для инициализации обязательных глобальных переменных,
    если они потребуются в будущем.
    """
    pass

def init_all_data(db: Session):
    """
    Главная точка входа для инициализации данных.
    Обернута в try/except, чтобы сбой в данных не положил весь сервер.
    """
    try:
        _init_project_context_fields(db)
        _init_global_variables(db)
    except Exception as e:
        print(f"⚠️ INIT ERROR: Failed to initialize predefined data: {e}")
        # Не пробрасываем исключение дальше, чтобы сервер мог запуститься
