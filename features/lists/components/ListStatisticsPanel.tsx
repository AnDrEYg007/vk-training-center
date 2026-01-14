
import React from 'react';
import { ListStats } from '../../../services/api/lists.api';
import { PostsStatsView } from './statistics/PostsStatsView';
import { UserStatsView } from './statistics/UserStatsView';
import { StatsPeriod, StatsGroupBy, FilterCanWrite } from '../types';

interface ListStatisticsPanelProps {
    stats: ListStats | null;
    isLoading: boolean;
    listType: 'subscribers' | 'history_join' | 'history_leave' | 'posts' | 'likes' | 'comments' | 'reposts' | 'mailing';
    statsPeriod?: StatsPeriod;
    statsGroupBy?: StatsGroupBy;
    onParamsChange?: (period: StatsPeriod, groupBy: StatsGroupBy, dateFrom?: string, dateTo?: string, filterCanWrite?: FilterCanWrite) => void;
    filterCanWrite?: FilterCanWrite;
}

export const ListStatisticsPanel: React.FC<ListStatisticsPanelProps> = ({ 
    stats, 
    isLoading, 
    listType,
    statsPeriod,
    statsGroupBy,
    onParamsChange,
    filterCanWrite
}) => {
    // Показываем скелетон ТОЛЬКО если данных совсем нет и идет загрузка
    if (isLoading && !stats) {
        return (
            <div className="flex gap-4 mb-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg flex-1"></div>
                <div className="h-32 bg-gray-200 rounded-lg flex-1"></div>
                <div className="h-32 bg-gray-200 rounded-lg flex-1"></div>
            </div>
        );
    }

    if (!stats) return null;

    // Отображение статистики постов
    if (listType === 'posts' && stats.post_stats) {
        return (
            <PostsStatsView 
                postStats={stats.post_stats} 
                statsPeriod={statsPeriod}
                statsGroupBy={statsGroupBy}
                onParamsChange={onParamsChange as any}
                isLoading={isLoading}
            />
        );
    }

    // Отображение статистики пользователей (Подписчики, История, Активности, Рассылка)
    return (
        <UserStatsView 
            stats={stats} 
            isLoading={isLoading} 
            listType={listType}
            statsPeriod={statsPeriod}
            statsGroupBy={statsGroupBy}
            onParamsChange={onParamsChange}
            filterCanWrite={filterCanWrite}
        />
    );
};
