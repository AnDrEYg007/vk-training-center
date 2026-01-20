import React from 'react';

// Компонент мини-графика (Sparkline)
export const Sparkline = ({ data, colorClass, fillClass }: { data: number[], colorClass: string, fillClass: string }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const min = 0; // Always start from 0 for proportion
    const range = max - min || 1;
    
    // Sample down if too many points to avoid SVG complexity
    const displayData = data.length > 50 ? data.filter((_, i) => i % Math.ceil(data.length / 50) === 0) : data;

    const points = displayData.map((val, i) => {
        const x = (i / (displayData.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                 <path d={`M0,100 ${points.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`} className={`${fillClass} opacity-20`} fill="currentColor" />
                 <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={colorClass} stroke="currentColor" />
            </svg>
        </div>
    );
};
