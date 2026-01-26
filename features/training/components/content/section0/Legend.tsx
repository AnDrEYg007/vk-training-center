import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';
import { MockProjectListItem } from '../SidebarMocks';
import { MockPostCard } from '../PostCardMocks';

// =====================================================================
// Основной компонент: Условные обозначения
// =====================================================================
export const Legend: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В интерфейсе приложения и документации используются единые визуальные обозначения. 
                Ознакомьтесь с ними, чтобы быстрее ориентироваться в системе.
            </p>

            <hr className="!my-10" />

            {/* Цвета счётчиков */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Цвета счётчиков постов</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Счётчик справа от названия проекта в сайдбаре показывает количество контента. 
                Цвет помогает быстро оценить ситуацию:
            </p>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="bg-gradient-to-t from-gray-300 to-red-200 text-red-900 text-xs px-2.5 py-1 rounded-full font-medium">0</span>
                    <div>
                        <p className="font-medium text-gray-800">Красный: Нет постов</p>
                        <p className="text-sm text-gray-600">В проекте нет контента для выбранной вкладки. Пора за работу!</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 text-xs px-2.5 py-1 rounded-full font-medium">3</span>
                    <div>
                        <p className="font-medium text-gray-800">Оранжевый: Мало постов (1-4)</p>
                        <p className="text-sm text-gray-600">Контент есть, но его немного. Возможно, стоит запланировать ещё.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="bg-gray-300 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">7</span>
                    <div>
                        <p className="font-medium text-gray-800">Серый: Достаточно постов (5-10)</p>
                        <p className="text-sm text-gray-600">Хороший запас контента на ближайшее время.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="bg-gradient-to-t from-gray-300 to-green-200 text-green-900 text-xs px-2.5 py-1 rounded-full font-medium">15</span>
                    <div>
                        <p className="font-medium text-gray-800">Зелёный: Много постов (11+)</p>
                        <p className="text-sm text-gray-600">Отлично! Контента достаточно, можно сфокусироваться на других проектах.</p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Типы рамок постов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типы рамок карточек постов</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Рамка карточки поста в календаре показывает его текущий статус:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="space-y-3">
                    <div className="border-2 border-dashed border-indigo-400 rounded-lg p-3 bg-white">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 border-2 border-dashed border-indigo-400 rounded"></div>
                            <span className="text-sm font-medium text-gray-800">Пунктирная рамка</span>
                        </div>
                        <p className="text-xs text-gray-600">Системный пост — создан в планировщике, ещё не отправлен в VK</p>
                    </div>
                    <MockPostCard type="system" textLength="short" imagesCount={1} />
                </div>

                <div className="space-y-3">
                    <div className="border-2 border-solid border-indigo-500 rounded-lg p-3 bg-white">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 border-2 border-solid border-indigo-500 rounded"></div>
                            <span className="text-sm font-medium text-gray-800">Сплошная рамка</span>
                        </div>
                        <p className="text-xs text-gray-600">Отложенный пост VK — уже находится в очереди VK</p>
                    </div>
                    <MockPostCard type="vk" textLength="short" imagesCount={1} />
                </div>

                <div className="space-y-3">
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 border border-gray-300 rounded bg-gray-50"></div>
                            <span className="text-sm font-medium text-gray-800">Тонкая серая рамка</span>
                        </div>
                        <p className="text-xs text-gray-600">Опубликованный пост — уже на стене сообщества</p>
                    </div>
                    <MockPostCard type="published" textLength="short" imagesCount={1} />
                </div>
            </div>

            <hr className="!my-10" />

            {/* Иконки действий */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Иконки действий</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Эти иконки используются в кнопках и меню по всему приложению:
            </p>

            <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Редактировать</p>
                        <p className="text-xs text-gray-500">Открыть для изменения</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Копировать</p>
                        <p className="text-xs text-gray-500">Создать дубликат</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Удалить</p>
                        <p className="text-xs text-gray-500">Удалить элемент</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Обновить</p>
                        <p className="text-xs text-gray-500">Синхронизировать с VK</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Настройки</p>
                        <p className="text-xs text-gray-500">Открыть параметры</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Добавить</p>
                        <p className="text-xs text-gray-500">Создать новый</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Галерея</p>
                        <p className="text-xs text-gray-500">Выбрать изображения</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">AI-помощник</p>
                        <p className="text-xs text-gray-500">Генерация текста</p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Статусные индикаторы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Статусные индикаторы</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Дополнительные визуальные индикаторы в интерфейсе:
            </p>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                        <p className="font-medium text-gray-800">Синяя пульсирующая точка</p>
                        <p className="text-sm text-gray-600">Доступны обновления — данные изменились на сервере</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="loader h-4 w-4 border-2 border-gray-300 border-t-indigo-500"></div>
                    <div>
                        <p className="font-medium text-gray-800">Спиннер загрузки</p>
                        <p className="text-sm text-gray-600">Идёт загрузка данных или выполнение операции</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-amber-500">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">Жёлтый треугольник</p>
                        <p className="text-sm text-gray-600">Проблема с доступом — проверьте права токена</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-green-500">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">Зелёная галочка</p>
                        <p className="text-sm text-gray-600">Успешное выполнение операции</p>
                    </div>
                </div>
            </div>

            {/* Подсказка */}
            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Совет:</strong> Если вы видите незнакомую иконку или индикатор, 
                    наведите на неё курсор — появится всплывающая подсказка с пояснением.
                </p>
            </div>

            <NavigationButtons currentPath="0-4-legend" />
        </article>
    );
};
