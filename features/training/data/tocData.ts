// Этот файл определяет структуру иерархического оглавления для раздела обучения.
// Полная структура, соответствующая всему функционалу приложения "Планировщик контента".

export interface TocItem {
    title: string;
    path: string; // Уникальный путь/идентификатор
    children?: TocItem[];
}

export const toc: TocItem[] = [
    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 0: О ЦЕНТРЕ ОБУЧЕНИЯ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 0: О Центре обучения',
        path: '0-about-training-center',
        children: [
            { 
                title: '0.1. Что такое Центр обучения?', 
                path: '0-1-what-is-training-center',
                children: [
                    { title: 'Назначение и цели', path: '0-1-1-purpose' },
                    { title: 'Для кого этот раздел', path: '0-1-2-target-audience' },
                    { title: 'Как устроена документация', path: '0-1-3-documentation-structure' },
                ]
            },
            { 
                title: '0.2. Как работать с Центром обучения', 
                path: '0-2-how-to-use',
                children: [
                    { title: 'Навигация по оглавлению', path: '0-2-1-navigation' },
                    { title: 'Интерактивные песочницы', path: '0-2-2-sandboxes' },
                    { title: 'Примеры из реального интерфейса', path: '0-2-3-real-examples' },
                ]
            },
            { 
                title: '0.3. Что вы узнаете', 
                path: '0-3-what-you-will-learn',
                children: [
                    { title: 'Управление контентом', path: '0-3-1-content-management' },
                    { title: 'Работа с товарами', path: '0-3-2-products' },
                    { title: 'Автоматизации и конкурсы', path: '0-3-3-automations' },
                    { title: 'Администрирование', path: '0-3-4-administration' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 1: ВВЕДЕНИЕ И ПЕРВЫЕ ШАГИ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 1: Введение в приложение',
        path: '1-intro',
        children: [
            { 
                title: '1.1. Что такое "Планировщик контента"?', 
                path: '1-1-what-is',
                children: [
                    { title: 'Общая информация', path: '1-1-1-overview' },
                    { title: 'Какие задачи решает приложение', path: '1-1-2-tasks' },
                    { title: 'Сценарии использования', path: '1-1-3-use-cases' },
                ]
            },
            { 
                title: '1.2. Знакомство с интерфейсом', 
                path: '1-2-interface-overview',
                children: [
                    { title: 'Главная навигационная панель', path: '1-2-1-primary-sidebar-intro' },
                    { title: 'Сайдбар проектов', path: '1-2-2-projects-sidebar-intro' },
                    { title: 'Рабочая область', path: '1-2-3-workspace-intro' },
                ]
            },
            { title: '1.3. Экран приветствия', path: '1-4-welcome-screen' },
            { title: '1.4. Ваш первый шаг: Проекты', path: '1-5-projects-first-step' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 2: МОДУЛЬ "КОНТЕНТ-МЕНЕДЖМЕНТ"
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 2: Модуль "Контент-менеджмент"',
        path: '2-content-management',
        children: [
            // ─────────────────────────────────────────────────────────────────────
            // 2.1. Вкладка "Отложенные" (Календарь)
            // ─────────────────────────────────────────────────────────────────────
            {
                title: '2.1. Вкладка "Отложенные" (Календарь)',
                path: '2-1-schedule',
                children: [
                    {
                        title: '2.1.1. Сайдбар проектов',
                        path: '2-1-1-sidebar-nav',
                        children: [
                            { title: 'Элементы списка проектов', path: '2-1-1-1-project-list-items' },
                            { title: 'Индикаторы состояния', path: '2-1-1-2-status-indicators' },
                            { title: 'Счётчики постов', path: '2-1-1-3-post-counters' },
                            { title: 'Фильтры и поиск', path: '2-1-1-4-filters-search' },
                        ]
                    },
                    {
                        title: '2.1.2. Шапка календаря',
                        path: '2-1-2-calendar-header',
                        children: [
                            { title: 'Навигация по датам', path: '2-1-2-1-date-navigation' },
                            { title: 'Режимы отображения (Неделя/Сегодня)', path: '2-1-2-2-view-modes' },
                            { title: 'Управление видимостью заметок и тегов', path: '2-1-2-3-visibility-controls' },
                            { title: 'Кнопка "Обновить"', path: '2-1-2-4-refresh-button' },
                            { title: 'Массовые действия', path: '2-1-2-5-bulk-actions' },
                            { title: 'Создание заметки (✏️)', path: '2-1-2-6-create-note-button' },
                        ]
                    },
                    {
                        title: '2.1.3. Сетка календаря',
                        path: '2-1-3-calendar-grid',
                        children: [
                            { title: 'Дневные колонки', path: '2-1-3-1-day-columns' },
                            { title: 'Взаимодействие с сеткой', path: '2-1-3-2-grid-interaction' },
                            { title: 'Drag-and-Drop', path: '2-1-3-3-drag-and-drop' },
                            { title: 'Быстрое создание заметки', path: '2-1-3-4-quick-note' },
                        ]
                    },
                    {
                        title: '2.1.4. Посты в календаре',
                        path: '2-1-4-posts-in-calendar',
                        children: [
                            { title: 'Три типа постов: В чём разница?', path: '2-1-4-1-post-types' },
                            { title: 'Опубликованный пост', path: '2-1-4-2-published-post' },
                            { title: 'Отложенный пост VK', path: '2-1-4-3-deferred-post' },
                            { title: 'Системный пост', path: '2-1-4-4-system-post' },
                            { title: 'Жизненный цикл системного поста', path: '2-1-4-5-system-post-lifecycle' },
                            { title: 'Карточка поста: Детальный обзор', path: '2-1-4-6-postcard-deep-dive' },
                        ]
                    },
                    {
                        title: '2.1.5. Заметки',
                        path: '2-1-5-notes',
                        children: [
                            { title: 'Создание заметки', path: '2-1-5-1-create-note' },
                            { title: 'Редактирование заметки', path: '2-1-5-2-edit-note' },
                            { title: 'Цветовая палитра', path: '2-1-5-3-color-palette' },
                            { title: 'Просмотр и действия', path: '2-1-5-4-view-actions' },
                        ]
                    },
                    {
                        title: '2.1.6. Истории (Stories)',
                        path: '2-1-6-stories',
                        children: [
                            { title: 'Отображение историй в календаре', path: '2-1-6-1-stories-display' },
                            { title: 'Просмотр историй', path: '2-1-6-2-stories-viewer' },
                        ]
                    },
                    {
                        title: '2.1.7. Модальное окно поста',
                        path: '2-1-7-post-modal',
                        children: [
                            { title: 'Общие механики', path: '2-1-7-1-general-mechanics' },
                            { title: 'Способ публикации', path: '2-1-7-2-publication-method' },
                            { title: 'Массовое создание (несколько дат)', path: '2-1-7-3-bulk-dates' },
                            { title: 'Мультипроектная публикация', path: '2-1-7-4-multi-project' },
                            { title: 'Работа с текстом', path: '2-1-7-5-text-editing' },
                            { title: 'AI-помощник в посте', path: '2-1-7-6-ai-assistant' },
                            { title: 'Переменные в тексте', path: '2-1-7-7-variables' },
                            { title: 'Emoji Picker', path: '2-1-7-8-emoji-picker' },
                            { title: 'Работа с медиа', path: '2-1-7-9-media-editing' },
                            { title: 'Галерея изображений VK', path: '2-1-7-10-image-gallery' },
                            { title: 'Создание альбомов', path: '2-1-7-11-create-album' },
                            { title: 'Футер и кнопка сохранения', path: '2-1-7-12-footer-save-button' },
                        ]
                    },
                    {
                        title: '2.1.8. Операции с постами',
                        path: '2-1-8-post-operations',
                        children: [
                            { title: 'Создание поста', path: '2-1-8-1-create' },
                            { title: 'Редактирование', path: '2-1-8-2-edit' },
                            { title: 'Копирование', path: '2-1-8-3-copy' },
                            { title: 'Удаление', path: '2-1-8-4-delete' },
                            { title: 'Перемещение (Drag-and-Drop)', path: '2-1-8-5-move' },
                            { title: 'Массовый выбор и удаление', path: '2-1-8-6-bulk-selection' },
                            { title: 'Публикация сейчас', path: '2-1-8-7-publish-now' },
                        ]
                    },
                ]
            },

            // ─────────────────────────────────────────────────────────────────────
            // 2.2. Вкладка "Предложенные"
            // ─────────────────────────────────────────────────────────────────────
            {
                title: '2.2. Вкладка "Предложенные"',
                path: '2-2-suggested',
                children: [
                    { title: '2.2.1. Обзор интерфейса', path: '2-2-1-overview' },
                    { title: '2.2.2. Лента изображений', path: '2-2-2-image-ribbon' },
                    { title: '2.2.3. Карточка предложенного поста', path: '2-2-3-suggested-post-card' },
                    { title: '2.2.4. AI-редактор предложки', path: '2-2-4-ai-editor' },
                    { title: '2.2.5. Принятие и отклонение', path: '2-2-5-accept-reject' },
                    { title: '2.2.6. Планирование предложенного поста', path: '2-2-6-schedule-suggested' },
                ]
            },

            // ─────────────────────────────────────────────────────────────────────
            // 2.3. Вкладка "Товары"
            // ─────────────────────────────────────────────────────────────────────
            {
                title: '2.3. Вкладка "Товары"',
                path: '2-3-products',
                children: [
                    { title: '2.3.1. Обзор интерфейса', path: '2-3-1-overview' },
                    {
                        title: '2.3.2. Таблица товаров',
                        path: '2-3-2-products-table',
                        children: [
                            { title: 'Колонки таблицы', path: '2-3-2-1-columns' },
                            { title: 'Управление видимостью колонок', path: '2-3-2-2-column-visibility' },
                            { title: 'Сортировка и поиск', path: '2-3-2-3-sort-search' },
                        ]
                    },
                    { title: '2.3.3. Фильтры по альбомам', path: '2-3-3-album-filters' },
                    { title: '2.3.4. Фильтры по категориям', path: '2-3-4-category-filters' },
                    {
                        title: '2.3.5. Создание товаров',
                        path: '2-3-5-create-products',
                        children: [
                            { title: 'Создание одного товара', path: '2-3-5-1-create-single' },
                            { title: 'Создание нескольких товаров', path: '2-3-5-2-create-multiple' },
                            { title: 'Вставка из буфера обмена', path: '2-3-5-3-paste-clipboard' },
                        ]
                    },
                    {
                        title: '2.3.6. Импорт и экспорт',
                        path: '2-3-6-import-export',
                        children: [
                            { title: 'Импорт из файла (CSV/XLSX)', path: '2-3-6-1-import-file' },
                            { title: 'Маппинг колонок при импорте', path: '2-3-6-2-column-mapping' },
                            { title: 'Обновление товаров из файла', path: '2-3-6-3-update-from-file' },
                            { title: 'Экспорт в CSV', path: '2-3-6-4-export-csv' },
                            { title: 'Экспорт в XLSX', path: '2-3-6-5-export-xlsx' },
                        ]
                    },
                    {
                        title: '2.3.7. Массовое редактирование',
                        path: '2-3-7-bulk-edit',
                        children: [
                            { title: 'Массовое редактирование цен', path: '2-3-7-1-bulk-price' },
                            { title: 'Массовое редактирование старых цен', path: '2-3-7-2-bulk-old-price' },
                            { title: 'Массовое редактирование названий', path: '2-3-7-3-bulk-title' },
                            { title: 'Массовое редактирование описаний', path: '2-3-7-4-bulk-description' },
                            { title: 'Массовое редактирование альбомов', path: '2-3-7-5-bulk-album' },
                            { title: 'Массовое редактирование категорий', path: '2-3-7-6-bulk-category' },
                        ]
                    },
                    { title: '2.3.8. AI-предложения категорий', path: '2-3-8-ai-category' },
                    { title: '2.3.9. Редактор описаний', path: '2-3-9-description-editor' },
                    { title: '2.3.10. Просмотр изменений (DiffViewer)', path: '2-3-10-diff-viewer' },
                    { title: '2.3.11. Результаты сохранения', path: '2-3-11-save-results' },
                ]
            },

            // ─────────────────────────────────────────────────────────────────────
            // 2.4. Раздел "Автоматизации"
            // ─────────────────────────────────────────────────────────────────────
            {
                title: '2.4. Автоматизации',
                path: '2-4-automations',
                children: [
                    {
                        title: '2.4.1. Посты в истории',
                        path: '2-4-1-stories-automation',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-1-1-overview' },
                            { title: 'Настройки автоматизации', path: '2-4-1-2-settings' },
                            { title: 'Статистика', path: '2-4-1-3-stats' },
                            { title: 'Дашборд', path: '2-4-1-4-dashboard' },
                        ]
                    },
                    {
                        title: '2.4.2. Конкурс отзывов',
                        path: '2-4-2-reviews-contest',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-2-1-overview' },
                            { title: 'Настройки конкурса', path: '2-4-2-2-settings' },
                            { title: 'Победители', path: '2-4-2-4-winners' },
                            { title: 'Промокоды', path: '2-4-2-5-promocodes' },
                            { title: 'Лист отправок', path: '2-4-2-6-sending-list' },
                            { title: 'Блэклист', path: '2-4-2-7-blacklist' },
                            { title: 'Посты конкурса', path: '2-4-2-8-posts' },
                        ]
                    },
                    {
                        title: '2.4.3. Дроп промокодов',
                        path: '2-4-3-promo-drop',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-3-1-overview' },
                            { title: 'Настройка дропа', path: '2-4-3-2-settings' },
                        ]
                    },
                    {
                        title: '2.4.4. Универсальные конкурсы',
                        path: '2-4-4-general-contests',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-4-1-overview' },
                            { title: 'Список конкурсов', path: '2-4-4-2-contests-list' },
                            { title: 'Создание конкурса', path: '2-4-4-3-create' },
                            { title: 'Редактор конкурса', path: '2-4-4-4-editor' },
                            { title: 'Условия участия', path: '2-4-4-5-conditions' },
                            { title: 'Настройки', path: '2-4-4-6-settings' },
                            { title: 'Участники', path: '2-4-4-7-participants' },
                            { title: 'Победители', path: '2-4-4-8-winners' },
                            { title: 'Промокоды', path: '2-4-4-9-promocodes' },
                            { title: 'Отправка', path: '2-4-4-10-sending-list' },
                            { title: 'Чёрный список', path: '2-4-4-11-blacklist' },
                            { title: 'Превью конкурса', path: '2-4-4-12-preview' },
                        ]
                    },
                    {
                        title: '2.4.5. AI посты',
                        path: '2-4-5-ai-posts',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-5-1-overview' },
                            { title: 'Список AI постов', path: '2-4-5-2-list' },
                            { title: 'Создание AI поста', path: '2-4-5-3-create' },
                            { title: 'Редактор AI поста', path: '2-4-5-4-editor' },
                        ]
                    },
                    {
                        title: '2.4.6. Поздравления с ДР',
                        path: '2-4-6-birthday',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-6-1-overview' },
                            { title: 'Настройка поздравлений', path: '2-4-6-2-settings' },
                        ]
                    },
                    {
                        title: '2.4.7. Конкурс "Актив"',
                        path: '2-4-7-activity-contest',
                        children: [
                            { title: 'Обзор функционала', path: '2-4-7-1-overview' },
                            { title: 'Настройка конкурса', path: '2-4-7-2-settings' },
                        ]
                    },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 3: МОДУЛЬ "СПИСКИ"
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 3: Модуль "Списки"',
        path: '3-lists',
        children: [
            {
                title: '3.1. Общий обзор',
                path: '3-1-lists-overview',
                children: [
                    { title: '3.1.1. Интерфейс модуля', path: '3-1-1-interface' },
                    { title: '3.1.2. Навигация по спискам', path: '3-1-2-navigation' },
                    { title: '3.1.3. Фильтры', path: '3-1-3-filters' },
                ]
            },
            {
                title: '3.2. Системные списки',
                path: '3-2-system-lists',
                children: [
                    { title: '3.2.1. Типы системных списков', path: '3-2-1-types' },
                    { title: '3.2.2. Карточка списка', path: '3-2-2-list-card' },
                    { title: '3.2.3. Просмотр участников', path: '3-2-3-members' },
                    { title: '3.2.4. Просмотр постов', path: '3-2-4-posts' },
                    { title: '3.2.5. Просмотр взаимодействий', path: '3-2-5-interactions' },
                    { title: '3.2.6. Синхронизация взаимодействий', path: '3-2-6-sync-interactions' },
                ]
            },
            {
                title: '3.3. Статистика списков',
                path: '3-3-statistics',
                children: [
                    { title: '3.3.1. Статистика пользователей', path: '3-3-1-user-stats' },
                    { title: '3.3.2. Статистика постов', path: '3-3-2-posts-stats' },
                    { title: '3.3.3. Графики и диаграммы', path: '3-3-3-charts' },
                ]
            },
            {
                title: '3.4. Пользовательские списки',
                path: '3-4-user-lists',
                children: [
                    { title: '3.4.1. Создание списка', path: '3-4-1-create' },
                    { title: '3.4.2. Управление списком', path: '3-4-2-manage' },
                ]
            },
            {
                title: '3.5. Списки автоматизаций',
                path: '3-5-automation-lists',
                children: [
                    { title: '3.5.1. Связь со списками конкурсов', path: '3-5-1-contest-lists' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 4: УПРАВЛЕНИЕ ПРОЕКТАМИ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 4: Управление проектами',
        path: '4-projects',
        children: [
            {
                title: '4.1. База проектов',
                path: '4-1-database',
                children: [
                    { title: '4.1.1. Интерфейс управления', path: '4-1-1-interface' },
                    { title: '4.1.2. Добавление проектов', path: '4-1-2-add-projects' },
                    {
                        title: '4.1.3. Таблица проектов',
                        path: '4-1-3-projects-table',
                        children: [
                            { title: 'Колонки таблицы', path: '4-1-3-1-columns' },
                            { title: 'Управление видимостью колонок', path: '4-1-3-2-column-visibility' },
                            { title: 'Редактирование ячеек', path: '4-1-3-3-cell-editing' },
                        ]
                    },
                    { title: '4.1.4. Фильтрация и поиск', path: '4-1-4-filters' },
                    {
                        title: '4.1.5. Массовые операции',
                        path: '4-1-5-bulk-operations',
                        children: [
                            { title: 'Очистка колонки', path: '4-1-5-1-clear-column' },
                            { title: 'Очистка строки', path: '4-1-5-2-clear-row' },
                        ]
                    },
                ]
            },
            {
                title: '4.2. Настройки проекта',
                path: '4-2-project-settings',
                children: [
                    { title: '4.2.1. Название проекта', path: '4-2-1-name' },
                    { title: '4.2.2. Информация о проекте', path: '4-2-2-info' },
                    { title: '4.2.3. Статус (активен/неактивен)', path: '4-2-3-status' },
                    { title: '4.2.4. Команда проекта', path: '4-2-4-team' },
                    { title: '4.2.5. Заметки проекта', path: '4-2-5-notes' },
                    {
                        title: '4.2.6. Интеграции',
                        path: '4-2-6-integrations',
                        children: [
                            { title: 'Токен сообщества', path: '4-2-6-1-community-token' },
                            { title: 'Дополнительные токены', path: '4-2-6-2-additional-tokens' },
                            { title: 'Код Callback API', path: '4-2-6-3-callback-code' },
                        ]
                    },
                    {
                        title: '4.2.7. Переменные проекта (локальные)',
                        path: '4-2-7-local-variables',
                        children: [
                            { title: 'Создание переменных', path: '4-2-7-1-create' },
                            { title: 'AI-автозаполнение', path: '4-2-7-2-ai-autofill' },
                        ]
                    },
                    {
                        title: '4.2.8. Глобальные переменные',
                        path: '4-2-8-global-variables',
                        children: [
                            { title: 'Создание типов переменных', path: '4-2-8-1-create-types' },
                            { title: 'Заполнение значений', path: '4-2-8-2-fill-values' },
                        ]
                    },
                    { title: '4.2.9. Теги проекта', path: '4-2-9-tags' },
                    { title: '4.2.10. AI-шаблоны инструкций', path: '4-2-10-ai-presets' },
                ]
            },
            {
                title: '4.3. Контекст проекта',
                path: '4-3-project-context',
                children: [
                    { title: '4.3.1. Управление полями контекста', path: '4-3-1-context-fields' },
                    { title: '4.3.2. Создание поля контекста', path: '4-3-2-create-field' },
                    { title: '4.3.3. Удаление поля контекста', path: '4-3-3-delete-field' },
                    { title: '4.3.4. AI-автозаполнение контекста', path: '4-3-4-ai-context-autofill' },
                    { title: '4.3.5. Массовое AI-автозаполнение', path: '4-3-5-mass-ai-autofill' },
                ]
            },
            {
                title: '4.4. Глобальные переменные (управление)',
                path: '4-4-global-variables-management',
                children: [
                    { title: '4.4.1. Интерфейс управления', path: '4-4-1-interface' },
                    { title: '4.4.2. Создание глобальной переменной', path: '4-4-2-create' },
                    { title: '4.4.3. Редактирование и удаление', path: '4-4-3-edit-delete' },
                ]
            },
            {
                title: '4.5. Администрируемые группы VK',
                path: '4-5-administered-groups',
                children: [
                    { title: '4.5.1. Таблица групп', path: '4-5-1-groups-table' },
                    { title: '4.5.2. Таблица владельцев', path: '4-5-2-owners-table' },
                    { title: '4.5.3. Таблица администраторов', path: '4-5-3-admins-table' },
                ]
            },
            {
                title: '4.6. Архив проектов',
                path: '4-6-archive',
                children: [
                    { title: '4.6.1. Архивация проекта', path: '4-6-1-archive' },
                    { title: '4.6.2. Восстановление из архива', path: '4-6-2-restore' },
                    { title: '4.6.3. Удаление проекта', path: '4-6-3-delete' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 5: ПРОДВИНУТЫЕ ИНСТРУМЕНТЫ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 5: Продвинутые инструменты',
        path: '5-advanced-tools',
        children: [
            {
                title: '5.1. Система переменных',
                path: '5-1-variables',
                children: [
                    { title: '5.1.1. Локальные переменные проекта', path: '5-1-1-local' },
                    { title: '5.1.2. Глобальные переменные', path: '5-1-2-global' },
                    { title: '5.1.3. Использование в постах', path: '5-1-3-usage' },
                    { title: '5.1.4. Автозаполнение AI', path: '5-1-4-ai-autofill' },
                ]
            },
            {
                title: '5.2. Система тегов',
                path: '5-2-tags',
                children: [
                    { title: '5.2.1. Создание и редактирование тегов', path: '5-2-1-create-edit' },
                    { title: '5.2.2. Автоприсвоение по ключевым словам', path: '5-2-2-auto-assign' },
                    { title: '5.2.3. Обновление тегов', path: '5-2-3-update' },
                ]
            },
            {
                title: '5.3. AI-помощник',
                path: '5-3-ai-assistant',
                children: [
                    { title: '5.3.1. Генерация текста', path: '5-3-1-text-generation' },
                    { title: '5.3.2. История чата', path: '5-3-2-chat-history' },
                    { title: '5.3.3. Системный промпт', path: '5-3-3-system-prompt' },
                    { title: '5.3.4. Контекст (переменные)', path: '5-3-4-context' },
                    { title: '5.3.5. Шаблоны AI-инструкций', path: '5-3-5-ai-presets' },
                ]
            },
            {
                title: '5.4. Галерея изображений',
                path: '5-4-image-gallery',
                children: [
                    { title: '5.4.1. Просмотр альбомов VK', path: '5-4-1-albums' },
                    { title: '5.4.2. Создание альбомов', path: '5-4-2-create-album' },
                    { title: '5.4.3. Загрузка изображений', path: '5-4-3-upload' },
                    { title: '5.4.4. Выбор фото для поста', path: '5-4-4-select' },
                ]
            },
            {
                title: '5.5. Emoji Picker',
                path: '5-5-emoji',
                children: [
                    { title: '5.5.1. Поиск эмодзи', path: '5-5-1-search' },
                    { title: '5.5.2. Категории', path: '5-5-2-categories' },
                    { title: '5.5.3. Вставка в текст', path: '5-5-3-insert' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 6: АДМИНИСТРИРОВАНИЕ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 6: Администрирование',
        path: '6-administration',
        children: [
            {
                title: '6.1. Управление пользователями системы',
                path: '6-1-users',
                children: [
                    { title: '6.1.1. Создание пользователей', path: '6-1-1-create' },
                    { title: '6.1.2. Редактирование пользователей', path: '6-1-2-edit' },
                    { title: '6.1.3. Удаление пользователей', path: '6-1-3-delete' },
                    { title: '6.1.4. Роли (admin/user)', path: '6-1-4-roles' },
                ]
            },
            {
                title: '6.2. VK-пользователи',
                path: '6-2-vk-users',
                children: [
                    { title: '6.2.1. Таблица VK-пользователей', path: '6-2-1-table' },
                    { title: '6.2.2. Управление доступом', path: '6-2-2-access' },
                ]
            },
            {
                title: '6.3. Системные аккаунты',
                path: '6-3-system-accounts',
                children: [
                    { title: '6.3.1. Таблица аккаунтов', path: '6-3-1-table' },
                    { title: '6.3.2. Панель статистики', path: '6-3-2-stats-panel' },
                    { title: '6.3.3. График использования токенов', path: '6-3-3-usage-chart' },
                    { title: '6.3.4. Добавление системных аккаунтов', path: '6-3-4-add-accounts' },
                    { title: '6.3.5. Авторизация аккаунта', path: '6-3-5-authorize' },
                ]
            },
            {
                title: '6.4. AI-токены',
                path: '6-4-ai-tokens',
                children: [
                    { title: '6.4.1. Таблица токенов', path: '6-4-1-table' },
                    { title: '6.4.2. Панель статистики', path: '6-4-2-stats-panel' },
                    { title: '6.4.3. Логи использования токенов', path: '6-4-3-token-logs' },
                ]
            },
            {
                title: '6.5. Активные задачи',
                path: '6-5-active-tasks',
                children: [
                    { title: '6.5.1. Список задач', path: '6-5-1-list' },
                    { title: '6.5.2. Детали задачи', path: '6-5-2-details' },
                    { title: '6.5.3. Управление задачами', path: '6-5-3-manage' },
                ]
            },
            {
                title: '6.6. Глобальные настройки',
                path: '6-6-settings',
                children: [
                    {
                        title: '6.6.1. Логи приложения',
                        path: '6-6-1-logs',
                        children: [
                            { title: 'Логи Callback API', path: '6-6-1-1-callback-logs' },
                            { title: 'VK Логи', path: '6-6-1-2-vk-logs' },
                            { title: 'AI Логи', path: '6-6-1-3-ai-logs' },
                        ]
                    },
                    { title: '6.6.2. Фоновые задачи', path: '6-6-2-background-tasks' },
                    { title: '6.6.3. Настройки AI токенов', path: '6-6-3-ai-tokens-settings' },
                    { title: '6.6.4. Системные страницы', path: '6-6-4-system-pages' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 7: АВТОРИЗАЦИЯ И БЕЗОПАСНОСТЬ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 7: Авторизация и безопасность',
        path: '7-auth',
        children: [
            { title: '7.1. Страница входа', path: '7-1-login' },
            { title: '7.2. Роли пользователей', path: '7-2-roles' },
            { title: '7.3. VK Auth Integration', path: '7-3-vk-auth' },
            { title: '7.4. Выход из системы', path: '7-4-logout' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 8: МОДАЛЬНЫЕ ОКНА И ДИАЛОГИ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 8: Модальные окна и диалоги',
        path: '8-modals',
        children: [
            {
                title: '8.1. Окна для постов',
                path: '8-1-post-modals',
                children: [
                    { title: '8.1.1. Подтверждение публикации', path: '8-1-1-publish-confirm' },
                    { title: '8.1.2. Успешная публикация', path: '8-1-2-publish-success' },
                    { title: '8.1.3. Подтверждение удаления', path: '8-1-3-delete-confirm' },
                    { title: '8.1.4. Подтверждение загрузки', path: '8-1-4-upload-confirm' },
                    { title: '8.1.5. Подтверждение перемещения', path: '8-1-5-move-confirm' },
                    { title: '8.1.6. Массовое удаление', path: '8-1-6-bulk-delete' },
                ]
            },
            {
                title: '8.2. Окна для заметок',
                path: '8-2-note-modals',
                children: [
                    { title: '8.2.1. Создание/редактирование заметки', path: '8-2-1-note-edit' },
                    { title: '8.2.2. Просмотр заметки', path: '8-2-2-note-preview' },
                ]
            },
            {
                title: '8.3. Превью-окна',
                path: '8-3-preview-modals',
                children: [
                    { title: '8.3.1. Превью AI-ленты', path: '8-3-1-ai-feed-preview' },
                    { title: '8.3.2. Превью победителей конкурса', path: '8-3-2-winner-preview' },
                    { title: '8.3.3. Превью универсального конкурса', path: '8-3-3-general-contest-preview' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 9: ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ (В РАЗРАБОТКЕ)
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 9: Дополнительные модули',
        path: '9-additional-modules',
        children: [
            { title: '9.1. Работа с сообщениями (в разработке)', path: '9-1-messages' },
            { title: '9.2. Статистика (в разработке)', path: '9-2-statistics' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // РАЗДЕЛ 10: FAQ И РЕШЕНИЕ ПРОБЛЕМ
    // ═══════════════════════════════════════════════════════════════════════════════
    {
        title: 'Раздел 10: FAQ и решение проблем',
        path: '10-faq',
        children: [
            { title: '10.1. Частые вопросы по постам', path: '10-1-posts-faq' },
            { title: '10.2. Частые вопросы по доступу', path: '10-2-access-faq' },
            { title: '10.3. Частые вопросы по автоматизациям', path: '10-3-automations-faq' },
            { title: '10.4. Частые вопросы по товарам', path: '10-4-products-faq' },
            { title: '10.5. Решение типичных проблем', path: '10-5-troubleshooting' },
        ]
    },
];