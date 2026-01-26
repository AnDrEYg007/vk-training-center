# 📚 Документация проекта "Планировщик контента ВК"

Добро пожаловать в централизованное хранилище документации проекта. Вся документация организована по категориям для удобной навигации.

## 📁 Структура документации

### 🖥️ [Frontend](./frontend/)
Документация по клиентской части приложения (React/TypeScript).

- [00_OVERVIEW.md](./frontend/00_OVERVIEW.md) - Общий обзор фронтенда
- [01_ARCHITECTURE_AND_DESIGN.md](./frontend/01_ARCHITECTURE_AND_DESIGN.md) - Архитектура и дизайн
- [02_STATE_MANAGEMENT.md](./frontend/02_STATE_MANAGEMENT.md) - Управление состоянием
- [03_API_COMMUNICATION.md](./frontend/03_API_COMMUNICATION.md) - Взаимодействие с API
- [04_COMPONENT_GUIDE.md](./frontend/04_COMPONENT_GUIDE.md) - Руководство по компонентам
- [05_HOOKS_AND_LOGIC.md](./frontend/05_HOOKS_AND_LOGIC.md) - Хуки и логика
- [06_BUILD_AND_RUN.md](./frontend/06_BUILD_AND_RUN.md) - Сборка и запуск
- [DOCUMENTATION_MAP.md](./frontend/DOCUMENTATION_MAP.md) - Карта документации

**Фичи фронтенда:**
- [features/auth/](./frontend/features/auth/) - Аутентификация
- [features/posts/](./frontend/features/post_modal/) - Посты и модальные окна
- [features/products/](./frontend/features/products/) - Товары
- [features/lists/](./frontend/features/lists/) - Списки рассылок
- [features/schedule/](./frontend/features/schedule/) - Расписание
- [features/tags/](./frontend/features/tags/) - Теги
- [features/projects/](./frontend/features/projects/) - Проекты

---

### ⚙️ [Backend](./backend/)
Документация по серверной части приложения (Python/FastAPI).

- [00_OVERVIEW.md.txt](./backend/00_OVERVIEW.md.txt) - Общий обзор бэкенда
- [01_STRUCTURE_AND_FLOW.md.txt](./backend/01_STRUCTURE_AND_FLOW.md.txt) - Структура и потоки
- [02_DATABASE.md.txt](./backend/02_DATABASE.md.txt) - База данных
- [03_API_AND_VALIDATION.md.txt](./backend/03_API_AND_VALIDATION.md.txt) - API и валидация
- [04_CORE_LOGIC.md.txt](./backend/04_CORE_LOGIC.md.txt) - Основная логика
- [05_EXTERNAL_SERVICES.md.txt](./backend/05_EXTERNAL_SERVICES.md.txt) - Внешние сервисы
- [06_BACKGROUND_SYSTEMS.md.txt](./backend/06_BACKGROUND_SYSTEMS.md.txt) - Фоновые системы
- [07_DEVELOPER_ONBOARDING.md.txt](./backend/07_DEVELOPER_ONBOARDING.md.txt) - Онбординг разработчика
- [DOCUMENTATION_MAP.md.txt](./backend/DOCUMENTATION_MAP.md.txt) - Карта документации

**Фичи бэкенда:**
- [features/posts/](./backend/features/posts/) - Публикации
- [features/market/](./backend/features/market/) - Товары (Market API)
- [features/lists/](./backend/features/lists/) - Рассылки
- [features/ai/](./backend/features/ai/) - AI сервисы
- [features/auth/](./backend/features/auth/) - Аутентификация
- [features/projects/](./backend/features/projects/) - Проекты
- [features/automations/](./backend/features/automations/) - **Автоматизации** (сторис, конкурсы, AI-посты)

---

### 🏗️ [Architecture](./architecture/)
Общая архитектура проекта.

- [00_OVERVIEW.md](./architecture/00_OVERVIEW.md) - Обзор архитектуры
- [01_BACKEND_GUIDE.md](./architecture/01_BACKEND_GUIDE.md) - Руководство по бэкенду
- [02_FRONTEND_GUIDE.md](./architecture/02_FRONTEND_GUIDE.md) - Руководство по фронтенду
- [03_API_CONTRACT_AND_COMMUNICATION.md](./architecture/03_API_CONTRACT_AND_COMMUNICATION.md) - API контракт
- [04_DATABASE_SETUP.md](./architecture/04_DATABASE_SETUP.md) - Настройка БД
- [05_DEPLOYMENT_WORKFLOW.md](./architecture/05_DEPLOYMENT_WORKFLOW.md) - Деплой

---

### 🎨 [UI-Kit](./ui-kit/)
Дизайн-система и компоненты интерфейса.

- [00_OVERVIEW.md](./ui-kit/00_OVERVIEW.md) - Обзор UI-Kit
- [01_FOUNDATIONS.md](./ui-kit/01_FOUNDATIONS.md) - Основы (цвета, типографика)
- [02_COMPONENTS_INDEX.md](./ui-kit/02_COMPONENTS_INDEX.md) - Индекс компонентов
- [03_LAYOUTS.md](./ui-kit/03_LAYOUTS.md) - Лейауты
- [04_UI_UX_PRINCIPLES.md](./ui-kit/04_UI_UX_PRINCIPLES.md) - Принципы UI/UX

**Компоненты:**
- [components/BUTTONS.md](./ui-kit/components/BUTTONS.md) - Кнопки
- [components/CARDS.md](./ui-kit/components/CARDS.md) - Карточки
- [components/MODALS.md](./ui-kit/components/MODALS.md) - Модальные окна
- [components/TABLES.md](./ui-kit/components/TABLES.md) - Таблицы
- [components/INPUTS_AND_CONTROLS.md](./ui-kit/components/INPUTS_AND_CONTROLS.md) - Поля ввода

---

### 🔌 [API](./api/)
Документация по API и базе данных.

- [API_CONTRACT.md](./api/API_CONTRACT.md) - Контракт API
- [DATABASE_SCHEMA.md](./api/DATABASE_SCHEMA.md) - Схема базы данных
- [vk_api_audit_report.md](./api/vk_api_audit_report.md) - Аудит VK API

---

### 🚀 [Deployment](./deployment/)
Инструкции по развёртыванию.

- [DEPLOYMENT.md](./deployment/DEPLOYMENT.md) - Общие инструкции
- [DEPLOYMENT_BACKEND.md](./deployment/DEPLOYMENT_BACKEND.md) - Деплой бэкенда
- [DEPLOYMENT_FRONTEND.md](./deployment/DEPLOYMENT_FRONTEND.md) - Деплой фронтенда

---

### 📖 [Training](./training/)
Документация по учебному центру.

- [TRAINING_STRUCTURE.md](./training/TRAINING_STRUCTURE.md) - Структура обучения
- [DEVELOPER_GUIDE.md](./training/DEVELOPER_GUIDE.md) - Руководство разработчика
- [PROGRESS.md](./training/PROGRESS.md) - Прогресс
- [PROMPT_EXAMPLES.md](./training/PROMPT_EXAMPLES.md) - Примеры промптов
- [feature_README.md](./training/feature_README.md) - README фичи

---

### 📝 [Changelog](./changelog/)
История изменений проекта.

- [changelog_9.md](./changelog/changelog_9.md) - Последний changelog (актуальный)
- [changelog_8.md](./changelog/changelog_8.md)
- [changelog_7.md](./changelog/changelog_7.md)
- ... и более ранние версии

---

### 📋 [Misc](./misc/)
Прочие документы.

- [TODO.md](./misc/TODO.md) - Список задач
- [PROJECT_MAP.md](./misc/PROJECT_MAP.md) - Карта проекта
- [AI_INSTRUCTIONS.md](./misc/AI_INSTRUCTIONS.md) - Инструкции для AI
- [TECHNICAL_SPEC_GENERAL_CONTESTS.md](./misc/TECHNICAL_SPEC_GENERAL_CONTESTS.md) - Техспеки конкурсов
- [getstoris_README.md](./misc/getstoris_README.md) - GetStoris сервис

---

## 🔍 Быстрый старт

1. **Новый разработчик?** Начните с:
   - [architecture/00_OVERVIEW.md](./architecture/00_OVERVIEW.md)
   - [frontend/09_DEVELOPER_ONBOARDING.md](./frontend/09_DEVELOPER_ONBOARDING.md)
   - [backend/07_DEVELOPER_ONBOARDING.md.txt](./backend/07_DEVELOPER_ONBOARDING.md.txt)

2. **Работаете с фронтендом?** Изучите:
   - [frontend/DOCUMENTATION_MAP.md](./frontend/DOCUMENTATION_MAP.md)
   - [ui-kit/00_OVERVIEW.md](./ui-kit/00_OVERVIEW.md)

3. **Работаете с бэкендом?** Изучите:
   - [backend/DOCUMENTATION_MAP.md.txt](./backend/DOCUMENTATION_MAP.md.txt)
   - [api/API_CONTRACT.md](./api/API_CONTRACT.md)

4. **Нужно задеплоить?** Смотрите:
   - [deployment/](./deployment/)

---

*Последнее обновление структуры: 23 января 2026*
