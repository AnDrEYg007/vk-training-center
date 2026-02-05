import React, { useState } from 'react';
import { ContentProps } from '../shared';

export const RefreshButton: React.FC<ContentProps> = ({ title }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

    const refreshOptions = [
        { id: 'published', label: 'Опубликованные', description: 'Загрузить посты, которые уже на стене' },
        { id: 'scheduled', label: 'Отложенные VK', description: 'Обновить стандартные отложенные посты' },
        { id: 'system', label: 'Системные', description: 'Обновить посты из нашей системы' },
        { id: 'stories', label: 'Истории', description: 'Обновить истории сообщества' },
        { id: 'tags', label: 'Теги', description: 'Пересчитать теги для всех постов' },
        { id: 'notes', label: 'Заметки', description: 'Обновить заметки проекта' },
        { id: 'all', label: 'Все сразу', description: 'Полное обновление всех типов данных' }
    ];

    const handleRefresh = (optionId: string) => {
        setLastRefreshed(refreshOptions.find(opt => opt.id === optionId)?.label || null);
        setIsDropdownOpen(false);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"Обновить"</strong> в шапке календаря позволяет 
                <strong> загрузить свежие данные из ВКонтакте</strong>. Это не просто одна кнопка — 
                это целое раздвижное меню с разными вариантами обновления.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Вместо того, чтобы обновлять всё подряд (что занимает время), 
                    ты можешь обновить только нужный тип данных (опубликованные, отложенные, системные и т.д.).
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находится кнопка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка "Обновить" расположена в <strong>правой части шапки календаря</strong>, 
                обычно после кнопок управления видимостью. Она имеет иконку стрелок обновления (SVG) и текст "Обновить". 
                При нажатии справа раздвигается меню с вариантами обновления.
            </p>

            <hr className="!my-10" />

            {/* Зачем нужна эта кнопка */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем обновлять данные?</h2>

            <div className="not-prose space-y-4 my-8">
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Синхронизация с ВКонтакте</h3>
                            <p className="text-sm text-gray-700">
                                Календарь показывает <strong>копию данных с сервера</strong>. 
                                Если кто-то создал пост прямо в VK (минуя приложение), 
                                ты не увидишь его, пока не нажмёшь "Обновить".
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Работа в команде</h3>
                            <p className="text-sm text-gray-700">
                                Если твой коллега добавил пост или изменил расписание, 
                                тебе нужно обновить данные, чтобы увидеть изменения.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Проверка статуса публикации</h3>
                            <p className="text-sm text-gray-700">
                                Системный пост был опубликован? Нажми "Обновить → Опубликованные", 
                                чтобы увидеть его на стене в календаре.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Варианты обновления */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Варианты обновления (меню)</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Когда ты нажимаешь на кнопку "Обновить", открывается <strong>раздвижное меню</strong> с вариантами. 
                Каждый вариант обновляет только определённый тип данных:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Опция 1: Опубликованные */}
                <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-green-900 mb-2">Опубликованные</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Загружает все посты, которые <strong>уже находятся на стене сообщества</strong>.
                            </p>
                            <div className="bg-green-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Системный пост только что был опубликован</li>
                                    <li>Нужно проверить, появился ли пост на стене</li>
                                    <li>Кто-то опубликовал пост вручную через VK</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 2: Отложенные VK */}
                <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-900 mb-2">Отложенные VK</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Загружает <strong>стандартные отложенные посты ВКонтакте</strong> 
                                (те, которые видны в разделе "Отложенные" в интерфейсе VK).
                            </p>
                            <div className="bg-blue-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Кто-то создал отложенный пост прямо в VK</li>
                                    <li>Нужно увидеть изменения в отложенной очереди</li>
                                    <li>Проверяешь, не удалил ли кто-то отложенный пост</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 3: Системные */}
                <div className="bg-white border-2 border-indigo-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-indigo-900 mb-2">Системные</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Обновляет <strong>посты из нашей системы</strong> — те, которые хранятся 
                                в нашей базе данных и будут опубликованы автоматически (пунктирная рамка).
                            </p>
                            <div className="bg-indigo-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Изменил системный пост и хочешь увидеть обновление</li>
                                    <li>Коллега создал системный пост в другой вкладке</li>
                                    <li>Хочешь проверить статус публикации системного поста</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 4: Истории */}
                <div className="bg-white border-2 border-purple-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-purple-900 mb-2">Истории</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Обновляет <strong>истории сообщества</strong> — короткие публикации, которые 
                                отображаются в специальном блоке календаря.
                            </p>
                            <div className="bg-purple-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Опубликовали новую историю в VK</li>
                                    <li>Нужно проверить актуальные истории</li>
                                    <li>История истекла и нужно обновить список</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 5: Теги */}
                <div className="bg-white border-2 border-pink-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-pink-900 mb-2">Теги</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Запускает <strong>пересчёт тегов</strong> для всех постов проекта по актуальным правилам тегирования.
                            </p>
                            <div className="bg-pink-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Изменил правила автоматического тегирования</li>
                                    <li>Добавил новые теги и хочешь применить к старым постам</li>
                                    <li>Теги отображаются неправильно</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 6: Заметки */}
                <div className="bg-white border-2 border-cyan-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-cyan-900 mb-2">Заметки</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Обновляет <strong>заметки текущего проекта</strong> из базы данных.
                            </p>
                            <div className="bg-cyan-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Коллега создал заметку в другой вкладке</li>
                                    <li>Изменения заметок не отобразились автоматически</li>
                                    <li>Нужно убедиться что все заметки актуальны</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 7: Все сразу */}
                <div className="bg-white border-2 border-gray-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">Все сразу (Полное обновление)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Загружает <strong>все типы данных одновременно</strong>: 
                                опубликованные, отложенные, системные, истории, теги, заметки.
                            </p>
                            <div className="bg-purple-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Только что открыл приложение и хочешь всё обновить</li>
                                    <li>Долго не заходил в календарь (несколько часов/дней)</li>
                                    <li>Не уверен, что именно изменилось</li>
                                </ul>
                                <p className="text-xs text-gray-600 mt-2">
                                    <strong>Внимание:</strong> Это самый медленный вариант, 
                                    потому что загружает все данные сразу. Используй точечное обновление, 
                                    если знаешь, что нужно.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивная демонстрация */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивная демонстрация</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Ниже находится <strong>макет кнопки "Обновить"</strong> с работающим раздвижным меню. 
                Попробуй нажать на кнопку и выбрать один из вариантов:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {/* Шапка календаря */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Шапка календаря</span>
                        </div>
                        
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                </svg>
                                <span>Обновить</span>
                            </button>

                            {/* Раздвижное меню */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
                                isDropdownOpen ? 'max-w-4xl opacity-100 ml-2' : 'max-w-0 opacity-0'
                            }`}>
                                <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                    {refreshOptions.map((option, index) => (
                                        <React.Fragment key={option.id}>
                                            {index > 0 && <div className="h-5 w-px bg-gray-200"></div>}
                                            <button
                                                onClick={() => handleRefresh(option.id)}
                                                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                title={option.description}
                                            >
                                                {option.label}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Результат */}
                    {lastRefreshed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-900">
                                <strong>Обновлено:</strong> {lastRefreshed}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                (Данные успешно загружены с сервера)
                            </p>
                        </div>
                    )}

                    {!lastRefreshed && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600">
                                Нажми на кнопку "Обновить" и выбери вариант
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Нажми на кнопку и выбери тип данных для обновления
                </p>
            </div>

            <hr className="!my-10" />

            {/* Таблица сравнения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сравнение вариантов обновления</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Вариант</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Что обновляется</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Скорость</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Когда использовать</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Опубликованные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Посты на стене</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Проверка публикации</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Отложенные VK</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Отложенные VK</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Синхронизация с VK</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Системные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Системные посты</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">После изменений</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Истории</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Истории сообщества</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Обновление блока историй</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Теги</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Пересчёт тегов</td>
                            <td className="border border-gray-300 px-4 py-2 text-orange-600">Средне</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">После изменения правил</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Заметки</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Заметки проекта</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Ручное обновление</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Все сразу</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всё одновременно</td>
                            <td className="border border-gray-300 px-4 py-2 text-orange-600">Медленно</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полная синхронизация</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Частые вопросы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">Почему я не вижу только что созданный пост?</p>
                    <p className="text-sm text-gray-700">
                        Скорее всего, ты создал его через VK или другой интерфейс. 
                        Нажми <strong>"Обновить → Опубликованные"</strong> (если пост уже на стене) 
                        или <strong>"Обновить → Отложенные VK"</strong> (если пост отложен).
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">Как часто нужно нажимать "Обновить"?</p>
                    <p className="text-sm text-gray-700">
                        Приложение <strong>автоматически проверяет наличие обновлений</strong> каждые 5 секунд. 
                        Но если работаешь в команде или что-то изменил вручную в VK, 
                        лучше нажать "Обновить" сразу для мгновенной синхронизации.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">Что быстрее: "Все сразу" или несколько раз точечно?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Точечное обновление быстрее!</strong> Если тебе нужно обновить только системные посты, 
                        нажми "Обновить → Системные". Не нужно загружать всё подряд.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">Можно ли обновить данные для конкретного проекта?</p>
                    <p className="text-sm text-gray-700">
                        Да! В сайдбаре проектов (слева) наведи на проект и нажми <strong>иконку обновления (стрелки)</strong>. 
                        Это обновит данные только для этого сообщества, не затрагивая остальные.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">Что делать, если обновление "зависло"?</p>
                    <p className="text-sm text-gray-700">
                        Обычно обновление занимает 2-5 секунд. Если прошло больше 10 секунд, 
                        попробуй <strong>обновить страницу браузера</strong> (F5) и попробуй снова.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">Отличается ли обновление для разных типов постов?</p>
                    <p className="text-sm text-gray-700">
                        Да! <strong>"Опубликованные"</strong> загружаются с VK API (wall.get), 
                        <strong>"Отложенные VK"</strong> — через wall.getScheduled, 
                        а <strong>"Системные"</strong> — из нашей базы данных на сервере.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Совет */}
            <div className="not-prose bg-green-50 border-l-4 border-green-400 pl-4 py-3 rounded-lg">
                <p className="text-green-900 font-bold mb-2">Совет для опытных пользователей</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Оптимальная стратегия обновления:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li><strong>Утром / При открытии:</strong> "Все сразу" (полная синхронизация)</li>
                    <li><strong>После публикации системного поста:</strong> "Опубликованные" (проверить, что появился)</li>
                    <li><strong>После редактирования:</strong> "Системные" (увидеть изменения)</li>
                    <li><strong>Изменил правила тегов:</strong> "Теги" (пересчитать для всех постов)</li>
                    <li><strong>Опубликовали историю:</strong> "Истории" (обновить блок историй)</li>
                </ul>
            </div>
        </article>
    );
};
