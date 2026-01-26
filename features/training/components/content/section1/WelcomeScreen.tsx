import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Экран приветствия
// =====================================================================
export const WelcomeScreenComponent: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Экран приветствия</strong> (Welcome Screen) — это то, что вы видите в рабочей области, 
                когда <strong>ни один проект не выбран</strong>. Это не ошибка и не пустой экран — 
                это сознательное состояние приложения, которое подсказывает, что делать дальше.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Вместо пустоты или загрузки несуществующих данных 
                    приложение явно показывает: "Выберите проект, чтобы начать работу".
                </p>
            </div>

            <hr className="!my-10" />

            {/* Когда появляется */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда появляется экран приветствия?</h2>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">Первый вход</h3>
                            <p className="text-sm text-gray-700">
                                Когда вы только зашли в приложение и ещё не выбрали ни один проект.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-green-900 mb-1">Переключение модулей</h3>
                            <p className="text-sm text-gray-700">
                                Когда вы переходите в модуль, где проект не выбран (например, в "Списки").
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-1">После удаления проекта</h3>
                            <p className="text-sm text-gray-700">
                                Если был выбран проект, который затем удалили — приложение вернётся к экрану приветствия.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-1">Сброс выбора</h3>
                            <p className="text-sm text-gray-700">
                                Если вы вручную сбросили выбранный проект (через фильтры или поиск).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как выглядит */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выглядит экран приветствия?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Экран имеет минималистичный дизайн с четырьмя элементами:
            </p>

            <div className="not-prose my-8">
                {/* Mock экрана приветствия */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Добро пожаловать!</h2>
                    <p className="text-gray-500 max-w-md text-sm">
                        Выберите проект из списка слева, чтобы просмотреть его расписание, или воспользуйтесь фильтрами для поиска.
                    </p>
                </div>
            </div>

            <div className="not-prose my-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Разберём элементы:</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                        <div>
                            <p className="font-semibold text-gray-800">Иконка документа</p>
                            <p className="text-sm text-gray-600">Визуальный символ, что это состояние "ожидания действия" от пользователя</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                        <div>
                            <p className="font-semibold text-gray-800">Заголовок "Добро пожаловать!"</p>
                            <p className="text-sm text-gray-600">Приветственный текст вместо сухого "Проект не выбран"</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                        <div>
                            <p className="font-semibold text-gray-800">Подсказка</p>
                            <p className="text-sm text-gray-600">Объясняет, что делать дальше: "Выберите проект из списка слева"</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                        <div>
                            <p className="font-semibold text-gray-800">Пустой фон</p>
                            <p className="text-sm text-gray-600">Белое пространство — не загружаем данные, которых нет</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Почему это важно */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Почему это важно?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Экран приветствия решает несколько важных задач:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Понятное состояние
                    </h4>
                    <p className="text-sm text-gray-700">
                        Новый пользователь сразу понимает, что ему нужно выбрать проект, 
                        а не думает "приложение сломалось".
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Производительность
                    </h4>
                    <p className="text-sm text-gray-700">
                        Не загружаем данные проектов, пока не выбран конкретный — 
                        экономим ресурсы сервера и браузера.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Избегаем ошибок
                    </h4>
                    <p className="text-sm text-gray-700">
                        Без выбранного проекта нельзя случайно создать пост "не в том месте" 
                        или отредактировать не те данные.
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Приятный UX
                    </h4>
                    <p className="text-sm text-gray-700">
                        Дружелюбный текст "Добро пожаловать!" вместо технического сообщения об ошибке.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что делать на этом экране */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что делать на этом экране?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Экран приветствия — это сигнал к действию. Вот что вы можете сделать:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
                    <ol className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <div>
                                <p className="font-semibold text-gray-800">Выберите проект из списка слева</p>
                                <p className="text-sm text-gray-600 mt-1">Кликните на любой проект в сайдбаре — его данные загрузятся автоматически</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <div>
                                <p className="font-semibold text-gray-800">Используйте фильтры и поиск</p>
                                <p className="text-sm text-gray-600 mt-1">В сайдбаре есть поле поиска и фильтры — найдите нужный проект быстрее</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <div>
                                <p className="font-semibold text-gray-800">Или создайте новый проект</p>
                                <p className="text-sm text-gray-600 mt-1">Перейдите в раздел "База проектов" через главную панель (иконка базы данных внизу)</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Когда экран НЕ появляется */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда экран НЕ появляется?</h2>

            <div className="not-prose my-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-gray-700 mb-3">
                        <strong>Важно понимать:</strong> Есть разделы, которые работают БЕЗ выбора проекта:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">•</span>
                            <span><strong>База проектов</strong> — здесь вы видите ВСЕ проекты сразу</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">•</span>
                            <span><strong>Управление пользователями</strong> — глобальная настройка доступа</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">•</span>
                            <span><strong>Центр обучения</strong> — эта документация</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">•</span>
                            <span><strong>Настройки</strong> — глобальные параметры приложения</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Полезные советы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Полезные советы</h2>

            <div className="not-prose grid gap-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Совет 1: Начните с выбора проекта</p>
                        <p className="text-sm text-gray-600">
                            Если вы новичок, просто кликните на первый проект в списке — 
                            это самый быстрый способ начать работу.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Совет 2: Используйте цветовые индикаторы</p>
                        <p className="text-sm text-gray-600">
                            Проекты с красным счётчиком (0 постов) требуют внимания — 
                            это подсказка, где нужно поработать.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Совет 3: Используйте поиск</p>
                        <p className="text-sm text-gray-600">
                            Если у вас много проектов, поиск в сайдбаре поможет быстро найти нужный 
                            по названию или части названия.
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons currentPath="1-4-welcome-screen" />
        </article>
    );
};
