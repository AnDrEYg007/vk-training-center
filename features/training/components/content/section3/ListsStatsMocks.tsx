import React, { useState } from 'react';

// =====================================================================
// Вспомогательные компоненты
// =====================================================================

// Обёртка для карточки статистики
export const MockStatCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
            {title}
        </h4>
        {children}
    </div>
);

// Значение с процентом
export const MockValueWithPercent: React.FC<{ value: number; percent: number }> = ({ value, percent }) => (
    <span className="font-bold">
        {value.toLocaleString()} <span className="text-xs font-normal opacity-70">({percent}%)</span>
    </span>
);

// Прогресс-бар
export const MockProgressBar: React.FC<{ 
    label: string; 
    value: number; 
    percent: number; 
    color: string;
}> = ({ label, value, percent, color }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs">
            <span className="text-gray-600">{label}</span>
            <span className="font-semibold text-gray-900">{value.toLocaleString()} ({percent}%)</span>
        </div>
        <div className="bg-gray-200 rounded-full h-1.5">
            <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

// =====================================================================
// Mock-карточки статистики пользователей
// =====================================================================

// 1. Качество базы
export const MockQualityCard: React.FC = () => {
    const total = 12458;
    const active = 11234;
    const banned = 542;
    const deleted = 682;

    return (
        <MockStatCard title="Качество базы">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Всего</span>
                    <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Активные</span>
                        <span className="text-green-600 font-semibold">
                            <MockValueWithPercent value={active} percent={Math.round((active / total) * 100)} />
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Забанены</span>
                        <span className="text-red-600 font-semibold">
                            <MockValueWithPercent value={banned} percent={Math.round((banned / total) * 100)} />
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Удалены</span>
                        <span className="text-gray-500 font-semibold">
                            <MockValueWithPercent value={deleted} percent={Math.round((deleted / total) * 100)} />
                        </span>
                    </div>
                </div>
            </div>
        </MockStatCard>
    );
};

// 2. Доступность ЛС (для рассылки)
export const MockMailingStatusCard: React.FC = () => {
    const allowed = 8932;
    const forbidden = 3526;
    const target = 7845;
    const total = allowed + forbidden;

    return (
        <MockStatCard title="Доступность ЛС">
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Можно писать</span>
                    <span className="text-green-600 font-semibold">
                        <MockValueWithPercent value={allowed} percent={Math.round((allowed / total) * 100)} />
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Запрещено</span>
                    <span className="text-red-600 font-semibold">
                        <MockValueWithPercent value={forbidden} percent={Math.round((forbidden / total) * 100)} />
                    </span>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="text-xs text-green-700 mb-1">Целевая группа (Актив + ЛС)</div>
                    <div className="text-xl font-bold text-green-800">{target.toLocaleString()}</div>
                </div>
            </div>
        </MockStatCard>
    );
};

// 3. Life Time (Цикл подписки)
export const MockLifetimeCard: React.FC = () => {
    return (
        <MockStatCard title="Life Time (Цикл подписки)">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Среднее по всем</span>
                    <span className="text-2xl font-bold text-indigo-600">142 дня</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">По активным</span>
                        <span className="text-green-600 font-semibold">187 дней</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">По отписавшимся</span>
                        <span className="text-red-600 font-semibold">68 дней</span>
                    </div>
                </div>
            </div>
        </MockStatCard>
    );
};

// 4. Последний контакт (для рассылки)
export const MockLastContactCard: React.FC = () => {
    const data = [
        { label: 'Сегодня', value: 1245, color: 'text-gray-700' },
        { label: '3 дня', value: 2134, color: 'text-gray-700' },
        { label: 'Неделя', value: 1567, color: 'text-gray-700' },
        { label: '>1 месяца', value: 892, color: 'text-orange-600' },
        { label: '>3 месяцев', value: 534, color: 'text-red-600' },
        { label: '>Года', value: 123, color: 'text-red-700' }
    ];

    return (
        <MockStatCard title="Последний контакт (LC)">
            <div className="space-y-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className={`font-semibold ${item.color}`}>{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </MockStatCard>
    );
};

// 5. Демография
export const MockDemographicsCard: React.FC = () => {
    const total = 12458;
    const male = 5234;
    const female = 6892;
    const unknown = 332;

    return (
        <MockStatCard title="Демография">
            <div className="space-y-3">
                <MockProgressBar 
                    label="Женщины" 
                    value={female} 
                    percent={Math.round((female / total) * 100)}
                    color="bg-pink-400"
                />
                <MockProgressBar 
                    label="Мужчины" 
                    value={male} 
                    percent={Math.round((male / total) * 100)}
                    color="bg-blue-400"
                />
                <MockProgressBar 
                    label="Не указан" 
                    value={unknown} 
                    percent={Math.round((unknown / total) * 100)}
                    color="bg-gray-400"
                />
            </div>
        </MockStatCard>
    );
};

// 6. Платформы
export const MockPlatformsCard: React.FC = () => {
    const data = [
        { label: 'm.vk', value: 3245, color: 'bg-orange-300' },
        { label: 'iPhone', value: 2876, color: 'bg-slate-400' },
        { label: 'Android', value: 4123, color: 'bg-emerald-400' },
        { label: 'Web', value: 1892, color: 'bg-blue-400' },
        { label: 'Неизвестно', value: 322, color: 'bg-gray-300' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <MockStatCard title="Платформы">
            <div className="space-y-3">
                {data.map((item, idx) => (
                    <MockProgressBar 
                        key={idx}
                        label={item.label} 
                        value={item.value} 
                        percent={Math.round((item.value / total) * 100)}
                        color={item.color}
                    />
                ))}
            </div>
        </MockStatCard>
    );
};

// 7. Последний онлайн
export const MockOnlineCard: React.FC = () => {
    const data = [
        { label: 'Сегодня', value: 2145, color: 'text-gray-700' },
        { label: '3 дня', value: 3234, color: 'text-gray-700' },
        { label: 'Неделя', value: 2567, color: 'text-gray-700' },
        { label: '>1 месяца', value: 1892, color: 'text-orange-600' },
        { label: '>3 месяцев', value: 1234, color: 'text-red-600' },
        { label: '>Года', value: 523, color: 'text-red-700' }
    ];

    return (
        <MockStatCard title="Последний онлайн">
            <div className="space-y-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className={`font-semibold ${item.color}`}>{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </MockStatCard>
    );
};

// 8. Возраст (столбчатая диаграмма)
export const MockAgeCard: React.FC = () => {
    const data = [
        { label: '<16', value: 234 },
        { label: '16-20', value: 1892 },
        { label: '20-25', value: 3456 },
        { label: '25-30', value: 2876 },
        { label: '30-35', value: 1567 },
        { label: '35-40', value: 892 },
        { label: '40-45', value: 534 },
        { label: '45+', value: 423 }
    ];
    const unknown = 584;
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="md:col-span-2 xl:col-span-2">
            <MockStatCard title="Возраст">
                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-2 h-40">
                        {data.map((item, idx) => {
                            const heightPercent = (item.value / maxValue) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div className="text-xs font-semibold text-purple-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value.toLocaleString()}
                                    </div>
                                    <div 
                                        className="w-full bg-purple-300 group-hover:bg-purple-400 rounded-t transition-colors"
                                        style={{ height: `${heightPercent}%` }}
                                    ></div>
                                    <div className="text-xs text-gray-600 mt-2">{item.label}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-600">Не указано</span>
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            {unknown.toLocaleString()}
                        </span>
                    </div>
                </div>
            </MockStatCard>
        </div>
    );
};

// 9. Дни рождения (столбчатая диаграмма)
export const MockBirthdayCard: React.FC = () => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const data = [423, 534, 678, 892, 1234, 1567, 1892, 2145, 1876, 1456, 987, 756];
    const unknown = 892;
    const currentMonth = 1; // Февраль (индекс 1)
    const maxValue = Math.max(...data);

    return (
        <div className="md:col-span-2 xl:col-span-2">
            <MockStatCard title="Дни рождения">
                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-1 h-40">
                        {data.map((value, idx) => {
                            const heightPercent = (value / maxValue) * 100;
                            const isCurrent = idx === currentMonth;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div className={`text-xs font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent ? 'text-indigo-700' : 'text-indigo-600'}`}>
                                        {value.toLocaleString()}
                                    </div>
                                    <div 
                                        className={`w-full rounded-t transition-colors ${
                                            isCurrent 
                                                ? 'bg-indigo-600' 
                                                : 'bg-indigo-300 group-hover:bg-indigo-400'
                                        }`}
                                        style={{ height: `${heightPercent}%` }}
                                    ></div>
                                    <div className="text-xs text-gray-600 mt-2">{months[idx]}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-600">Не указано</span>
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            {unknown.toLocaleString()}
                        </span>
                    </div>
                </div>
            </MockStatCard>
        </div>
    );
};

// 10. География (круговая диаграмма)
export const MockGeoCard: React.FC = () => {
    const data = [
        { label: 'Москва', value: 3456, color: '#6366f1' },
        { label: 'Санкт-Петербург', value: 2145, color: '#ec4899' },
        { label: 'Казань', value: 1234, color: '#3b82f6' },
        { label: 'Екатеринбург', value: 892, color: '#10b981' },
        { label: 'Нижний Новгород', value: 678, color: '#f59e0b' }
    ];
    const other = 3053;
    const total = data.reduce((sum, item) => sum + item.value, 0) + other;

    // Простая круговая диаграмма через CSS conic-gradient
    let currentAngle = 0;
    const segments = [...data, { label: 'Прочие', value: other, color: '#6b7280' }];
    const gradientStops = segments.map(item => {
        const angle = (item.value / total) * 360;
        const stop = `${item.color} ${currentAngle}deg ${currentAngle + angle}deg`;
        currentAngle += angle;
        return stop;
    }).join(', ');

    return (
        <MockStatCard title="География">
            <div className="flex items-start gap-4">
                <div 
                    className="w-32 h-32 rounded-full flex-shrink-0"
                    style={{ background: `conic-gradient(${gradientStops})` }}
                ></div>
                <div className="flex-1 space-y-2">
                    {segments.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                            <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-gray-700 flex-1">{item.label}</span>
                            <span className="font-semibold text-gray-900">
                                {Math.round((item.value / total) * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </MockStatCard>
    );
};

// =====================================================================
// Mock-компоненты статистики постов
// =====================================================================

// Блок метрики (Просмотры, Лайки и т.д.)
export const MockMetricBlock: React.FC<{
    icon: React.ReactNode;
    title: string;
    total: number;
    avg: number;
    color: string;
}> = ({ icon, title, total, avg, color }) => (
    <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white`}>
                {icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Среднее: {avg.toFixed(1)}</div>
        </div>
    </div>
);

// Карточка топового поста (с поддержкой metric)
export const MockTopPostCard: React.FC<{
    metric: 'views' | 'likes' | 'comments' | 'reposts';
}> = ({ metric }) => {
    const data = {
        views: { 
            title: 'Лучший пост по просмотрам', 
            postId: '-12345_11111', 
            value: 12456, 
            badgeColor: 'bg-gray-600', 
            badgeLabel: 'Просмотры' 
        },
        likes: { 
            title: 'Лучший пост по лайкам', 
            postId: '-12345_22222', 
            value: 856, 
            badgeColor: 'bg-pink-600', 
            badgeLabel: 'Лайки' 
        },
        comments: { 
            title: 'Лучший пост по комментариям', 
            postId: '-12345_33333', 
            value: 234, 
            badgeColor: 'bg-blue-600', 
            badgeLabel: 'Комментарии' 
        },
        reposts: { 
            title: 'Лучший пост по репостам', 
            postId: '-12345_44444', 
            value: 123, 
            badgeColor: 'bg-purple-600', 
            badgeLabel: 'Репосты' 
        }
    };
    
    const post = data[metric];
    
    return (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-2">{post.title}</div>
            <a 
                href={`https://vk.com/wall${post.postId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline mb-2 block"
            >
                vk.com/wall{post.postId}
            </a>
            <span className={`inline-block px-2 py-1 ${post.badgeColor} text-white text-xs rounded`}>
                {post.badgeLabel}: {post.value.toLocaleString()}
            </span>
        </div>
    );
};

// Иконки для метрик (inline SVG)
export const ViewsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const LikesIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

export const CommentsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const RepostsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

// =====================================================================
// Mock линейного графика (с поддержкой period и metric)
// =====================================================================

export const MockLineChart: React.FC<{
    period: 'day' | 'week' | 'month';
    metric: 'views' | 'likes' | 'comments' | 'reposts';
}> = ({ period, metric }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Генерация mock-данных на основе периода и метрики
    const generateData = (period: string, metric: string) => {
        const multipliers = { 
            views: 1000, 
            likes: 50, 
            comments: 10, 
            reposts: 5 
        };
        const mult = multipliers[metric as keyof typeof multipliers];
        
        if (period === 'day') {
            return Array.from({ length: 7 }, (_, i) => ({
                date: `${20 + i}.02`,
                value: Math.floor(Math.random() * mult) + mult
            }));
        } else if (period === 'week') {
            return Array.from({ length: 4 }, (_, i) => ({
                date: `Нед. ${i + 1}`,
                value: Math.floor(Math.random() * mult * 7) + mult * 7
            }));
        } else {
            return Array.from({ length: 6 }, (_, i) => ({
                date: ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев'][i],
                value: Math.floor(Math.random() * mult * 30) + mult * 30
            }));
        }
    };

    const data = generateData(period, metric);
    
    const colors = { 
        views: '#6b7280', 
        likes: '#ec4899', 
        comments: '#3b82f6', 
        reposts: '#9333ea' 
    };
    
    const labels = { 
        views: 'Просмотры', 
        likes: 'Лайки', 
        comments: 'Комментарии', 
        reposts: 'Репосты' 
    };
    
    const color = colors[metric];
    const label = labels[metric];

    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                Нет данных для графика
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const width = 800;
    const height = 320;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Генерация точек для polyline
    const points = data.map((item, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (item.value / maxValue) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative">
            <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-80">
                {/* Сетка */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                    const y = padding.top + chartHeight * (1 - ratio);
                    return (
                        <g key={idx}>
                            <line 
                                x1={padding.left} 
                                y1={y} 
                                x2={width - padding.right} 
                                y2={y} 
                                stroke="#e5e7eb" 
                                strokeWidth="1"
                            />
                            <text 
                                x={padding.left - 10} 
                                y={y + 4} 
                                textAnchor="end" 
                                fontSize="12" 
                                fill="#6b7280"
                            >
                                {Math.round(maxValue * ratio)}
                            </text>
                        </g>
                    );
                })}

                {/* Линия графика */}
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                />

                {/* Точки данных */}
                {data.map((item, index) => {
                    const x = padding.left + (index / (data.length - 1)) * chartWidth;
                    const y = padding.top + chartHeight - (item.value / maxValue) * chartHeight;
                    const isHovered = hoveredIndex === index;

                    return (
                        <g key={index}>
                            <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 6 : 4}
                                fill={color}
                                className="cursor-pointer transition-all"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                            {isHovered && (
                                <g>
                                    <rect
                                        x={x - 40}
                                        y={y - 35}
                                        width="80"
                                        height="30"
                                        fill="#1f2937"
                                        rx="4"
                                    />
                                    <text
                                        x={x}
                                        y={y - 23}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="white"
                                        fontWeight="bold"
                                    >
                                        {item.value}
                                    </text>
                                    <text
                                        x={x}
                                        y={y - 12}
                                        textAnchor="middle"
                                        fontSize="9"
                                        fill="#9ca3af"
                                    >
                                        {item.date}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* Метки оси X */}
                {data.map((item, index) => {
                    if (index % Math.ceil(data.length / 6) !== 0 && index !== data.length - 1) return null;
                    const x = padding.left + (index / (data.length - 1)) * chartWidth;
                    return (
                        <text
                            key={index}
                            x={x}
                            y={height - padding.bottom + 20}
                            textAnchor="middle"
                            fontSize="11"
                            fill="#6b7280"
                        >
                            {item.date}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};
