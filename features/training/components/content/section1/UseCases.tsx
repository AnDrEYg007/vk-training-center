import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Сценарии использования приложения
// =====================================================================
export const UseCases: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Планировщик контента — это внутренняя разработка нашего SMM-агентства, 
                созданная для оптимизации работы команды. Давайте разберём, 
                как приложение решает реальные задачи разных специалистов.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Важно:</strong> Все сценарии основаны на реальном опыте работы с клиентами. 
                    <span className="font-medium"> Приложение создано для решения наших конкретных проблем</span>, 
                    с которыми мы сталкиваемся ежедневно.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Сценарий 1: Работа с контентом */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий 1: Работа с контентом</h2>

            <div className="not-prose bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 my-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">Задачи</h3>
                        <p className="text-sm text-gray-700">
                            Работа с контентом, текстами, модерацией, конкурсами и товарами. 
                            Ведение 3-5 проектов одновременно, быстрое переключение между задачами.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="font-bold text-red-800 text-sm mb-2">❌ Как было БЕЗ приложения:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Заходили в каждое сообщество VK отдельно</li>
                            <li>• Копировали посты вручную через буфер обмена</li>
                            <li>• Модерировали предложку прямо в VK, вручную редактировали каждый пост</li>
                            <li>• Не видели отложенные и предложенные посты одновременно</li>
                            <li>• Забывали, в каком проекте что делали</li>
                            <li>• Теряли время на поиск товаров в каталоге VK</li>
                            <li>• Тратили 1-2 часа на публикацию одинакового поста в 5 проектах</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="font-bold text-green-800 text-sm mb-2">✅ Как стало С приложением:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Список всех проектов в сайдбаре, быстрое переключение</li>
                            <li>• Копирование постов встроенной кнопкой</li>
                            <li>• Просмотр предложенных постов в отдельной вкладке</li>
                            <li>• Календарь с drag-and-drop для планирования дат</li>
                            <li>• Встроенный модуль товаров с подключением к каталогу VK</li>
                            <li>• Работа с изображениями через drag-and-drop</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-100 mt-3">
                    <p className="font-medium text-blue-800 text-sm mb-1">💡 Главное преимущество:</p>
                    <p className="text-sm text-gray-600">
                        Не нужно заходить в каждое сообщество VK отдельно — 
                        все проекты управляются из одного интерфейса.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Сценарий 2: Настройка и интеграции */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий 2: Настройка и интеграции</h2>

            <div className="not-prose bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5 my-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-purple-900 mb-2">Задачи</h3>
                        <p className="text-sm text-gray-700">
                            Настройка интеграций с каталогами товаров, сторонними сервисами, 
                            подключение автоматизации историй, работа с VK API и расширение возможностей проектов.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="font-bold text-red-800 text-sm mb-2">❌ Как было БЕЗ приложения:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Настраивали каждую интеграцию вручную для каждого сообщества</li>
                            <li>• Не было единого места для управления токенами VK API</li>
                            <li>• Автоматизация историй требовала отдельных скриптов для каждого проекта</li>
                            <li>• Товары из каталога VK приходилось загружать через API вручную</li>
                            <li>• Не было контроля за правами доступа к токенам</li>
                            <li>• Факапы из-за человеческого фактора: неправильные токены, не те группы</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="font-bold text-green-800 text-sm mb-2">✅ Как стало С приложением:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Настройки проекта включают привязку токена VK API</li>
                            <li>• Модуль товаров синхронизируется с каталогом VK по настройке</li>
                            <li>• Можно подключить внешние интеграции (например, сервис автоматизации историй)</li>
                            <li>• Интерфейс показывает статус подключения к VK API</li>
                            <li>• Настройка прав пользователей на уровне проекта</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-100 mt-3">
                    <p className="font-medium text-purple-800 text-sm mb-1">💡 Главное преимущество:</p>
                    <p className="text-sm text-gray-600">
                        Настройка всех проектов происходит в одном месте, 
                        не нужно писать отдельные скрипты для каждого сообщества.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Сценарий 3: Контроль проектов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий 3: Контроль проектов</h2>

            <div className="not-prose bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-5 my-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-orange-900 mb-2">Задачи</h3>
                        <p className="text-sm text-gray-700">
                            Контроль команды, общение с заказчиками, 
                            ответственность за результаты проектов, предотвращение факапов и поиск способов расширения возможностей.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="font-bold text-red-800 text-sm mb-2">❌ Как было БЕЗ приложения:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Не видели, что делают специалисты — нужно было спрашивать в чатах</li>
                            <li>• Факапы обнаруживались поздно: уже опубликовали не туда или не то</li>
                            <li>• Заказчик спрашивал статус — приходилось собирать информацию вручную</li>
                            <li>• Сложно оценить объём работы по проекту</li>
                            <li>• Каждый новый специалист требовал долгого обучения</li>
                            <li>• Не было единого места для просмотра контента всех проектов</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="font-bold text-green-800 text-sm mb-2">✅ Как стало С приложением:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Список всех проектов в сайдбаре с цветовыми индикаторами статуса</li>
                            <li>• Счётчики постов показывают, где мало контента (красный = 0 постов)</li>
                            <li>• Можно открыть проект и сразу увидеть все отложенные посты</li>
                            <li>• Быстрая оценка: сколько запланировано, сколько опубликовано</li>
                            <li>• Новый специалист? Встроенный Центр обучения + назначение конкретных проектов</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-orange-100 mt-3">
                    <p className="font-medium text-orange-800 text-sm mb-1">💡 Главное преимущество:</p>
                    <p className="text-sm text-gray-600">
                        Видно общую картину по всем проектам: где всё хорошо (зелёный счётчик), 
                        а где пора работать над контентом (красный счётчик = 0 постов).
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Итоговая таблица */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные изменения в работе</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Задача</th>
                            <th className="border border-gray-200 px-3 py-2 text-left font-semibold">БЕЗ приложения</th>
                            <th className="border border-gray-200 px-3 py-2 text-left font-semibold">С приложением</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr>
                            <td className="border border-gray-200 px-3 py-2 font-medium">Переключение между проектами</td>
                            <td className="border border-gray-200 px-3 py-2 text-red-700">Открывать каждое сообщество VK отдельно</td>
                            <td className="border border-gray-200 px-3 py-2 text-green-700">Список в сайдбаре, клик для переключения</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-200 px-3 py-2 font-medium">Копирование постов</td>
                            <td className="border border-gray-200 px-3 py-2 text-red-700">Вручную через буфер обмена</td>
                            <td className="border border-gray-200 px-3 py-2 text-green-700">Встроенная кнопка копирования</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-3 py-2 font-medium">Работа с товарами</td>
                            <td className="border border-gray-200 px-3 py-2 text-red-700">Искать в каталоге VK каждый раз</td>
                            <td className="border border-gray-200 px-3 py-2 text-green-700">Встроенный модуль с синхронизацией каталога</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-200 px-3 py-2 font-medium">Просмотр статуса проектов</td>
                            <td className="border border-gray-200 px-3 py-2 text-red-700">Заходить в каждый, считать посты</td>
                            <td className="border border-gray-200 px-3 py-2 text-green-700">Счётчики в сайдбаре (зелёный/жёлтый/красный)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-3 py-2 font-medium">Планирование публикаций</td>
                            <td className="border border-gray-200 px-3 py-2 text-red-700">Через интерфейс VK по одному</td>
                            <td className="border border-gray-200 px-3 py-2 text-green-700">Календарь с drag-and-drop</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Ключевые преимущества */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ключевые преимущества для агентства</h2>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Централизация работы
                    </h3>
                    <p className="text-sm text-gray-700">
                        Все проекты в одном интерфейсе — не нужно переключаться между вкладками VK 
                        и держать десятки открытых окон браузера.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Видимость статуса
                    </h3>
                    <p className="text-sm text-gray-700">
                        Цветовые счётчики показывают, где всё в порядке (зелёный), 
                        где нужно добавить контент (жёлтый/красный).
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Планирование стало проще
                    </h3>
                    <p className="text-sm text-gray-700">
                        Календарь с drag-and-drop позволяет быстро перемещать посты между датами 
                        и видеть общую картину контент-плана.
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Встроенные интеграции
                    </h3>
                    <p className="text-sm text-gray-700">
                        Модуль товаров синхронизируется с VK, можно подключать внешние сервисы 
                        (например, автоматизацию историй) через настройки проекта.
                    </p>
                </div>
            </div>

            <NavigationButtons currentPath="1-1-3-use-cases" />
        </article>
    );
};
