import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { 
    MockQualityCard,
    MockMailingStatusCard,
    MockLifetimeCard,
    MockLastContactCard,
    MockDemographicsCard,
    MockPlatformsCard,
    MockOnlineCard,
    MockAgeCard,
    MockBirthdayCard,
    MockGeoCard
} from './ListsStatsMocks';

// =====================================================================
// Компонент страницы 3.3.1: Статистика пользователей
// =====================================================================
export const UserStatsPage: React.FC<ContentProps> = ({ title }) => {
    const [showMailingFilter, setShowMailingFilter] = useState(false);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Статистика пользователей — это набор из 10 карточек, которые показывают разные срезы данных о вашей аудитории: качество базы, демографию, активность, географию и другие метрики. Карточки расположены горизонтально и прокручиваются как слайдер.
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель статистики пользователей — это горизонтальная прокручиваемая лента из 10 карточек. Каждая карточка — это отдельная метрика со своей визуализацией: круговые диаграммы, столбчатые графики, числовые показатели.
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                        <div className="font-bold text-purple-900 mb-1">10 карточек метрик</div>
                        <div className="text-sm text-purple-800">
                            Система показывает фиксированный набор из 10 карточек. Нельзя добавить новые или удалить существующие — это сделано для единообразия интерфейса.
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Полный список карточек */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Полный список карточек</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот все 10 карточек в том порядке, как они отображаются в интерфейсе:
            </p>

            {/* Интерактивная демонстрация всех карточек */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Прокрутите панель статистики горизонтально — каждая карточка показывает свою метрику."
                instructions={[
                    '<strong>Прокрутите панель</strong> — используйте колесо мыши или полосу прокрутки внизу',
                    '<strong>Изучите карточки</strong> — каждая имеет уникальную визуализацию'
                ]}
            >
                <div className="overflow-x-auto custom-scrollbar pb-2">
                    <div className="flex gap-4 min-w-max">
                        <div className="w-80 flex-shrink-0">
                            <MockQualityCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockMailingStatusCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockLifetimeCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockLastContactCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockDemographicsCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockPlatformsCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockOnlineCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockAgeCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockBirthdayCard />
                        </div>
                        <div className="w-80 flex-shrink-0">
                            <MockGeoCard />
                        </div>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Разбор каждой карточки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Разбор каждой карточки</h2>

            {/* Карточка 1: Качество базы */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Качество базы</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по статусу аккаунта: активные, забаненные, удалённые.
            </p>

            <div className="not-prose my-6 w-80">
                <MockQualityCard />
            </div>

            <div className="not-prose my-4">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Элемент</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Всего</span></td>
                            <td className="border border-gray-300 px-3 py-2">Общее количество пользователей в списке (включая забаненных и удалённых)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Активны</span></td>
                            <td className="border border-gray-300 px-3 py-2">Пользователи с нормальным статусом (зелёная полоса)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Забанены</span></td>
                            <td className="border border-gray-300 px-3 py-2">Заблокированные ВКонтакте аккаунты (красная полоса)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Удалены</span></td>
                            <td className="border border-gray-300 px-3 py-2">Удалённые пользователями аккаунты (серая полоса)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Карточка 2: Статус рассылки */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Статус рассылки</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает, сколько пользователей разрешили/запретили сообщения от сообщества, и сколько входят в целевую аудиторию рекламы.
            </p>

            <div className="not-prose my-6 w-80">
                <MockMailingStatusCard />
            </div>

            <div className="not-prose my-4">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Элемент</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Разрешены</span></td>
                            <td className="border border-gray-300 px-3 py-2">Пользователи, которые разрешили получать сообщения от сообщества (зелёная карточка)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Запрещены</span></td>
                            <td className="border border-gray-300 px-3 py-2">Пользователи, которые запретили сообщения (красная карточка)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">В целевой группе</span></td>
                            <td className="border border-gray-300 px-3 py-2">Пользователи, которые входят в целевую аудиторию для рекламных кампаний (фиолетовая карточка)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Карточка 3: Life Time */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Life Time (Цикл подписки)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает средний и медианный срок подписки пользователей на сообщество — сколько дней они остаются подписчиками.
            </p>

            <div className="not-prose my-6 w-80">
                <MockLifetimeCard />
            </div>

            <div className="not-prose my-4">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Элемент</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Средний LT</span></td>
                            <td className="border border-gray-300 px-3 py-2">Среднее количество дней подписки по всем пользователям</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Активные</span></td>
                            <td className="border border-gray-300 px-3 py-2">Средний LT только для активных подписчиков (зелёная карточка)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Отписавшиеся</span></td>
                            <td className="border border-gray-300 px-3 py-2">Средний LT для тех, кто отписался (серая карточка)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Карточка 4: Последний контакт */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Последний контакт</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по давности последнего взаимодействия с сообществом: последний месяц, 1-3 месяца, 3-6 месяцев, больше 6 месяцев, нет истории.
            </p>

            <div className="not-prose my-6 w-80">
                <MockLastContactCard />
            </div>

            {/* Карточка 5: Демография (пол) */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">5. Демография (пол)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по полу: женщины, мужчины, не указан.
            </p>

            <div className="not-prose my-6 w-80">
                <MockDemographicsCard />
            </div>

            <div className="not-prose my-4">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Элемент</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Женщины</span></td>
                            <td className="border border-gray-300 px-3 py-2">Розовая полоса + процент</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Мужчины</span></td>
                            <td className="border border-gray-300 px-3 py-2">Синяя полоса + процент</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Не указан</span></td>
                            <td className="border border-gray-300 px-3 py-2">Серая полоса + процент (если есть)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Карточка 6: Платформы */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">6. Платформы</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по платформам: мобильное приложение, полная версия сайта.
            </p>

            <div className="not-prose my-6 w-80">
                <MockPlatformsCard />
            </div>

            {/* Карточка 7: Последний онлайн */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">7. Последний онлайн</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по давности последнего онлайна: сегодня, вчера, на этой неделе, на прошлой неделе, в этом месяце, давно.
            </p>

            <div className="not-prose my-6 w-80">
                <MockOnlineCard />
            </div>

            {/* Карточка 8: Возраст */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">8. Возраст</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по возрастным группам: до 18, 18-21, 21-24, 24-27, 27-30, 30-35, 35-45, 45+.
            </p>

            <div className="not-prose my-6 w-80">
                <MockAgeCard />
            </div>

            {/* Карточка 9: Дни рождения */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">9. Дни рождения</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение дней рождения пользователей по месяцам года. Текущий месяц выделяется цветом.
            </p>

            <div className="not-prose my-6 w-80">
                <MockBirthdayCard />
            </div>

            {/* Карточка 10: География */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">10. География (страны)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает распределение пользователей по странам в виде круговой диаграммы. Максимум 5 стран, остальные объединяются в "Другие".
            </p>

            <div className="not-prose my-6 w-80">
                <MockGeoCard />
            </div>

            <hr className="!my-10" />

            {/* Фильтр рассылки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Фильтр рассылки</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Над панелью статистики есть переключатель <strong>«Рассылка разрешена»</strong>. Если его включить, система пересчитает все карточки, учитывая только тех пользователей, кто разрешил получать сообщения от сообщества.
            </p>

            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Включите фильтр и посмотрите, как изменятся числа в карточках."
                instructions={[
                    '<strong>Кликните на переключатель</strong> — фильтр применится ко всем карточкам',
                    '<strong>Сравните числа</strong> — без фильтра и с фильтром'
                ]}
            >
                <div className="space-y-4">
                    {/* Переключатель фильтра */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                        <button
                            onClick={() => setShowMailingFilter(!showMailingFilter)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                showMailingFilter ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    showMailingFilter ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            Рассылка разрешена
                        </span>
                    </div>

                    {/* Карточки */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {showMailingFilter ? (
                            <>
                                <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                                    <div className="text-sm text-gray-600 mb-1">Качество базы</div>
                                    <div className="text-2xl font-bold text-gray-900">8 932</div>
                                    <div className="text-xs text-green-700 mt-2">Только пользователи с разрешённой рассылкой</div>
                                </div>
                                <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                                    <div className="text-sm text-gray-600 mb-1">Демография</div>
                                    <div className="text-2xl font-bold text-gray-900">62% / 38%</div>
                                    <div className="text-xs text-green-700 mt-2">Распределение изменилось</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                                    <div className="text-sm text-gray-600 mb-1">Качество базы</div>
                                    <div className="text-2xl font-bold text-gray-900">12 458</div>
                                    <div className="text-xs text-gray-500 mt-2">Все пользователи</div>
                                </div>
                                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                                    <div className="text-sm text-gray-600 mb-1">Демография</div>
                                    <div className="text-2xl font-bold text-gray-900">58% / 42%</div>
                                    <div className="text-xs text-gray-500 mt-2">Исходное распределение</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: ручной анализ базы</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Выгружать список в Excel, строить сводные таблицы вручную</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Вручную считать проценты мужчин/женщин, активных/удалённых</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Строить диаграммы в Google Sheets для отчётов</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Тратить 15-20 минут на подготовку каждого отчёта</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: автоматическая панель</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Мгновенная аналитика</strong> — все метрики загружаются за 3 секунды</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Визуальные диаграммы</strong> — круговые, столбчатые графики вместо таблиц с цифрами</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Автоматические вычисления</strong> — проценты, средние, медианы считает система</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Фильтр рассылки</strong> — мгновенный пересчёт для сегмента с разрешёнными сообщениями</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что дальше? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующем разделе мы разберём статистику постов — другой режим панели, который показывает метрики публикаций.
            </p>

            {/* Навигация */}
            <NavigationButtons 
                prevPath="3-3-statistics" 
                nextPath="3-3-2-posts-stats" 
                currentPath="3-3-1-user-stats" 
            />
        </article>
    );
};
