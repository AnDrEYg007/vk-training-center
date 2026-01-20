import React from 'react';

// Компонент кольцевой диаграммы (Donut)
export const DonutChart = ({ value, max, colorClass, size = 60, strokeWidth = 6 }: { value: number, max: number, colorClass: string, size?: number, strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / (max || 1)) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-gray-100" />
                <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={colorClass} />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-700">{Math.round((value / (max || 1)) * 100)}%</span>
        </div>
    );
};
