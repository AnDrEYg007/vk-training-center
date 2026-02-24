import React, { useState } from 'react';
import { Sandbox, NavigationButtons, ContentProps } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации
// =====================================================================

// Упрощённый компонент Sparkline для демонстрации
const MockSparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / max) * 100;
        return `${x},${y}`;
    }).join(' ');
    
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline points={points} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={color} stroke="currentColor" />
        </svg>
    );
};

// Компонент метрической карточки
const MockMetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    textColor?: string;
    children?: React.ReactNode;
    colSpan?: string;
}> = ({ title, value, icon, bgColor, iconColor, textColor = 'text-gray-900', children, colSpan = 'col-span-1' }) => (
    <div className={`${colSpan} bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors`}>
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <p className="text-gray-500 text-sm font-semibold">{title}</p>
                <h3 className={`text-3xl font-bold ${textColor} mt-2`}>{value}</h3>
            </div>
            <div className={`p-2 ${bgColor} rounded-xl`}>
                {icon}
            </div>
        </div>
        {children}
    </div>
);

// Компонент фильтра
const MockFilterButton: React.FC<{ label: string; active: boolean; onClick: () => void; variant?: 'period' | 'type' }> = ({ label, active, onClick, variant = 'period' }) => {
    const activeClass = variant === 'period' 
        ? 'bg-indigo-100 text-indigo-700' 
        : 'bg-indigo-600 text-white shadow-md';
    const inactiveClass = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
    
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${active ? activeClass : inactiveClass}`}
        >
            {label}
        </button>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsStoriesDashboardPage: React.FC<ContentProps> = ({ title }) => {
    // Состояния для интерактивных демо
    const [periodFilter, setPeriodFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [demoViews] = useState<number[]>([1200, 1500, 1800, 2200, 2800, 3100, 2900]);

    return (
        <article className="prose max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Дашборд эффективности — это главный экран для анализа результатов публикации историй. 
                Здесь собраны все ключевые показатели: охваты, клики, вовлечённость и экономия бюджета. 
                Система автоматически рассчитывает метрики и показывает тренды на графиках.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 mb-8">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Для чего нужен дашборд?</p>
                        <p>Раньше приходилось заходить в каждую историю VK и смотреть статистику вручную. 
                        Теперь все данные собраны в одном месте, с автоматическими расчётами CTR, ER и экономии бюджета.</p>
                    </div>
                </div>
            </div>

            {/* РАЗДЕЛ 1: СИСТЕМА ФИЛЬТРОВ */}
            <hr className="!my-10" />
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">1. Система фильтров</h2>
            
            <p className="!text-base !leading-relaxed !text-gray-700">
                В верхней части дашборда расположены два фильтра, которые работают вместе и мгновенно обновляют все карточки и графики.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Фильтр по периоду времени</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Позволяет выбрать временной диапазон для анализа. Доступны 6 вариантов:
            </p>

            <div className="not-prose">
                <ul className="space-y-2 mt-4">
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">Все истории</span> — показывает статистику за всё время без ограничений
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">За неделю</span> — последние 7 дней (удобно для анализа текущей недели)
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">За месяц</span> — последние 30 дней (для ежемесячных отчётов)
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">За квартал</span> — последние 90 дней (квартальная аналитика)
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">За год</span> — последние 365 дней (годовая статистика)
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">Свой период</span> — при выборе появляются два поля для выбора даты начала и конца. 
                            Можно выбрать любой произвольный диапазон (например, с 1 по 15 марта)
                        </div>
                    </li>
                </ul>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Фильтр по типу историй</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Позволяет разделить статистику по способу публикации. Доступны 3 варианта:
            </p>

            <div className="not-prose">
                <ul className="space-y-2 mt-4">
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">Все истории</span> — показывает суммарную статистику (и автоматические, и ручные)
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">Вручную</span> — только истории, опубликованные без автоматизации
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 mt-1">•</span>
                        <div>
                            <span className="font-semibold">Наш сервис</span> — только истории, опубликованные через автоматизацию из товаров
                        </div>
                    </li>
                </ul>
            </div>

            {/* Интерактивная демонстрация фильтров */}
            <Sandbox
                title="Попробуйте фильтры"
                description="Переключайте фильтры и наблюдайте, как меняется отображение выбранных параметров."
                instructions={[
                    "Нажимайте на кнопки <strong>фильтра периода</strong> — активная подсвечивается фиолетовым фоном",
                    "Нажимайте на кнопки <strong>фильтра типа</strong> — активная становится тёмно-фиолетовой с тенью"
                ]}
            >
                <div className="space-y-4">
                    {/* Фильтр периода */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Период:</p>
                        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-gray-200">
                            {[
                                { value: 'all', label: 'Все истории' },
                                { value: 'week', label: 'За неделю' },
                                { value: 'month', label: 'За месяц' },
                                { value: 'quarter', label: 'За квартал' },
                                { value: 'year', label: 'За год' },
                                { value: 'custom', label: 'Свой период' }
                            ].map(opt => (
                                <MockFilterButton
                                    key={opt.value}
                                    label={opt.label}
                                    active={periodFilter === opt.value}
                                    onClick={() => setPeriodFilter(opt.value)}
                                    variant="period"
                                />
                            ))}
                        </div>
                        {periodFilter === 'custom' && (
                            <div className="mt-2 flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 animate-fade-in-up">
                                <input type="date" className="px-2 py-1 text-xs border border-gray-200 rounded bg-gray-50" />
                                <span className="text-gray-300">—</span>
                                <input type="date" className="px-2 py-1 text-xs border border-gray-200 rounded bg-gray-50" />
                            </div>
                        )}
                    </div>

                    {/* Фильтр типа */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Тип:</p>
                        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 w-fit">
                            {[
                                { value: 'all', label: 'Все истории' },
                                { value: 'manual', label: 'Вручную' },
                                { value: 'auto', label: 'Наш сервис' }
                            ].map(opt => (
                                <MockFilterButton
                                    key={opt.value}
                                    label={opt.label}
                                    active={typeFilter === opt.value}
                                    onClick={() => setTypeFilter(opt.value)}
                                    variant="type"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Информация о выбранных фильтрах */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Выбрано:</span> {
                                periodFilter === 'all' ? 'Все истории' :
                                periodFilter === 'week' ? 'За неделю' :
                                periodFilter === 'month' ? 'За месяц' :
                                periodFilter === 'quarter' ? 'За квартал' :
                                periodFilter === 'year' ? 'За год' :
                                'Свой период'
                            } + {
                                typeFilter === 'all' ? 'Все типы' :
                                typeFilter === 'manual' ? 'Вручную' :
                                'Наш сервис'
                            }
                        </p>
                    </div>
                </div>
            </Sandbox>

            {/* РАЗДЕЛ 2: МЕТРИКИ ДАШБОРДА */}
            <hr className="!my-10" />
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">2. Метрики дашборда</h2>
            
            <p className="!text-base !leading-relaxed !text-gray-700">
                Дашборд показывает 8 карточек с ключевыми показателями эффективности. Карточки размещены в 
                формате бенто-сетки — 4 карточки в верхнем ряду (разного размера) и 4 мини-карточки в нижнем ряду.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Главный ряд карточек</h3>

            {/* Карточка 1: Сумма показов */}
            <div className="not-prose mt-6">
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-600 rounded-r-lg p-4">
                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        1. Сумма показов
                    </h4>
                    <p className="text-sm text-indigo-800">
                        <strong>Самая большая карточка</strong> (занимает 2 колонки). Показывает общее количество просмотров всех историй.
                    </p>
                    <ul className="text-sm text-indigo-700 space-y-1 mt-2 ml-4">
                        <li>• <strong>Иконка:</strong> Глаз (фиолетовый фон)</li>
                        <li>• <strong>График:</strong> Линия тренда показов по времени (показывает динамику роста или падения)</li>
                        <li>• <strong>Зачем:</strong> Главный показатель охвата — сколько человек увидели ваши истории</li>
                    </ul>
                </div>
            </div>

            {/* Карточка 2: Эквивалент в рекламе */}
            <div className="not-prose mt-4">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-600 rounded-r-lg p-4">
                    <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        2. Эквивалент в рекламе
                    </h4>
                    <p className="text-sm text-emerald-800">
                        <strong>Показывает экономию бюджета.</strong> Рассчитывает, сколько стоило бы получить такой же охват через таргетированную рекламу ВКонтакте.
                    </p>
                    <ul className="text-sm text-emerald-700 space-y-1 mt-2 ml-4">
                        <li>• <strong>Иконка:</strong> Денежный знак (зелёный фон)</li>
                        <li>• <strong>Формула:</strong> (Показы / 1000) × 150₽ (CPM = 150₽ за 1000 показов)</li>
                        <li>• <strong>Подсказка:</strong> При наведении курсора на иконку информации появляется объяснение формулы</li>
                        <li>• <strong>Бейдж:</strong> "Вы сэкономили бюджет" (зелёный)</li>
                    </ul>
                </div>
            </div>

            {/* Карточка 3: Клики + CTR */}
            <div className="not-prose mt-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-r-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        3. Клики + CTR
                    </h4>
                    <p className="text-sm text-blue-800">
                        <strong>Показывает эффективность ссылок.</strong> Количество переходов по ссылкам и процент кликнувших пользователей.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 mt-2 ml-4">
                        <li>• <strong>Иконка:</strong> Курсор (синий фон)</li>
                        <li>• <strong>График:</strong> Линия тренда кликов</li>
                        <li>• <strong>CTR:</strong> Click-Through Rate — процент пользователей, перешедших по ссылке</li>
                        <li>• <strong>Формула CTR:</strong> (Клики / Просмотры) × 100%</li>
                        <li>• <strong>Подсказка:</strong> При наведении на "CTR" появляется объяснение метрики</li>
                    </ul>
                </div>
            </div>

            {/* Карточка 4: Активность */}
            <div className="not-prose mt-4">
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-600 rounded-r-lg p-4">
                    <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        4. Активность
                    </h4>
                    <p className="text-sm text-pink-800">
                        <strong>Суммарная вовлечённость.</strong> Показывает общее количество действий пользователей с историями.
                    </p>
                    <ul className="text-sm text-pink-700 space-y-1 mt-2 ml-4">
                        <li>• <strong>Иконка:</strong> Сердечко (розовый фон)</li>
                        <li>• <strong>Разбивка по действиям:</strong></li>
                        <li className="ml-4">◦ 🔴 Лайки — сколько пользователей поставили "Нравится"</li>
                        <li className="ml-4">◦ 🟣 Репосты — сколько раз поделились</li>
                        <li className="ml-4">◦ 🔵 Ответы — ответы в комментариях + личные сообщения</li>
                        <li>• <strong>Зачем:</strong> Показывает реальный интерес аудитории к контенту</li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Нижний ряд мини-карточек</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Четыре компактные карточки с дополнительными метриками и рассчитанными показателями.
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Карточка 5: Историй */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        5. Историй
                    </h4>
                    <p className="text-xs text-gray-600">Количество историй в выбранном периоде и типе (с учётом фильтров)</p>
                </div>

                {/* Карточка 6: Подписки */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        6. Подписки
                    </h4>
                    <p className="text-xs text-gray-600">Новые подписчики, которые подписались после просмотра историй</p>
                </div>

                {/* Карточка 7: Скрытия */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        7. Скрытия
                    </h4>
                    <p className="text-xs text-gray-600">Сколько пользователей скрыли историю (негативная реакция). Чем меньше — тем лучше</p>
                </div>

                {/* Карточка 8: ER View */}
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-lg p-3">
                    <h4 className="font-bold text-indigo-900 text-sm mb-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        8. ER View
                    </h4>
                    <p className="text-xs text-indigo-700">
                        <strong>Engagement Rate View</strong> — уровень вовлечённости. 
                        Формула: ((Лайки + Репосты + Ответы) / Просмотры) × 100%
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">
                        • 3-5% — хороший показатель<br/>
                        • Меньше 1% — стоит улучшить контент
                    </p>
                </div>
            </div>

            {/* Интерактивная демонстрация карточек */}
            <Sandbox
                title="Демонстрация метрических карточек"
                description="Посмотрите на примеры карточек с графиками и метриками."
                instructions={[
                    "Обратите внимание на <strong>цветовую кодировку</strong> — каждая метрика имеет свой цвет",
                    "График показывает <strong>тренд изменения</strong> показателей по времени",
                    "Наведите курсор на карточки — появляется эффект подсветки границы"
                ]}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Карточка "Сумма показов" с графиком */}
                    <MockMetricCard
                        title="Сумма показов"
                        value="25,430"
                        colSpan="col-span-1 md:col-span-2"
                        bgColor="bg-indigo-50"
                        iconColor="text-indigo-600"
                        textColor="text-indigo-900"
                        icon={
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        }
                    >
                        <div className="mt-4 h-16 w-full">
                            <MockSparkline data={demoViews} color="text-indigo-500" />
                        </div>
                    </MockMetricCard>

                    {/* Карточка "Эквивалент в рекламе" */}
                    <MockMetricCard
                        title="Эквивалент в рекламе"
                        value="3,815 ₽"
                        bgColor="bg-emerald-50"
                        iconColor="text-emerald-600"
                        textColor="text-emerald-600"
                        icon={
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    >
                        <div className="mt-3">
                            <div className="bg-emerald-50 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-800 inline-block">
                                Вы сэкономили бюджет
                            </div>
                        </div>
                    </MockMetricCard>

                    {/* Карточка "Клики + CTR" */}
                    <MockMetricCard
                        title="Клики"
                        value="342"
                        bgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        icon={
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                        }
                    >
                        <div className="mt-3 flex items-end gap-2">
                            <div className="flex-1 h-12">
                                <MockSparkline data={[50, 60, 75, 85, 90, 110, 95]} color="text-blue-500" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">CTR</p>
                                <p className="text-lg font-bold text-blue-600">1.3%</p>
                            </div>
                        </div>
                    </MockMetricCard>
                </div>
            </Sandbox>

            {/* РАЗДЕЛ 3: РАСЧЁТНЫЕ ПОКАЗАТЕЛИ */}
            <hr className="!my-10" />
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">3. Расчётные показатели</h2>
            
            <p className="!text-base !leading-relaxed !text-gray-700">
                Дашборд автоматически рассчитывает три важных показателя эффективности. 
                Эти метрики помогают понять, насколько успешно работают ваши истории.
            </p>

            <div className="not-prose space-y-4 mt-6">
                {/* CTR */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <h4 className="font-bold text-blue-900 mb-2">CTR (Click-Through Rate) — Кликабельность</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Формула:</strong> (Клики / Просмотры) × 100%</p>
                        <p><strong>Что показывает:</strong> Процент пользователей, которые перешли по ссылке после просмотра истории</p>
                        <p><strong>Пример:</strong> 1000 просмотров, 15 кликов → CTR = 1.5%</p>
                        <div className="bg-blue-100 rounded p-2 mt-2">
                            <p className="font-semibold">Как оценивать:</p>
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>• Больше 1% — отличный результат</li>
                                <li>• 0.5-1% — хороший результат</li>
                                <li>• Меньше 0.5% — стоит улучшить призыв к действию или ссылку</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ER View */}
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                    <h4 className="font-bold text-indigo-900 mb-2">ER View (Engagement Rate) — Вовлечённость</h4>
                    <div className="space-y-2 text-sm text-indigo-800">
                        <p><strong>Формула:</strong> ((Лайки + Репосты + Ответы) / Просмотры) × 100%</p>
                        <p><strong>Что показывает:</strong> Процент пользователей, которые проявили активность (лайкнули, поделились или ответили)</p>
                        <p><strong>Пример:</strong> 1000 просмотров, 30 лайков, 5 репостов, 10 ответов → ER = 4.5%</p>
                        <div className="bg-indigo-100 rounded p-2 mt-2">
                            <p className="font-semibold">Как оценивать:</p>
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>• 3-5% — отличная вовлечённость</li>
                                <li>• 1-3% — нормальная вовлечённость</li>
                                <li>• Меньше 1% — контент не заинтересовал аудиторию</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Эквивалент в рекламе */}
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                    <h4 className="font-bold text-emerald-900 mb-2">Эквивалент в рекламе — Экономия бюджета</h4>
                    <div className="space-y-2 text-sm text-emerald-800">
                        <p><strong>Формула:</strong> (Просмотры / 1000) × 150₽</p>
                        <p><strong>Что показывает:</strong> Примерная стоимость получения такого же охвата через таргетированную рекламу ВКонтакте</p>
                        <p><strong>CPM (Cost Per Mille):</strong> Стоимость 1000 показов рекламы ≈ 150₽ (средний показатель по рынку)</p>
                        <p><strong>Пример:</strong> 10,000 просмотров → (10,000 / 1000) × 150₽ = 1,500₽ сэкономлено</p>
                        <div className="bg-emerald-100 rounded p-2 mt-2">
                            <p className="font-semibold">Зачем нужно:</p>
                            <p className="mt-1">Помогает оценить реальную ценность органических историй. Показывает, сколько денег вы сэкономили, получив охват бесплатно через автоматизацию историй.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* РАЗДЕЛ 4: СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ */}
            <hr className="!my-10" />
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">4. Сценарии использования дашборда</h2>
            
            <p className="!text-base !leading-relaxed !text-gray-700">
                Дашборд — это не просто набор цифр. Это инструмент для принятия решений. 
                Вот три частых сценария, когда дашборд особенно полезен.
            </p>

            <div className="not-prose space-y-6 mt-6">
                {/* Сценарий 1 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 border-b border-purple-200">
                        <h3 className="font-bold text-purple-900">Сценарий 1: Сравнение ручных и автоматических историй</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-100 rounded-full p-2 mt-0.5">
                                <span className="text-purple-700 font-bold text-sm">1</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Выберите фильтр "Наш сервис"</p>
                                <p className="text-sm text-gray-600">Посмотрите статистику автоматических историй (CTR, ER, охваты)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-100 rounded-full p-2 mt-0.5">
                                <span className="text-purple-700 font-bold text-sm">2</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Переключите на "Вручную"</p>
                                <p className="text-sm text-gray-600">Сравните показатели с ручными историями</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-100 rounded-full p-2 mt-0.5">
                                <span className="text-purple-700 font-bold text-sm">3</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Сделайте выводы</p>
                                <p className="text-sm text-gray-600">
                                    Если автоматические истории показывают лучший CTR и ER — продолжайте использовать автоматизацию. 
                                    Если хуже — проверьте настройки шаблонов и изображения товаров.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Сценарий 2 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b border-orange-200">
                        <h3 className="font-bold text-orange-900">Сценарий 2: Анализ эффективности недели</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 rounded-full p-2 mt-0.5">
                                <span className="text-orange-700 font-bold text-sm">1</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Выберите "За неделю"</p>
                                <p className="text-sm text-gray-600">Дашборд покажет результаты последних 7 дней</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 rounded-full p-2 mt-0.5">
                                <span className="text-orange-700 font-bold text-sm">2</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Посмотрите на графики трендов</p>
                                <p className="text-sm text-gray-600">
                                    Линия показов растёт → хорошо, публикуем регулярно<br/>
                                    Линия падает → возможно, снизилась частота публикаций или упало качество
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 rounded-full p-2 mt-0.5">
                                <span className="text-orange-700 font-bold text-sm">3</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Проверьте ER и CTR</p>
                                <p className="text-sm text-gray-600">
                                    Если показатели упали по сравнению с прошлой неделей — пересмотрите контент и ссылки
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Сценарий 3 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 px-4 py-3 border-b border-cyan-200">
                        <h3 className="font-bold text-cyan-900">Сценарий 3: Подготовка отчёта для руководителя</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="bg-cyan-100 rounded-full p-2 mt-0.5">
                                <span className="text-cyan-700 font-bold text-sm">1</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Выберите "За месяц"</p>
                                <p className="text-sm text-gray-600">Соберите данные за последние 30 дней</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-cyan-100 rounded-full p-2 mt-0.5">
                                <span className="text-cyan-700 font-bold text-sm">2</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Запишите ключевые метрики</p>
                                <p className="text-sm text-gray-600">
                                    • Сумма показов (охват)<br/>
                                    • Эквивалент в рекламе (экономия бюджета)<br/>
                                    • ER View (вовлечённость)<br/>
                                    • Количество историй (объём контента)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-cyan-100 rounded-full p-2 mt-0.5">
                                <span className="text-cyan-700 font-bold text-sm">3</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Сформулируйте выводы</p>
                                <p className="text-sm text-gray-600">
                                    Пример: "За месяц опубликовали 45 историй, получили 18,500 просмотров, 
                                    сэкономили 2,775₽ на рекламе, ER составил 3.2% (нормальный уровень)"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Финальный блок с советами */}
            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-green-800">
                        <p className="font-semibold mb-1">Полезные советы</p>
                        <ul className="space-y-1 ml-4">
                            <li>• <strong>Проверяйте дашборд регулярно</strong> — раз в неделю для отслеживания динамики</li>
                            <li>• <strong>Сравнивайте периоды</strong> — смотрите, как меняются показатели от недели к неделе</li>
                            <li>• <strong>Обращайте внимание на скрытия</strong> — если их много, контент не нравится аудитории</li>
                            <li>• <strong>Используйте графики</strong> — они показывают тренды лучше, чем цифры</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-1-4-dashboard" />
        </article>
    );
};
