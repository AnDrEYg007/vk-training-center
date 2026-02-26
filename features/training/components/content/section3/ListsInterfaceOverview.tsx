import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Компонент страницы 3.1.1: Интерфейс модуля
// =====================================================================
export const ListsInterfaceOverview: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Модуль "Списки" состоит из трёх основных секций, расположенных вертикально. Каждая секция выполняет свою роль и работает независимо, но все вместе создают единый рабочий интерфейс.
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Интерфейс модуля "Списки" — это система из трёх компонентов, которые управляют отображением данных о пользователях, постах и активностях сообщества:
            </p>

            <div className="not-prose my-8 space-y-4">
                {/* Секция 1: Навигация */}
                <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50/30">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                            1
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Навигация по спискам (ListsNavigation)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Карусель карточек списков с группировкой по табам. Здесь выбираете нужный список — например, "Подписчики" или "Лайкали".
                            </p>
                            <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 bg-white border border-indigo-200 rounded text-indigo-700">
                                    Табы групп
                                </span>
                                <span className="px-2 py-1 bg-white border border-indigo-200 rounded text-indigo-700">
                                    12 типов списков
                                </span>
                                <span className="px-2 py-1 bg-white border border-indigo-200 rounded text-indigo-700">
                                    Кнопка обновления
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Секция 2: Фильтры */}
                <div className="border border-purple-200 rounded-lg p-6 bg-purple-50/30">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                            2
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Панель фильтров (ListsFilters)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Закреплённая панель с поиском и фильтрами. При прокрутке таблицы вниз остаётся видимой сверху экрана, чтобы всегда можно было изменить условия отбора.
                            </p>
                            <div className="flex gap-2 text-xs flex-wrap">
                                <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                    Поиск
                                </span>
                                <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                    8 типов фильтров
                                </span>
                                <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                    Кнопка "Сбросить"
                                </span>
                                <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                    Счётчик результатов
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Секция 3: Таблица данных */}
                <div className="border border-emerald-200 rounded-lg p-6 bg-emerald-50/30">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                            3
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Отображение данных (ListsDataView)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Таблица с данными выбранного списка. В зависимости от типа списка показывает пользователей, посты или взаимодействия. Поддерживает подгрузку при прокрутке вниз.
                            </p>
                            <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-emerald-700">
                                    Таблица пользователей
                                </span>
                                <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-emerald-700">
                                    Таблица постов
                                </span>
                                <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-emerald-700">
                                    Таблица активностей
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как это работает? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работает?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Порядок работы</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Типичный сценарий использования модуля выглядит так:
            </p>

            <div className="not-prose my-6">
                <ol className="space-y-3">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            1
                        </span>
                        <span className="text-gray-700">
                            <strong>Выберите группу списков</strong> в табах навигации — например, "Подписчики"
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            2
                        </span>
                        <span className="text-gray-700">
                            <strong>Кликните на нужную карточку списка</strong> — она выделится, внизу загрузятся данные
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            3
                        </span>
                        <span className="text-gray-700">
                            <strong>Настройте фильтры</strong> в панели над таблицей — появится счётчик "Найдено: X"
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            4
                        </span>
                        <span className="text-gray-700">
                            <strong>Прокручивайте таблицу</strong> — панель фильтров останется видимой сверху
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            5
                        </span>
                        <span className="text-gray-700">
                            <strong>Обновите данные</strong> кнопкой на карточке — счётчик изменится после синхронизации с VK
                        </span>
                    </li>
                </ol>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Sticky Headers (закреплённые заголовки)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Интерфейс использует систему «липких» заголовков для удобства работы с длинными списками:
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex-shrink-0 px-2 py-1 bg-purple-600 text-white text-xs font-mono rounded">
                        z-index: 20
                    </div>
                    <span className="text-sm text-gray-700">
                        <strong>Панель фильтров</strong> — всегда видна при прокрутке таблицы
                    </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex-shrink-0 px-2 py-1 bg-emerald-600 text-white text-xs font-mono rounded">
                        z-index: 10
                    </div>
                    <span className="text-sm text-gray-700">
                        <strong>Заголовки таблицы</strong> — закреплены под панелью фильтров
                    </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 px-2 py-1 bg-gray-600 text-white text-xs font-mono rounded">
                        z-index: 0
                    </div>
                    <span className="text-sm text-gray-700">
                        <strong>Строки таблицы</strong> — прокручиваются под заголовками
                    </span>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Благодаря этой системе вы всегда видите, какие фильтры активны и по каким колонкам отсортированы данные, даже когда прокрутили таблицу на несколько экранов вниз.
            </p>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: работа через интерфейс VK</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Заходить в каждое сообщество отдельно</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Вручную выгружать списки подписчиков, лайкнувших, комментаторов</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Невозможно фильтровать по возрасту, полу, городу в одном месте</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Нет истории вступлений/выходов — только текущее состояние</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: централизованное управление</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>12 типов списков</strong> в одном интерфейсе — подписчики, активности, автоматизации</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Автоматическая синхронизация с VK</strong> — кнопка обновления загружает актуальные данные</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Мощная фильтрация</strong> — пол, возраст, город, онлайн, платформа, статус</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>История действий</strong> — видно кто вступил/вышел, когда лайкал/комментировал</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что дальше? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующих разделах мы подробно разберём каждую секцию интерфейса: карточки списков, систему фильтрации и работу с таблицами данных.
            </p>

            {/* Навигация */}
            <NavigationButtons currentPath="3-1-1-interface" />
        </article>
    );
};
