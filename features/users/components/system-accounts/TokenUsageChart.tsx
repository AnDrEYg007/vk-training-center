import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChartDataPoint } from '../../../../services/api/system_accounts.api';

// Генерация цветов для методов
const generateColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const Tooltip: React.FC<{
    x: number;
    y: number;
    content: ChartDataPoint;
    visibleMethods: Set<string>;
}> = ({ x, y, content, visibleMethods }) => {
    // Фильтруем методы, оставляя только видимые
    const sortedMethods = Object.entries(content.methods)
        .filter(([method]) => visibleMethods.has(method))
        .sort((a, b) => Number(b[1]) - Number(a[1]));

    if (sortedMethods.length === 0) return null;

    return createPortal(
        <div
            className="fixed pointer-events-none z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg text-xs animate-fade-in-up"
            style={{
                top: y,
                left: x,
                transform: 'translate(-50%, -110%)',
                minWidth: '150px',
                maxWidth: '250px'
            }}
        >
            <p className="font-bold text-center text-gray-300 mb-1 border-b border-gray-600 pb-1">{content.date}</p>
            <div className="space-y-1 max-h-40 overflow-hidden">
                {sortedMethods.map(([method, count]) => (
                    <div key={method} className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-1 min-w-0">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: generateColor(method) }}></div>
                            <span className="truncate">{method}</span>
                        </div>
                        <span className="font-semibold">{count}</span>
                    </div>
                ))}
            </div>
        </div>,
        document.body
    );
};

export const TokenUsageChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: ChartDataPoint } | null>(null);
    
    // Состояние видимости методов
    const [visibleMethods, setVisibleMethods] = useState<Set<string>>(new Set());

    // Фиксированная высота, адаптивная ширина с минимальным порогом
    const height = 240;
    const minWidth = 600;
    const width = 1000; // Базовое значение для viewBox
    const paddingX = 50;
    const paddingY = 40;

    // 1. Находим все уникальные методы для легенды/линий
    const allMethods = useMemo(() => {
        const methods = new Set<string>();
        if (data && Array.isArray(data)) {
            data.forEach(d => {
                if (d.methods) {
                    Object.keys(d.methods).forEach(m => methods.add(m));
                }
            });
        }
        return Array.from(methods).sort();
    }, [data]);

    // При изменении данных (или списка методов) включаем все методы по умолчанию
    useEffect(() => {
        setVisibleMethods(new Set(allMethods));
    }, [allMethods]);

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
             <div className="h-60 flex items-center justify-center text-gray-400 text-sm bg-white border rounded-lg">
                Нет данных для графика
            </div>
        );
    }

    // 2. Находим макс значение для Y оси ТОЛЬКО среди видимых методов
    const maxValue = useMemo(() => {
        let max = 0;
        data.forEach(d => {
            if (d.methods) {
                 Object.entries(d.methods).forEach(([method, val]) => {
                    // Учитываем значение, только если метод видим
                    if (visibleMethods.has(method)) {
                        if (Number(val) > max) max = Number(val);
                    }
                 });
            }
        });
        return max > 0 ? max : 1; // Гарантируем, что не вернем 0
    }, [data, visibleMethods]);

    const getCoords = (value: number, index: number) => {
        // Защита от деления на 0, если данных мало
        const xRatio = data.length > 1 ? index / (data.length - 1) : 0.5;
        const x = paddingX + xRatio * (width - 2 * paddingX);
        
        const yRatio = value / maxValue;
        // Защита от NaN
        const safeYRatio = isNaN(yRatio) ? 0 : yRatio;
        
        const y = (height - paddingY) - safeYRatio * (height - 2 * paddingY);
        return { x, y };
    };

    const xAxisLabels = useMemo(() => {
        if (!data || data.length < 2) return [];
        const availableWidth = width - 2 * paddingX;
        const labelWidth = 80;
        const maxLabels = Math.max(1, Math.floor(availableWidth / labelWidth));
        const step = Math.max(1, Math.ceil(data.length / maxLabels));
        
        const labels = [];
        for (let i = 0; i < data.length; i += step) {
            const d = data[i];
            const { x } = getCoords(0, i);
            labels.push({ x, text: d.date });
        }
        // Всегда добавляем последнюю точку, если она не слишком близко к предыдущей
        const lastIndex = data.length - 1;
        const lastLabel = labels[labels.length - 1];
        const { x: lastX } = getCoords(0, lastIndex);
        
        if (lastLabel && (lastX - lastLabel.x) > labelWidth / 2) {
             labels.push({ x: lastX, text: data[lastIndex].date });
        } else if (lastLabel && labels.length > 1 && lastIndex !== 0) {
             // Если последняя точка близко, заменяем последнюю метку на самый конец
             labels[labels.length - 1] = { x: lastX, text: data[lastIndex].date };
        }

        return labels;
    }, [data, maxValue]);

    const toggleMethod = (method: string) => {
        setVisibleMethods(prev => {
            const newSet = new Set(prev);
            if (newSet.has(method)) {
                newSet.delete(method);
            } else {
                newSet.add(method);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        setVisibleMethods(new Set(allMethods));
    };

    const handleResetAll = () => {
        setVisibleMethods(new Set());
    };

    return (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-2">
            <div className="relative w-full select-none" style={{ aspectRatio: `${width} / ${height}`, maxHeight: '280px' }}>
                <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
                    {/* Сетка */}
                    <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e5e7eb" strokeDasharray="4" />
                    <line x1={paddingX} y1={(height - paddingY + paddingY) / 2} x2={width - paddingX} y2={(height - paddingY + paddingY) / 2} stroke="#e5e7eb" strokeDasharray="4" />
                    <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e5e7eb" />
                    
                    {/* Y-Axis Labels */}
                    <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{maxValue}</text>
                    <text x={paddingX - 10} y={(height - paddingY + paddingY) / 2 + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(maxValue / 2)}</text>
                    <text x={paddingX - 10} y={height - paddingY + 4} textAnchor="end" fontSize="10" fill="#9ca3af">0</text>


                    {/* Линии графиков */}
                    {allMethods.map(method => {
                        // Если метод скрыт, не рендерим линию
                        if (!visibleMethods.has(method)) return null;

                        const points = data.map((d, i) => {
                            const val = d.methods ? (d.methods[method] || 0) : 0;
                            const { x, y } = getCoords(val, i);
                            return `${x},${y}`;
                        }).join(' ');

                        return (
                            <polyline 
                                key={method}
                                points={points} 
                                fill="none" 
                                stroke={generateColor(method)} 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                className="transition-all duration-300"
                            />
                        );
                    })}

                    {/* Зоны для ховера */}
                    {data.map((d, index) => {
                        const { x } = getCoords(0, index);
                        
                        let rectWidth;
                        if (data.length > 1) {
                            if (index < data.length - 1) {
                                const nextX = getCoords(0, index + 1).x;
                                rectWidth = nextX - x;
                            } else {
                                const prevX = getCoords(0, index - 1).x;
                                rectWidth = x - prevX;
                            }
                        } else {
                            rectWidth = width - 2 * paddingX;
                        }
                        
                        // Рисуем точки только при наведении (или всегда, если их мало)
                        const isHovered = tooltip?.content.date === d.date;

                        return (
                            <g key={d.date + index}>
                                <rect 
                                    x={x - rectWidth/2} y={paddingY} width={rectWidth} height={height - 2*paddingY} 
                                    fill="transparent" cursor="pointer"
                                    onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: d })}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                                {isHovered && <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke="#d1d5db" strokeDasharray="2" />}
                            </g>
                        );
                    })}

                     {/* Метки оси X */}
                     <g>
                        {xAxisLabels.map(({ x, text }, i) => (
                            <text key={`${text}-${i}`} x={x} y={height - paddingY + 20} textAnchor="middle" fill="#6b7280" fontSize="11">{text}</text>
                        ))}
                    </g>
                </svg>
                
                {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} visibleMethods={visibleMethods} />}
            </div>

            {/* Легенда с интерактивными кнопками */}
            <div className="flex flex-wrap items-center gap-2 px-4 pb-2 mt-2 max-h-24 overflow-y-auto custom-scrollbar">
                {allMethods.map(method => {
                    const isVisible = visibleMethods.has(method);
                    return (
                        <button
                            key={method}
                            onClick={() => toggleMethod(method)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-all duration-200 ${
                                isVisible 
                                ? 'bg-gray-50 border-gray-200 text-gray-700 shadow-sm' 
                                : 'bg-white border-transparent text-gray-400 opacity-60 grayscale'
                            }`}
                            title={isVisible ? "Скрыть график" : "Показать график"}
                        >
                            <div className={`w-2 h-2 rounded-full transition-colors ${isVisible ? '' : 'bg-gray-300'}`} style={{ backgroundColor: isVisible ? generateColor(method) : undefined }}></div>
                            <span className={isVisible ? 'font-medium' : ''}>{method}</span>
                        </button>
                    );
                })}

                {allMethods.length > 0 && (
                    <>
                        <div className="w-px h-4 bg-gray-300 mx-2"></div>
                        <button 
                            onClick={handleSelectAll} 
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap"
                        >
                            Выбрать все
                        </button>
                        <button 
                            onClick={handleResetAll} 
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
                        >
                            Сбросить
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};