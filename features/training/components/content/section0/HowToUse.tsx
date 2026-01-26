import React, { useState } from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';
import { MockSidebarList, MockProjectListItem } from '../SidebarMocks';

// =====================================================================
// Мок-компонент: Интерактивный Sidebar Header (из реального Sidebar.tsx)
// =====================================================================
const MockSidebarHeader: React.FC = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
                {/* Кнопка сворачивания */}
                <button 
                    title="Свернуть/Развернуть сайдбар" 
                    className="p-1.5 text-gray-500 rounded hover:bg-gray-100 hover:text-indigo-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* Кнопка обновления списка */}
                <button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="Обновить список проектов" 
                    className="p-1.5 text-gray-500 rounded hover:bg-gray-100 hover:text-indigo-600 disabled:opacity-50"
                >
                    {isRefreshing ? (
                        <div className="loader h-5 w-5 border-2 border-gray-300 border-t-indigo-500"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                    )}
                </button>
            </div>
            <div className="flex items-center gap-2">
                {/* Кнопка массового обновления */}
                <button 
                    title="Массовое обновление всех проектов" 
                    className="p-1.5 text-gray-500 rounded hover:bg-gray-100 hover:text-indigo-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </button>
                {/* Версия */}
                <span className="text-xs text-gray-400">v2.1.0</span>
            </div>
        </div>
    );
};

// =====================================================================
// Мок-компонент: Панель фильтров (из реального Sidebar.tsx)
// =====================================================================
const MockFilterPanel: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [showDisabled, setShowDisabled] = useState(true);

    const teams = ['All', 'Команда А', 'Команда Б', 'Внешние'];

    return (
        <div className="px-4 py-3 border-b border-gray-200 bg-white space-y-3">
            {/* Поиск */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Поиск проектов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            
            {/* Фильтр по команде */}
            <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {teams.map(team => (
                    <option key={team} value={team}>{team === 'All' ? 'Все команды' : team}</option>
                ))}
            </select>

            {/* Чекбокс "Показать отключенные" */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                    type="checkbox"
                    checked={showDisabled}
                    onChange={(e) => setShowDisabled(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Показать отключенные
            </label>
        </div>
    );
};

// =====================================================================
// Основной компонент: Как работать с Центром обучения
// =====================================================================
export const HowToUse: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Этот раздел поможет вам понять, как эффективно использовать Центр обучения. 
                Здесь мы покажем основные приёмы навигации и взаимодействия с документацией.
            </p>

            <hr className="!my-10" />

            {/* Структура страницы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура страницы</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждая страница Центра обучения разделена на две части:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Левая панель (оглавление)</strong> — дерево разделов для навигации</li>
                <li><strong>Правая область (контент)</strong> — содержимое выбранного раздела</li>
            </ul>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Это похоже на структуру основного приложения, где слева находится сайдбар с проектами, 
                а справа — рабочая область с календарём или списком постов.
            </p>

            <hr className="!my-10" />

            {/* Работа с оглавлением */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Работа с оглавлением</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Оглавление работает как <strong>аккордеон</strong> — вы можете разворачивать и сворачивать разделы:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Клик на заголовок раздела</strong> — разворачивает/сворачивает список подразделов</li>
                <li><strong>Клик на подраздел</strong> — загружает его содержимое в правую область</li>
                <li><strong>Активный подраздел</strong> — выделяется цветом и вертикальной полоской слева</li>
            </ul>

            <hr className="!my-10" />

            {/* Примеры из реального интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Примеры из реального интерфейса</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В документации мы показываем <strong>mock-версии</strong> реальных компонентов приложения. 
                Это упрощённые копии, которые выглядят и работают так же, как настоящие элементы интерфейса.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Шапка сайдбара проектов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот как выглядит верхняя часть сайдбара с кнопками управления:
            </p>

            <Sandbox 
                title="Шапка сайдбара" 
                description="Нажмите на кнопку обновления (вторая слева), чтобы увидеть индикатор загрузки."
            >
                <div className="w-72 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <MockSidebarHeader />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Панель фильтров</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Под шапкой расположена панель фильтров для поиска и фильтрации проектов:
            </p>

            <Sandbox 
                title="Панель фильтров" 
                description="Попробуйте ввести текст в поиск, выбрать команду из списка или переключить чекбокс."
            >
                <div className="w-72 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <MockFilterPanel />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Список проектов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Основная часть сайдбара — это список проектов с различными состояниями:
            </p>

            <Sandbox 
                title="Список проектов" 
                description="Здесь показаны проекты в разных состояниях: обычный, активный, при наведении, с ошибкой, с обновлением, загружающийся, отключённый."
            >
                <MockSidebarList />
            </Sandbox>

            <hr className="!my-10" />

            {/* Типы элементов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типы интерактивных элементов</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В песочницах вы можете встретить различные типы интерактивных элементов:
            </p>
            
            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    </div>
                    <div>
                        <h5 className="text-sm font-medium text-gray-800">Кликабельные элементы</h5>
                        <p className="text-xs text-gray-500">Кнопки, ссылки, переключатели — реагируют на клик</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h5 className="text-sm font-medium text-gray-800">Поля ввода</h5>
                        <p className="text-xs text-gray-500">Текстовые поля, выпадающие списки, чекбоксы</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                    </div>
                    <div>
                        <h5 className="text-sm font-medium text-gray-800">Drag-and-Drop</h5>
                        <p className="text-xs text-gray-500">Элементы, которые можно перетаскивать мышью</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <div>
                        <h5 className="text-sm font-medium text-gray-800">Hover-эффекты</h5>
                        <p className="text-xs text-gray-500">Элементы, меняющиеся при наведении курсора</p>
                    </div>
                </div>
            </div>

            {/* Подсказка */}
            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Подсказка:</strong> Все интерактивные элементы в песочницах работают 
                    изолированно — ваши действия не влияют на реальные данные приложения. 
                    Экспериментируйте свободно!
                </p>
            </div>

            <NavigationButtons currentPath="0-2-how-to-use" />
        </article>
    );
};
