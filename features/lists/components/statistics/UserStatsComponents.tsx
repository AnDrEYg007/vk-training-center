
import React from 'react';
import { StatsPeriod, StatsGroupBy, FilterCanWrite } from '../../types';

// --- Компоненты UI ---

export const ProgressBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-gray-800">{value} ({percent}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

export const StatCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 ${className}`}>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">{title}</h4>
        {children}
    </div>
);

export const getPercent = (value: number, total: number) => {
    if (total === 0) return '0%';
    const percent = Math.round((value / total) * 100);
    if (percent === 0 && value > 0) return '<1%';
    return `${percent}%`;
};

export const ValueWithPercent: React.FC<{ value: number; total: number; className?: string }> = ({ value, total, className = "" }) => (
    <span className={`font-bold ${className}`}>
        {value} <span className="text-xs font-normal opacity-70">({getPercent(value, total)})</span>
    </span>
);

// --- Константы и Хелперы ---

export const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
    { value: 'all', label: 'За всё время' },
    { value: 'week', label: 'За неделю' },
    { value: 'month', label: 'За месяц' },
    { value: 'quarter', label: 'За квартал' },
    { value: 'year', label: 'За год' },
    { value: 'custom', label: 'Свой период' },
];

export const CAN_WRITE_OPTIONS: { value: FilterCanWrite; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'allowed', label: 'Активные' },
    { value: 'forbidden', label: 'Запретили' },
];

export const getGroupByOptions = (period: StatsPeriod): { value: StatsGroupBy; label: string }[] => {
    const all: { value: StatsGroupBy; label: string }[] = [
        { value: 'day', label: 'По дням' },
        { value: 'week', label: 'По неделям' },
        { value: 'month', label: 'По месяцам' },
        { value: 'quarter', label: 'По кварталам' },
        { value: 'year', label: 'По годам' },
    ];
    
    switch (period) {
        case 'week': return [all[0]];
        case 'month': return [all[0], all[1]];
        case 'quarter': return [all[0], all[1], all[2]];
        case 'year': return [all[1], all[2], all[3]];
        case 'custom': return all;
        default: return all;
    }
};
