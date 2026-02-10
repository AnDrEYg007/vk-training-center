import React, { useState } from 'react';
import { ContentProps, NavigationButtons, Sandbox } from '../shared';

// =====================================================================
// Основной компонент: Счётчики постов
// =====================================================================
export const PostCounters: React.FC<ContentProps> = ({ title }) => {
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Счётчик — это <strong>маленькая цифра справа от названия проекта</strong>, 
                которая показывает, <strong>сколько постов ждут публикации</strong>. 
                Но это не просто число — <strong>цвет этого числа очень важен!</strong>
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главное правило:</strong> Цвет счётчика — это сигнал от приложения. 
                    Красный = "Срочно!", Зелёный = "Всё OK".
                </p>
            </div>

            <hr className="!my-10" />

            {/* Четыре состояния */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Четыре состояния счётчика</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В зависимости от количества постов, счётчик меняет цвет. Вот все четыре варианта:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Статус 1: Красный */}
                <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-red-200 text-red-900 px-2 py-0.5 rounded-full">0</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-red-900">Красный счётчик: 0 постов</h3>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-t from-gray-300 to-red-200 text-red-900">0</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Что это значит:</strong> В проекте <strong>вообще нет черновиков</strong> (отложенных постов). 
                                Это красный сигнал — <strong>контент закончился!</strong>
                            </p>
                            <div className="bg-white rounded p-3 border border-red-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда это случается:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Все посты уже опубликованы</li>
                                    <li>Контент для проекта закончился</li>
                                    <li>Нужно срочно планировать новые посты</li>
                                </ul>
                            </div>
                            <div className="bg-red-100 rounded p-3 border border-red-300 text-sm text-red-900 mt-3">
                                <p><strong>Что делать:</strong> Кликни на этот проект и <strong>начни создавать новые посты</strong>. 
                                Пора пополнять контент-план!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Статус 2: Оранжевый */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 px-2 py-0.5 rounded-full">3</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-orange-900">Оранжевый счётчик: 1-4 поста</h3>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900">3</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Что это значит:</strong> Постов <strong>очень мало</strong> 
                                (от 1 до 4). Это предупреждение — контента скоро не будет!
                            </p>
                            <div className="bg-white rounded p-3 border border-orange-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Статус:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Есть несколько постов, но это небольшой запас</li>
                                    <li>На 1-2 дня контента хватит</li>
                                    <li>Нужно начинать планировать больше</li>
                                </ul>
                            </div>
                            <div className="bg-orange-100 rounded p-3 border border-orange-300 text-sm text-orange-900 mt-3">
                                <p><strong>Совет:</strong> Не спеши паниковать, но уже пора 
                                <strong> начинать создавать новые посты</strong> на будущее.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Статус 3: Серый */}
                <div className="border-l-4 border-gray-400 pl-4 py-3 bg-gray-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full">7</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900">Серый счётчик: 5-10 постов</h3>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-300 text-gray-700">7</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Что это значит:</strong> Контента <strong>нормальное количество</strong>. 
                                Запаса хватит на неделю-две. Всё в порядке.
                            </p>
                            <div className="bg-white rounded p-3 border border-gray-300 text-sm text-gray-700 space-y-2">
                                <p><strong>Статус:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Достаточно контента для плановой работы</li>
                                    <li>Нет срочности с созданием новых постов</li>
                                    <li>Но уже можно подумать о дополнительном контенте</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 rounded p-3 border border-blue-200 text-sm text-blue-900 mt-3">
                                <p><strong>Комментарий:</strong> Это нормальное рабочее состояние. 
                                Ты можешь спокойно работать, не переживая об экстренном контенте.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Статус 4: Зелёный */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-green-200 text-green-900 px-2 py-0.5 rounded-full">15</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-green-900">Зелёный счётчик: больше 10 постов</h3>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-t from-gray-300 to-green-200 text-green-900">15</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Что это значит:</strong> <strong>Отличная работа!</strong> 
                                Контента много, можешь спокойно работать несколько недель вперёд.
                            </p>
                            <div className="bg-white rounded p-3 border border-green-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Статус:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Много контента на будущее</li>
                                    <li>Запаса хватит на 2-3+ недели</li>
                                    <li>Можно спокойно планировать стратегию</li>
                                </ul>
                            </div>
                            <div className="bg-green-100 rounded p-3 border border-green-300 text-sm text-green-900 mt-3">
                                <p><strong>Поздравляем:</strong> Это означает, что контент-план хорошо подготовлен. 
                                Ты в добром здравии!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Таблица сравнения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сравнительная таблица</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Цвет</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Количество</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Смысл</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Что делать</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-red-50">
                            <td className="border border-gray-300 px-4 py-2">
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-t from-gray-300 to-red-200 text-red-900">Красный</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">0 постов</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">Срочно! Контент закончился</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-red-700">Немедленно создавать посты</td>
                        </tr>
                        <tr className="hover:bg-orange-50">
                            <td className="border border-gray-300 px-4 py-2">
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900">Оранжевый</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">1-4 поста</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">Предупреждение: мало контента</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-orange-700">Начать создавать посты</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-300 text-gray-700">Серый</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">5-10 постов</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">ОК: нормальный уровень</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">Работать как обычно</td>
                        </tr>
                        <tr className="hover:bg-green-50">
                            <td className="border border-gray-300 px-4 py-2">
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-t from-gray-300 to-green-200 text-green-900">Зелёный</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">10+ постов</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">Отлично! Много контента</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-green-700">Спокойно работать, контента много</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Важные моменты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Важные моменты</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-blue-900">Счётчик меняется в зависимости от вкладки</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Когда ты открываешь разные вкладки ("Отложенные", "Предложенные" и т.д.), 
                            числа в счётчике меняются. Это нормально!
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <div>
                        <p className="font-medium text-purple-900">Счётчик обновляется автоматически</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Когда ты создаёшь новый пост или публикуешь существующий, 
                            счётчик сразу обновляется. Не нужно перезагружать страницу.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Используй счётчики для контроля</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Быстро посмотри на сайдбар и увидишь цветные счётчики — 
                            это быстрый способ понять, где нужна работа.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-yellow-900">Красный счётчик — не конец света</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Если увидел 0, не паникуй. Просто начни создавать посты. 
                            За 30 минут можно подготовить неделю контента!
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Пример реальной работы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Пример в реальной работе</h2>

            <Sandbox
                title="Интерактивный список с разными счётчиками"
                description="Наведи курсор на проекты, чтобы увидеть кнопки управления. Обрати внимание на разные цвета счётчиков."
                instructions={["Красный (0) — срочно создавать посты", "Оранжевый (3) — мало контента", "Серый (7) — нормально", "Зелёный (18) — отлично"]}
            >
            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Список проектов с разными счётчиками:</p>
                
                <div className="space-y-2 bg-white rounded border border-gray-300 p-4">
                    {/* Проект 1: Красный счетчик */}
                    <div 
                        className="relative overflow-hidden"
                        onMouseEnter={() => setHoveredProject(1)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        {/* Контейнер для кнопок, который выдвигается */}
                        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${hoveredProject === 1 ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                                <button
                                    title="Обновить данные"
                                    aria-label="Обновить данные проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    aria-label="Настройки проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 1 ? 'pl-24' : 'pl-4'}`}>
                            <span className="truncate pr-1">Фиолето Суши | Доставка ро...</span>
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-red-200 text-red-900 px-2 py-0.5 rounded-full flex-shrink-0">0</span>
                        </button>
                    </div>

                    {/* Проект 2: Оранжевый счетчик */}
                    <div 
                        className="relative overflow-hidden mt-3"
                        onMouseEnter={() => setHoveredProject(2)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${hoveredProject === 2 ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                                <button
                                    title="Обновить данные"
                                    aria-label="Обновить данные проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    aria-label="Настройки проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 2 ? 'pl-24' : 'pl-4'}`}>
                            <span className="truncate pr-1">Тестовое сообщество</span>
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 px-2 py-0.5 rounded-full flex-shrink-0">3</span>
                        </button>
                    </div>

                    {/* Проект 3: Серый счетчик */}
                    <div 
                        className="relative overflow-hidden mt-3"
                        onMouseEnter={() => setHoveredProject(3)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${hoveredProject === 3 ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                                <button
                                    title="Обновить данные"
                                    aria-label="Обновить данные проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    aria-label="Настройки проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 3 ? 'pl-24' : 'pl-4'}`}>
                            <span className="truncate pr-1">Изготовление автоключей | К...</span>
                            <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full flex-shrink-0">7</span>
                        </button>
                    </div>

                    {/* Проект 4: Зеленый счетчик */}
                    <div 
                        className="relative overflow-hidden mt-3"
                        onMouseEnter={() => setHoveredProject(4)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${hoveredProject === 4 ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                                <button
                                    title="Обновить данные"
                                    aria-label="Обновить данные проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    aria-label="Настройки проекта"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 4 ? 'pl-24' : 'pl-4'}`}>
                            <span className="truncate pr-1">ООО Строй Кровля | Кровел...</span>
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-green-200 text-green-900 px-2 py-0.5 rounded-full flex-shrink-0">18</span>
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    <strong>Смотрим на список и сразу видим:</strong> 
                    первый проект срочно нужно наполнить, второй чуть отстаёт, остальное в норме.
                </p>
            </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Почему счётчик меняется, когда я переключаю вкладки?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Счётчик показывает количество постов в текущей вкладке. На вкладке «Отложенные» — количество черновиков, 
                        на вкладке «Предложенные» — количество постов от других. Это нормально и помогает быстро понять, 
                        сколько контента есть в каждой категории.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Можно ли изменить пороги для цветов счётчиков?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, пороги зафиксированы: красный (0), оранжевый (1-4), серый (5-10), зелёный (10+). 
                        Эти значения выбраны на основе оптимального контент-плана для сообществ.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Как быстро исправить все красные счётчики?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Используй фильтры в сайдбаре — выбери «Нет постов» (красный фильтр), чтобы увидеть только проекты с нулевым контентом. 
                        Затем поочерёдно открывай их и создавай посты. Цель — вывести все проекты хотя бы на оранжевый уровень (1-4 поста).
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Что делать, если у всех проектов зелёные счётчики?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Поздравляем! Это означает, что контент-план в отличном состоянии. Можешь сосредоточиться на качестве контента, 
                        стратегии публикаций или работе с другими проектами. Зелёные счётчики — это идеальная ситуация.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Счётчик показывает количество постов, ожидающих публикации (черновики).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Красный (0) = срочно, оранжевый (1-4) = мало, серый (5-10) = нормально, зелёный (10+) = отлично.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Цвет счётчика — это сигнал приоритета: красные проекты нужно обрабатывать первыми.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Счётчики обновляются автоматически при создании/публикации постов.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Используй фильтры в сайдбаре для быстрого поиска проектов с определённым уровнем контента.</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700">
                            Каждое утро проверяй сайдбар и смотри на цвета счётчиков. Если видишь красные или оранжевые — 
                            выдели 15-30 минут на создание постов для этих проектов. Цель — все счётчики минимум серые, 
                            а лучше зелёные. Это гарантирует стабильную публикацию контента и отсутствие «провалов».
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons />
        </article>
    );
};
