
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TokenLog, SystemAccount, Project, AiTokenLog, AiToken } from '../../../shared/types';
import * as api from '../../../services/api';
import { GetLogsFilters } from '../../../services/api/system_accounts.api';
import { GetAiLogsFilters } from '../../../services/api/ai_token.api';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

// Вспомогательный компонент для мультиселекта
const MultiSelectDropdown: React.FC<{
    options: { id: string; label: string }[];
    selectedIds: Set<string>;
    onChange: (selectedIds: Set<string>) => void;
    label: string;
}> = ({ options, selectedIds, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        onChange(newSet);
    };
    
    const selectedCount = selectedIds.size;
    const displayLabel = selectedCount === 0 ? 'Все' : `Выбрано: ${selectedCount}`;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-44 px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    selectedCount > 0 ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-gray-300 text-gray-700'
                }`}
            >
                <span className="truncate mr-2">{label}: {displayLabel}</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute z-20 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map(opt => (
                        <label key={opt.id} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedIds.has(opt.id)}
                                onChange={() => handleToggle(opt.id)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                            />
                            <span className="truncate">{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

interface TokenLogsDashboardProps {
    mode: 'vk' | 'ai';
}

export const TokenLogsDashboard: React.FC<TokenLogsDashboardProps> = ({ mode }) => {
    // mode определяет какие логи показывать (vk или ai)
    const activeTab = mode;
    
    // --- VK Logs State ---
    const [vkLogs, setVkLogs] = useState<TokenLog[]>([]);
    const [vkAccounts, setVkAccounts] = useState<SystemAccount[]>([]);
    const [vkProjects, setVkProjects] = useState<Project[]>([]);
    const [vkSelectedAccountIds, setVkSelectedAccountIds] = useState<Set<string>>(new Set());
    
    // --- AI Logs State ---
    const [aiLogs, setAiLogs] = useState<AiTokenLog[]>([]);
    const [aiTokens, setAiTokens] = useState<AiToken[]>([]);
    const [aiSelectedTokenIds, setAiSelectedTokenIds] = useState<Set<string>>(new Set());
    
    // --- Infinite Scroll State ---
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');
    
    // --- Состояние выбора записей для удаления ---
    const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Типы действий для модального окна подтверждения
    type ConfirmAction = 'deleteOne' | 'deleteSelected' | 'deleteAll' | null;
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    
    // Ref для контейнера скролла
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Загрузка списков (один раз)
    useEffect(() => {
        api.getAllSystemAccounts().then(setVkAccounts).catch(console.error);
        api.getAllProjectsForManagement().then(setVkProjects).catch(console.error);
        api.getAllAiTokens().then(setAiTokens).catch(console.error);
    }, []);

    // Функция начальной загрузки логов (сброс и загрузка первой страницы)
    const fetchLogsInitial = useCallback(async () => {
        setIsLoading(true);
        setPage(1);
        try {
            if (activeTab === 'vk') {
                const filters: GetLogsFilters = {
                    accountIds: Array.from(vkSelectedAccountIds),
                    searchQuery: searchQuery || undefined,
                    status: statusFilter
                };
                const data = await api.getLogs(1, pageSize, filters);
                setVkLogs(data.items);
                setTotalCount(data.total_count);
                setHasMore(data.items.length >= pageSize && data.items.length < data.total_count);
            } else {
                const filters: GetAiLogsFilters = {
                    tokenIds: Array.from(aiSelectedTokenIds),
                    searchQuery: searchQuery || undefined,
                    status: statusFilter
                };
                const data = await api.getAiLogs(1, pageSize, filters);
                setAiLogs(data.items);
                setTotalCount(data.total_count);
                setHasMore(data.items.length >= pageSize && data.items.length < data.total_count);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, pageSize, vkSelectedAccountIds, aiSelectedTokenIds, searchQuery, statusFilter]);

    // Функция подгрузки следующей страницы (append)
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        
        setIsLoadingMore(true);
        const nextPage = page + 1;
        
        try {
            if (activeTab === 'vk') {
                const filters: GetLogsFilters = {
                    accountIds: Array.from(vkSelectedAccountIds),
                    searchQuery: searchQuery || undefined,
                    status: statusFilter
                };
                const data = await api.getLogs(nextPage, pageSize, filters);
                setVkLogs(prev => [...prev, ...data.items]);
                setHasMore(data.items.length >= pageSize && (vkLogs.length + data.items.length) < data.total_count);
            } else {
                const filters: GetAiLogsFilters = {
                    tokenIds: Array.from(aiSelectedTokenIds),
                    searchQuery: searchQuery || undefined,
                    status: statusFilter
                };
                const data = await api.getAiLogs(nextPage, pageSize, filters);
                setAiLogs(prev => [...prev, ...data.items]);
                setHasMore(data.items.length >= pageSize && (aiLogs.length + data.items.length) < data.total_count);
            }
            setPage(nextPage);
        } catch (err) {
            console.error("Failed to load more logs:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [activeTab, page, pageSize, vkSelectedAccountIds, aiSelectedTokenIds, searchQuery, statusFilter, isLoadingMore, hasMore, vkLogs.length, aiLogs.length]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || isLoadingMore || !hasMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        // Подгружаем когда до конца осталось менее 200px
        if (scrollHeight - scrollTop - clientHeight < 200) {
            loadMore();
        }
    }, [loadMore, isLoadingMore, hasMore]);

    // Подписка на скролл
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    // Дебаунс для поиска и фильтров - сбрасывает и загружает заново
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogsInitial();
        }, 500);
        return () => clearTimeout(timer);
    }, [vkSelectedAccountIds, aiSelectedTokenIds, searchQuery, statusFilter]);
    
    // Сброс и загрузка при смене режима (mode prop)
    useEffect(() => {
        setSearchQuery('');
        setStatusFilter('all');
        setTotalCount(0);
        setHasMore(true);
        setPage(1);
        setSelectedLogIds(new Set());
        if (mode === 'vk') {
            setVkLogs([]);
        } else {
            setAiLogs([]);
        }
        fetchLogsInitial();
    }, [mode]);

    // --- Функции выбора записей ---
    const toggleSelectLog = (id: string) => {
        setSelectedLogIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        const currentLogs = activeTab === 'vk' ? vkLogs : aiLogs;
        if (selectedLogIds.size === currentLogs.length) {
            setSelectedLogIds(new Set());
        } else {
            setSelectedLogIds(new Set(currentLogs.map(l => l.id)));
        }
    };

    // --- Функции удаления ---
    const handleDeleteOne = (id: string) => {
        setDeleteTargetId(id);
        setConfirmAction('deleteOne');
    };

    const handleDeleteSelected = () => {
        if (selectedLogIds.size === 0) return;
        setConfirmAction('deleteSelected');
    };

    const handleDeleteAll = () => {
        setConfirmAction('deleteAll');
    };

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            if (confirmAction === 'deleteOne' && deleteTargetId !== null) {
                if (activeTab === 'vk') {
                    await api.deleteVkLog(deleteTargetId);
                } else {
                    await api.deleteAiLog(deleteTargetId);
                }
                window.showAppToast?.('Запись удалена', 'success');
            } else if (confirmAction === 'deleteSelected') {
                const ids: string[] = Array.from(selectedLogIds);
                if (activeTab === 'vk') {
                    // VK логи используют Integer ID, нужно преобразовать
                    await api.deleteVkLogsBatch(ids.map(id => parseInt(id)));
                } else {
                    // AI логи тоже используют Integer ID
                    await api.deleteAiLogsBatch(ids.map(id => parseInt(id)));
                }
                window.showAppToast?.(`Удалено ${selectedLogIds.size} записей`, 'success');
            } else if (confirmAction === 'deleteAll') {
                // Используем существующую логику очистки всех
                if (activeTab === 'vk') {
                    await api.clearLogs(null);
                } else {
                    await api.clearAiLogs(null);
                }
                window.showAppToast?.('Все логи удалены', 'success');
            }
            setSelectedLogIds(new Set());
            fetchLogsInitial();
        } catch (err) {
            console.error(err);
            window.showAppToast?.('Не удалось удалить', 'error');
        } finally {
            setIsDeleting(false);
            setConfirmAction(null);
            setDeleteTargetId(null);
        }
    };

    const cancelDelete = () => {
        setConfirmAction(null);
        setDeleteTargetId(null);
    };

    const getConfirmMessage = () => {
        switch (confirmAction) {
            case 'deleteOne':
                return 'Удалить эту запись?';
            case 'deleteSelected':
                return `Удалить выбранные записи (${selectedLogIds.size} шт.)?`;
            case 'deleteAll':
                return `Удалить ВСЕ логи ${activeTab === 'vk' ? 'VK' : 'AI'}? Это действие нельзя отменить.`;
            default:
                return '';
        }
    };
    
    // Helpers for VK
    const getVkAccountName = (log: TokenLog) => {
        if (log.is_env_token) return "ENV TOKEN (Системный)";
        if (!log.account_id) return "Неизвестный";
        const acc = vkAccounts.find(a => a.id === log.account_id);
        return acc ? acc.full_name : "Удаленный аккаунт";
    };
    
    const getProjectName = (log: TokenLog) => {
        if (!log.project_id) return '-';
        const proj = vkProjects.find(p => p.id === log.project_id);
        return proj ? proj.name : log.project_id;
    };
    
    // Helpers for AI
    const getAiTokenName = (log: AiTokenLog) => {
        if (log.is_env_token) return "ENV TOKEN (Основной)";
        if (!log.token_id) return "Неизвестный";
        const t = aiTokens.find(t => t.id === log.token_id);
        return t ? (t.description || "Без названия") : "Удаленный токен";
    };

    const getStatusBadge = (status: string) => {
        return status === 'success' 
            ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Успех</span>
            : <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Ошибка</span>;
    };

    const vkOptions = [
        { id: 'env', label: 'ENV TOKEN' },
        ...vkAccounts.map(a => ({ id: a.id, label: a.full_name }))
    ];
    
    const aiOptions = [
        { id: 'env', label: 'ENV TOKEN' },
        ...aiTokens.map(t => ({ id: t.id, label: t.description || 'Без названия' }))
    ];

    const currentLogs = activeTab === 'vk' ? vkLogs : aiLogs;
    const currentLogsCount = currentLogs.length;

    return (
        <div className="flex flex-col h-full">
            {/* Заголовок секции с кнопками */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {activeTab === 'vk' ? 'VK Логи' : 'AI Логи'}
                    </h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Загружено: {currentLogsCount} из {totalCount}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={handleDeleteAll}
                        disabled={currentLogsCount === 0 || isDeleting}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                        title="Удалить все логи"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Удалить все
                    </button>
                    <button 
                        type="button"
                        onClick={fetchLogsInitial}
                        disabled={isLoading || isDeleting}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        title="Обновить данные"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Обновить
                    </button>
                </div>
            </div>

            {/* Панель выбранных записей + фильтры */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-4">
                {/* Выбранные записи */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        Выбрано: <span className="font-medium">{selectedLogIds.size}</span> из {currentLogsCount}
                    </span>
                    <button 
                        onClick={handleDeleteSelected}
                        disabled={selectedLogIds.size === 0 || isDeleting}
                        className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Удалить выбранные
                    </button>
                </div>

                {/* Разделитель */}
                <div className="w-px h-6 bg-gray-300"></div>

                {/* Фильтры */}
                <div className="flex flex-wrap items-center gap-3">
                    {activeTab === 'vk' ? (
                        <MultiSelectDropdown 
                            label="Аккаунты" 
                            options={vkOptions} 
                            selectedIds={vkSelectedAccountIds} 
                            onChange={setVkSelectedAccountIds} 
                        />
                    ) : (
                        <MultiSelectDropdown 
                            label="Токены" 
                            options={aiOptions} 
                            selectedIds={aiSelectedTokenIds} 
                            onChange={setAiSelectedTokenIds} 
                        />
                    )}
                    
                    <div className="relative w-56">
                         <input
                            type="text"
                            placeholder={activeTab === 'vk' ? "Поиск (метод, ошибка)..." : "Поиск (модель, ошибка)..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="flex rounded-md shadow-sm">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 text-sm font-medium border rounded-l-md ${statusFilter === 'all' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setStatusFilter('success')}
                            className={`px-3 py-1.5 text-sm font-medium border-t border-b border-r ${statusFilter === 'success' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            Успех
                        </button>
                        <button
                            onClick={() => setStatusFilter('error')}
                            className={`px-3 py-1.5 text-sm font-medium border-t border-b border-r rounded-r-md ${statusFilter === 'error' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            Ошибки
                        </button>
                    </div>
                </div>
            </div>

            {/* Таблица с infinite scroll */}
            <div 
                ref={scrollContainerRef}
                className="flex-grow overflow-auto custom-scrollbar bg-gray-50 p-4"
            >
                {isLoading && currentLogsCount === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : currentLogsCount === 0 ? (
                    <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg bg-white">
                        Логи не найдены
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-[1100px] w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b sticky top-0 z-10">
                                <tr>
                                    <th className="w-10 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={currentLogsCount > 0 && selectedLogIds.size === currentLogsCount}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 w-40">Дата</th>
                                    <th className="px-6 py-3 w-48">{activeTab === 'vk' ? 'Аккаунт' : 'Токен'}</th>
                                    <th className="px-6 py-3 w-32">{activeTab === 'vk' ? 'Метод' : 'Модель'}</th>
                                    <th className="px-6 py-3 w-24">Статус</th>
                                    {activeTab === 'vk' && <th className="px-6 py-3 w-64">Проект</th>}
                                    <th className="px-6 py-3">Детали</th>
                                    <th className="w-12 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activeTab === 'vk' ? (
                                    vkLogs.map((log) => (
                                        <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${selectedLogIds.has(log.id) ? 'bg-indigo-50' : ''}`}>
                                            <td className="w-10 px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLogIds.has(log.id)}
                                                    onChange={() => toggleSelectLog(log.id)}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(log.timestamp).toLocaleString('ru-RU')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900 truncate max-w-[180px]" title={getVkAccountName(log)}>{getVkAccountName(log)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold whitespace-nowrap">{log.method}</td>
                                            <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {log.project_id ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-700 text-xs truncate max-w-[200px]" title={getProjectName(log)}>
                                                            {getProjectName(log)}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-mono">{log.project_id}</span>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap truncate max-w-xs" title={log.error_details || '-'}>{log.error_details || '-'}</td>
                                            <td className="w-12 px-4 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteOne(log.id)}
                                                    disabled={isDeleting}
                                                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                    title="Удалить"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    aiLogs.map((log) => (
                                        <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${selectedLogIds.has(log.id) ? 'bg-indigo-50' : ''}`}>
                                            <td className="w-10 px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLogIds.has(log.id)}
                                                    onChange={() => toggleSelectLog(log.id)}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(log.timestamp).toLocaleString('ru-RU')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900 truncate max-w-[180px]" title={getAiTokenName(log)}>{getAiTokenName(log)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold whitespace-nowrap">{log.model_name}</td>
                                            <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap truncate max-w-xs" title={log.error_details || '-'}>{log.error_details || '-'}</td>
                                            <td className="w-12 px-4 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteOne(log.id)}
                                                    disabled={isDeleting}
                                                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                    title="Удалить"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        
                        {/* Кнопка "Загрузить ещё" и индикатор загрузки */}
                        {hasMore && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
                                {isLoadingMore ? (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <div className="loader border-t-indigo-500 w-5 h-5"></div>
                                        <span className="text-sm">Загрузка...</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={loadMore}
                                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors"
                                    >
                                        Загрузить ещё
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Сообщение что всё загружено */}
                        {!hasMore && currentLogsCount > 0 && (
                            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-400">
                                Все записи загружены ({currentLogsCount})
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Модальное окно подтверждения удаления */}
            {confirmAction && (
                 <ConfirmationModal
                    title="Подтверждение удаления"
                    message={getConfirmMessage()}
                    onConfirm={executeDelete}
                    onCancel={cancelDelete}
                    confirmText="Удалить"
                    confirmButtonVariant="danger"
                    isConfirming={isDeleting}
                />
            )}
        </div>
    );
}
