
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AccountStats, LogStatItem } from '../../../../shared/types';
import { ChartDataPoint } from '../../../../services/api/system_accounts.api';
import * as api from '../../../../services/api';
import { TokenUsageChart } from './TokenUsageChart';

type MetricType = 'total' | 'success' | 'error';
type Granularity = 'hour' | 'day' | 'week' | 'month';

interface ProjectOption {
    id: string;
    name: string;
}

// Кастомный селектор с поиском
const ProjectSelector: React.FC<{
    selectedId: string;
    options: ProjectOption[];
    onChange: (id: string) => void;
}> = ({ selectedId, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        const lowerSearch = search.toLowerCase();
        return options.filter(opt => opt.name.toLowerCase().includes(lowerSearch));
    }, [options, search]);

    const selectedLabel = options.find(o => o.id === selectedId)?.name || 'Все проекты';

    return (
        <div className="relative w-64" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <span className="truncate mr-2">{selectedLabel}</span>
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Найти проект..."
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt.id);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedId === opt.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}`}
                                >
                                    {opt.name}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">Нет совпадений</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export const AccountStatsPanel: React.FC<{ accountId: string }> = ({ accountId }) => {
    // State for summary stats
    const [stats, setStats] = useState<AccountStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [allProjectsMap, setAllProjectsMap] = useState<Record<string, string>>({});

    // State for chart
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('total');
    const [granularity, setGranularity] = useState<Granularity>('day');
    const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [isLoadingChart, setIsLoadingChart] = useState(false);

    // 1. Загрузка общих данных (один раз при маунте)
    useEffect(() => {
        setIsLoadingStats(true);
        Promise.all([
            api.getAccountStats(accountId),
            api.getAllProjectsForManagement()
        ]).then(([statsData, projectsData]) => {
            setStats(statsData);
            const projMap: Record<string, string> = {};
            projectsData.forEach(p => projMap[p.id] = p.name);
            setAllProjectsMap(projMap);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setIsLoadingStats(false);
        });
    }, [accountId]);

    // Вычисляем список проектов, которые реально использовались данным аккаунтом
    const relevantProjects = useMemo<ProjectOption[]>(() => {
        if (!stats) return [{ id: 'all', name: 'Все проекты' }];

        // Собираем уникальные ID проектов из логов
        const usedIds = new Set<string>();
        stats.items.forEach(item => {
            if (item.project_id) {
                usedIds.add(item.project_id);
            }
        });

        const options: ProjectOption[] = [];
        options.push({ id: 'all', name: 'Все проекты' });

        usedIds.forEach(id => {
            const name = allProjectsMap[id] || `Проект ID: ${id}`; // Фолбек если проект удален
            options.push({ id, name });
        });

        // Сортируем по имени (кроме "Все проекты", который первый)
        return [
            options[0],
            ...options.slice(1).sort((a, b) => a.name.localeCompare(b.name))
        ];
    }, [stats, allProjectsMap]);


    // 2. Загрузка данных графика (при изменении фильтров)
    useEffect(() => {
        const fetchChart = async () => {
            setIsLoadingChart(true);
            try {
                const data = await api.getAccountChartData(
                    accountId, 
                    granularity, 
                    selectedMetric, 
                    selectedProjectId
                );
                setChartData(data);
            } catch (err) {
                console.error("Failed to load chart data", err);
            } finally {
                setIsLoadingChart(false);
            }
        };
        fetchChart();
    }, [accountId, granularity, selectedMetric, selectedProjectId]);

    if (isLoadingStats) return <div className="p-8 flex justify-center"><div className="loader border-t-indigo-500 w-6 h-6"></div></div>;
    if (!stats || stats.total_requests === 0) return <div className="p-4 text-center text-gray-500 text-sm">Нет данных в логах за все время.</div>;

    // Фильтрация списков для отображения внизу
    const successItems = stats.items.filter(i => i.status === 'success');
    const errorItems = stats.items.filter(i => i.status === 'error');

    // Компонент карточки-переключателя
    const StatCardButton: React.FC<{ 
        type: MetricType; 
        count: number; 
        label: string; 
        colorClass: string 
    }> = ({ type, count, label, colorClass }) => (
        <button
            onClick={() => setSelectedMetric(type)}
            className={`flex flex-col items-center p-3 rounded border transition-all duration-200 ${
                selectedMetric === type 
                ? `ring-2 ring-offset-1 ${colorClass} bg-white shadow-md` 
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
        >
            <div className="text-xs uppercase font-bold opacity-70 mb-1">{label}</div>
            <div className={`text-xl font-bold ${selectedMetric === type ? '' : 'text-gray-800'}`}>{count}</div>
        </button>
    );

    return (
        <div className="bg-gray-50 p-4 border-t border-gray-200 animate-fade-in-up">
            
            {/* 1. Карточки-переключатели */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCardButton 
                    type="total" 
                    count={stats.total_requests} 
                    label="Всего запросов" 
                    colorClass="ring-indigo-500 text-indigo-600 border-indigo-200" 
                />
                <StatCardButton 
                    type="success" 
                    count={stats.success_count} 
                    label="Успешно" 
                    colorClass="ring-green-500 text-green-600 border-green-200" 
                />
                <StatCardButton 
                    type="error" 
                    count={stats.error_count} 
                    label="Ошибки" 
                    colorClass="ring-red-500 text-red-600 border-red-200" 
                />
            </div>

            {/* 2. Фильтры графика */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Период:</span>
                    <div className="flex bg-gray-100 rounded p-0.5">
                        {['hour', 'day', 'week', 'month'].map(g => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g as Granularity)}
                                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                                    granularity === g ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {{hour: 'За час', day: 'За сутки', week: 'За неделю', month: 'За месяц'}[g]}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Проект:</span>
                    <ProjectSelector
                        selectedId={selectedProjectId}
                        options={relevantProjects}
                        onChange={setSelectedProjectId}
                    />
                </div>
            </div>

            {/* 3. График */}
            <div className="mb-8">
                {isLoadingChart ? (
                     <div className="h-60 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                     </div>
                ) : (
                    <TokenUsageChart data={chartData} />
                )}
            </div>

            {/* 4. Детальные списки (как раньше) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden">
                    <div className="bg-green-50 px-4 py-2 border-b border-green-100">
                        <h4 className="text-sm font-bold text-green-700">Топ успешных операций</h4>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                        <LogList items={successItems} projects={allProjectsMap} />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-red-100 shadow-sm overflow-hidden">
                    <div className="bg-red-50 px-4 py-2 border-b border-red-100">
                        <h4 className="text-sm font-bold text-red-700">Топ ошибок</h4>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                        <LogList items={errorItems} projects={allProjectsMap} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const LogList: React.FC<{ items: LogStatItem[], projects: Record<string, string> }> = ({ items, projects }) => (
    <ul className="space-y-1">
        {items.length === 0 && <li className="text-xs text-gray-400 p-2 text-center">Нет данных</li>}
        {items.map((item, idx) => (
            <li key={idx} className="text-xs flex justify-between items-start border-b border-gray-100 last:border-0 pb-2 pt-1 px-2 hover:bg-gray-50 rounded">
                <div className="flex-1 min-w-0 pr-2">
                    <div className="font-mono font-semibold text-gray-700 truncate" title={item.method}>{item.method}</div>
                    {item.project_id && (
                        <div className="text-gray-500 text-[10px] truncate" title={projects[item.project_id] || item.project_id}>
                            {projects[item.project_id] || item.project_id}
                        </div>
                    )}
                </div>
                <div className="text-right flex flex-col items-end flex-shrink-0">
                        <span className="font-bold text-gray-800 bg-gray-200 px-1.5 rounded">{item.count}</span>
                        {item.last_used && (
                        <span className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(item.last_used).toLocaleDateString()}
                        </span>
                        )}
                </div>
            </li>
        ))}
    </ul>
);
