import React from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Обзор сайдбара проектов
// =====================================================================
export const SidebarNavOverview: React.FC<ContentProps> = ({ title }) => {
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
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Из чего состоит сайдбар?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Сайдбар состоит из <strong>4 главных частей</strong>, каждая из которых выполняет свою функцию:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Часть 1 */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-blue-700">1️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Элементы списка проектов</h3>
                            <p className="text-sm text-gray-700">
                                Сам список сообществ — название, счётчик постов, индикаторы состояния, 
                                кнопки для обновления и настроек.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Из чего состоит один элемент проекта, как им управлять.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 2 */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-green-700">2️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Индикаторы состояния</h3>
                            <p className="text-sm text-gray-700">
                                Маленькие значки (⚠️ жёлтый треугольник, 🔵 синяя точка) 
                                которые сообщают о проблемах или обновлениях в проекте.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Что означает каждый значок и что делать когда он появляется.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 3 */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-purple-700">3️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Счётчики постов</h3>
                            <p className="text-sm text-gray-700">
                                Цифра справа от названия, которая показывает количество черновиков. 
                                Цвет счётчика говорит об уровне контента (красный = срочно, зелёный = отлично).
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Что означает каждый цвет и как использовать счётчики для контроля.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 4 */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-orange-700">4️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Фильтры и поиск</h3>
                            <p className="text-sm text-gray-700">
                                Инструменты для быстрого поиска нужного проекта — поиск по названию, 
                                фильтр по командам, фильтр по количеству постов.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Как быстро найти нужный проект среди множества сообществ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как это выглядит */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это выглядит?</h2>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Структура сайдбара проектов:</p>
                
                <div className="space-y-2">
                    {/* Шапка сайдбара */}
                    <div className="bg-white border border-gray-300 rounded p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-800">Проекты</p>
                            <div className="flex gap-1">
                                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded" title="Обновить">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <input type="text" placeholder="Поиск..." className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-2" disabled />
                        <div className="flex flex-wrap gap-1 mb-2">
                            <button className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full">All</button>
                            <button className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">Команда А</button>
                        </div>
                    </div>

                    {/* Список проектов */}
                    <div className="space-y-1 bg-white border border-gray-300 rounded p-2">
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="text-sm text-gray-800">🍕 Доставка</span>
                            <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">0</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-800">🎨 Дизайн</span>
                                <span className="text-sm">⚠️</span>
                            </div>
                            <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">3</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="text-sm text-gray-800">📚 Образование</span>
                            <span className="text-xs font-bold bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full">7</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    ℹ️ Это упрощённая схема. В реальном приложении будет больше проектов и полный функционал.
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
                Каждая из 4 частей сайдбара описана подробно в своём разделе:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <h3 className="font-bold text-indigo-900 mb-2">📌 Элементы списка проектов</h3>
                    <p className="text-sm text-gray-700">Из чего состоит один элемент: название, счётчик, кнопки.</p>
                </a>

                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <h3 className="font-bold text-indigo-900 mb-2">⚠️ Индикаторы состояния</h3>
                    <p className="text-sm text-gray-700">Что означают значки и когда они появляются.</p>
                </a>

                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <h3 className="font-bold text-indigo-900 mb-2">🔢 Счётчики постов</h3>
                    <p className="text-sm text-gray-700">Цвета и значения счётчиков, их смысл.</p>
                </a>

                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <h3 className="font-bold text-indigo-900 mb-2">🔍 Фильтры и поиск</h3>
                    <p className="text-sm text-gray-700">Как быстро найти нужный проект среди всех сообществ.</p>
                </a>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    💡 <strong>Совет:</strong> Начни с раздела "Элементы списка проектов" — это основа для понимания всего остального.
                </p>
            </div>
        </article>
    );
};
