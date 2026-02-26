import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { 
    MockMetricBlock,
    MockTopPostCard,
    ViewsIcon,
    LikesIcon,
    CommentsIcon,
    RepostsIcon
} from './ListsStatsMocks';

// =====================================================================
// Компонент страницы 3.3.2: Статистика постов
// =====================================================================
export const PostsStatsPage: React.FC<ContentProps> = ({ title }) => {
    const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'comments' | 'reposts'>('views');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Статистика постов — это режим панели статистики, который появляется при открытии списка <strong>«История постов»</strong>. Вместо метрик пользователей система показывает данные о публикациях: просмотры, лайки, комментарии, репосты и топ лучших постов.
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель статистики постов состоит из двух блоков:
            </p>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Общая активность</div>
                            <div className="text-xs text-gray-500">4 карточки с метриками</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-700">
                        Четыре карточки показывают суммарные и средние значения по всем постам: просмотры, лайки, комментарии, репосты.
                    </div>
                </div>

                <div className="border border-purple-200 rounded-lg p-5 bg-purple-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Лучшие посты</div>
                            <div className="text-xs text-gray-500">Топ по каждой метрике</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-700">
                        Блок «Лучшие посты» показывает топ-1 публикацию по выбранной метрике: самый просматриваемый, самый лайкнутый и т.д.
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Общая активность */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Общая активность</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Первый блок — это 4 карточки с ключевыми метриками. Каждая карточка показывает:
            </p>

            <div className="not-prose my-4">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span><strong>Иконку метрики</strong> — глаз (просмотры), сердце (лайки), облачко (комментарии), стрелки (репосты)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span><strong>Общее значение</strong> — суммарное количество по всем постам</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span><strong>Среднее значение</strong> — средняя метрика на один пост</span>
                    </li>
                </ul>
            </div>

            {/* Интерактивная демонстрация карточек */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Изучите 4 карточки общей активности — каждая показывает свою метрику."
            >
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
            </Sandbox>

            {/* Разбор каждой карточки */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Разбор каждой карточки</h3>

            <div className="not-prose my-6">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Метрика</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Цвет</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <ViewsIcon />
                                    <span className="font-medium">Просмотры</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                    <span className="text-xs">Серый</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Количество просмотров (охват) всех постов. Средний показатель = общее / количество постов.
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <LikesIcon />
                                    <span className="font-medium">Лайки</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-pink-400 rounded"></div>
                                    <span className="text-xs">Розовый</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Суммарное количество лайков по всем публикациям. Показывает вовлечённость аудитории.
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <CommentsIcon />
                                    <span className="font-medium">Комментарии</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                                    <span className="text-xs">Голубой</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Общее количество комментариев. Высокое значение говорит о дискуссионности контента.
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <RepostsIcon />
                                    <span className="font-medium">Репосты</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-400 rounded"></div>
                                    <span className="text-xs">Фиолетовый</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Количество репостов (шаринга). Отражает виральность — насколько люди готовы делиться контентом.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Лучшие посты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Лучшие посты</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Второй блок — это раздел <strong>«Лучшие посты»</strong>. Он показывает топ-1 публикацию по выбранной метрике. Вверху блока есть 4 вкладки (просмотры, лайки, комментарии, репосты) — при переключении меняется карточка поста.
            </p>

            {/* Интерактивная демонстрация топов */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Переключайте вкладки и смотрите, какой пост является лучшим по каждой метрике."
                instructions={[
                    '<strong>Кликните на вкладку</strong> — карточка поста изменится',
                    '<strong>Изучите карточку</strong> — показан заголовок, картинка, метрики, ссылка'
                ]}
            >
                <div className="space-y-4">
                    {/* Вкладки */}
                    <div className="flex gap-1 border-b border-gray-200">
                        <button
                            onClick={() => setSelectedMetric('views')}
                            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                                selectedMetric === 'views'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ViewsIcon />
                                Просмотры
                            </div>
                            {selectedMetric === 'views' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setSelectedMetric('likes')}
                            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                                selectedMetric === 'likes'
                                    ? 'text-pink-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <LikesIcon />
                                Лайки
                            </div>
                            {selectedMetric === 'likes' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setSelectedMetric('comments')}
                            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                                selectedMetric === 'comments'
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <CommentsIcon />
                                Комментарии
                            </div>
                            {selectedMetric === 'comments' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setSelectedMetric('reposts')}
                            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                                selectedMetric === 'reposts'
                                    ? 'text-purple-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <RepostsIcon />
                                Репосты
                            </div>
                            {selectedMetric === 'reposts' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                            )}
                        </button>
                    </div>

                    {/* Карточка топового поста */}
                    <MockTopPostCard metric={selectedMetric} />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Анатомия карточки поста</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Карточка топового поста состоит из следующих элементов:
            </p>

            <div className="not-prose my-6">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Элемент</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Изображение</span></td>
                            <td className="border border-gray-300 px-3 py-2">Превью поста (первое вложение или заглушка, если картинки нет)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Заголовок</span></td>
                            <td className="border border-gray-300 px-3 py-2">Первые 80 символов текста поста (если текст короче, показывается полностью)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Дата</span></td>
                            <td className="border border-gray-300 px-3 py-2">Когда был опубликован пост</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Метрики</span></td>
                            <td className="border border-gray-300 px-3 py-2">Строка с 4 иконками + числами (просмотры, лайки, комментарии, репосты)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Ссылка</span></td>
                            <td className="border border-gray-300 px-3 py-2">Кнопка «Открыть пост ВКонтакте» — клик ведёт на публикацию во ВК</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <div className="font-bold text-indigo-900 mb-1">Только топ-1</div>
                        <div className="text-sm text-indigo-800">
                            Система показывает только один лучший пост по выбранной метрике. Топ-3 или топ-5 не предусмотрены — это сделано для упрощения интерфейса.
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: ручной поиск лучших постов</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Открывать страницу ВК, листать стену, искать посты с высокими метриками</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Сравнивать числа вручную: «У этого 245 лайков, у того 312 — значит, тот лучше»</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Выписывать ссылки на топовые посты в Excel для отчётов</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Тратить 10-15 минут на поиск и сравнение</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: автоматический топ</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Мгновенный топ</strong> — система сама находит лучший пост по каждой метрике</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Визуальная карточка</strong> — превью, заголовок, метрики, ссылка в одном месте</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Быстрый переход</strong> — один клик на кнопку «Открыть пост ВКонтакте»</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Экономия времени</strong> — от 15 минут ручного поиска до 3 секунд загрузки панели</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что дальше? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующем разделе мы разберём графики и диаграммы: линейные графики динамики, круговые диаграммы географии, столбчатые графики возраста и дней рождения.
            </p>

            {/* Навигация */}
            <NavigationButtons 
                prevPath="3-3-1-user-stats" 
                nextPath="3-3-3-charts" 
                currentPath="3-3-2-posts-stats" 
            />
        </article>
    );
};
