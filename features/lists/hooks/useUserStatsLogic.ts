
import { useState, useMemo } from 'react';
import { StatsPeriod, StatsGroupBy, FilterCanWrite } from '../types';
import { getGroupByOptions } from '../components/statistics/UserStatsComponents';

interface UseUserStatsLogicProps {
    statsPeriod: StatsPeriod;
    statsGroupBy: StatsGroupBy;
    filterCanWrite: FilterCanWrite;
    onParamsChange?: (period: StatsPeriod, groupBy: StatsGroupBy, dateFrom?: string, dateTo?: string, filterCanWrite?: FilterCanWrite) => void;
}

export const useUserStatsLogic = ({
    statsPeriod,
    statsGroupBy,
    filterCanWrite,
    onParamsChange
}: UseUserStatsLogicProps) => {
    // Локальное состояние для дат графика
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
    // Опции группировки
    const availableGroupOptions = useMemo(() => getGroupByOptions(statsPeriod), [statsPeriod]);

    const handlePeriodChange = (newPeriod: StatsPeriod) => {
        if (!onParamsChange) return;
        
        let newGroupBy = statsGroupBy;
        const newOptions = getGroupByOptions(newPeriod);
        
        // Если текущая группировка недоступна для нового периода, сбрасываем на дефолт
        if (!newOptions.find(o => o.value === newGroupBy)) {
             switch (newPeriod) {
                 case 'week':
                 case 'month':
                     newGroupBy = 'day';
                     break;
                 case 'quarter':
                     newGroupBy = 'week';
                     break;
                 case 'year':
                     newGroupBy = 'month';
                     break;
                 default:
                     newGroupBy = 'month';
             }
        }
        
        if (newPeriod === 'custom') {
             const now = new Date();
             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
             const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
             setDateFrom(startOfMonth);
             setDateTo(endOfMonth);
             onParamsChange(newPeriod, newGroupBy, startOfMonth, endOfMonth, filterCanWrite);
        } else {
             onParamsChange(newPeriod, newGroupBy, undefined, undefined, filterCanWrite);
        }
    };

    const handleCanWriteChange = (newVal: FilterCanWrite) => {
        if (onParamsChange) {
            onParamsChange(statsPeriod, statsGroupBy, dateFrom, dateTo, newVal);
        }
    };

    const handleDateChange = (type: 'from' | 'to', val: string) => {
        if (type === 'from') setDateFrom(val);
        else setDateTo(val);
        
        const newFrom = type === 'from' ? val : dateFrom;
        const newTo = type === 'to' ? val : dateTo;
        
        if (newFrom && newTo && onParamsChange) {
            onParamsChange('custom', statsGroupBy, newFrom, newTo, filterCanWrite);
        }
    };

    return {
        dateFrom,
        dateTo,
        availableGroupOptions,
        handlePeriodChange,
        handleCanWriteChange,
        handleDateChange
    };
};
