import React, { useState } from 'react';
import { ContentProps } from '../shared';
import { Sandbox } from '../SharedComponents';

// =====================================================================
// Основной компонент: Обзор модуля "Контент-менеджмент"
// =====================================================================
export const ContentManagementOverview: React.FC<ContentProps> = ({ title }) => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'suggested' | 'products'>('schedule');
    const [automationsOpen, setAutomationsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string>('project-1');
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<'all' | 'В' | 'С' | 'А' | 'none'>('all');
    const [postFilter, setPostFilter] = useState<'all' | 'empty' | 'not_empty' | 'lt5' | '5-10' | 'gt10'>('all');

    // Список проектов с данными
    const projects = [
        { id: 'project-1', name: 'Изготовление автоключей | ...', team: 'В', posts: 0, hasWarning: true },
        { id: 'project-2', name: 'Тестовое сообщество', team: 'С', posts: 0, hasWarning: false },
        { id: 'project-3', name: 'Фиолето Суши | Доставка ро...', team: 'В', posts: 0, hasWarning: false },
    ];
    
    // Функция для определения цвета badge счётчика
    const getPostCountColorClasses = (count: number) => {
        if (count === 0) return 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium';
        if (count > 0 && count < 5) return 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium';
        if (count > 10) return 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium';
        return 'bg-gray-300 text-gray-700';
    };

    // Фильтрация проектов
    const filteredProjects = projects.filter(p => {
        // Поиск
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        // Фильтр команд
        if (teamFilter !== 'all') {
            if (teamFilter === 'none' && p.team) return false;
            if (teamFilter !== 'none' && p.team !== teamFilter) return false;
        }
        
        // Фильтр постов
        if (postFilter === 'empty' && p.posts !== 0) return false;
        if (postFilter === 'not_empty' && p.posts === 0) return false;
        if (postFilter === 'lt5' && !(p.posts > 0 && p.posts < 5)) return false;
        if (postFilter === '5-10' && !(p.posts >= 5 && p.posts <= 10)) return false;
        if (postFilter === 'gt10' && p.posts <= 10) return false;
        
        return true;
    });

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Модуль "Контент-менеджмент"</strong> — это центральная часть планировщика, 
                где ты работаешь с постами для сообществ ВКонтакте. Здесь находятся все инструменты 
                для планирования, создания и управления контентом.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Модуль объединяет три основных типа контента 
                    (отложенные посты, предложенные посты, товары) плюс инструменты автоматизации в одном удобном интерфейсе. 
                    Выбрал проект в сайдбаре → переключил вкладку → работаешь с нужным типом контента.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Основные разделы модуля */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные разделы модуля</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                Модуль состоит из <strong>трёх основных вкладок</strong> для работы с контентом и раздела <strong>«Автоматизации»</strong> с дополнительными инструментами:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Вкладка 1: Отложенные */}
                <div className="border-l-4 border-indigo-400 pl-4 py-3 bg-indigo-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 mb-2">Отложенные</h3>
                            <p className="text-sm text-gray-700">
                                Календарь с постами, которые <strong>запланированы к публикации</strong>. 
                                Здесь ты создаёшь системные черновики, отправляешь их в VK как отложенные посты, 
                                видишь уже опубликованные записи и планируешь контент на неделю вперёд.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Основной инструмент:</strong> Календарь с сеткой по дням и часам.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Вкладка 2: Предложенные */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Предложенные</h3>
                            <p className="text-sm text-gray-700">
                                Посты, которые <strong>предложили участники сообщества</strong> (предложка). 
                                Отображаются в виде списка карточек. Для каждого поста можно использовать AI-редактор, 
                                который автоматически исправляет ошибки и подготавливает текст к публикации.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Основной инструмент:</strong> Список карточек постов с AI-редактором.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Вкладка 3: Товары */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Товары</h3>
                            <p className="text-sm text-gray-700">
                                Управление товарами в сообществе. Табличный интерфейс со списком всех товаров, 
                                их характеристиками и ценами. Можно редактировать описания, цены (включая старую цену для отображения скидки), 
                                загружать новые фотографии, указывать SKU прямо в таблице.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Основной инструмент:</strong> Редактируемая таблица товаров с колонками: Фото, New Фото, Название, Описание, Цена, Старая цена, SKU.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Секция 4: Автоматизации */}
                <div className="border-l-4 border-amber-400 pl-4 py-3 bg-amber-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">Автоматизации</h3>
                            <p className="text-sm text-gray-700">
                                Раздел с инструментами автоматизации работы сообщества: <strong>посты в истории</strong> (автоматическая публикация постов как сториз), 
                                <strong>конкурсы отзывов</strong>, <strong>дроп промокодов</strong>, <strong>AI-генерация постов</strong> и другие автоматизированные механики.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Основной инструмент:</strong> Раскрывающийся список с 7 подразделами автоматизаций.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Структура интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выглядит интерфейс?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Модуль "Контент-менеджмент" имеет <strong>трёхколоночную структуру</strong>:
            </p>

            <Sandbox
                title="Структура модуля: 3 колонки"
                description="Визуальное представление расположения элементов в модуле Контент-менеджмент. Нажмите на вкладки в выдвижном меню главной панели, чтобы увидеть как меняется содержимое рабочей области."
                instructions={[
                    'Нажмите на <strong>"Отложенные"</strong>, <strong>"Предложенные"</strong> или <strong>"Товары"</strong> в выдвижном меню — содержимое рабочей области изменится',
                    'Нажмите на <strong>"Автоматизации"</strong> — раскроется список из 7 подразделов'
                ]}
            >
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Структура модуля (3 колонки):</p>
                
                <div className="flex gap-2" style={{ height: '500px' }}>
                    {/* Колонка 1: Главная панель с выдвижным меню */}
                    <div className="flex bg-white border-r border-gray-200 rounded">
                        {/* Иконки модулей */}
                        <div className="w-16 border-r border-gray-200 flex flex-col items-center justify-between py-4">
                            <div className="space-y-4">
                                {/* Контент-менеджмент (активная) */}
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {/* Списки */}
                                <div className="w-12 h-12 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                {/* Сообщения */}
                                <div className="w-12 h-12 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                            {/* Настройки внизу */}
                            <div className="w-12 h-12 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Выдвижное меню с вкладками */}
                        <div className="w-40 flex flex-col py-4 px-2">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Контент</div>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setActiveTab('schedule')}
                                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeTab === 'schedule' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Отложенные
                            </button>
                            <button 
                                onClick={() => setActiveTab('suggested')}
                                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeTab === 'suggested' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Предложенные
                            </button>
                            <button 
                                onClick={() => setActiveTab('products')}
                                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Товары
                            </button>
                            <button 
                                onClick={() => setAutomationsOpen(!automationsOpen)}
                                className="w-full text-left p-2 rounded-md text-sm transition-colors text-gray-500 hover:bg-gray-100 flex items-center justify-between"
                            >
                                <span>Автоматизации</span>
                                <svg className={`w-4 h-4 transition-transform ${automationsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {automationsOpen && (
                                <div className="pl-4 space-y-1 mt-1">
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">Посты в истории</div>
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">Конкурс отзывов</div>
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">Дроп промокодов</div>
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">Конкурсы</div>
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">AI посты</div>
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">С др</div>
                                    <div className="text-xs text-gray-600 p-1.5 hover:bg-gray-50 rounded cursor-pointer">Конкурс Актив</div>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>

                    {/* Колонка 2: Список проектов */}
                    <div className="w-72 bg-white border-r border-gray-200 rounded flex flex-col">
                        {/* Заголовок Проекты */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Проекты</h3>
                            <div className="flex gap-1">
                                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800" title="Глобальное обновление">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                    </svg>
                                </button>
                                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800" title="Обновить список">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Поиск */}
                        <div className="p-3">
                            <input 
                                type="text" 
                                placeholder="Поиск по названию..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Фильтры КОМАНДЫ */}
                        <div className="px-3 pb-4 space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Команды</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    <button 
                                        onClick={() => setTeamFilter('all')}
                                        className={`px-2.5 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 font-medium transition-all ${teamFilter === 'all' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        Все
                                    </button>
                                    <button 
                                        onClick={() => setTeamFilter('В')}
                                        className={`px-2.5 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 font-medium transition-all ${teamFilter === 'В' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        В
                                    </button>
                                    <button 
                                        onClick={() => setTeamFilter('С')}
                                        className={`px-2.5 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 font-medium transition-all ${teamFilter === 'С' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        С
                                    </button>
                                    <button 
                                        onClick={() => setTeamFilter('А')}
                                        className={`px-2.5 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 font-medium transition-all ${teamFilter === 'А' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        А
                                    </button>
                                    <button 
                                        onClick={() => setTeamFilter('none')}
                                        className={`px-2.5 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 font-medium transition-all ${teamFilter === 'none' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        Без команды
                                    </button>
                                </div>
                            </div>

                        {/* Фильтры ОТЛОЖЕННЫЕ ПОСТЫ */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Отложенные посты</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    <button 
                                        onClick={() => setPostFilter('all')}
                                        className={`px-2.5 py-1 text-xs bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 font-medium transition-all ${postFilter === 'all' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        Все
                                    </button>
                                    <button 
                                        onClick={() => setPostFilter('empty')}
                                        className={`px-2.5 py-1 text-xs bg-gradient-to-t from-gray-300 to-red-200 text-red-900 rounded-full hover:to-red-300 font-medium transition-all ${postFilter === 'empty' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        Нет постов
                                    </button>
                                    <button 
                                        onClick={() => setPostFilter('not_empty')}
                                        className={`px-2.5 py-1 text-xs bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900 rounded-full hover:to-blue-300 font-medium transition-all ${postFilter === 'not_empty' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        Есть посты
                                    </button>
                                    <button 
                                        onClick={() => setPostFilter('lt5')}
                                        className={`px-2.5 py-1 text-xs bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 rounded-full hover:to-orange-300 font-medium transition-all ${postFilter === 'lt5' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        &lt; 5
                                    </button>
                                    <button 
                                        onClick={() => setPostFilter('5-10')}
                                        className={`px-2.5 py-1 text-xs bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 font-medium transition-all ${postFilter === '5-10' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        5-10
                                    </button>
                                    <button 
                                        onClick={() => setPostFilter('gt10')}
                                        className={`px-2.5 py-1 text-xs bg-gradient-to-t from-gray-300 to-green-200 text-green-900 rounded-full hover:to-green-300 font-medium transition-all ${postFilter === 'gt10' ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        &gt; 10
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Список проектов */}
                        <div className="flex-1 overflow-auto">
                            <div className="p-2 space-y-1">
                                {filteredProjects.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        <p>Проекты не найдены</p>
                                        <p className="text-xs mt-1">Попробуйте изменить фильтры</p>
                                    </div>
                                ) : (
                                    filteredProjects.map(project => (
                                        <div 
                                            key={project.id}
                                            onClick={() => setSelectedProject(project.id)}
                                            className={`rounded p-2 flex items-center justify-between text-sm cursor-pointer transition-all ${
                                                selectedProject === project.id 
                                                    ? 'bg-gray-100 hover:bg-gray-200' 
                                                    : 'bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className={`truncate ${selectedProject === project.id ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>
                                                {project.name}
                                            </span>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {project.hasWarning && (
                                                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getPostCountColorClasses(project.posts)}`}>{project.posts}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Колонка 3: Рабочая область */}
                    <div className="flex-1 bg-white border border-gray-300 rounded p-4 overflow-auto">
                        {activeTab === 'schedule' && (
                            <div>
                                <div className="text-sm font-semibold text-gray-700 mb-3">Календарь отложенных постов</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* День 1 - пусто */}
                                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                                        <div className="text-center mb-2">
                                            <p className="font-bold text-xs text-gray-700">Пн</p>
                                            <p className="text-gray-500 text-xs">03.02</p>
                                        </div>
                                        <div className="border-2 border-dashed border-gray-300 rounded p-2 text-center">
                                            <svg className="w-4 h-4 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                    </div>
                                    
                                    {/* День 2 - с постом */}
                                    <div className="border border-gray-200 rounded p-2 bg-white">
                                        <div className="text-center mb-2">
                                            <p className="font-bold text-xs text-indigo-600">Вт</p>
                                            <p className="text-gray-500 text-xs font-semibold">04.02</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded p-2 shadow-sm">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">14:30</p>
                                            <div className="aspect-video bg-gray-200 rounded mb-1">
                                                <img src="https://picsum.photos/seed/demo1/200/113" alt="" className="w-full h-full object-cover rounded" />
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2">Новое поступление товаров! 🎉</p>
                                        </div>
                                    </div>

                                    {/* День 3 - с 2 постами */}
                                    <div className="border border-gray-200 rounded p-2 bg-white">
                                        <div className="text-center mb-2">
                                            <p className="font-bold text-xs text-gray-700">Ср</p>
                                            <p className="text-gray-500 text-xs">05.02</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="bg-white border border-gray-200 rounded p-1.5 shadow-sm">
                                                <p className="text-xs font-semibold text-gray-500">10:00</p>
                                                <p className="text-xs text-gray-600 line-clamp-1">Утренний пост</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded p-1.5 shadow-sm">
                                                <p className="text-xs font-semibold text-gray-500">18:00</p>
                                                <p className="text-xs text-gray-600 line-clamp-1">Вечерний пост</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'suggested' && (
                            <div className="animate-fadeIn">
                                <div className="text-sm font-semibold text-gray-700 mb-3">Список предложенных постов</div>
                                <div className="space-y-3">
                                    {/* Пост 1 */}
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <a href="#" className="text-xs font-semibold text-gray-800 hover:text-indigo-600 truncate pr-2">
                                                    Анна Белова
                                                </a>
                                                <span className="text-xs text-gray-500 flex-shrink-0">
                                                    2 фев 2026
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3">Отличный магазин! Заказывала уже несколько раз, всегда довольна качеством 😊</p>
                                            
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <a href="#" className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-indigo-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    Посмотреть на VK
                                                </a>
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                                    Редактор AI
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Пост 2 с изображениями */}
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex gap-1 p-1">
                                            <div className="w-1/2 aspect-video bg-gray-200 rounded overflow-hidden">
                                                <img src="https://picsum.photos/seed/sug1/400/225" alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="w-1/2 aspect-video bg-gray-200 rounded overflow-hidden">
                                                <img src="https://picsum.photos/seed/sug2/400/225" alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <a href="#" className="text-xs font-semibold text-gray-800 hover:text-indigo-600 truncate pr-2">
                                                    Иван Смирнов
                                                </a>
                                                <span className="text-xs text-gray-500 flex-shrink-0">
                                                    3 фев 2026
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3">Фото с вчерашнего мероприятия! 🎊</p>
                                            
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <a href="#" className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-indigo-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    Посмотреть на VK
                                                </a>
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                                    Редактор AI
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'products' && (
                            <div className="animate-fadeIn">
                                <div className="text-sm font-semibold text-gray-700 mb-3">Таблица товаров</div>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                                            <tr>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Фото</th>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">New Фото</th>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Название</th>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Старая цена</th>
                                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            <tr className="border-t border-gray-200 hover:bg-gray-50">
                                                <td className="px-2 py-2 align-top">
                                                    <img src="https://picsum.photos/seed/prod1/40/40" alt="" className="w-10 h-10 rounded object-cover" />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <div className="text-xs text-gray-400 italic">—</div>
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="text" value="Товар 1" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-800" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <textarea rows={2} value="Описание товара" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs resize-none" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="number" value="1200" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-800" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="number" value="1500" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-500 line-through" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="text" value="SKU001" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700" readOnly />
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200 hover:bg-gray-50">
                                                <td className="px-2 py-2 align-top">
                                                    <img src="https://picsum.photos/seed/prod2/40/40" alt="" className="w-10 h-10 rounded object-cover" />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <div className="w-10 h-10 rounded border-2 border-dashed border-indigo-300 bg-indigo-50 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="text" value="Товар 2" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-800" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <textarea rows={2} value="Отличное качество" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs resize-none" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="number" value="890" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-800" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <div className="text-xs text-gray-400 italic">—</div>
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="text" value="SKU002" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700" readOnly />
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200 hover:bg-gray-50">
                                                <td className="px-2 py-2 align-top">
                                                    <img src="https://picsum.photos/seed/prod3/40/40" alt="" className="w-10 h-10 rounded object-cover" />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <div className="text-xs text-gray-400 italic">—</div>
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="text" value="Товар 3" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-800" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <textarea rows={2} value="Новинка сезона" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs resize-none" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="number" value="2500" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-800" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="number" value="3000" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-500 line-through" readOnly />
                                                </td>
                                                <td className="px-2 py-2 align-top">
                                                    <input type="text" value="SKU003" className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700" readOnly />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                `}</style>
            </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Основные компоненты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные компоненты модуля</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Независимо от выбранной вкладки, модуль состоит из <strong>двух главных частей</strong>:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-blue-900">1. Сайдбар проектов (вторая колонка)</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Список всех сообществ ВКонтакте с фильтрами, поиском и счётчиками. 
                            Одинаковый для всех вкладок, но счётчики показывают разные данные: 
                            для "Отложенные" — количество черновиков, для "Предложенные" — количество предложенных постов, 
                            для "Товары" счётчиков нет.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">2. Рабочая область (третья колонка)</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Место, где ты работаешь с контентом. Для "Отложенные" — 
                            календарь с постами, для "Предложенные" — список карточек с предложенными постами, 
                            для "Товары" — таблица со списком товаров.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что ты сможешь делать */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что ты сможешь делать?</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-indigo-900">Планировать публикации</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Создавать системные черновики, отправлять их в VK как отложенные посты, 
                            видеть всё расписание на неделю вперёд.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-purple-900">Работать с предложенными постами</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Просматривать посты от участников сообщества и использовать AI-редактор для подготовки текста к публикации.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Управлять товарами</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Редактировать товары сообщества: названия, описания, цены (включая старую цену для скидок), категории, SKU, загружать новые фотографии.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-orange-900">Быстро переключаться между проектами</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Использовать сайдбар для мгновенного переключения между разными сообществами.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Навигация по подразделам */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура раздела</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел "Контент-менеджмент" подробно описан в следующих подразделах:
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">2.1. Вкладка "Отложенные" (Календарь)</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Подробное описание работы с календарём отложенных постов: сайдбар проектов, 
                        шапка календаря, сетка с постами, заметки, истории.
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>→ 2.1.1. Сайдбар проектов</p>
                        <p>→ 2.1.2. Шапка календаря</p>
                        <p>→ 2.1.3. Сетка календаря</p>
                        <p>→ 2.1.4. Посты в календаре</p>
                        <p>→ 2.1.5. Заметки</p>
                        <p>→ 2.1.6. Истории (Stories)</p>
                        <p>→ 2.1.7. Модальное окно поста</p>
                        <p>→ 2.1.8. Операции с постами</p>
                    </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-purple-900 mb-2">2.2. Вкладка "Предложенные"</h3>
                    <p className="text-sm text-gray-700">
                        Работа с постами, которые предложили участники сообщества. Интерфейс представляет собой 
                        список карточек с текстом постов и кнопками действий (одобрить, отклонить).
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-green-900 mb-2">2.3. Вкладка "Товары"</h3>
                    <p className="text-sm text-gray-700">
                        Управление товарами в сообществе через табличный интерфейс.
                    </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-amber-900 mb-2">2.4. Автоматизации</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Инструменты для автоматизации работы с контентом: автоматическая публикация постов в истории, 
                        конкурсы отзывов с автоматической модерацией, дроп промокодов, AI-генерация контента и другие автоматизированные процессы.
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>→ 2.4.1. Посты в истории</p>
                        <p>→ 2.4.2. Конкурс отзывов</p>
                        <p>→ 2.4.3. Дроп промокодов</p>
                        <p>→ + другие автоматизации</p>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Совет:</strong> Начни с раздела 2.1 "Вкладка Отложенные" — это самая используемая 
                    часть модуля, где ты будешь проводить больше всего времени.
                </p>
            </div>
        </article>
    );
};
