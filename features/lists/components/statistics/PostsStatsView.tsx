
import React, { useMemo, useState } from 'react';
import { PostStats } from '../../../../services/api/lists.api';
import { MetricBlock, TopPostCard } from './PostsStatsComponents';
import { Chart, Metric } from './Chart';
import { StatsPeriod, StatsGroupBy } from '../../types';
import { CustomDatePicker } from '../../../../shared/components/pickers/CustomDatePicker';

const StatCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 min-w-[250px] ${className}`}>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">{title}</h4>
        {children}
    </div>
);

interface PostsStatsViewProps {
    postStats: PostStats;
    statsPeriod?: StatsPeriod;
    statsGroupBy?: StatsGroupBy;
    onParamsChange?: (period: StatsPeriod, groupBy: StatsGroupBy, dateFrom?: string, dateTo?: string) => void;
    isLoading?: boolean;
}

// Опции для выбора периода
const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
    { value: 'all', label: 'За всё время' },
    { value: 'week', label: 'За неделю' },
    { value: 'month', label: 'За месяц' },
    { value: 'quarter', label: 'За квартал' },
    { value: 'year', label: 'За год' },
    { value: 'custom', label: 'Свой период' },
];

// Опции для выбора группировки (зависят от периода)
const getGroupByOptions = (period: StatsPeriod): { value: StatsGroupBy; label: string }[] => {
    const all: { value: StatsGroupBy; label: string }[] = [
        { value: 'day', label: 'По дням' },
        { value: 'week', label: 'По неделям' },
        { value: 'month', label: 'По месяцам' },
        { value: 'quarter', label: 'По кварталам' },
        { value: 'year', label: 'По годам' },
    ];
    
    switch (period) {
        case 'week': return [all[0]]; // Только по дням
        case 'month': return [all[0], all[1]]; // Дни, Недели
        case 'quarter': return [all[0], all[1], all[2]]; // Дни, Недели, Месяцы
        case 'year': return [all[1], all[2], all[3]]; // Недели, Месяцы, Кварталы
        case 'custom': return all; // Все варианты для кастомного периода
        default: return all; // All time - всё доступно
    }
};

export const PostsStatsView: React.FC<PostsStatsViewProps> = ({ 
    postStats: ps,
    statsPeriod = 'all',
    statsGroupBy = 'month',
    onParamsChange,
    isLoading
}) => {
    // Локальное состояние для дат
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
    // Поднимаем состояние метрик графика сюда, чтобы оно сохранялось при смене периода
    const [activeMetrics, setActiveMetrics] = useState<Set<Metric>>(new Set(['count']));
    
    // Если текущая группировка недоступна для нового периода, выбираем дефолтную
    const availableGroupOptions = useMemo(() => getGroupByOptions(statsPeriod as StatsPeriod), [statsPeriod]);
    
    const handlePeriodChange = (newPeriod: StatsPeriod) => {
        if (!onParamsChange) return;
        
        let newGroupBy = statsGroupBy as StatsGroupBy;
        const newOptions = getGroupByOptions(newPeriod);
        if (!newOptions.find(o => o.value === newGroupBy)) {
            if (newPeriod === 'week') newGroupBy = 'day' as StatsGroupBy;
            else if (newPeriod === 'month') newGroupBy = 'day' as StatsGroupBy;
            else if (newPeriod === 'quarter') newGroupBy = 'week' as StatsGroupBy;
            else if (newPeriod === 'year') newGroupBy = 'month' as StatsGroupBy;
            else newGroupBy = 'month' as StatsGroupBy; // all or custom
        }
        
        if (newPeriod === 'custom') {
             const now = new Date();
             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
             const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
             setDateFrom(startOfMonth);
             setDateTo(endOfMonth);
             onParamsChange(newPeriod, newGroupBy, startOfMonth, endOfMonth);
        } else {
             onParamsChange(newPeriod, newGroupBy);
        }
    };

    const handleDateChange = (type: 'from' | 'to', val: string) => {
        if (type === 'from') setDateFrom(val);
        else setDateTo(val);
        
        const newFrom = type === 'from' ? val : dateFrom;
        const newTo = type === 'to' ? val : dateTo;
        
        if (newFrom && newTo && onParamsChange) {
            onParamsChange('custom' as StatsPeriod, statsGroupBy, newFrom, newTo);
        }
    }

    const handleMetricToggle = (metric: Metric) => {
        setActiveMetrics(prev => {
            const newSet = new Set(prev);
            if (newSet.has(metric)) {
                if (newSet.size > 1) newSet.delete(metric);
            } else {
                newSet.add(metric);
            }
            return newSet;
        });
    };

    return (
        <div className={`flex flex-col gap-4 mb-4 transition-opacity duration-200 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex flex-wrap gap-4">
                    {/* 1. General Stats */}
                <StatCard title="Общая активность" className="flex-grow max-w-2xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <MetricBlock label="Просмотры" total={ps.total_views} avg={ps.avg_views} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>} 
                        />
                        <MetricBlock label="Лайки" total={ps.total_likes} avg={ps.avg_likes} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} 
                        />
                        <MetricBlock label="Комменты" total={ps.total_comments} avg={ps.avg_comments} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" /></svg>} 
                        />
                        <MetricBlock label="Репосты" total={ps.total_reposts} avg={ps.avg_reposts} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>} 
                        />
                    </div>
                </StatCard>

                {/* 2. Top Posts */}
                <StatCard title="Лучшие публикации" className="min-w-[280px]">
                    <div className="space-y-1">
                            <TopPostCard item={ps.top_views} type="просмотрам" color="bg-gray-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                            <TopPostCard item={ps.top_likes} type="лайкам" color="bg-pink-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />
                            <TopPostCard item={ps.top_comments} type="комментариям" color="bg-blue-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" /></svg>} />
                            <TopPostCard item={ps.top_reposts} type="репостам" color="bg-purple-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342" /></svg>} />
                    </div>
                </StatCard>
            </div>
            
            {/* 3. Chart */}
            <StatCard title="Динамика публикаций">
                {onParamsChange && (
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 mb-4 bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-gray-500">Период:</span>
                            <div className="flex bg-white rounded border border-gray-300 p-0.5">
                                {PERIOD_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handlePeriodChange(opt.value)}
                                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                                            statsPeriod === opt.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            
                            {statsPeriod === 'custom' && (
                                <div className="flex items-center gap-2 ml-2 animate-fade-in-up">
                                    <CustomDatePicker 
                                        value={dateFrom} 
                                        onChange={(val) => handleDateChange('from', val)} 
                                        placeholder="С"
                                        className="w-28 h-7 text-xs"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <CustomDatePicker 
                                        value={dateTo} 
                                        onChange={(val) => handleDateChange('to', val)} 
                                        placeholder="По"
                                        className="w-28 h-7 text-xs"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-medium text-gray-500">Шаг:</span>
                             <div className="flex bg-white rounded border border-gray-300 p-0.5">
                                {availableGroupOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => onParamsChange(statsPeriod as StatsPeriod, opt.value, dateFrom, dateTo)}
                                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                                            statsGroupBy === opt.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                )}
                <Chart 
                    data={ps.chart_data} 
                    activeMetrics={activeMetrics} 
                    onMetricToggle={handleMetricToggle} 
                />
            </StatCard>
        </div>
    );
};
