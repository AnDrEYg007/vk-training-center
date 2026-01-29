import React, { useState } from 'react';
import { ContentProps } from '../shared';

export const RefreshButton: React.FC<ContentProps> = ({ title }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

    const refreshOptions = [
        { id: 'published', label: 'Опубликованные', icon: '✅', description: 'Загрузить посты, которые уже на стене' },
        { id: 'scheduled', label: 'Отложенные VK', icon: '📅', description: 'Обновить стандартные отложенные посты' },
        { id: 'system', label: 'Системные', icon: '⚙️', description: 'Обновить посты из нашей системы' },
        { id: 'suggested', label: 'Предложенные', icon: '💡', description: 'Обновить предложенные сообществом посты' },
        { id: 'all', label: 'Все сразу', icon: '🔄', description: 'Полное обновление всех типов данных' }
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
                это целое выпадающее меню с разными вариантами обновления.
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
                обычно после кнопок управления видимостью. Она имеет иконку <strong>🔄</strong> и 
                стрелку вниз (▼), указывающую на выпадающее меню.
            </p>

            <hr className="!my-10" />

            {/* Зачем нужна эта кнопка */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем обновлять данные?</h2>

            <div className="not-prose space-y-4 my-8">
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">⏰</div>
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
                        <div className="text-3xl flex-shrink-0">👥</div>
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
                        <div className="text-3xl flex-shrink-0">🔍</div>
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
                Когда ты нажимаешь на кнопку "Обновить", открывается <strong>выпадающее меню</strong> с вариантами. 
                Каждый вариант обновляет только определённый тип данных:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Опция 1: Опубликованные */}
                <div className="bg-white border-2 border-green-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">✅</div>
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
                <div className="bg-white border-2 border-blue-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📅</div>
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
                <div className="bg-white border-2 border-indigo-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">⚙️</div>
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

                {/* Опция 4: Предложенные */}
                <div className="bg-white border-2 border-amber-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">💡</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900 mb-2">Предложенные</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Обновляет <strong>предложенные посты</strong> — те, которые пользователи 
                                предложили в сообщество, но ещё не опубликованы.
                            </p>
                            <div className="bg-amber-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Кто-то предложил новый пост в сообщество</li>
                                    <li>Нужно проверить очередь предложенных постов</li>
                                    <li>Модератор принял или отклонил предложенный пост</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Опция 5: Все сразу */}
                <div className="bg-white border-2 border-purple-400 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">🔄</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-purple-900 mb-2">Все сразу (Полное обновление)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Загружает <strong>все типы данных одновременно</strong>: 
                                опубликованные, отложенные, системные и предложенные.
                            </p>
                            <div className="bg-purple-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-2">Когда использовать:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Только что открыл приложение и хочешь всё обновить</li>
                                    <li>Долго не заходил в календарь (несколько часов/дней)</li>
                                    <li>Не уверен, что именно изменилось</li>
                                </ul>
                                <p className="text-xs text-gray-600 mt-2">
                                    ⚠️ <strong>Внимание:</strong> Это самый медленный вариант, 
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
                Ниже находится <strong>макет кнопки "Обновить"</strong> с работающим выпадающим меню. 
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
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors shadow-md"
                            >
                                <span>🔄</span>
                                <span>Обновить</span>
                                <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
                            </button>

                            {/* Выпадающее меню */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-10">
                                    {refreshOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleRefresh(option.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{option.icon}</span>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 text-sm">{option.label}</p>
                                                    <p className="text-xs text-gray-600">{option.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Результат */}
                    {lastRefreshed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-900">
                                <strong>✅ Обновлено:</strong> {lastRefreshed}
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
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">✅ Опубликованные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Посты на стене</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">⚡ Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Проверка публикации</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">📅 Отложенные VK</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Отложенные VK</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">⚡ Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Синхронизация с VK</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">⚙️ Системные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Системные посты</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">⚡ Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">После изменений</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">💡 Предложенные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Предложка</td>
                            <td className="border border-gray-300 px-4 py-2 text-green-600">⚡ Быстро</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Модерация предложки</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">🔄 Все сразу</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всё одновременно</td>
                            <td className="border border-gray-300 px-4 py-2 text-orange-600">🐢 Медленно</td>
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
                    <p className="font-bold text-amber-900 mb-2">❓ Почему я не вижу только что созданный пост?</p>
                    <p className="text-sm text-gray-700">
                        Скорее всего, ты создал его через VK или другой интерфейс. 
                        Нажми <strong>"Обновить → Опубликованные"</strong> (если пост уже на стене) 
                        или <strong>"Обновить → Отложенные VK"</strong> (если пост отложен).
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Как часто нужно нажимать "Обновить"?</p>
                    <p className="text-sm text-gray-700">
                        Приложение <strong>автоматически обновляет данные</strong> раз в несколько минут. 
                        Но если работаешь в команде или что-то изменил вручную в VK, 
                        лучше нажать "Обновить" сразу.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Что быстрее: "Все сразу" или несколько раз точечно?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Точечное обновление быстрее!</strong> Если тебе нужно обновить только системные посты, 
                        нажми "Обновить → Системные". Не нужно загружать всё подряд.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Можно ли обновить данные для конкретного проекта?</p>
                    <p className="text-sm text-gray-700">
                        Да! В сайдбаре проектов (слева) наведи на проект и нажми <strong>иконку 🔄</strong>. 
                        Это обновит данные только для этого сообщества, не затрагивая остальные.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Что делать, если обновление "зависло"?</p>
                    <p className="text-sm text-gray-700">
                        Обычно обновление занимает 2-5 секунд. Если прошло больше 10 секунд, 
                        попробуй <strong>обновить страницу браузера</strong> (F5) и попробуй снова.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Почему нет варианта "Обновить заметки"?</p>
                    <p className="text-sm text-gray-700">
                        Заметки хранятся <strong>только в нашей системе</strong>, а не в VK. 
                        Они обновляются автоматически в реальном времени, поэтому отдельная кнопка не нужна.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Отличается ли обновление для разных типов постов?</p>
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
                <p className="text-green-900 font-bold mb-2">💚 Совет для опытных пользователей</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Оптимальная стратегия обновления:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li><strong>Утром / При открытии:</strong> "Все сразу" (полная синхронизация)</li>
                    <li><strong>После публикации системного поста:</strong> "Опубликованные" (проверить, что появился)</li>
                    <li><strong>После редактирования:</strong> "Системные" (увидеть изменения)</li>
                    <li><strong>При работе с предложкой:</strong> "Предложенные" (обновить очередь)</li>
                </ul>
            </div>
        </article>
    );
};
