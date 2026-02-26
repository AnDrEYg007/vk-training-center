import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockLineChart, MockGeoCard, MockAgeCard, MockBirthdayCard } from './ListsStatsMocks';

// =====================================================================
// Компонент страницы 3.3.3: Графики и диаграммы
// =====================================================================
export const ChartsPage: React.FC<ContentProps> = ({ title }) => {
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
    const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'comments' | 'reposts'>('views');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Графики и диаграммы — это визуальные элементы внутри карточек статистики. Система использует три типа графиков: линейные (динамика по времени), круговые (распределение по категориям), столбчатые (сравнение значений).
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Графики и диаграммы — это не отдельные компоненты, а части карточек статистики. Три типа визуализации:
            </p>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Линейный график */}
                <div className="border border-indigo-200 rounded-lg p-5 bg-indigo-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Линейный</div>
                            <div className="text-xs text-gray-500">Динамика во времени</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-700">
                        Показывает изменение метрики по периодам: день, неделя, месяц. Используется для статистики постов.
                    </div>
                </div>

                {/* Круговая диаграмма */}
                <div className="border border-purple-200 rounded-lg p-5 bg-purple-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Круговая</div>
                            <div className="text-xs text-gray-500">Доли категорий</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-700">
                        Показывает процентное распределение: демография, география, статус рассылки.
                    </div>
                </div>

                {/* Столбчатая диаграмма */}
                <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Столбчатая</div>
                            <div className="text-xs text-gray-500">Сравнение значений</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-700">
                        Сравнивает значения по группам: возраст, дни рождения, последний онлайн.
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Линейный график */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Линейный график</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Линейный график используется в панели статистики постов для отображения динамики публикаций. График показывает, как менялись просмотры, лайки, комментарии или репосты в зависимости от выбранного периода.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Управление графиком</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Над графиком расположены два контрола:
            </p>

            <div className="not-prose my-4">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                        <span className="text-indigo-500">•</span>
                        <span><strong>Период</strong> — кнопки «День», «Неделя», «Месяц». Меняют группировку данных по оси X.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-indigo-500">•</span>
                        <span><strong>Метрика</strong> — выпадающий список «Просмотры», «Лайки», «Комментарии», «Репосты». Меняют данные по оси Y.</span>
                    </li>
                </ul>
            </div>

            {/* Интерактивная демонстрация линейного графика */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Переключайте период и метрику — график перестроится с новыми данными. Наведите на точку для просмотра точного значения."
                instructions={[
                    '<strong>Выберите период</strong> — день, неделя или месяц',
                    '<strong>Выберите метрику</strong> — просмотры, лайки, комментарии или репосты',
                    '<strong>Наведите на точку</strong> — появится тултип с датой и значением'
                ]}
            >
                <div className="space-y-4">
                    {/* Контролы */}
                    <div className="flex flex-wrap gap-4">
                        {/* Переключатель периода */}
                        <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">Период</div>
                            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                                <button
                                    onClick={() => setSelectedPeriod('day')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        selectedPeriod === 'day'
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    День
                                </button>
                                <button
                                    onClick={() => setSelectedPeriod('week')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        selectedPeriod === 'week'
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Неделя
                                </button>
                                <button
                                    onClick={() => setSelectedPeriod('month')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        selectedPeriod === 'month'
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Месяц
                                </button>
                            </div>
                        </div>

                        {/* Выбор метрики */}
                        <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">Метрика</div>
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value as any)}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="views">Просмотры</option>
                                <option value="likes">Лайки</option>
                                <option value="comments">Комментарии</option>
                                <option value="reposts">Репосты</option>
                            </select>
                        </div>
                    </div>

                    {/* График */}
                    <MockLineChart period={selectedPeriod} metric={selectedMetric} />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Анатомия линейного графика</h3>
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
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Ось X</span></td>
                            <td className="border border-gray-300 px-3 py-2">Временная шкала: даты (день), номера недель (неделя), месяцы (месяц)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Ось Y</span></td>
                            <td className="border border-gray-300 px-3 py-2">Значения выбранной метрики (просмотры, лайки и т.д.)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Линия</span></td>
                            <td className="border border-gray-300 px-3 py-2">Синяя линия с градиентной заливкой под ней (fill opacity 10%)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Точки</span></td>
                            <td className="border border-gray-300 px-3 py-2">Маркеры данных на линии (появляются при наведении)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Тултип</span></td>
                            <td className="border border-gray-300 px-3 py-2">Всплывающее окно с точной датой и значением (появляется при наведении на точку)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Сетка</span></td>
                            <td className="border border-gray-300 px-3 py-2">Горизонтальные линии для удобства чтения значений по оси Y</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div>
                        <div className="font-bold text-indigo-900 mb-1">Кастомная реализация на SVG</div>
                        <div className="text-sm text-indigo-800">
                            График написан вручную через SVG-элементы (<code>&lt;path&gt;</code>, <code>&lt;circle&gt;</code>, <code>&lt;line&gt;</code>), а не через библиотеки типа Chart.js или Recharts. Это даёт полный контроль над внешним видом и поведением.
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Круговая диаграмма */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Круговая диаграмма</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Круговая диаграмма используется для отображения процентного распределения по категориям. В системе она применяется в карточке «География» для показа распределения пользователей по странам.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Где используется?</h3>
            <div className="not-prose my-4">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                        <span className="text-purple-500">•</span>
                        <span><strong>География (страны)</strong> — показывает топ-5 стран + категорию «Другие»</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-purple-500">•</span>
                        <span><strong>Демография (пол)</strong> — использует горизонтальные полосы вместо круга (проще для 2-3 категорий)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-purple-500">•</span>
                        <span><strong>Статус рассылки</strong> — три квадратные карточки вместо круга (удобнее для чисел)</span>
                    </li>
                </ul>
            </div>

            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Карточка географии с круговой диаграммой."
            >
                <div className="w-80">
                    <MockGeoCard />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Анатомия круговой диаграммы</h3>
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
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Круг</span></td>
                            <td className="border border-gray-300 px-3 py-2">Диаграмма создаётся через CSS-свойство <code>conic-gradient</code> с процентными углами</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Сегменты</span></td>
                            <td className="border border-gray-300 px-3 py-2">Каждая страна = сегмент с уникальным цветом (макс. 5 стран + «Другие»)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Легенда</span></td>
                            <td className="border border-gray-300 px-3 py-2">Список стран под диаграммой: цветной квадратик + название + процент</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <div className="font-bold text-purple-900 mb-1">Топ-5 + Другие</div>
                        <div className="text-sm text-purple-800">
                            Если стран больше 5, система показывает топ-5 по количеству пользователей, остальные объединяются в категорию «Другие». Это упрощает визуализацию и делает диаграмму читаемой.
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Столбчатая диаграмма */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Столбчатая диаграмма</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Столбчатая диаграмма используется для сравнения значений по группам. В системе она применяется в трёх карточках: возраст, дни рождения, последний онлайн.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Где используется?</h3>

            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Две карточки со столбчатыми диаграммами: возраст и дни рождения."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MockAgeCard />
                    <MockBirthdayCard />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Анатомия столбчатой диаграммы</h3>
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
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Столбцы</span></td>
                            <td className="border border-gray-300 px-3 py-2">Вертикальные полосы, высота которых пропорциональна значению</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Подписи оси X</span></td>
                            <td className="border border-gray-300 px-3 py-2">Названия категорий под столбцами: возрастные группы, месяцы, периоды онлайна</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Цвет</span></td>
                            <td className="border border-gray-300 px-3 py-2">Все столбцы одного цвета (фиолетовый для возраста, индиго для дней рождения)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Выделение</span></td>
                            <td className="border border-gray-300 px-3 py-2">Текущий месяц (для дней рождения) выделяется ярким цветом</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2"><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Проценты</span></td>
                            <td className="border border-gray-300 px-3 py-2">Над каждым столбцом может быть подпись с процентом или абсолютным значением</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/30">
                    <div className="font-bold text-gray-900 mb-2 text-sm">Возраст</div>
                    <div className="text-xs text-gray-700">
                        8 столбцов: до 18, 18-21, 21-24, 24-27, 27-30, 30-35, 35-45, 45+. Цвет: фиолетовый.
                    </div>
                </div>
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
                    <div className="font-bold text-gray-900 mb-2 text-sm">Дни рождения</div>
                    <div className="text-xs text-gray-700">
                        12 столбцов (месяцы). Текущий месяц выделяется ярко-индиго. Остальные — серые.
                    </div>
                </div>
                <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/30">
                    <div className="font-bold text-gray-900 mb-2 text-sm">Последний онлайн</div>
                    <div className="text-xs text-gray-700">
                        6 столбцов: сегодня, вчера, на этой неделе, на прошлой неделе, в этом месяце, давно.
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: таблицы с цифрами</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Строить сводные таблицы в Excel с группировкой по возрасту, полу, странам</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Вручную рисовать диаграммы в Google Sheets для презентаций</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Тратить 10-15 минут на подготовку каждого графика</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Сложно увидеть тренды и аномалии — только числа, без визуализации</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: автоматическая визуализация</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Мгновенные графики</strong> — система автоматически строит диаграммы при загрузке данных</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Интерактивность</strong> — можно навести на точку/столбец и увидеть точное значение</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Динамическое обновление</strong> — переключение периода/метрики перестраивает график за доли секунды</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Визуальное восприятие</strong> — тренды, аномалии, пики видны сразу, не нужно всматриваться в цифры</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Итоги раздела 3.3 */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Итоги раздела «Статистика списков»</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Мы разобрали все элементы панели статистики:
            </p>

            <div className="not-prose my-6">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                        <span className="text-gray-500">✓</span>
                        <span><strong>Два режима</strong> — статистика пользователей (10 карточек) и статистика постов (4 метрики + топы)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-gray-500">✓</span>
                        <span><strong>Карточки пользователей</strong> — качество, демография, активность, география, Life Time и другие</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-gray-500">✓</span>
                        <span><strong>Карточки постов</strong> — просмотры, лайки, комментарии, репосты + лучшие публикации</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-gray-500">✓</span>
                        <span><strong>Графики</strong> — линейные (динамика), круговые (доли), столбчатые (сравнение)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-gray-500">✓</span>
                        <span><strong>Фильтр рассылки</strong> — мгновенный пересчёт всех карточек для сегмента с разрешёнными сообщениями</span>
                    </li>
                </ul>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель статистики — это мощный инструмент аналитики, который заменяет часы ручной работы в Excel. Все метрики обновляются автоматически, визуализация позволяет мгновенно увидеть тренды, а интерактивные элементы (тултипы, переключатели) делают работу с данными удобной и быстрой.
            </p>

            {/* Навигация */}
            <NavigationButtons 
                prevPath="3-3-2-posts-stats" 
                nextPath="3-4-user-lists" 
                currentPath="3-3-3-charts" 
            />
        </article>
    );
};
