// Этот файл определяет структуру иерархического оглавления для раздела обучения.
// Он основан на документе TRAINING_STRUCTURE.md.

export interface TocItem {
    title: string;
    path: string; // Уникальный путь/идентификатор
    children?: TocItem[];
}

export const toc: TocItem[] = [
    {
        title: 'Раздел 1: Введение и первые шаги',
        path: '1-intro',
        children: [
            { title: '1.1. Что такое "Планировщик контента"?', path: '1-1-what-is' },
            { title: '1.2. Знакомство с интерфейсом', path: '1-2-interface-overview' },
            { title: '1.3. Экран приветствия', path: '1-3-welcome-screen' },
            { title: '1.4. Ваш первый шаг: Проекты', path: '1-4-projects-first-step' },
        ]
    },
    {
        title: 'Раздел 2: Работа в календаре: от А до Я',
        path: '2-calendar',
        children: [
            {
                title: '2.1. Сайдбар: Навигация',
                path: '2-1-sidebar-nav',
                children: [
                    { title: '2.1.1. Элементы списка проектов', path: '2-1-1-project-list-items' },
                    { title: '2.1.2. Индикаторы состояния', path: '2-1-2-status-indicators' },
                    { title: '2.1.3. Фильтры и поиск', path: '2-1-3-filters-search' },
                ]
            },
            { title: '2.2. Шапка календаря: Инструменты', path: '2-2-calendar-header' },
            { 
                title: '2.3. Сетка календаря', 
                path: '2-3-calendar-grid',
                children: [
                    { title: '2.3.1. Дневные колонки', path: '2-3-1-day-columns'},
                    { title: '2.3.2. Взаимодействие с сеткой', path: '2-3-2-grid-interaction'},
                ]
            },
            {
                title: '2.4. Посты в календаре',
                path: '2-4-posts-in-calendar',
                children: [
                    { title: '2.4.1. Три типа постов: В чем разница?', path: '2-4-1-post-types' },
                    { title: '2.4.2. Жизненный цикл Системного поста', path: '2-4-2-system-post-lifecycle' },
                    { title: '2.4.3. Карточка поста: Детальный обзор', path: '2-4-3-postcard-deep-dive' },
                ]
            },
            {
                title: '2.5. Модальное окно поста: Полное руководство',
                path: '2-5-post-modal-guide',
                children: [
                    { title: '2.5.1. Общие механики', path: '2-5-1-general-mechanics' },
                    { title: '2.5.2. Способ публикации', path: '2-5-2-publication-method' },
                    { title: '2.5.3. Массовое и мультипроектное создание', path: '2-5-3-bulk-multi-project' },
                    { title: '2.5.4. Работа с текстом', path: '2-5-4-text-editing' },
                    { title: '2.5.5. Работа с медиа', path: '2-5-5-media-editing' },
                    { title: '2.5.6. Футер и кнопка сохранения', path: '2-5-6-modal-footer' },
                ]
            },
            { 
                title: '2.6. Основные операции с постами и заметками', 
                path: '2-6-basic-operations',
                 children: [
                    { title: '2.6.1-2.6.2. Создание и Редактирование', path: '2-6-1-create-edit' },
                    { title: '2.6.3. Копирование', path: '2-6-3-copying' },
                    { title: '2.6.4. Удаление', path: '2-6-4-deleting' },
                    { title: '2.6.5. Перемещение', path: '2-6-5-moving' },
                    { title: '2.6.6. Массовый выбор', path: '2-6-6-bulk-selection' },
                ]
            },
            { 
                title: '2.7. Модальные окна: Диалоги и подтверждения', 
                path: '2-7-modals-dialogs',
                children: [
                    { title: '2.7.1. Окна для Заметок', path: '2-7-1-note-modals' },
                    { title: '2.7.2. Окна для Публикаций', path: '2-7-2-publication-modals' },
                    { title: '2.7.3. Окна для Системных постов', path: '2-7-3-system-post-modals' },
                ]
            },
        ]
    },
    {
        title: 'Раздел 3: Продвинутые инструменты',
        path: '3-advanced-tools',
        children: [
            { title: '3.1. Работа с "Предложкой"', path: '3-1-suggested-posts' },
            { title: '3.2. Мощь переменных', path: '3-2-variables-power' },
            { title: '3.3. Организация с помощью тегов', path: '3-3-tags-organization' },
            { title: '3.4. Галерея изображений', path: '3-4-image-gallery' },
            { title: '3.5. Шаблоны AI-инструкций', path: '3-5-ai-presets' },
        ]
    },
    {
        title: 'Раздел 4: Администрирование',
        path: '4-administration',
        children: [
            { title: '4.1. Управление пользователями', path: '4-1-user-management' },
            { title: '4.2. Архив проектов', path: '4-2-project-archive' },
        ]
    },
    {
        title: 'Раздел 5: Часто задаваемые вопросы (FAQ)',
        path: '5-faq',
    },
];