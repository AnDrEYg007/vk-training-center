import React, { useState } from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Индикаторы состояния проектов
// =====================================================================
export const StatusIndicators: React.FC<ContentProps> = ({ title }) => {
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый проект в сайдбаре может иметь <strong>маленький значок</strong>, который сигнализирует о его состоянии. 
                Эти иконки помогают быстро понять, есть ли проблемы с проектом или если там произошли изменения.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Зачем это нужно:</strong> Вместо того, чтобы заходить в каждый проект и проверять, 
                    сразу видишь по иконке — всё ли там нормально.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Какие индикаторы существуют */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Какие индикаторы существуют?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В приложении есть два основных индикатора состояния:
            </p>

            <div className="not-prose space-y-4 my-6">
                {/* Индикатор 1: Ошибка доступа */}
                <div className="border-l-4 border-amber-400 pl-4 py-3 bg-amber-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">Янтарный треугольник = Ошибка доступа</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Этот значок появляется, когда приложение не может получить доступ к проекту 
                                (сообществу в ВКонтакте).
                            </p>
                            <div className="bg-white rounded p-3 border border-amber-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда это случается:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Токен VK API был удален или заблокирован</li>
                                    <li>Токен потерял права администратора в сообществе</li>
                                    <li>Сообщество было удалено</li>
                                    <li>Истёк срок действия токена</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 rounded p-3 border border-red-200 text-sm text-red-900 mt-3">
                                <p><strong>Что делать:</strong></p>
                                <p>
                                    Нажми на кнопку настроек рядом с проектом и 
                                    <strong> обнови токен VK API</strong>. После этого иконка должна исчезнуть.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Индикатор 2: Обновления на сервере */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Синяя точка = Есть обновления</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Этот значок появляется, когда на сервере произошли <strong>изменения для этого проекта</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-blue-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Что это означает:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>В сообществе появился новый опубликованный пост</li>
                                    <li>Кто-то другой создал отложенный пост в ВК</li>
                                    <li>Изменилась история или другие данные</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 rounded p-3 border border-blue-300 text-sm text-blue-900 mt-3">
                                <p><strong>Что делать:</strong></p>
                                <p>
                                    <strong>Просто переключись на этот проект</strong>. 
                                    Когда ты кликнешь на него, приложение автоматически загрузит 
                                    новые данные и синяя точка исчезнет.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный пример */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это выглядит в интерфейсе?</h2>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Пример списка проектов:</p>
                
                <div className="space-y-2 bg-white rounded border border-gray-300 p-4">
                    {/* Проект 1: Нормальный */}
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
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 1 ? 'pl-24' : 'pl-4'}`}>
                            <span className="truncate pr-1">Изготовление автоключей | К...</span>
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-green-200 text-green-900 px-2 py-0.5 rounded-full flex-shrink-0">15</span>
                        </button>
                    </div>

                    {/* Проект 2: С ошибкой */}
                    <div 
                        className="relative overflow-hidden"
                        onMouseEnter={() => setHoveredProject(2)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        {/* Контейнер для кнопок */}
                        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${hoveredProject === 2 ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                                <button
                                    title="Обновить данные"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 2 ? 'pl-24' : 'pl-4'}`}>
                            <div className="flex items-center min-w-0">
                                <span className="truncate pr-1">Тестовое сообщество</span>
                                <div title="Проблема с доступом. Проверьте права токена." className="text-amber-500 flex-shrink-0">
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-xs font-medium bg-gradient-to-t from-gray-300 to-red-200 text-red-900 px-2 py-0.5 rounded-full flex-shrink-0">0</span>
                        </button>
                    </div>

                    {/* Проект 3: С обновлениями */}
                    <div 
                        className="relative overflow-hidden"
                        onMouseEnter={() => setHoveredProject(3)}
                        onMouseLeave={() => setHoveredProject(null)}
                    >
                        {/* Контейнер для кнопок */}
                        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${hoveredProject === 3 ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                                <button
                                    title="Обновить данные"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                    </svg>
                                </button>
                                <button
                                    title="Настройки"
                                    className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out hover:bg-gray-100 ${hoveredProject === 3 ? 'pl-24' : 'pl-4'}`}>
                            <span className="truncate pr-1">Фиолето Суши | Доставка ро...</span>
                            <div className="flex-shrink-0 flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" title="Доступны обновления"></div>
                                <span className="text-xs font-medium bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full">8</span>
                            </div>
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    <strong>Подсказка:</strong> Наводи курсор на проект — для действий (обновить, настройки) появятся дополнительные кнопки.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Важные моменты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Важные моменты</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-purple-900">Как долго висит индикатор?</p>
                        <p className="text-sm text-gray-700 mt-1">
                            <strong>Янтарный треугольник</strong> останется, пока не исправишь проблему с доступом.<br/>
                            <strong>Синяя точка</strong> исчезнет автоматически при загрузке данных.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Нет индикатора?</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Если иконки нет — это означает, что <strong>всё работает нормально</strong> 
                            и с этим проектом нет никаких проблем.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Следующие шаги */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Далее</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь, когда ты знаешь про индикаторы, давайте посмотрим на 
                <strong> счётчики постов</strong> — те цифры справа от названия проекта, 
                которые показывают, сколько там черновиков и отложенных постов.
            </p>
        </article>
    );
};
