
import React from 'react';

// Генерация цветов для графика
const COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

export const PieChart: React.FC<{ data: Record<string, number>; total: number }> = ({ data, total }) => {
    if (!data || total === 0) return <div className="h-40 flex items-center justify-center text-gray-400 text-xs">Нет данных</div>;

    // Сортировка и подготовка данных
    const sorted = Object.entries(data)
        .map(([label, value]) => {
            // Явное приведение unknown/any к number для безопасности арифметики
            const val = Number(value); 
            return { label, value: val, percent: (val / total) * 100 };
        })
        .sort((a, b) => b.value - a.value);

    // Если категорий слишком много, берем топ-5, остальные в "Прочие"
    let finalData = sorted;
    if (sorted.length > 6) {
        const top = sorted.slice(0, 5);
        const others = sorted.slice(5);
        // Explicit typing for reduce accumulator and current item to avoid 'unknown' errors
        const othersSum = others.reduce((sum: number, item: { value: number }) => sum + item.value, 0);
        
        finalData = [...top];
        if (othersSum > 0) {
            finalData.push({
                label: 'Прочие',
                value: othersSum,
                percent: (othersSum / total) * 100
            });
        }
    }

    // Расчет сегментов круга (SVG)
    let accumulatedPercent = 0;
    const segments = finalData.map((item, index) => {
        const startPercent = accumulatedPercent;
        accumulatedPercent += item.percent;
        const endPercent = accumulatedPercent;

        const x1 = Math.cos(2 * Math.PI * startPercent / 100);
        const y1 = Math.sin(2 * Math.PI * startPercent / 100);
        const x2 = Math.cos(2 * Math.PI * endPercent / 100);
        const y2 = Math.sin(2 * Math.PI * endPercent / 100);

        const largeArcFlag = item.percent > 50 ? 1 : 0;

        const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        return { pathData, color: COLORS[index % COLORS.length], ...item };
    });

    return (
        <div className="flex items-center gap-4">
            <div className="w-32 h-32 flex-shrink-0">
                <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                    {segments.map((seg, i) => (
                        <path key={i} d={seg.pathData} fill={seg.color} />
                    ))}
                    {/* Если всего один сегмент 100%, path может глючить, рисуем круг */}
                    {segments.length === 1 && <circle cx="0" cy="0" r="1" fill={segments[0].color} />}
                </svg>
            </div>
            <div className="flex-1 text-xs space-y-1 overflow-y-auto max-h-40 custom-scrollbar pr-1">
                {segments.map((seg, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2 min-w-0">
                             <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }}></div>
                             <span className="truncate text-gray-600" title={seg.label}>{seg.label}</span>
                        </div>
                        <span className="font-bold text-gray-800 ml-2">{Math.round(seg.percent)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
