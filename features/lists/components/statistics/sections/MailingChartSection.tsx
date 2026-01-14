
import React from 'react';
import { ListStats } from '../../../../../services/api/lists.api';
import { StatsPeriod, StatsGroupBy, FilterCanWrite } from '../../../types';
import { StatCard, PERIOD_OPTIONS, CAN_WRITE_OPTIONS } from '../UserStatsComponents';
import { Chart } from '../Chart';
import { CustomDatePicker } from '../../../../../shared/components/pickers/CustomDatePicker';
import { useUserStatsLogic } from '../../../hooks/useUserStatsLogic';

interface MailingChartSectionProps {
    stats: ListStats;
    statsPeriod: StatsPeriod;
    statsGroupBy: StatsGroupBy;
    filterCanWrite: FilterCanWrite;
    onParamsChange?: (period: StatsPeriod, groupBy: StatsGroupBy, dateFrom?: string, dateTo?: string, filterCanWrite?: FilterCanWrite) => void;
}

export const MailingChartSection: React.FC<MailingChartSectionProps> = ({
    stats,
    statsPeriod,
    statsGroupBy,
    filterCanWrite,
    onParamsChange
}) => {
    const {
        dateFrom,
        dateTo,
        availableGroupOptions,
        handlePeriodChange,
        handleCanWriteChange,
        handleDateChange
    } = useUserStatsLogic({ statsPeriod, statsGroupBy, filterCanWrite, onParamsChange });

    // Для графика рассылки у нас только одна метрика - количество
    const activeMetrics = new Set(['count'] as const);

    if (!stats.mailing_chart_data) return null;

    return (
        <StatCard title="Динамика новых диалогов (First Contact)" className="w-full">
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-y-4 gap-x-6 mb-4 bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">Период:</span>
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

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">Сообщения:</span>
                    <div className="flex bg-white rounded border border-gray-300 p-0.5">
                        {CAN_WRITE_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleCanWriteChange(opt.value)}
                                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                    filterCanWrite === opt.value ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">Шаг:</span>
                        <div className="flex bg-white rounded border border-gray-300 p-0.5">
                        {availableGroupOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => onParamsChange && onParamsChange(statsPeriod, opt.value, dateFrom, dateTo, filterCanWrite)}
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
            <Chart 
                data={stats.mailing_chart_data} 
                activeMetrics={activeMetrics as any} 
                onMetricToggle={() => {}} 
                availableMetrics={['count']} 
                customLabels={{ count: 'Новые диалоги' }} 
            />
        </StatCard>
    );
};
