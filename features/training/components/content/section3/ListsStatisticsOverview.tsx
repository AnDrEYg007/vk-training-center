import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { 
    MockQualityCard, 
    MockDemographicsCard, 
    MockMetricBlock,
    ViewsIcon,
    LikesIcon,
    CommentsIcon,
    RepostsIcon
} from './ListsStatsMocks';

// =====================================================================
// Компонент страницы 3.3: Статистика списков (обзор)
// =====================================================================
export const ListsStatisticsOverview: React.FC<ContentProps> = ({ title }) => {
    const [activeMode, setActiveMode] = useState<'users' | 'posts'>('users');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель статистики — это раздел аналитики, который появляется в верхней части интерфейса при открытии любого списка. Система автоматически собирает метрики и показывает карточки с ключевыми показателями: качество аудитории, демографию, активность, географию и другие данные.
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель статистики — это набор карточек с метриками, расположенных горизонтально в верхней части экрана списка. Каждая карточка показывает конкретный срез данных: от общего количества пользователей до детальной разбивки по возрасту, полу и городам.
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <div className="font-bold text-indigo-900 mb-1">Автоматический сбор данных</div>
                        <div className="text-sm text-indigo-800">
                            Статистика обновляется автоматически при каждой синхронизации списка с VK. Не нужно вручную запускать сбор метрик — система делает это в фоновом режиме.
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Два режима статистики */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Два режима статистики</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Система показывает разные наборы метрик в зависимости от типа выбранного списка:
            </p>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Режим 1: Статистика пользователей */}
                <div className="border border-purple-200 rounded-lg p-5 bg-purple-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Статистика пользователей</div>
                            <div className="text-xs text-gray-500">Для списков подписчиков и активностей</div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-purple-500">•</span>
                            <span>Качество базы (активные/забаненные/удалённые)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-500">•</span>
                            <span>Демография (пол, возраст, география)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-500">•</span>
                            <span>Активность (последний онлайн, платформы)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-500">•</span>
                            <span>Дни рождения (по месяцам)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-500">•</span>
                            <span>Life Time (средний цикл подписки)</span>
                        </li>
                    </ul>
                </div>

                {/* Режим 2: Статистика постов */}
                <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Статистика постов</div>
                            <div className="text-xs text-gray-500">Для списка "История постов"</div>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span>Общая активность (просмотры, лайки, комментарии, репосты)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span>Средние значения на пост</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span>Лучшие публикации (топ по каждой метрике)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span>Динамика публикаций (график по периодам)</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Интерактивная демонстрация */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Переключайте режимы статистики — интерфейс меняется в зависимости от типа списка."
                instructions={[
                    '<strong>Выберите режим</strong> — кликните на одну из кнопок',
                    '<strong>Изучите карточки</strong> — каждый режим показывает свой набор метрик'
                ]}
            >
                <div className="space-y-4">
                    {/* Переключатель режимов */}
                    <div className="flex gap-2 p-2 bg-gray-100 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveMode('users')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeMode === 'users'
                                    ? 'bg-purple-600 text-white shadow'
                                    : 'text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Статистика пользователей
                        </button>
                        <button
                            onClick={() => setActiveMode('posts')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeMode === 'posts'
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Статистика постов
                        </button>
                    </div>

                    {/* Карточки статистики */}
                    {activeMode === 'users' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MockQualityCard />
                            <MockDemographicsCard />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <MockMetricBlock
                                icon={<ViewsIcon />}
                                title="Просмотры"
                                total={245678}
                                avg={127.4}
                                color="bg-gray-400"
                            />
                            <MockMetricBlock
                                icon={<LikesIcon />}
                                title="Лайки"
                                total={12456}
                                avg={6.5}
                                color="bg-pink-400"
                            />
                            <MockMetricBlock
                                icon={<CommentsIcon />}
                                title="Комментарии"
                                total={3456}
                                avg={1.8}
                                color="bg-blue-400"
                            />
                            <MockMetricBlock
                                icon={<RepostsIcon />}
                                title="Репосты"
                                total={1892}
                                avg={1.0}
                                color="bg-purple-400"
                            />
                        </div>
                    )}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Как это работает? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работает?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Порядок отображения</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель статистики появляется автоматически после выбора списка:
            </p>

            <div className="not-prose my-6">
                <ol className="space-y-3">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            1
                        </span>
                        <span className="text-gray-700">
                            <strong>Выбираете список</strong> — кликаете на карточку (например, "Подписчики")
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            2
                        </span>
                        <span className="text-gray-700">
                            <strong>Система определяет тип</strong> — если это список пользователей, показывает статистику пользователей; если "История постов" — статистику постов
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            3
                        </span>
                        <span className="text-gray-700">
                            <strong>Панель загружается</strong> — карточки появляются над таблицей данных
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            4
                        </span>
                        <span className="text-gray-700">
                            <strong>Можете прокручивать</strong> — панель остаётся вверху, таблица прокручивается под ней
                        </span>
                    </li>
                </ol>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Состояние загрузки</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                При первом открытии списка или обновлении данных панель статистики показывает анимированные заглушки (skeleton):
            </p>

            <div className="not-prose my-6 flex gap-4">
                <div className="flex-1 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После загрузки данных заглушки заменяются реальными карточками с метриками.
            </p>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: ручной анализ в Excel</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Выгружать список в CSV, открывать в Excel, строить сводные таблицы</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Вручную считать проценты женщин/мужчин, активных/удалённых</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Строить графики в Google Sheets для отчётов</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Невозможно быстро увидеть общую картину — нужно минимум 15-20 минут на подготовку</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: мгновенная аналитика</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Мгновенный обзор</strong> — все ключевые метрики видны сразу после открытия списка</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Визуальное восприятие</strong> — круговые диаграммы, столбчатые графики, цветовые индикаторы</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Автоматические вычисления</strong> — проценты, средние значения, топы считаются системой</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Экономия времени</strong> — от 20 минут ручной работы до 3 секунд загрузки панели</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что дальше? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующих разделах мы подробно разберём каждую карточку статистики пользователей и постов, а также систему графиков и диаграмм.
            </p>

            {/* Навигация */}
            <NavigationButtons 
                prevPath="3-2-6-sync" 
                nextPath="3-3-1-user-stats" 
                currentPath="3-3-statistics" 
            />
        </article>
    );
};
