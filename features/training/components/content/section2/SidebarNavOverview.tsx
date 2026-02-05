import React, { useState } from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Обзор сайдбара проектов
// =====================================================================
export const SidebarNavOverview: React.FC<ContentProps> = ({ title }) => {
    // State для интерактивности макета
    const [activeTeam, setActiveTeam] = useState('Все');
    const [activeContentFilter, setActiveContentFilter] = useState('Все');
    const [showDisabled, setShowDisabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Сайдбар проектов</strong> — это левая панель в модуле "Контент-менеджмент", 
                где находятся <strong>все твои сообщества ВКонтакте</strong>. 
                Это не просто список — это мощный инструмент управления, который показывает много важной информации одновременно.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Сайдбар — это твой "пульт управления" проектами. 
                    Одним взглядом видишь состояние всех сообществ и быстро переключаешься между ними.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Из чего состоит */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">Из чего состоит сайдбар?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                Сайдбар — это <strong>сложная структура из 7 основных блоков</strong>, каждый из которых выполняет свою функцию. 
                Некоторые из них очевидны (список проектов), другие скрыты до поры (отключённые проекты), 
                а третьи всегда на виду (блок пользователя внизу).
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Часть 1 */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-blue-700">1</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Элементы списка проектов</h3>
                            <p className="text-sm text-gray-700">
                                Сам список сообществ — название, счётчик постов, индикаторы состояния, 
                                кнопки для обновления и настроек. <strong>При наведении курсора</strong> на проект 
                                слева появляются кнопки управления.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Из чего состоит один элемент проекта, как им управлять.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 2 */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-green-700">2</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Индикаторы состояния</h3>
                            <p className="text-sm text-gray-700">
                                Маленькие значки, которые сообщают о проблемах или обновлениях:
                            </p>
                            <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                <li className="flex items-center gap-2">
                                    <svg className="inline-block w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                    <span>Янтарный треугольник — ошибка доступа к проекту</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></span>
                                    <span>Синяя мигающая точка — доступны новые данные для загрузки</span>
                                </li>
                                <li className="text-xs text-gray-600 mt-1">
                                    <em>+ Специальные индикаторы для конкурсов (на соответствующей вкладке)</em>
                                </li>
                            </ul>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Что означает каждый значок и что делать когда он появляется.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 3 */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-purple-700">3</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Счётчики постов</h3>
                            <p className="text-sm text-gray-700">
                                Цифра справа от названия, которая показывает количество черновиков. 
                                Цвет счётчика говорит об уровне контента (красный = срочно, зелёный = отлично).
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Что означает каждый цвет и как использовать счётчики для контроля.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 4 */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-orange-700">4</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Фильтры и поиск</h3>
                            <p className="text-sm text-gray-700">
                                Инструменты для быстрого поиска нужного проекта — поиск по названию, 
                                фильтр по командам, фильтр по количеству постов 
                                (показывается только на вкладках "Отложенные" и "Предложенные").
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Как быстро найти нужный проект среди множества сообществ.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 5 - НОВОЕ */}
                <div className="border-l-4 border-indigo-400 pl-4 py-3 bg-indigo-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-indigo-700">5</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 mb-2">Глобальное массовое обновление</h3>
                            <p className="text-sm text-gray-700">
                                Специальная кнопка в шапке рядом с заголовком "Проекты", которая запускает 
                                <strong> обновление данных для ВСЕХ проектов одновременно</strong>. 
                                Показывает процент выполнения и работает в фоне.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Когда использовать глобальное обновление, почему оно медленное, 
                                как следить за прогрессом.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 6 - НОВОЕ */}
                <div className="border-l-4 border-gray-400 pl-4 py-3 bg-gray-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-gray-700">6</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Секция отключённых проектов</h3>
                            <p className="text-sm text-gray-700">
                                Коллапсируемая секция под списком активных проектов для временно неактивных сообществ. 
                                По умолчанию развёрнута, сворачивается кнопкой с иконкой глаза.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Зачем отключать проекты, как это ускоряет работу, 
                                как управлять отключёнными.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 7 - НОВОЕ */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-purple-700">7</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Блок текущего пользователя</h3>
                            <p className="text-sm text-gray-700">
                                Информационный блок в самом низу сайдбара ("прибит" к низу, не скроллится). 
                                Показывает аватар, имя, роль (или иконку VK для пользователей ВКонтакте), 
                                кнопку выхода и версию бэкенда.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                <strong>Что узнаешь:</strong> Какие роли существуют, как работает интеграция с VK, 
                                как быстро выйти из системы, зачем нужна версия бэкенда.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как это выглядит */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это выглядит?</h2>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Структура сайдбара:</strong> Ниже показана точная структура всех элементов. 
                    Данные (названия проектов, имя пользователя) загружаются из базы данных при работе приложения.
                    <br /><br />
                    <strong>Важно:</strong> Фильтры по количеству постов показаны здесь для примера, но в реальном приложении 
                    они появляются <strong>только на вкладках "Отложенные" и "Предложенные"</strong>. 
                    На вкладке "Товары" этих фильтров нет.
                </p>
            </div>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Полная структура сайдбара проектов:</p>
                
                <div className="space-y-2">
                    {/* Шапка сайдбара */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Проекты</h2>
                        <div className="flex items-center gap-1">
                            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800" title="Глобальное обновление всех проектов">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800" title="Обновить список проектов">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Фильтры и поиск */}
                    <div className="p-3 space-y-4 border-b border-gray-200">
                        <input 
                            type="text" 
                            placeholder="Поиск по названию..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Команды <span className="text-[10px] normal-case font-normal text-gray-400">(список зависит от ваших проектов)</span></h4>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                <button 
                                    onClick={() => setActiveTeam('Все')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${activeTeam === 'Все' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    Все
                                </button>
                                <button 
                                    onClick={() => setActiveTeam('В')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${activeTeam === 'В' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    В
                                </button>
                                <button 
                                    onClick={() => setActiveTeam('С')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${activeTeam === 'С' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    С
                                </button>
                                <button 
                                    onClick={() => setActiveTeam('A')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${activeTeam === 'A' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    A
                                </button>
                                <button 
                                    onClick={() => setActiveTeam('Без команды')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${activeTeam === 'Без команды' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    Без команды
                                </button>
                            </div>
                        </div>

                        {/* Условные фильтры контента (показываются только на вкладках Отложенные/Предложенные) */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Отложенные посты <span className="text-[10px] normal-case font-normal text-gray-400">(или "Предложенные" на другой вкладке)</span></h4>
                        <div className="flex flex-wrap gap-1.5">
                                <button 
                                    onClick={() => setActiveContentFilter('Все')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gray-300 text-gray-800 transition-colors ${activeContentFilter === 'Все' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    Все
                                </button>
                                <button 
                                    onClick={() => setActiveContentFilter('Нет постов')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-t from-gray-300 to-red-200 text-red-900 transition-colors ${activeContentFilter === 'Нет постов' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    Нет постов
                                </button>
                                <button 
                                    onClick={() => setActiveContentFilter('Есть посты')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900 transition-colors ${activeContentFilter === 'Есть посты' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    Есть посты
                                </button>
                                <button 
                                    onClick={() => setActiveContentFilter('< 5')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 transition-colors ${activeContentFilter === '< 5' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    &lt; 5
                                </button>
                                <button 
                                    onClick={() => setActiveContentFilter('5-10')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gray-300 text-gray-800 transition-colors ${activeContentFilter === '5-10' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    5-10
                                </button>
                                <button 
                                    onClick={() => setActiveContentFilter('> 10')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-t from-gray-300 to-green-200 text-green-900 transition-colors ${activeContentFilter === '> 10' ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    &gt; 10
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Список проектов */}
                    <div className="bg-white p-2">
                        <p className="text-xs text-gray-500 italic px-2">Здесь отображаются все активные проекты...</p>
                    </div>

                    {/* Отключённые проекты */}
                    <div className="flex justify-between items-center px-4 pt-4 pb-2 mt-2 border-t border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Отключенные</h4>
                        <button 
                            onClick={() => setShowDisabled(!showDisabled)}
                            className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-700" 
                            title={showDisabled ? "Скрыть" : "Показать"}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {showDisabled ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                    {showDisabled && (
                        <div className="px-4">
                            <p className="text-xs text-gray-500 italic">Список отключенных проектов (если есть)</p>
                        </div>
                    )}

                    {/* Блок пользователя */}
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-indigo-600 text-sm font-medium">A</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">admin</p>
                                <p className="text-xs text-gray-500">Администратор</p>
                            </div>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Выйти">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                        {/* Версия бэкенда */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-[10px] text-gray-400 font-mono truncate" title="Backend: v1.0.46_fix_community_token">
                                Backend: v1.0.46_fix_community_token
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    <strong>Важно:</strong> Блок пользователя внизу не скроллится — он всегда виден. 
                    Список проектов можно прокручивать, а блок с именем прибит к низу.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Типичные задачи */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что ты сможешь делать?</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Переключаться между проектами</p>
                        <p className="text-sm text-gray-700 mt-1">Кликнуть на проект и сразу увидеть его расписание.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-blue-900">Видеть состояние всех проектов</p>
                        <p className="text-sm text-gray-700 mt-1">По счётчикам и индикаторам видишь, что происходит в каждом сообществе.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-purple-900">Быстро находить нужный проект</p>
                        <p className="text-sm text-gray-700 mt-1">Использовать поиск и фильтры вместо прокрутки по списку.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-orange-900">Обновлять данные и настраивать проекты</p>
                        <p className="text-sm text-gray-700 mt-1">Кнопки для обновления и доступа к настройкам находятся прямо здесь.</p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Навигация по подразделам */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Подробные разделы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Основные 4 части сайдбара (проекты, индикаторы, счётчики, фильтры) описаны подробно в своих разделах. 
                Остальные 3 части (глобальное обновление, отключённые проекты, блок пользователя) работают автоматически:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">Элементы списка проектов</h3>
                    <p className="text-sm text-gray-700">Из чего состоит один элемент: название, счётчик, кнопки.</p>
                    <p className="text-xs text-gray-500 mt-2 italic">→ Раздел 2.1.2</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">Индикаторы состояния</h3>
                    <p className="text-sm text-gray-700">Что означают значки и когда они появляются.</p>
                    <p className="text-xs text-gray-500 mt-2 italic">→ Раздел 2.1.3</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">Счётчики постов</h3>
                    <p className="text-sm text-gray-700">Цвета и значения счётчиков, их смысл.</p>
                    <p className="text-xs text-gray-500 mt-2 italic">→ Раздел 2.1.4</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <h3 className="font-bold text-indigo-900 mb-2">Фильтры и поиск</h3>
                    <p className="text-sm text-gray-700">Как быстро найти нужный проект среди всех сообществ.</p>
                    <p className="text-xs text-gray-500 mt-2 italic">→ Раздел 2.1.5</p>
                </div>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Совет:</strong> Начни с раздела "Элементы списка проектов" — это основа для понимания всего остального.
                </p>
            </div>
        </article>
    );
};
