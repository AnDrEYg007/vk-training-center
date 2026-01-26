import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Знакомство с интерфейсом (обзорная страница для 1.2)
// =====================================================================
export const InterfaceOverview: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Интерфейс приложения построен как <strong>три колонки</strong>, каждая из которых выполняет свою функцию. 
                Это позволяет быстро переключаться между проектами и модулями без перезагрузки страницы.
            </p>

            <div className="not-prose bg-indigo-50 border-l-4 border-indigo-500 p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>Философия интерфейса:</strong> Всё важное на одном экране — никаких всплывающих окон для выбора проекта, 
                    всё управление доступно из боковых панелей.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Три основные части */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Три основные части интерфейса</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Экран делится на три зоны, каждая из которых отвечает за свой уровень навигации:
            </p>

            <div className="not-prose grid md:grid-cols-3 gap-5 my-8">
                {/* Главная панель */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow">
                            1
                        </div>
                        <h3 className="font-bold text-blue-900 text-xl">Главная панель</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        <strong>Вертикальная панель слева</strong> с иконками модулей (Контент-менеджмент, Автоматизации, Списки).
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Функция:</p>
                        <p className="text-sm text-gray-800">Переключение между <strong>модулями работы</strong> — контент, автоматизации, списки.</p>
                    </div>
                </div>

                {/* Сайдбар проектов */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-300 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow">
                            2
                        </div>
                        <h3 className="font-bold text-purple-900 text-xl">Сайдбар проектов</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        <strong>Список проектов</strong> с поиском, фильтрами и цветными счётчиками постов.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Функция:</p>
                        <p className="text-sm text-gray-800">Выбор <strong>сообщества VK</strong> для работы. Видно сразу, где мало постов (красный счётчик).</p>
                    </div>
                </div>

                {/* Рабочая область */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow">
                            3
                        </div>
                        <h3 className="font-bold text-green-900 text-xl">Рабочая область</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        <strong>Основная часть экрана справа</strong> — здесь отображается контент выбранного модуля и проекта.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Функция:</p>
                        <p className="text-sm text-gray-800">Отображение <strong>контента</strong> — календарь, посты, товары, автоматизации.</p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как это работает вместе */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работает вместе?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Три панели связаны между собой — изменение одной влияет на другие:
            </p>

            <div className="not-prose my-8">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                    <ol className="space-y-5">
                        <li className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">1</span>
                            <div>
                                <p className="font-bold text-gray-800 text-lg mb-1">Выбираете модуль на главной панели</p>
                                <p className="text-sm text-gray-600">
                                    Например, кликаете на иконку <strong>"Контент-менеджмент"</strong> → появляется список проектов.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">2</span>
                            <div>
                                <p className="font-bold text-gray-800 text-lg mb-1">Выбираете проект из сайдбара</p>
                                <p className="text-sm text-gray-600">
                                    Кликаете на карточку сообщества → загружаются его данные (посты, товары, счётчики).
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">3</span>
                            <div>
                                <p className="font-bold text-gray-800 text-lg mb-1">Работаете в рабочей области</p>
                                <p className="text-sm text-gray-600">
                                    Видите календарь постов, предложенные посты, товары — создаёте контент, публикуете, модерируете.
                                </p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="not-prose bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <p className="font-bold text-amber-900 mb-1">Важно понимать последовательность</p>
                        <p className="text-sm text-gray-700">
                            Сначала выбираете <strong>ЧТО</strong> делать (модуль), потом <strong>ГДЕ</strong> делать (проект), 
                            и только после этого видите контент. Это предотвращает путаницу с данными разных сообществ.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Переход к подразделам */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Изучите каждую часть подробно</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь, когда вы понимаете общую структуру, изучите каждую часть интерфейса отдельно:
            </p>

            <div className="not-prose my-8 space-y-4">
                <a href="#" className="block group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow group-hover:scale-110 transition-transform">
                            1
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-blue-900 text-lg mb-1">→ 1.2.1. Главная навигационная панель</p>
                            <p className="text-sm text-gray-600">
                                Левая панель с иконками модулей — как переключаться между разделами работы.
                            </p>
                        </div>
                    </div>
                </a>

                <a href="#" className="block group bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-5 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow group-hover:scale-110 transition-transform">
                            2
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-purple-900 text-lg mb-1">→ 1.2.2. Сайдбар проектов</p>
                            <p className="text-sm text-gray-600">
                                Список сообществ с поиском, фильтрами и цветными счётчиками — как выбирать проект.
                            </p>
                        </div>
                    </div>
                </a>

                <a href="#" className="block group bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow group-hover:scale-110 transition-transform">
                            3
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-green-900 text-lg mb-1">→ 1.2.3. Рабочая область</p>
                            <p className="text-sm text-gray-600">
                                Основная часть экрана — как выглядит календарь, предложенные посты, товары и другие разделы.
                            </p>
                        </div>
                    </div>
                </a>
            </div>

            <NavigationButtons currentPath="1-2-interface-overview" />
        </article>
    );
};
