
import React from 'react';
import { ListStats } from '../../../../../services/api/lists.api';
import { StatCard, ValueWithPercent, ProgressBar, getPercent } from '../UserStatsComponents';
import { PieChart } from '../PieChart';

interface CardProps {
    stats: ListStats;
    className?: string;
}

export const QualityCard: React.FC<CardProps> = ({ stats, className }) => (
    <StatCard title="Качество базы" className={className}>
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Всего</span>
                <span className="font-bold text-gray-900">{stats.total_users}</span>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex justify-between items-center text-green-700">
                <span className="text-sm">Активные</span>
                <ValueWithPercent value={stats.active_count} total={stats.total_users} />
            </div>
            <div className="flex justify-between items-center text-red-600">
                <span className="text-sm">Забанены</span>
                <ValueWithPercent value={stats.banned_count} total={stats.total_users} />
            </div>
            <div className="flex justify-between items-center text-gray-500">
                <span className="text-sm">Удалены</span>
                <ValueWithPercent value={stats.deleted_count} total={stats.total_users} />
            </div>
        </div>
    </StatCard>
);

export const MailingStatusCard: React.FC<CardProps> = ({ stats, className }) => {
    if (!stats.mailing_stats) return null;
    return (
        <StatCard title="Доступность ЛС" className={className}>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-cyan-700">
                    <span className="text-sm">Можно писать</span>
                    <span className="font-bold">
                        {stats.mailing_stats.allowed_count} <span className="text-xs font-normal opacity-70">({getPercent(stats.mailing_stats.allowed_count, stats.total_users)})</span>
                    </span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                    <span className="text-sm">Запрещено</span>
                    <span className="font-bold">
                        {stats.mailing_stats.forbidden_count} <span className="text-xs font-normal opacity-70">({getPercent(stats.mailing_stats.forbidden_count, stats.total_users)})</span>
                    </span>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex justify-between items-center font-medium text-green-800 bg-green-50 p-2 rounded-md border border-green-100">
                    <span className="text-xs">Целевая (Актив + ЛС)</span>
                    <span>{stats.mailing_stats.active_allowed_count}</span>
                </div>
            </div>
        </StatCard>
    );
};

export const LifetimeCard: React.FC<CardProps> = ({ stats, className }) => {
    // Используем дефолтные значения, если статистики еще нет
    const lifetime = stats.lifetime_stats || { total_avg: 0, allowed_avg: 0, forbidden_avg: 0 };
    const hasData = stats.lifetime_stats !== null && stats.lifetime_stats !== undefined;

    return (
        <StatCard title="Life Time (Цикл подписки)" className={className}>
            <div className="space-y-3">
                {/* Среднее по всем */}
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="text-sm text-gray-800 font-bold">Среднее по всем</span>
                    <span className="font-bold text-indigo-700 text-lg">{hasData ? lifetime.total_avg : '—'} дн.</span>
                </div>
                
                <div className="h-px bg-gray-100"></div>

                {/* По активным */}
                <div className="flex justify-between items-center text-green-700">
                    <span className="text-sm">По активным (в рассылке)</span>
                    <span className="font-bold">{hasData ? lifetime.allowed_avg : '—'} дн.</span>
                </div>
                
                {/* По отписавшимся */}
                <div className="flex justify-between items-center text-red-600">
                    <span className="text-sm">По отписавшимся</span>
                    <span className="font-bold">{hasData ? lifetime.forbidden_avg : '—'} дн.</span>
                </div>

                <div className="mt-2 text-[10px] text-gray-400 leading-tight">
                    {hasData 
                        ? '* Рассчитано как разница между датой первого и последнего сообщения'
                        : '* Требуется запустить "Анализ" диалогов для расчета'}
                </div>
            </div>
        </StatCard>
    );
};

export const LastContactCard: React.FC<CardProps> = ({ stats, className }) => {
    if (!stats.last_contact_stats) return null;
    return (
        <StatCard title="Последний контакт (LC)" className={className}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Сегодня:</span>
                    <ValueWithPercent value={stats.last_contact_stats.today} total={stats.total_users} />
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">&gt; 1 месяца:</span>
                    <ValueWithPercent value={stats.last_contact_stats.month_plus} total={stats.total_users} className="text-amber-600" />
                </div>
                
                <div className="flex justify-between">
                    <span className="text-gray-500">За 3 дня:</span>
                    <ValueWithPercent value={stats.last_contact_stats['3_days']} total={stats.total_users} />
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">&gt; 3 месяцев:</span>
                    <ValueWithPercent value={stats.last_contact_stats['3_months_plus']} total={stats.total_users} className="text-orange-600" />
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500">За неделю:</span>
                    <ValueWithPercent value={stats.last_contact_stats.week} total={stats.total_users} />
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">&gt; Года:</span>
                    <ValueWithPercent value={stats.last_contact_stats.year_plus} total={stats.total_users} className="text-red-600" />
                </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <span>Нет данных:</span>
                <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {stats.last_contact_stats.unknown} ({getPercent(stats.last_contact_stats.unknown, stats.total_users)})
                </span>
            </div>
        </StatCard>
    );
};

export const GeoCard: React.FC<CardProps> = ({ stats, className }) => (
    <StatCard title="География" className={className}>
        <PieChart data={stats.geo_stats} total={stats.total_users} />
    </StatCard>
);

export const DemographicsCard: React.FC<CardProps> = ({ stats, className }) => (
    <StatCard title="Демография" className={className}>
        <ProgressBar label="Женщины" value={stats.gender_stats.female} total={stats.total_users} color="bg-pink-400" />
        <ProgressBar label="Мужчины" value={stats.gender_stats.male} total={stats.total_users} color="bg-blue-400" />
        <ProgressBar label="Не указан" value={stats.gender_stats.unknown} total={stats.total_users} color="bg-gray-400" />
    </StatCard>
);

export const PlatformsCard: React.FC<CardProps> = ({ stats, className }) => {
    const platforms = stats.platform_stats || {};
    const platformMapping: Record<string, { label: string, color: string }> = {
        "1": { label: "m.vk", color: "bg-orange-300" },
        "2": { label: "iPhone", color: "bg-slate-400" },
        "3": { label: "iPad", color: "bg-slate-300" },
        "4": { label: "Android", color: "bg-emerald-400" },
        "6": { label: "Windows", color: "bg-blue-300" },
        "7": { label: "Web", color: "bg-blue-400" },
        "unknown": { label: "Неизвестно", color: "bg-gray-300" }
    };

    return (
        <StatCard title="Платформы" className={className}>
            {Object.entries(platforms).map(([key, count]) => {
                const info = platformMapping[key] || { label: `ID: ${key}`, color: "bg-gray-300" };
                if (count === 0) return null;
                return (
                    <ProgressBar 
                        key={key} 
                        label={info.label} 
                        value={count} 
                        total={stats.total_users} 
                        color={info.color} 
                    />
                );
            })}
            {Object.values(platforms).reduce((a: number, b: number) => a + b, 0) === 0 && <p className="text-gray-400 text-xs text-center py-4">Нет данных</p>}
        </StatCard>
    );
};

export const OnlineCard: React.FC<CardProps> = ({ stats, className }) => (
    <StatCard title="Последний онлайн" className={className}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500">Сегодня:</span>
                <ValueWithPercent value={stats.online_stats.today} total={stats.total_users} />
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">&gt; 1 месяца:</span>
                <ValueWithPercent value={stats.online_stats.month_plus} total={stats.total_users} className="text-amber-600" />
            </div>
            
            <div className="flex justify-between">
                <span className="text-gray-500">За 3 дня:</span>
                <ValueWithPercent value={stats.online_stats['3_days']} total={stats.total_users} />
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">&gt; 3 месяцев:</span>
                <ValueWithPercent value={stats.online_stats['3_months_plus']} total={stats.total_users} className="text-orange-600" />
            </div>

            <div className="flex justify-between">
                <span className="text-gray-500">За неделю:</span>
                <ValueWithPercent value={stats.online_stats.week} total={stats.total_users} />
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">&gt; Года:</span>
                <ValueWithPercent value={stats.online_stats.year_plus} total={stats.total_users} className="text-red-600" />
            </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Скрыт / Неизвестно:</span>
            <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {stats.online_stats.unknown} ({getPercent(stats.online_stats.unknown, stats.total_users)})
            </span>
        </div>
    </StatCard>
);

export const AgeCard: React.FC<CardProps> = ({ stats, className }) => {
    const ageStats = stats.age_stats || {};
    const ageChartConfig = [
        { key: 'u16', label: '<16' },
        { key: '16-20', label: '16-20' },
        { key: '20-25', label: '20-25' },
        { key: '25-30', label: '25-30' },
        { key: '30-35', label: '30-35' },
        { key: '35-40', label: '35-40' },
        { key: '40-45', label: '40-45' },
        { key: '45p', label: '45+' },
    ];
    const ageCounts = ageChartConfig.map(c => ageStats[c.key] || 0);
    const maxAgeValue = Math.max(...ageCounts, 1);

    return (
        <StatCard title="Возраст" className={className}>
            <div className="h-32 flex items-end justify-between gap-1 mt-4 border-b border-gray-100">
                {ageChartConfig.map((config, i) => {
                    const count = ageCounts[i];
                    const heightPercent = maxAgeValue > 0 ? (count / maxAgeValue) * 100 : 0;
                    const displayHeight = count > 0 ? Math.max(heightPercent, 5) : 0;
                    
                    return (
                        <div key={config.key} className="flex flex-col items-center flex-1 h-full justify-end group relative cursor-default">
                            <span className={`text-[10px] mb-1 font-medium text-gray-500 transition-colors`}>
                                {count > 0 ? count : ''}
                            </span>
                            <div 
                                className="w-full rounded-t-sm transition-all duration-300 relative bg-purple-300 group-hover:bg-purple-400"
                                style={{ height: `${displayHeight}%` }}
                            >
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-between gap-1 mt-1">
                {ageChartConfig.map((config) => (
                    <span key={config.key} className="text-[9px] text-gray-500 truncate w-full text-center flex-1">
                        {config.label}
                    </span>
                ))}
            </div>

            <div className="mt-3 flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Не указано:</span>
                <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {ageStats["unknown"] || 0} ({getPercent(ageStats["unknown"] || 0, stats.total_users)})
                </span>
            </div>
        </StatCard>
    );
};

export const BirthdayCard: React.FC<CardProps> = ({ stats, className }) => {
    const bdateStats: Record<string, number> = stats.bdate_stats || {};
    const monthlyCounts = Array.from({length: 12}, (_, i) => {
        const key = String(i + 1);
        const keyPad = key.padStart(2, '0');
        const val1 = Number(bdateStats[key] || 0);
        const val2 = Number(bdateStats[keyPad] || 0);
        return val1 + val2;
    });
    const maxMonthValue = Math.max(...monthlyCounts, 1);

    return (
        <StatCard title="Дни рождения" className={className}>
            <div className="h-32 flex items-end justify-between gap-1 mt-4 border-b border-gray-100">
                {monthlyCounts.map((count, i) => {
                    const month = i + 1;
                    const isCurrentMonth = new Date().getMonth() + 1 === month;
                    const heightPercent = maxMonthValue > 0 ? (count / maxMonthValue) * 100 : 0;
                    const displayHeight = count > 0 ? Math.max(heightPercent, 5) : 0;

                    return (
                        <div key={month} className="flex flex-col items-center flex-1 h-full justify-end group relative cursor-default">
                            <span className={`text-[10px] mb-1 font-medium transition-colors ${isCurrentMonth ? 'text-indigo-700 font-bold' : 'text-gray-500'}`}>
                                {count > 0 ? count : ''}
                            </span>
                            <div 
                                className={`w-full rounded-t-sm transition-all duration-300 relative ${isCurrentMonth ? 'bg-indigo-600' : 'bg-indigo-300 group-hover:bg-indigo-400'}`}
                                style={{ height: `${displayHeight}%` }}
                            >
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-between gap-1 mt-1">
                {monthlyCounts.map((_, i) => {
                    const month = i + 1;
                    const isCurrentMonth = new Date().getMonth() + 1 === month;
                    return (
                        <span key={month} className={`text-[9px] uppercase truncate w-full text-center flex-1 ${isCurrentMonth ? 'font-bold text-indigo-700' : 'text-gray-400'}`}>
                            {new Date(2000, i).toLocaleString('ru', { month: 'short' }).replace('.', '')}
                        </span>
                    );
                })}
            </div>

            <div className="mt-3 flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Не указано:</span>
                <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {bdateStats["13"] || 0} ({getPercent(bdateStats["13"] || 0, stats.total_users)})
                </span>
            </div>
        </StatCard>
    );
};
