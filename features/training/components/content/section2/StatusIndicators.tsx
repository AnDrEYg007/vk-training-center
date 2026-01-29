import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Индикаторы состояния проектов
// =====================================================================
export const StatusIndicators: React.FC<ContentProps> = ({ title }) => {
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
                <div className="border-l-4 border-yellow-400 pl-4 py-3 bg-yellow-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">⚠️</div>
                        <div>
                            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Жёлтый треугольник = Ошибка доступа</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Этот значок появляется, когда приложение не может получить доступ к проекту 
                                (сообществу в ВКонтакте).
                            </p>
                            <div className="bg-white rounded p-3 border border-yellow-200 text-sm text-gray-700 space-y-2">
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
                                    Нажми на кнопку настроек (⚙️) рядом с проектом и 
                                    <strong> обнови токен VK API</strong>. После этого иконка должна исчезнуть.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Индикатор 2: Обновления на сервере */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">🔵</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">🔵 Синяя точка = Есть обновления</h3>
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
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                        <span className="text-sm text-gray-800">📱 Проект "Природа"</span>
                        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">15</span>
                    </div>

                    {/* Проект 2: С ошибкой */}
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-800">🍕 Проект "Доставка"</span>
                            <span title="Ошибка доступа" className="text-lg">⚠️</span>
                        </div>
                        <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full">0</span>
                    </div>

                    {/* Проект 3: С обновлениями */}
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-800">🎨 Проект "Дизайн"</span>
                            <span title="Есть обновления" className="text-lg">🔵</span>
                        </div>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">8</span>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    ℹ️ Наводи курсор на проект — для действий (обновить, настройки) появятся дополнительные кнопки.
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
                            ⚠️ Жёлтый треугольник <strong>останется</strong>, пока не исправишь проблему с доступом.
                            🔵 Синяя точка <strong>исчезнет автоматически</strong> при загрузке данных.
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
                            и с этим проектом нет никаких проблем. 👍
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
