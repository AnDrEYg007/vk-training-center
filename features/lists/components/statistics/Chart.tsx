
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PostChartData } from '../../../../services/api/lists.api';

export type Metric = 'count' | 'likes' | 'comments' | 'reposts' | 'views';

const COLORS: Record<Metric, { stroke: string; fill: string }> = {
    count: { stroke: '#6366f1', fill: 'rgba(99, 102, 241, 0.1)' },
    likes: { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.1)' },
    comments: { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)' },
    reposts: { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.1)' },
    views: { stroke: '#6b7280', fill: 'rgba(107, 114, 128, 0.1)' },
};

const METRIC_LABELS: Record<Metric, string> = {
    count: 'Посты',
    views: 'Просмотры',
    likes: 'Лайки',
    comments: 'Комменты',
    reposts: 'Репосты'
};

const MetricButton: React.FC<{ val: Metric; label: string; isActive: boolean; onClick: (val: Metric) => void }> = ({ val, label, isActive, onClick }) => (
    <button
        onClick={() => onClick(val)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all border whitespace-nowrap ${
            isActive
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500 z-10'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        }`}
    >
        {label}
    </button>
);

const Tooltip: React.FC<{
    x: number;
    y: number;
    content: PostChartData;
    activeMetrics: Set<Metric>;
    formattedDate: string;
    customLabels?: Partial<Record<Metric, string>>;
}> = ({ x, y, content, activeMetrics, formattedDate, customLabels }) => {
    
    const screenWidth = window.innerWidth;
    // Определяем, находится ли курсор в правой половине экрана
    const isRightSide = x > screenWidth / 2;

    // FIX: Changed type to `any` to accommodate for conditional `left` and `right` properties,
    // which were causing a type error, likely due to a misconfigured or incomplete CSSProperties type in the project.
    const style: any = {
        top: y - 10,
        transform: 'translateY(-100%)', // Сдвиг вверх, чтобы быть над курсором
        minWidth: '150px',
        position: 'fixed',
        zIndex: 9999, 
        pointerEvents: 'none', 
        backgroundColor: '#1f2937', // bg-gray-800
        color: 'white',
        borderRadius: '0.375rem', // rounded-md
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
        padding: '0.5rem', // p-2
        fontSize: '0.75rem', // text-xs
    };

    if (isRightSide) {
        // Если курсор справа: привязываемся к ПРАВОМУ краю окна.
        // Браузер сам отрисует блок влево от этой точки.
        // (screenWidth - x) = расстояние от курсора до правого края экрана
        // + 15px отступа влево от курсора
        style.right = (screenWidth - x) + 15;
        style.left = 'auto';
    } else {
        // Если курсор слева: привязываемся к ЛЕВОМУ краю (как обычно)
        style.left = x + 15;
        style.right = 'auto';
    }

    return createPortal(
        <div style={style} className="animate-fade-in-up">
            <p className="font-bold text-center text-gray-300 mb-1">{formattedDate}</p>
            <div className="space-y-1">
                {Array.from(activeMetrics).map((metric: Metric) => (
                    <div key={metric} className="flex justify-between items-center">
                        <span style={{ color: COLORS[metric].stroke }}>
                            {customLabels?.[metric] || METRIC_LABELS[metric]}:
                        </span>
                        <span className="font-semibold ml-2">{content[metric].toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>,
        document.body
    );
};

interface ChartProps {
    data: PostChartData[];
    activeMetrics: Set<Metric>;
    onMetricToggle: (metric: Metric) => void;
    availableMetrics?: Metric[];
    customLabels?: Partial<Record<Metric, string>>;
}

export const Chart: React.FC<ChartProps> = ({ data, activeMetrics, onMetricToggle, availableMetrics, customLabels }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: PostChartData; formattedDate: string } | null>(null);
    
    // Реф для измерения ширины контейнера
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(1000);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.clientWidth);
            }
        };

        // Initial measure
        updateWidth();

        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                updateWidth();
            }
        });
        
        resizeObserver.observe(containerRef.current);
        
        return () => resizeObserver.disconnect();
    }, []);

    const height = 320; // Соответствует h-80 (320px)
    const paddingX = 50;
    const paddingY = 40;

    const metricsToShow = availableMetrics || (['count', 'views', 'likes', 'comments', 'reposts'] as Metric[]);

    const maxValue = useMemo(() => {
        if (!data || data.length === 0) return 1;
        let maxVal = 1;
        for (const metric of activeMetrics) {
            const currentMax = Math.max(...data.map(d => d[metric as Metric]));
            if (currentMax > maxVal) maxVal = currentMax;
        }
        return maxVal;
    }, [data, activeMetrics]);

    const minMaxPoints = useMemo(() => {
        if (!data || data.length === 0) return {};
        const result: Record<string, { minPoint: PostChartData | null, maxPoint: PostChartData | null }> = {};
        for (const metric of activeMetrics) {
            const values = data.map(d => d[metric as Metric]);
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);
            result[metric] = {
                minPoint: data.find(d => d[metric as Metric] === minVal) || null,
                maxPoint: data.find(d => d[metric as Metric] === maxVal) || null,
            };
        }
        return result;
    }, [data, activeMetrics]);

    const getCoords = (value: number, index: number) => {
        const x = paddingX + (index / (data.length - 1 || 1)) * (width - 2 * paddingX);
        const y = (height - paddingY) - (value / maxValue) * (height - 2 * paddingY);
        return { x, y };
    };

    const formatLabel = (dateStr: string): string => {
        if (dateStr.includes('W')) {
            const [year, week] = dateStr.split('-W');
            return `${week} нед. ${year}`;
        }
        if (dateStr.includes('Q')) {
            const [year, quarter] = dateStr.split('-Q');
            return `Q${quarter} ${year}`;
        }
        if (dateStr.length === 4 && !dateStr.includes('-')) {
            return dateStr;
        }
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
             return dateStr;
        }
        
        if (dateStr.length === 7) {
             return date.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' }).replace('.', '');
        }
        
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
    
    const xAxisLabels = useMemo(() => {
        if (!data || data.length < 1) return [];
        
        const availableWidth = width - 2 * paddingX;
        const labelWidth = 70;
        let maxLabels = Math.floor(availableWidth / labelWidth);
        if (maxLabels > data.length) maxLabels = data.length;
        if (maxLabels < 2 && data.length >= 2) maxLabels = 2;
        if (maxLabels < 1) return [];

        const indices = new Set<number>();
        const step = data.length > 1 ? Math.floor((data.length - 1) / (maxLabels - 1)) || 1 : 1;

        for (let i = 0; i < data.length; i += step) {
            indices.add(i);
        }
        if (data.length > 1) {
            indices.add(data.length - 1);
        }

        return Array.from(indices).map(i => {
            const d = data[i];
            const { x } = getCoords(0, i);
            return { x, text: formatLabel(d.date) };
        });
    }, [data, width, paddingX]);

    if (!data || data.length === 0) return <div className="h-80 flex items-center justify-center text-gray-400 text-sm">Нет данных для графика</div>;

    return (
        <div className="w-full" ref={containerRef}>
            <div className="flex items-center gap-2 overflow-x-auto p-2 mb-2 -mx-2 custom-scrollbar">
                {metricsToShow.map(metric => (
                     <MetricButton
                        key={metric}
                        val={metric}
                        label={customLabels?.[metric] || METRIC_LABELS[metric]}
                        isActive={activeMetrics.has(metric)}
                        onClick={onMetricToggle}
                     />
                ))}
            </div>
            
            <div className="relative h-80 w-full select-none">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Сетка */}
                    <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e5e7eb" strokeDasharray="4" />
                    <line x1={paddingX} y1={(height - paddingY + paddingY) / 2} x2={width - paddingX} y2={(height - paddingY + paddingY) / 2} stroke="#e5e7eb" strokeDasharray="4" />
                    <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e5e7eb" />

                    {/* Области и линии для каждого активного графика */}
                    {Array.from(activeMetrics).map(metric => {
                        const points = data.map((d, i) => `${getCoords(d[metric as Metric], i).x},${getCoords(d[metric as Metric], i).y}`).join(' ');
                        const areaPath = `M${paddingX},${height - paddingY} L${points} L${width - paddingX},${height - paddingY} Z`;
                        return (
                            <g key={metric}>
                                <path d={areaPath} fill={COLORS[metric as Metric].fill} />
                                <polyline points={points} fill="none" stroke={COLORS[metric as Metric].stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        );
                    })}

                    {/* Точки и невидимые области для ховера */}
                    {data.map((d, index) => {
                        const { x } = getCoords(0, index);
                        
                        // РАСЧЕТ ЗОНЫ НАВЕДЕНИЯ
                        // Зона должна быть непрерывной от левого края (0) до правого (width)
                        let hitX, hitW;
                        
                        if (data.length === 1) {
                            hitX = 0;
                            hitW = width;
                        } else {
                            const prevX = index > 0 ? getCoords(0, index - 1).x : x;
                            const nextX = index < data.length - 1 ? getCoords(0, index + 1).x : x;
                            
                            const leftBound = index === 0 ? 0 : x - (x - prevX) / 2;
                            const rightBound = index === data.length - 1 ? width : x + (nextX - x) / 2;
                            
                            hitX = leftBound;
                            hitW = rightBound - leftBound;
                        }

                        return (
                            <g key={d.date + index}>
                                {/* Невидимая область для ховера - ТЕПЕРЬ ПОКРЫВАЕТ ВСЮ ВЫСОТУ */}
                                <rect 
                                    x={hitX} 
                                    y={0} // Начинаем с самого верха
                                    width={hitW} 
                                    height={height} // Занимаем всю высоту (включая метки оси X)
                                    fill="transparent" 
                                    cursor="pointer"
                                    onMouseMove={(e) => setTooltip({ 
                                        x: e.clientX, 
                                        y: e.clientY, 
                                        content: d, 
                                        formattedDate: formatLabel(d.date)
                                    })}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                                
                                {/* Точки для каждого графика */}
                                {Array.from(activeMetrics).map(metric => {
                                    const val = d[metric as Metric];
                                    if (val === 0) return null; 

                                    const { y } = getCoords(val, index);
                                    const isHovered = tooltip?.content.date === d.date;
                                    return <circle key={metric} cx={x} cy={y} r={isHovered ? 4 : 2.5} fill="white" stroke={COLORS[metric as Metric].stroke} strokeWidth="1.5" className="transition-all duration-100 pointer-events-none" />;
                                })}
                            </g>
                        );
                    })}

                    {/* Постоянные метки для min/max */}
                    {Array.from(activeMetrics).map(metric => {
                        const { minPoint, maxPoint } = minMaxPoints[metric] || { minPoint: null, maxPoint: null };
                        
                        const elements = [];

                        if (maxPoint && (maxPoint[metric as Metric]) > 0) {
                            const { x: maxX, y: maxY } = getCoords(maxPoint[metric as Metric], data.findIndex(d => d.date === maxPoint.date));
                            elements.push(
                                <g key={`max-${metric}`}>
                                    <circle cx={maxX} cy={maxY} r="3" fill={COLORS[metric as Metric].stroke} stroke="white" strokeWidth="1" />
                                    <text x={maxX} y={maxY - 12} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="bold">{maxPoint[metric as Metric]}</text>
                                </g>
                            );
                        }
                        
                        if (minPoint && (minPoint[metric as Metric]) > 0) {
                            const { x: minX, y: minY } = getCoords(minPoint[metric as Metric], data.findIndex(d => d.date === minPoint.date));
                            if (!maxPoint || minX !== getCoords(maxPoint[metric as Metric], data.findIndex(d => d.date === maxPoint.date)).x) {
                                 elements.push(
                                    <g key={`min-${metric}`}>
                                        <circle cx={minX} cy={minY} r="3" fill={COLORS[metric as Metric].stroke} stroke="white" strokeWidth="1" />
                                        <text x={minX} y={minY + 20} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="bold">{minPoint[metric as Metric]}</text>
                                    </g>
                                );
                            }
                        }
                        // pointer-events-none ВАЖЕН для меток
                        return <g key={`labels-${metric}`} className="pointer-events-none">{elements}</g>;
                    })}

                     {/* Метки оси X. pointer-events-none ВАЖЕН, чтобы метки не перекрывали hover-rect */}
                     <g className="pointer-events-none">
                        {xAxisLabels.map(({ x, text }, i) => (
                            <text key={`${text}-${i}`} x={x} y={height - paddingY + 20} textAnchor="middle" fill="#6b7280" fontSize="11">{text}</text>
                        ))}
                    </g>
                </svg>
                
                {tooltip && <Tooltip 
                    x={tooltip.x} 
                    y={tooltip.y} 
                    content={tooltip.content} 
                    activeMetrics={activeMetrics} 
                    formattedDate={tooltip.formattedDate} 
                    customLabels={customLabels} 
                />}
            </div>
        </div>
    );
};
