import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockListsNavigation, ListType, ListGroup } from './ListsMocks';
import { useTrainingNavigation } from '../../../contexts/TrainingNavigationContext';

// =====================================================================
// Основной компонент: Обзор модуля "Списки"
// =====================================================================
export const ListsModuleOverview: React.FC<ContentProps> = ({ title }) => {
    const { navigateTo } = useTrainingNavigation();
    const [selectedGroup, setSelectedGroup] = useState<ListGroup>('subscribers');
    const [selectedList, setSelectedList] = useState<ListType | null>(null);

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Модуль "Списки"</strong> — это инструмент для работы с базой подписчиков сообщества ВКонтакте. 
                Здесь можно просматривать участников, анализировать их активность, собирать статистику 
                и управлять рассылками — всё в одном месте.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Раньше, чтобы узнать кто лайкал посты или кому можно писать в личку, 
                    приходилось вручную собирать данные через VK или использовать сторонние сервисы. 
                    Теперь вся информация автоматически синхронизируется, фильтруется и выводится в удобных таблицах.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Раздел: Зачем нужны списки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем нужны списки?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                Списки решают несколько практических задач SMM-специалистов:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {/* Карточка 1 */}
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-indigo-500 rounded-lg p-2 flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-indigo-900 mb-1">Аналитика аудитории</h3>
                            <p className="text-sm text-gray-600">
                                Понять демографию: пол, возраст, география, платформы. Найти самых активных участников.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Карточка 2 */}
                <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-cyan-600 rounded-lg p-2 flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-cyan-900 mb-1">Рассылка сообщений</h3>
                            <p className="text-sm text-gray-600">
                                Собрать базу для рассылок: кому можно писать в личку, когда последний раз общались.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Карточка 3 */}
                <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-pink-500 rounded-lg p-2 flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-pink-900 mb-1">Анализ активности</h3>
                            <p className="text-sm text-gray-600">
                                Узнать кто лайкает, комментирует, репостит. Найти самых вовлечённых пользователей.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Карточка 4 */}
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-amber-500 rounded-lg p-2 flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-amber-900 mb-1">Конкурсы и автоматизации</h3>
                            <p className="text-sm text-gray-600">
                                Автоматически собирать участников, победителей, посты для конкурсов отзывов.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Раздел: Как устроен интерфейс */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как устроен интерфейс?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                Модуль состоит из трёх основных частей:
            </p>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="bg-indigo-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Навигация по спискам</h4>
                        <p className="text-sm text-gray-600">
                            Карточки с названиями, иконками и счётчиками. Разделены на группы: Подписчики, Активности, Автоматизации, Прочее.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="bg-indigo-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Панель фильтров</h4>
                        <p className="text-sm text-gray-600">
                            Поиск по имени или ID, фильтры по полу, возрасту, платформе, онлайн, качеству аккаунта. Кнопки обновления данных.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <div className="bg-indigo-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Таблица данных</h4>
                        <p className="text-sm text-gray-600">
                            Строки с пользователями/постами/активностями. Аватарки, статусы, метрики, даты. Пагинация и сортировка.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Раздел: Типы списков */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типы списков</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                Все списки разделены на четыре группы. Переключайся между ними, чтобы увидеть карточки:
            </p>

            <Sandbox 
                title="Интерактивная демонстрация"
                description="Переключай группы списков и кликай на карточки, чтобы увидеть как выглядит навигация в реальном интерфейсе."
                instructions={[
                    'Нажми на вкладку <strong>"Активности"</strong> или <strong>"Автоматизации"</strong>, чтобы увидеть другие списки',
                    'Кликни на любую карточку, чтобы она подсветилась как активная',
                    'При наведении на карточку появляется тень — это реакция интерфейса',
                    'Каждая карточка имеет свой цвет иконки и счётчик записей'
                ]}
            >
                <MockListsNavigation
                    selectedGroup={selectedGroup}
                    selectedList={selectedList}
                    onGroupChange={setSelectedGroup}
                    onListSelect={setSelectedList}
                />
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Описание групп</h3>

            <div className="not-prose space-y-4 my-6">
                {/* Группа: Подписчики */}
                <div className="border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg p-4">
                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Подписчики
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Работа с базой участников сообщества. Основа для анализа и рассылок.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li><strong>Подписчики</strong> — все текущие участники сообщества</li>
                        <li><strong>В рассылке</strong> — те, кому можно писать в личные сообщения</li>
                        <li><strong>Вступившие</strong> — новые подписчики за период</li>
                        <li><strong>Вышедшие</strong> — покинувшие сообщество участники</li>
                    </ul>
                </div>

                {/* Группа: Активности */}
                <div className="border-l-4 border-pink-500 bg-pink-50 rounded-r-lg p-4">
                    <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Активности
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Анализ вовлечённости аудитории. Кто взаимодействует с контентом.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li><strong>Лайкали</strong> — пользователи, которые ставили лайки постам</li>
                        <li><strong>Комментировали</strong> — оставили комментарии под постами</li>
                        <li><strong>Репостили</strong> — сделали репост контента на свою страницу</li>
                    </ul>
                </div>

                {/* Группа: Автоматизации */}
                <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-4">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Автоматизации
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Списки, связанные с активными конкурсами и автоматизациями.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li><strong>Конкурс отзывов: Победители</strong> — участники, которые выиграли</li>
                        <li><strong>Конкурс отзывов: Участники</strong> — все отправившие отзывы</li>
                        <li><strong>Конкурс отзывов: Посты</strong> — посты с отзывами для модерации</li>
                    </ul>
                </div>

                {/* Группа: Прочее */}
                <div className="border-l-4 border-violet-500 bg-violet-50 rounded-r-lg p-4">
                    <h4 className="font-bold text-violet-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        Прочее
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Дополнительные списки для работы с контентом.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li><strong>История постов</strong> — все опубликованные посты сообщества</li>
                        <li><strong>Авторы постов</strong> — пользователи, предложившие контент</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Раздел: Что дальше */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                Теперь, когда ты понимаешь общую структуру модуля, изучи детали:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <button 
                    onClick={() => navigateTo('3-1-lists-overview')}
                    className="block w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-500 transition-all"
                >
                    <h4 className="font-bold text-gray-900 mb-1">3.1. Общий обзор</h4>
                    <p className="text-sm text-gray-600">Интерфейс, навигация, фильтры</p>
                </button>
                
                <button 
                    onClick={() => navigateTo('3-2-system-lists')}
                    className="block w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-500 transition-all"
                >
                    <h4 className="font-bold text-gray-900 mb-1">3.2. Системные списки</h4>
                    <p className="text-sm text-gray-600">Карточки, таблицы, синхронизация</p>
                </button>
                
                <button 
                    onClick={() => navigateTo('3-3-statistics')}
                    className="block w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-500 transition-all"
                >
                    <h4 className="font-bold text-gray-900 mb-1">3.3. Статистика списков</h4>
                    <p className="text-sm text-gray-600">Аналитика, графики, диаграммы</p>
                </button>
                
                <button 
                    onClick={() => navigateTo('3-4-user-lists')}
                    className="block w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-500 transition-all"
                >
                    <h4 className="font-bold text-gray-900 mb-1">3.4. Пользовательские списки</h4>
                    <p className="text-sm text-gray-600">Создание и управление своими списками</p>
                </button>
            </div>

            {/* Навигация между страницами */}
            <NavigationButtons currentPath="3-lists" />
        </article>
    );
};
