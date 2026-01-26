# Схема Базы Данных (SQLAlchemy / SQLite & PostgreSQL)

Этот документ описывает полную структуру базы данных проекта "VK Content Planner".

## 1. Источник правды: Модели SQLAlchemy

Единственным источником правды для схемы БД являются **ORM-модели SQLAlchemy**, расположенные в:

- **Основной файл**: `backend_python/models.py` — хаб, импортирующий все модели
- **Папка моделей**: `backend_python/models_library/` — отдельные файлы по доменам

## 2. Полная схема моделей

### 2.1. Проекты и Пользователи (`models_library/projects.py`)

#### `Project` — Проекты
Основная таблица проектов с настройками.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID проекта |
| `name` | String | Название проекта |
| `api_token` | EncryptedString | Зашифрованный VK API токен |
| `group_id` | BigInteger | ID группы ВКонтакте |
| `timezone` | String | Часовой пояс (Europe/Moscow) |
| `is_hidden` | Boolean | Скрыт ли проект |
| `sort_order` | Integer | Порядок сортировки |
| `created_at` | DateTime | Дата создания |
| `updated_at` | DateTime | Дата обновления |
| ... | ... | И другие настройки |

#### `User` — Пользователи системы
Учётные записи пользователей для авторизации в системе.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID пользователя |
| `login` | String (unique) | Логин |
| `password_hash` | String | Хеш пароля (bcrypt) |
| `role` | String | Роль: admin/user |
| `full_name` | String | Полное имя |
| `is_active` | Boolean | Активен ли |
| `created_at` | DateTime | Дата создания |

#### `ProjectContextField` — Поля контекста проекта
Определения полей для контекста проекта (используются для AI).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID поля |
| `label` | String | Название поля |
| `description` | Text | Описание |
| `sort_order` | Integer | Порядок |
| `is_system` | Boolean | Системное ли |
| `created_at` | DateTime | Дата создания |

#### `ProjectContextValue` — Значения контекста проекта
Конкретные значения полей контекста для каждого проекта.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK) | ID проекта |
| `field_id` | String (FK) | ID поля |
| `value` | Text | Значение |

#### `ProjectContextFieldVisibility` — Видимость полей
Настройки видимости полей контекста для проектов.

---

### 2.2. Посты и Заметки (`models_library/posts.py`)

#### `Post` — Опубликованные посты (кеш)
Кеш опубликованных постов из VK.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_post_id |
| `project_id` | String (FK) | ID проекта |
| `owner_id` | Integer | ID владельца |
| `post_id` | Integer | ID поста |
| `text` | Text | Текст поста |
| `date` | Integer | Timestamp публикации |
| `attachments` | Text (JSON) | Вложения |
| `views` | Integer | Просмотры |
| `likes` | Integer | Лайки |
| `reposts` | Integer | Репосты |
| `comments` | Integer | Комментарии |
| `last_updated` | String | Время обновления кеша |

#### `ScheduledPost` — Отложенные посты (кеш)
Кеш запланированных постов из VK.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_post_id |
| `project_id` | String (FK) | ID проекта |
| `owner_id` | Integer | ID владельца |
| `post_id` | Integer | ID поста |
| `text` | Text | Текст поста |
| `date` | Integer | Timestamp запланированной публикации |
| `attachments` | Text (JSON) | Вложения |
| `is_donut` | Boolean | Donut пост |
| `last_updated` | String | Время обновления кеша |

#### `SystemPost` — Системные посты
Публикации, управляемые планировщиком (не VK отложенные).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK) | ID проекта |
| `scheduled_time` | DateTime | Время публикации |
| `text` | Text | Текст |
| `attachments` | Text (JSON) | Вложения |
| `status` | String | pending/publishing/published/error/cancelled |
| `vk_post_id` | Integer | ID поста после публикации |
| `error_message` | Text | Ошибка при публикации |
| `created_at` | DateTime | Дата создания |
| `updated_at` | DateTime | Дата обновления |

#### `SuggestedPost` — Предложенные посты
Посты из "Предложить новость".

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_post_id |
| `project_id` | String (FK) | ID проекта |
| `post_id` | Integer | ID поста |
| `text` | Text | Текст |
| `attachments` | Text (JSON) | Вложения |
| `from_id` | Integer | От кого |
| `date` | Integer | Timestamp |
| `last_updated` | String | Время обновления кеша |

#### `Note` — Заметки (стикеры)
Заметки на календаре.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK) | ID проекта |
| `date` | String | Дата (YYYY-MM-DD) |
| `text` | Text | Текст заметки |
| `color` | String | Цвет стикера |
| `created_at` | DateTime | Дата создания |

---

### 2.3. Теги (`models_library/tags.py`)

#### `Tag` — Теги
Теги для категоризации постов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK) | ID проекта |
| `name` | String | Название |
| `keyword` | String | Ключевое слово (для автотегирования) |
| `color` | String | Цвет (#hex) |
| `is_auto` | Boolean | Автотег |
| `created_at` | DateTime | Дата создания |

---

### 2.4. Ассоциативные таблицы (`models_library/associations.py`)

#### `published_post_tags_association`
Связь постов с тегами (many-to-many).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `post_id` | String (FK) | ID поста |
| `tag_id` | String (FK) | ID тега |

#### `scheduled_post_tags_association`
Связь отложенных постов с тегами.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `post_id` | String (FK) | ID поста |
| `tag_id` | String (FK) | ID тега |

---

### 2.5. Медиа (`models_library/media.py`)

#### `Album` — Фотоальбомы
Кеш альбомов группы.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_album_id |
| `project_id` | String (FK) | ID проекта |
| `title` | String | Название альбома |
| `size` | Integer | Количество фото |
| `thumb` | String | URL превью |
| `last_updated` | String | Время обновления |

#### `Photo` — Фотографии
Кеш фотографий из альбомов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_photo_id |
| `album_id` | String (FK) | ID альбома |
| `project_id` | String (FK) | ID проекта |
| `sizes` | Text (JSON) | Размеры фото |
| `date` | Integer | Timestamp |
| `text` | Text | Описание |

---

### 2.6. Настройки и Глобальные переменные (`models_library/settings.py`)

#### `AiPromptPreset` — Шаблоны AI инструкций
Сохранённые шаблоны системных промптов для AI.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK, nullable) | ID проекта (null = глобальный) |
| `name` | String | Название пресета |
| `system_instruction` | Text | Текст инструкции |
| `is_global` | Boolean | Глобальный ли пресет |
| `created_at` | DateTime | Дата создания |

#### `GlobalVariableDefinition` — Определения глобальных переменных
Типы переменных (Адрес, Телефон и т.д.).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `name` | String | Название (Адрес) |
| `placeholder_key` | String (unique) | Ключ ({address}) |
| `description` | Text | Описание |
| `created_at` | DateTime | Дата создания |

#### `ProjectGlobalVariableValue` — Значения глобальных переменных
Конкретные значения для каждого проекта.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK) | ID проекта |
| `definition_id` | String (FK) | ID определения |
| `value` | Text | Значение |

---

### 2.7. Товары (Market) (`models_library/market.py`)

#### `MarketCategory` — Категории товаров VK
Справочник категорий из VK Market API.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | Integer (PK) | ID категории VK |
| `name` | String | Название |
| `section_id` | Integer | ID секции |
| `section_name` | String | Название секции |

#### `MarketAlbum` — Подборки товаров
Альбомы товаров группы.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_album_id |
| `project_id` | String (FK) | ID проекта |
| `title` | String | Название |
| `count` | Integer | Количество товаров |
| `updated_time` | BigInteger | Timestamp обновления |
| `last_updated` | String | Время обновления кеша |

#### `MarketItem` — Товары
Кеш товаров из VK Market.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | owner_id_item_id |
| `project_id` | String (FK) | ID проекта |
| `title` | String | Название |
| `description` | Text | Описание |
| `price` | Text (JSON) | Цена |
| `category` | Text (JSON) | Категория |
| `thumb_photo` | String | Превью |
| `availability` | Integer | Доступность (0,1,2) |
| `date` | Integer | Timestamp |
| `album_ids` | Text (JSON) | IDs подборок |
| `sku` | String | Артикул |
| `rating` | String | Рейтинг |
| `reviews_count` | Integer | Количество отзывов |
| `is_deleted` | Boolean | Удалён |
| `last_updated` | String | Время обновления кеша |

---

### 2.8. Списки и Аналитика (`models_library/lists.py`)

#### `ProjectListMeta` — Метаданные списков проекта
Счётчики и время обновления для каждого типа списка.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | project_id |
| `project_id` | String (FK) | ID проекта |
| `subscribers_count` | Integer | Количество подписчиков |
| `subscribers_last_updated` | String | Время обновления |
| `history_join_count` | Integer | Вступления |
| `history_leave_count` | Integer | Выходы |
| `posts_count` | Integer | Посты |
| `likes_count` | Integer | Лайки |
| `comments_count` | Integer | Комментарии |
| `reposts_count` | Integer | Репосты |
| `mailing_count` | Integer | Рассылки |
| `authors_count` | Integer | Авторы |
| `reviews_participants_count` | Integer | Участники конкурсов |
| `reviews_winners_count` | Integer | Победители |

#### `SystemListSubscriber` — Подписчики
Список подписчиков группы.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | project_id_user_id |
| `project_id` | String (FK) | ID проекта |
| `vk_user_id` | BigInteger | VK ID пользователя |
| `first_name` | String | Имя |
| `last_name` | String | Фамилия |
| `sex` | Integer | Пол (0,1,2) |
| `photo_url` | String | Аватар |
| `domain` | String | Домен профиля |
| `bdate` | String | Дата рождения |
| `city` | String | Город |
| `country` | String | Страна |
| `is_closed` | Boolean | Закрытый профиль |
| `deactivated` | String | Деактивирован |
| `last_seen` | BigInteger | Последний визит |
| `platform` | Integer | Платформа (1-7) |
| `added_at` | DateTime | Дата добавления |
| `source` | String | Источник |

#### `SystemListHistoryJoin` — История вступлений
Записи о вступивших пользователях.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | Уникальный ID |
| `project_id` | String (FK) | ID проекта |
| `vk_user_id` | BigInteger | VK ID |
| `event_date` | DateTime | Дата события |
| ... | ... | + данные пользователя |

#### `SystemListHistoryLeave` — История выходов
Записи о вышедших пользователях.

#### `SystemListPost` — Посты сообщества
Детальная информация о постах для аналитики.

#### `SystemListLikes` — Лайки
Пользователи, поставившие лайки.

#### `SystemListComments` — Комментарии
Комментарии к постам.

#### `SystemListReposts` — Репосты
Пользователи, сделавшие репост.

#### `SystemListMailing` — Рассылки
Получатели рассылок.

#### `SystemListAuthor` — Авторы постов
Пользователи, публикующие посты в группе.

---

### 2.9. Автоматизации (`models_library/automations.py`)

#### `ReviewContest` — Конкурс отзывов
Настройки конкурса отзывов для проекта.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK, unique) | ID проекта |
| `is_active` | Boolean | Активен ли |
| `keywords` | String | Ключевые слова |
| `start_date` | String | Дата начала |
| `finish_condition` | String | Условие завершения (count/date/mixed) |
| `target_count` | Integer | Целевое количество |
| `finish_date` | String | Дата завершения |
| `finish_day_of_week` | Integer | День недели (1-7) |
| `finish_time` | String | Время завершения (HH:MM) |
| `auto_blacklist` | Boolean | Авто-бан |
| `auto_blacklist_duration` | Integer | Длительность бана (дни) |
| `template_comment` | Text | Шаблон комментария |
| `template_winner_post` | Text | Шаблон поста-победителя |
| `winner_post_images` | Text (JSON) | Изображения поста |
| `template_dm` | Text | Шаблон личного сообщения |
| `template_error_comment` | Text | Шаблон ошибки |
| `created_at` | DateTime | Дата создания |
| `updated_at` | DateTime | Дата обновления |

#### `ReviewContestEntry` — Участники конкурса
Записи участников конкурса отзывов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `contest_id` | String (FK) | ID конкурса |
| `vk_post_id` | Integer | ID поста |
| `vk_owner_id` | Integer | ID владельца |
| `user_vk_id` | BigInteger | VK ID участника |
| `user_name` | String | Имя участника |
| `user_photo` | String | Аватар |

#### `ReviewContestDeliveryLog` — Лог доставки призов
Журнал выдачи призов победителям.

#### `ReviewContestBlacklist` — Черный список
Пользователи в бане для конкурсов.

#### `PromoCode` — Промокоды
Промокоды для призов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `contest_id` | String (FK, nullable) | ID конкурса отзывов |
| `general_contest_id` | String (FK, nullable) | ID общего конкурса |
| `code` | String | Код |
| `description` | String | Описание |
| `is_issued` | Boolean | Выдан ли |
| `issued_at` | DateTime | Когда выдан |
| `issued_to_user_id` | BigInteger | Кому выдан |

#### `StoriesAutomation` — Автоматизация историй
Настройки автопубликации историй.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String (FK, unique) | ID проекта |
| `is_active` | Boolean | Активна ли |
| `keywords` | String | Ключевые слова |
| `created_at` | DateTime | Дата создания |
| `updated_at` | DateTime | Дата обновления |

#### `StoriesAutomationLog` — Лог автоматизации историй
Журнал выполнения автоматизации.

---

### 2.10. Системные таблицы (`models_library/system.py`)

#### `SystemAccount` — Системные аккаунты VK
Аккаунты для выполнения операций в VK.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `vk_user_id` | BigInteger (unique) | VK ID |
| `full_name` | String | Полное имя |
| `profile_url` | String | URL профиля |
| `avatar_url` | String | Аватар |
| `token` | EncryptedString | Зашифрованный токен |
| `notes` | Text | Заметки |
| `status` | String | Статус (active/error/unknown) |

#### `TokenLog` — Логи использования токенов
Журнал вызовов VK API.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | Integer (PK) | Автоинкремент |
| `account_id` | String | ID аккаунта |
| `is_env_token` | Boolean | Токен из .env |
| `project_id` | String | ID проекта |
| `method` | String | VK API метод |
| `status` | String | success/error |
| `error_details` | Text | Детали ошибки |
| `timestamp` | DateTime | Время |

#### `SystemTask` — Системные задачи
Фоновые задачи (синхронизация, импорт и т.д.).

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `project_id` | String | ID проекта |
| `list_type` | String | Тип списка |
| `status` | String | pending/fetching/processing/done/error |
| `loaded` | Integer | Загружено |
| `total` | Integer | Всего |
| `message` | String | Сообщение |
| `error` | Text | Ошибка |
| `created_at` | Float | Timestamp создания |
| `updated_at` | Float | Timestamp обновления |

---

### 2.11. AI Токены (`models_library/ai_tokens.py`)

#### `AiToken` — Токены для AI API
Хранение API ключей для Gemini/других AI сервисов.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | String (PK) | UUID |
| `description` | String | Описание токена |
| `token` | EncryptedString | Зашифрованный ключ |
| `status` | String | active/error/unknown |
| `status_error` | Text | Сообщение об ошибке |
| `last_checked` | DateTime | Время проверки |

#### `AiTokenLog` — Логи AI запросов
Журнал использования AI.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | Integer (PK) | Автоинкремент |
| `token_id` | String (FK) | ID токена |
| `is_env_token` | Boolean | Токен из .env |
| `model_name` | String | Модель (gemini-2.5-flash) |
| `status` | String | success/error |
| `error_details` | Text | Детали ошибки |
| `timestamp` | DateTime | Время |

---

### 2.12. Административные инструменты (`models_library/admin_tools.py`)

#### `AdministeredGroup` — Администрируемые группы
Группы VK, которыми управляют системные аккаунты.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | BigInteger (PK) | VK ID группы |
| `name` | String | Название |
| `screen_name` | String | Короткое имя |
| `photo_200` | String | Аватар |
| `members_count` | Integer | Подписчики |
| `activity` | String | Деятельность |
| `description` | Text | Описание |
| `admin_sources` | Text (JSON) | Источники администрирования |
| `creator_id` | BigInteger | ID создателя |
| `creator_name` | String | Имя создателя |
| `admins_data` | Text (JSON) | Данные администраторов |
| `last_updated` | DateTime | Время обновления |

---

### 2.13. VK Пользователи (`models_library/vk_users.py`)

#### `VkUser` — Авторизованные VK пользователи
Пользователи, прошедшие VK OAuth авторизацию.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `vk_user_id` | String (PK) | VK ID |
| `first_name` | String | Имя |
| `last_name` | String | Фамилия |
| `photo_url` | String | Аватар |
| `email` | String | Email |
| `access_token` | Text | Токен доступа |
| `refresh_token` | Text | Refresh токен |
| `token_expires_at` | DateTime | Истечение токена |
| `scope` | String | Разрешения |
| `app_id` | String | ID VK приложения |
| `is_active` | Boolean | Активен |
| `last_login` | DateTime | Последний вход |
| `created_at` | DateTime | Дата создания |

---

### 2.14. Логи (`models_library/logs.py`)

#### `VkCallbackLog` — Логи VK Callback API
Журнал входящих событий от VK.

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | Integer (PK) | Автоинкремент |
| `event_type` | String | Тип события |
| `group_id` | BigInteger | ID группы |
| `event_id` | String | ID события |
| `payload` | Text (JSON) | Данные события |
| `processed` | Boolean | Обработано |
| `created_at` | DateTime | Время получения |

---

## 3. Типы данных

### `EncryptedString` (`models_library/types.py`)
Кастомный тип для шифрования чувствительных данных (токенов, ключей).

- При записи: шифрует значение с помощью Fernet
- При чтении: расшифровывает
- Ключ шифрования: `ENCRYPTION_KEY` из переменных окружения

---

## 4. Автоматическое создание и миграции

- **Создание БД**: При первом запуске бэкенда таблицы создаются автоматически на основе моделей
- **Миграции**: Простые миграции (добавление колонок) выполняются при старте через `migrations.py`
- **PostgreSQL**: В продакшне используется PostgreSQL через `DATABASE_URL`
- **SQLite**: Локально создаётся файл `vk_planner.db`

---

## 5. Как посмотреть актуальную схему?

1. **Код моделей**: `backend_python/models_library/`
2. **SQLite браузер**: DB Browser for SQLite, DBeaver
3. **PostgreSQL**: pgAdmin, DBeaver

---

*Последнее обновление: 23 января 2026*
