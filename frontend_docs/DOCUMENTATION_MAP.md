
# Карта документации проекта

Документация реорганизована в соответствии с модульной структурой кода (Feature-Sliced Design).

## 📂 features/ (Бизнес-логика)

### 👥 lists/ (Системные списки)
*Работа с локальной базой пользователей, аналитикой и историей.*

*   **[01_Overview_and_Architecture.md](./features/lists/01_Overview_and_Architecture.md)**: Обзор архитектуры, хук `useSystemListsManager` и компонент `ListCard`.
*   **[02_Statistics_and_Charts.md](./features/lists/02_Statistics_and_Charts.md)**: Реализация панели статистики и графиков (`ListStatisticsPanel`).
*   **[03_Background_Tasks_and_Polling.md](./features/lists/03_Background_Tasks_and_Polling.md)**: Паттерн "Task Monitor" для длительных операций синхронизации.
*   **[04_Tables_and_Filters.md](./features/lists/04_Tables_and_Filters.md)**: Описание таблиц (`MembersTable`, `InteractionTable`) и логики фильтрации.

### 📦 products/ (Управление товарами)
*Самый сложный модуль, включающий редактируемую таблицу, AI и массовые операции.*

*   **[01_Architecture_and_State.md](./features/products/01_Architecture_and_State.md)**: Как устроен хук `useProductsManager` и управление состоянием.
*   **[02_Table_Interactions.md](./features/products/02_Table_Interactions.md)**: Логика инлайн-редактирования, управления колонками и фото.
*   **[03_AI_Features.md](./features/products/03_AI_Features.md)**: Логика подбора категорий и коррекции текстов (Single & Bulk).
*   **[04_Bulk_Operations.md](./features/products/04_Bulk_Operations.md)**: Массовое редактирование цен, описаний и удаление.
*   **[05_Creation_Flows.md](./features/products/05_Creation_Flows.md)**: Логика создания товаров (одиночное и массовое).

### 📝 post_modal/ (Окно создания поста)
*Модальное окно `PostDetailsModal` и его экосистема.*

*   **[01_Modal_Logic.md](./features/post_modal/01_Modal_Logic.md)**: Состояния (View/Edit/Copy), валидация и закрытие.
*   **[02_Media_Flow.md](./features/post_modal/02_Media_Flow.md)**: Загрузка, Drag-and-Drop, Галерея и компонент `PostMediaSection`.
*   **[03_Text_and_AI.md](./features/post_modal/03_Text_and_AI.md)**: Работа с текстом, переменными и AI-чатом.
*   **[04_Scheduling_Logic.md](./features/post_modal/04_Scheduling_Logic.md)**: Выбор даты, проверка конфликтов и методы публикации.

### 🗓 schedule/ (Календарь)
*   **[01_Grid_Mechanics.md](./features/schedule/01_Grid_Mechanics.md)**: Рендеринг сетки, адаптивность.
*   **[02_Drag_and_Drop.md](./features/schedule/02_Drag_and_Drop.md)**: Логика перемещения и копирования карточек.

### 📝 notes/ (Заметки)
*   **[01_Logic.md](./features/notes/01_Logic.md)**: CRUD, цветовые темы и поведение в календаре.

### ⚙️ projects/ (Проекты)
*   **[01_Sidebar_and_Navigation.md](./features/projects/01_Sidebar_and_Navigation.md)**: Сайдбар, фильтры, логика списка.
*   **[02_Project_Settings.md](./features/projects/02_Project_Settings.md)**: Модальное окно настроек, редакторы переменных.

### 🏷 tags/ (Теги)
*   **[01_Management.md](./features/tags/01_Management.md)**: Управление тегами, перетегирование.

### 🔐 auth/ (Аутентификация и Пользователи)
*   **[01_Authentication_Flow.md](./features/auth/01_Authentication_Flow.md)**: Вход, выбор окружения API.
*   **[02_User_Management.md](./features/auth/02_User_Management.md)**: Администрирование пользователей.

### 💾 database_management/ (Администрирование БД и Контекст)
*   **[01_Overview.md](./features/database_management/01_Overview.md)**: Таблица проектов, массовое добавление, архив.
*   **[02_Project_Context.md](./features/database_management/02_Project_Context.md)**: (НОВОЕ) Управление контекстом, массовое AI-заполнение.

### 💡 suggested_posts/ (Предложка)
*   **[01_Workflow.md](./features/suggested_posts/01_Workflow.md)**: Процесс работы с предложенными постами и AI-коррекция.

### 🎓 training/ (Центр обучения)
*   **[01_Architecture.md](./features/training/01_Architecture.md)**: Структура контента, навигация и интерактивные демо.

### 🧠 ai/ (AI Промпты и Настройки)
*   **[08_AI_PROMPT_PRESETS_GUIDE.md](./08_AI_PROMPT_PRESETS_GUIDE.md)**: Руководство по шаблонам AI-инструкций.

---

## 📂 shared/ (Общее и Архитектура)
*Здесь описаны архитектурные паттерны и утилиты.*

*   **[00_OVERVIEW.md](./00_OVERVIEW.md)**: Обзор стека и принципов.
*   **[01_ARCHITECTURE_AND_DESIGN.md](./01_ARCHITECTURE_AND_DESIGN.md)**: FSD, управление состоянием.
*   **[02_STATE_MANAGEMENT.md](./02_STATE_MANAGEMENT.md)**: Глубокий разбор Context API.
*   **[03_API_COMMUNICATION.md](./03_API_COMMUNICATION.md)**: Паттерны взаимодействия с API.
*   **[04_COMPONENT_GUIDE.md](./04_COMPONENT_GUIDE.md)**: Типы компонентов (Smart vs Dumb).
*   **[05_HOOKS_AND_LOGIC.md](./05_HOOKS_AND_LOGIC.md)**: Использование кастомных хуков.
*   **[06_BUILD_AND_RUN.md](./06_BUILD_AND_RUN.md)**: Инструкции по запуску.
*   **[09_DEVELOPER_ONBOARDING.md](./09_DEVELOPER_ONBOARDING.md)**: 🚀 **Старт для разработчика.**
*   **[10_TESTING_STRATEGY.md](./10_TESTING_STRATEGY.md)**: 🧪 **Стратегия тестирования.**
*   **[11_GLOSSARY.md](./11_GLOSSARY.md)**: 📖 **Глоссарий.**

### Специфические Гайды
*   **[01_Api_Client_Architecture.md](./shared/01_Api_Client_Architecture.md)**: Устройство HTTP-клиента.
*   **[07_PUBLISHED_POSTS_GUIDE.md](./07_PUBLISHED_POSTS_GUIDE.md)**: Регламент работы с опубликованными постами.
*   **[08_SYSTEM_POSTS_GUIDE.md](./08_SYSTEM_POSTS_GUIDE.md)**: Регламент работы с системными постами.

---

## 📂 backend/ (Справочник API и Бэкенда)
*См. папку `backend_python/docs/` для подробной документации по Python-части.*
