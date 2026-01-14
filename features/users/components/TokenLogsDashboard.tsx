
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
                className={`flex items-center justify-between w-48 px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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

export const TokenLogsDashboard: React.FC = () => {
    // --- Global State ---
    const [activeTab, setActiveTab] = useState<'vk' | 'ai'>('vk');
    
    // --- VK Logs State ---
    const [vkLogs, setVkLogs] = useState<TokenLog[]>([]);
    const [vkAccounts, setVkAccounts] = useState<SystemAccount[]>([]);
    const [vkProjects, setVkProjects] = useState<Project[]>([]);
    const [vkSelectedAccountIds, setVkSelectedAccountIds] = useState<Set<string>>(new Set());
    
    // --- AI Logs State ---
    const [aiLogs, setAiLogs] = useState<AiTokenLog[]>([]);
    const [aiTokens, setAiTokens] = useState<AiToken[]>([]);
    const [aiSelectedTokenIds, setAiSelectedTokenIds] = useState<Set<string>>(new Set());
    
    // --- Common State ---
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');
    
    const [isClearing, setIsClearing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Загрузка списков (один раз)
    useEffect(() => {
        api.getAllSystemAccounts().then(setVkAccounts).catch(console.error);
        api.getAllProjectsForManagement().then(setVkProjects).catch(console.error);
        api.getAllAiTokens().then(setAiTokens).catch(console.error);
    }, []);

    // Функция загрузки логов
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'vk') {
                const filters: GetLogsFilters = {
                    accountIds: Array.from(vkSelectedAccountIds),
                    searchQuery: searchQuery || undefined,
                    status: statusFilter
                };
                const data = await api.getLogs(page, pageSize, filters);
                setVkLogs(data.items);
                setTotalCount(data.total_count);
            } else {
                const filters: GetAiLogsFilters = {
                    tokenIds: Array.from(aiSelectedTokenIds),
                    searchQuery: searchQuery || undefined,
                    status: statusFilter
                };
                const data = await api.getAiLogs(page, pageSize, filters);
                setAiLogs(data.items);
                setTotalCount(data.total_count);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, page, pageSize, vkSelectedAccountIds, aiSelectedTokenIds, searchQuery, statusFilter]);

    // Дебаунс для поиска и фильтров
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [activeTab, vkSelectedAccountIds, aiSelectedTokenIds, searchQuery, statusFilter]);

    // Пагинация
    useEffect(() => {
        fetchLogs();
    }, [page]);
    
    // Сброс фильтров при переключении табов
    useEffect(() => {
        setPage(1);
        setSearchQuery('');
        setStatusFilter('all');
        setTotalCount(0);
        // Не сбрасываем выбранные аккаунты/токены, пусть хранятся в своих стейтах
    }, [activeTab]);


    const handleClearLogs = async () => {
        setIsClearing(true);
        try {
            if (activeTab === 'vk') {
                let accountIdToClear: string | null = null;
                if (vkSelectedAccountIds.size === 1) {
                    accountIdToClear = vkSelectedAccountIds.values().next().value;
                }
                await api.clearLogs(accountIdToClear);
            } else {
                let tokenIdToClear: string | null = null;
                if (aiSelectedTokenIds.size === 1) {
                    tokenIdToClear = aiSelectedTokenIds.values().next().value;
                }
                await api.clearAiLogs(tokenIdToClear);
            }
            
            setShowClearConfirm(false);
            window.showAppToast?.("Логи очищены.", 'success');
            fetchLogs();
        } catch (err) {
            console.error(err);
            window.showAppToast?.("Не удалось очистить логи", 'error');
        } finally {
            setIsClearing(false);
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

    return (
        <div className="flex flex-col h-full">
            {/* Вкладки */}
            <div className="px-4 pt-4 bg-white border-b border-gray-200">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab('vk')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'vk' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        VK Логи
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ai' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        AI Логи
                    </button>
                </div>
            </div>

            {/* Панель фильтров */}
            <div className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
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
                    
                    <div className="relative w-64">
                         <input
                            type="text"
                            placeholder={activeTab === 'vk' ? "Поиск (метод, ошибка, проект)..." : "Поиск (модель, ошибка)..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="flex rounded-md shadow-sm">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-2 text-sm font-medium border rounded-l-md ${statusFilter === 'all' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setStatusFilter('success')}
                            className={`px-3 py-2 text-sm font-medium border-t border-b border-r ${statusFilter === 'success' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            Успех
                        </button>
                        <button
                            onClick={() => setStatusFilter('error')}
                            className={`px-3 py-2 text-sm font-medium border-t border-b border-r rounded-r-md ${statusFilter === 'error' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            Ошибки
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => setShowClearConfirm(true)} 
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 shadow-sm"
                    disabled={isLoading || (activeTab === 'vk' ? vkLogs.length === 0 : aiLogs.length === 0)}
                >
                    Очистить
                </button>
            </div>

            {/* Таблица */}
            <div className="flex-grow overflow-auto custom-scrollbar bg-gray-50 p-4">
                {isLoading && (activeTab === 'vk' ? vkLogs.length === 0 : aiLogs.length === 0) ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 w-40">Дата</th>
                                    <th className="px-6 py-3 w-48">{activeTab === 'vk' ? 'Аккаунт' : 'Токен'}</th>
                                    <th className="px-6 py-3 w-32">{activeTab === 'vk' ? 'Метод' : 'Модель'}</th>
                                    <th className="px-6 py-3 w-24">Статус</th>
                                    {activeTab === 'vk' && <th className="px-6 py-3 w-64">Проект</th>}
                                    <th className="px-6 py-3">Детали</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activeTab === 'vk' ? (
                                    vkLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(log.timestamp).toLocaleString('ru-RU')}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{getVkAccountName(log)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold">{log.method}</td>
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
                                            <td className="px-6 py-4 text-gray-600 break-all max-w-md">{log.error_details || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    aiLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(log.timestamp).toLocaleString('ru-RU')}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{getAiTokenName(log)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold">{log.model_name}</td>
                                            <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                                            <td className="px-6 py-4 text-gray-600 break-all max-w-md">{log.error_details || '-'}</td>
                                        </tr>
                                    ))
                                )}
                                {((activeTab === 'vk' && vkLogs.length === 0) || (activeTab === 'ai' && aiLogs.length === 0)) && (
                                     <tr>
                                         <td colSpan={6} className="text-center py-10 text-gray-500">Логи не найдены</td>
                                     </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Пагинация */}
            <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center flex-shrink-0">
                <div className="text-sm text-gray-700">
                    Всего записей: <span className="font-medium">{totalCount}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1 || isLoading}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                    >
                        Назад
                    </button>
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 rounded">
                        Стр. {page}
                    </span>
                    <button 
                        onClick={() => setPage(p => p + 1)} 
                        disabled={(activeTab === 'vk' ? vkLogs.length : aiLogs.length) < pageSize || isLoading}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                    >
                        Вперед
                    </button>
                </div>
            </div>

            {showClearConfirm && (
                 <ConfirmationModal
                    title="Очистить логи?"
                    message={
                        (activeTab === 'vk' 
                            ? (vkSelectedAccountIds.size === 1 ? "Вы уверены, что хотите удалить логи выбранного аккаунта?" : "ВНИМАНИЕ: Вы собираетесь удалить ВСЕ логи VK.")
                            : (aiSelectedTokenIds.size === 1 ? "Вы уверены, что хотите удалить логи выбранного AI токена?" : "ВНИМАНИЕ: Вы собираетесь удалить ВСЕ логи AI.")) + 
                        "\nЭто действие необратимо."
                    }
                    onConfirm={handleClearLogs}
                    onCancel={() => setShowClearConfirm(false)}
                    confirmText="Очистить"
                    confirmButtonVariant="danger"
                    isConfirming={isClearing}
                />
            )}
        </div>
    );
}
