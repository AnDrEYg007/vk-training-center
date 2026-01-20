import React, { useState, useMemo } from 'react';
import { UnifiedStory } from '../../types';
import { Sparkline } from './Sparkline';
import { DonutChart } from './DonutChart';
import { CustomDatePicker } from '../../../../../shared/components/pickers/CustomDatePicker';

interface StoriesDashboardProps {
    stories: UnifiedStory[];
    getCount: (field: any) => number;
}

type PeriodType = 'all' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export const StoriesDashboard: React.FC<StoriesDashboardProps> = ({ stories, getCount }) => {
    const [filterType, setFilterType] = useState<'all' | 'manual' | 'auto'>('all');
    const [periodType, setPeriodType] = useState<PeriodType>('all');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');

    // Предварительная подготовка данных
    const { stats, history } = useMemo(() => {
        // Сортируем хронологически для графиков
        const sorted = [...stories].sort((a, b) => a.date - b.date);
        
        const now = new Date();
        // Reset hours for accurate date comparison
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const filtered = sorted.filter(s => {
            // 1. Filter by Type
            let matchesType = true;
            if (filterType === 'all') matchesType = true;
            else if (filterType === 'auto') matchesType = s.is_automated;
            else if (filterType === 'manual') matchesType = !s.is_automated;
            
            if (!matchesType) return false;

            // 2. Filter by Period
            const storyDate = new Date(s.date * 1000); // timestamp is in seconds
            
            if (periodType === 'all') return true;

            const timeDiff = today.getTime() - storyDate.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            if (periodType === 'week') {
                return daysDiff <= 7 && daysDiff >= -1; // Include future stories? Usually stats are past. Allow slightly future if timezones align.
            }
            if (periodType === 'month') {
                 return daysDiff <= 30;
            }
            if (periodType === 'quarter') {
                 return daysDiff <= 90;
            }
            if (periodType === 'year') {
                 return daysDiff <= 365;
            }
            if (periodType === 'custom') {
                 // Parse custom dates
                 let afterStart = true;
                 let beforeEnd = true;
                 
                 if (customStartDate) {
                     const start = new Date(customStartDate);
                     start.setHours(0,0,0,0);
                     if (storyDate < start) afterStart = false;
                 }
                 if (customEndDate) {
                     const end = new Date(customEndDate);
                     end.setHours(23,59,59,999);
                     if (storyDate > end) beforeEnd = false;
                 }
                 return afterStart && beforeEnd;
            }
            return true;
        });

        const initial = {
            count: 0,
            views: 0,
            likes: 0,
            replies: 0,
            clicks: 0,
            shares: 0,
            subscribers: 0,
            hides: 0,
            msg: 0,
            ctr: 0,
            er: 0,
            moneySaved: 0
        };

        const totalStats = filtered.reduce((acc, story) => {
            acc.count += 1;
            const detailedViews = story.detailed_stats?.views?.count || 0;
            const realViews = Math.max(story.views || 0, detailedViews);
            acc.views += realViews;

            if (story.detailed_stats) {
                acc.likes += getCount(story.detailed_stats.likes);
                acc.replies += getCount(story.detailed_stats.replies) + getCount(story.detailed_stats.answer);
                acc.clicks += getCount(story.detailed_stats.open_link);
                acc.shares += getCount(story.detailed_stats.shares);
                acc.subscribers += getCount(story.detailed_stats.subscribers);
                acc.hides += getCount(story.detailed_stats.bans);
                acc.msg += getCount(story.detailed_stats.answer);
            }
            return acc;
        }, initial);

        // История для графиков (последние 30 точек для красоты)
        const chartData = filtered.map(story => ({
            views: Math.max(story.views || 0, story.detailed_stats?.views?.count || 0),
            likes: getCount(story.detailed_stats?.likes),
            clicks: getCount(story.detailed_stats?.open_link)
        }));

        // Расчет сложных метрик
        totalStats.ctr = totalStats.views > 0 ? (totalStats.clicks / totalStats.views) * 100 : 0;
        const engagements = totalStats.likes + totalStats.shares + totalStats.replies + totalStats.msg;
        totalStats.er = totalStats.views > 0 ? (engagements / totalStats.views) * 100 : 0;

        // Расчет экономии бюджета (1000 показов = 150 рублей)
        totalStats.moneySaved = Math.floor((totalStats.views / 1000) * 150);

        return { stats: totalStats, history: chartData };
    }, [stories, filterType, getCount, periodType, customStartDate, customEndDate]);

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Заголовок и Фильтры */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                     <h2 className="text-xl font-bold text-gray-900 tracking-tight">Обзор эффективности</h2>
                     <p className="text-sm text-gray-500">Сводные показатели за выбранный период</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    
                    {/* Period Filter */}
                    <div className="flex items-center gap-3 overflow-x-auto">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Период:</span>
                        <div className="flex p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                            {[
                                { value: 'all', label: 'За всё время' },
                                { value: 'week', label: 'За неделю' },
                                { value: 'month', label: 'За месяц' },
                                { value: 'quarter', label: 'За квартал' },
                                { value: 'year', label: 'За год' },
                                { value: 'custom', label: 'Свой период' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setPeriodType(opt.value as PeriodType)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                                        periodType === opt.value
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Custom Date Inputs */}
                        {periodType === 'custom' && (
                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-200">
                                <CustomDatePicker 
                                    value={customStartDate} 
                                    onChange={setCustomStartDate} 
                                    placeholder="Начало" 
                                    className="!w-24 !text-xs !py-1.5 !border-gray-100 !bg-gray-50 focus:!bg-white !rounded-lg"
                                />
                                <span className="text-gray-300 text-xs px-1">—</span>
                                <CustomDatePicker 
                                    value={customEndDate} 
                                    onChange={setCustomEndDate} 
                                    placeholder="Конец" 
                                    className="!w-24 !text-xs !py-1.5 !border-gray-100 !bg-gray-50 focus:!bg-white !rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Type Filter */}
                    <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                        {['all', 'manual', 'auto'].map((type) => (
                            <button 
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                    filterType === type 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {{'all': 'Всё', 'manual': 'Ручные', 'auto': 'Авто'}[type]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* БЕНТО-СЕТКА ГРАФИКОВ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* 1. БОЛЬШАЯ КАРТОЧКА: ОХВАТ (Views) - ОБНОВЛЕННЫЙ ДИЗАЙН (Светлый) */}
                <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group flex flex-col justify-between hover:border-indigo-300 transition-colors">
                     <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Сумма показов</p>
                            <h3 className="text-4xl font-extrabold text-indigo-900 mt-2 tracking-tight">
                                {stats.views.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                    </div>
                    
                    <div className="mt-6 h-16 w-full -mb-2">
                         {/* График просмотров (Indigo) */}
                         <Sparkline data={history.map(h => h.views)} colorClass="text-indigo-500" fillClass="text-indigo-500" />
                    </div>
                </div>

                {/* 2. ЭКОНОМИЯ БЮДЖЕТА (Новая карточка) */}
                <div className="col-span-1 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
                     <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="text-gray-500 text-sm font-semibold">Эквивалент в рекламе</p>
                                <div className="group relative">
                                    <svg className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl hidden group-hover:block z-50 leading-relaxed text-center pointer-events-none">
                                        Примерная стоимость получения такого же охвата через официальную таргетированную рекламу (CPM ≈ 150₽ за 1000 показов).
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                                {stats.moneySaved.toLocaleString()} ₽
                            </h3>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-xl">
                             <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                     </div>

                     <div className="mt-4">
                        <div className="bg-emerald-50 rounded-lg px-3 py-2 text-xs font-medium text-emerald-800 inline-block">
                            Вы сэкономили бюджет
                        </div>
                     </div>
                </div>

                {/* 3. КЛИКИ и CTR */}
                <div className="col-span-1 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Клики</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.clicks.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                        </div>
                     </div>

                     <div className="mt-6 flex items-end gap-3">
                         <div className="flex-1 h-12">
                             <Sparkline data={history.map(h => h.clicks)} colorClass="text-blue-500" fillClass="text-blue-500" />
                         </div>
                         <div className="text-right">
                             <div className="flex items-center justify-end gap-1">
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">CTR</p>
                                 <div className="group relative">
                                    <svg className="w-3 h-3 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl hidden group-hover:block z-50 leading-relaxed text-center pointer-events-none">
                                        Click-Through Rate — процент пользователей, перешедших по ссылке (Клики / Просмотры).
                                        <div className="absolute bottom-full right-1 border-4 border-transparent border-b-gray-900"></div>
                                    </div>
                                </div>
                             </div>
                             <p className="text-lg font-bold text-blue-600">{stats.ctr.toFixed(1)}%</p>
                         </div>
                     </div>
                </div>

                {/* 4. ВОВЛЕЧЕННОСТЬ (Pie + List) */}
                <div className="col-span-1 row-span-1 lg:row-span-1 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col hover:border-pink-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">Активность</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {(stats.likes + stats.shares + stats.replies).toLocaleString()}
                                </h3>
                            </div>
                        </div>
                        <div className="p-2 bg-pink-50 rounded-xl">
                            <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                    </div>

                    {/* Мини-список */}
                    <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Лайки
                            </span>
                            <span className="font-bold text-gray-900">{stats.likes}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Репосты
                            </span>
                            <span className="font-bold text-gray-900">{stats.shares}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Ответы
                            </span>
                            <span className="font-bold text-gray-900">{stats.replies + stats.msg}</span>
                        </div>
                    </div>
                </div>

                {/* 5. НИЖНИЙ РЯД: 4 карточки */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                     
                     {/* Историй в выборке */}
                     <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-indigo-200 transition-colors">
                        <div className="p-3 bg-indigo-50 rounded-full shrink-0">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stats.count}</p>
                            <p className="text-xs text-gray-500 font-medium">Историй</p>
                        </div>
                     </div>

                     {/* Подписки */}
                     <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors">
                        <div className="p-3 bg-orange-50 rounded-full shrink-0">
                            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stats.subscribers}</p>
                            <p className="text-xs text-gray-500 font-medium">Новых подписок</p>
                        </div>
                     </div>

                     {/* Скрытия */}
                     <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-gray-300 transition-colors">
                        <div className="p-3 bg-gray-100 rounded-full shrink-0">
                             <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stats.hides}</p>
                            <p className="text-xs text-gray-500 font-medium">Скрытий</p>
                        </div>
                     </div>

                     {/* ER Score */}
                     <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between">
                         <div>
                            <div className="flex items-center gap-1 mb-1">
                                <p className="text-xs text-indigo-400 font-bold uppercase">ER View</p>
                                <div className="group relative">
                                    <svg className="w-3 h-3 text-indigo-400 cursor-help hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl hidden group-hover:block z-50 leading-relaxed text-center pointer-events-none">
                                        Engagement Rate View — уровень вовлеченности на просмотр. (Лайки + Репосты + Ответы) / Просмотры.
                                        <div className="absolute top-full left-1 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-2xl font-black text-indigo-600">{stats.er.toFixed(1)}%</p>
                         </div>
                        <div className="p-2 bg-indigo-100 rounded-full">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                     </div>
                </div>

            </div>
        </div>
    );
};
