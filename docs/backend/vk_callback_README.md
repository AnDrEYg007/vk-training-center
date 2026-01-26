# VK Callback Event System

Модульная система для обработки событий от VK Callback API.

## Архитектура

```
services/vk_callback/
├── __init__.py          # Экспорт публичного API
├── dispatcher.py        # Главный диспетчер событий
├── models.py            # Типы данных и Pydantic модели
├── debounce.py          # Защита от дублирования действий
└── handlers/            # Обработчики событий
    ├── __init__.py      # Регистрация всех handlers
    ├── base.py          # Базовый класс обработчика
    ├── confirmation.py  # Обработчик подтверждения сервера
    └── wall.py          # Обработчики событий стены
```

## Поддерживаемые события

### Стена (wall)
- `wall_post_new` — Новый пост опубликован (сразу или из отложки)
- `wall_schedule_post_new` — Создан новый отложенный пост
- `wall_schedule_post_delete` — Удален/отредактирован отложенный пост

### Другие
- `confirmation` — Подтверждение сервера при настройке Callback API

## Debounce механизм

При редактировании отложенного поста VK присылает 2 события подряд:
1. `wall_schedule_post_delete` (старая версия)
2. `wall_schedule_post_new` (новая версия)

Также при публикации из отложки приходит:
1. `wall_post_new` (опубликованный пост)
2. `wall_schedule_post_delete` (удален из очереди)

Debouncer накапливает эти события и выполняет **одно** обновление с задержкой 2 секунды.

## Cooldown механизм

Когда наше приложение удаляет посты через VK API, VK присылает callback-события
об этих удалениях. Чтобы избежать лишних обновлений, используется cooldown:

### Как работает

1. **Перед удалением** — вызываем `set_event_cooldown(group_id, "wall_schedule_post_delete")`
2. **Обработчик получает событие** — проверяет `is_event_on_cooldown()` и пропускает его
3. **Cooldown истекает** — через 30 секунд события снова обрабатываются нормально

### Где используется

- `services/post_actions/delete.py` — устанавливает cooldown при удалении отложенных постов
- `handlers/wall.py` — `WallSchedulePostDeleteHandler` проверяет cooldown

### Пример

```python
from services.vk_callback.debounce import set_event_cooldown, clear_event_cooldown

# Перед операцией
set_event_cooldown(group_id, "wall_schedule_post_delete")

# Выполняем операции с VK API...
vk_service.call_vk_api('wall.delete', {...})

# Cooldown автоматически истечёт через 30 секунд
# Или можно снять вручную: clear_event_cooldown(group_id, "wall_schedule_post_delete")
```

## Использование

```python
from services.vk_callback import dispatch_event

# В роутере callback API
result, confirmation_code = dispatch_event(db, event_type, group_id, payload)

if event_type == "confirmation" and confirmation_code:
    return PlainTextResponse(content=confirmation_code)

return PlainTextResponse(content="ok")
```

## Добавление нового обработчика

1. Создайте файл в `handlers/` (например, `messages.py`)
2. Унаследуйте класс от `BaseEventHandler`
3. Укажите `HANDLES_EVENTS` — список типов событий
4. Реализуйте метод `handle()`
5. Добавьте в `handlers/__init__.py` в `ALL_HANDLERS`

```python
from .base import BaseEventHandler
from ..models import CallbackEvent, HandlerResult

class MessageNewHandler(BaseEventHandler):
    HANDLES_EVENTS = ["message_new"]
    
    def handle(self, db, event: CallbackEvent, project) -> HandlerResult:
        # Логика обработки
        self._log("Processing message", event)
        return HandlerResult(success=True, message="Message processed")
```

## Логирование

Все события автоматически логируются в таблицу `vk_callback_logs` через роутер.

Обработчики используют `self._log()` для консольного вывода с контекстом события.

## Конфигурация

- `debounce.py`: `delay_seconds = 2.0` — задержка debounce
- Токен для API запросов берется из `config.settings.vk_user_token`
