
import React, { useState, useEffect } from 'react';
import * as api from '../../../../services/api/automations.api';
import { DeliveryLog } from '../types';
import { useProjects } from '../../../../contexts/ProjectsContext';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { useAuth } from '../../../../features/auth/contexts/AuthContext';

interface SendingListTabProps {
    projectId: string;
}

export const SendingListTab: React.FC<SendingListTabProps> = ({ projectId }) => {
    const [logs, setLogs] = useState<DeliveryLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState<string | null>(null);
    const [isRetryingAll, setIsRetryingAll] = useState(false);
    
    // Состояния для модальных окон
    const [showRetryAllConfirm, setShowRetryAllConfirm] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    
    const { projects } = useProjects();
    const { user } = useAuth();
    const currentProject = projects.find(p => p.id === projectId);
    const vkProjectId = currentProject?.vkProjectId;

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await api.getDeliveryLogs(projectId);
            setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [projectId]);

    const handleRetry = async (logId: string) => {
        setIsRetrying(logId);
        try {
            await api.retryPromocodeDelivery(logId);
            window.showAppToast?.("Сообщение успешно отправлено!", 'success');
            loadData(); // Обновляем список
        } catch (e) {
            window.showAppToast?.("Повторная отправка не удалась: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsRetrying(null);
        }
    };

    const handleRetryAllClick = () => {
        setShowRetryAllConfirm(true);
    };

    const executeRetryAll = async () => {
        setShowRetryAllConfirm(false);
        setIsRetryingAll(true);
        try {
            await api.retryPromocodeDeliveryAll(projectId);
            window.showAppToast?.("Массовая отправка завершена!", 'success');
            loadData();
        } catch (e) {
            window.showAppToast?.("Массовая отправка не удалась: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsRetryingAll(false);
        }
    };
    
    const handleClearLogsClick = () => {
        setShowClearConfirm(true);
    };

    const executeClearLogs = async () => {
        setShowClearConfirm(false);
        setIsClearing(true);
        try {
            await api.clearDeliveryLogs(projectId);
            setLogs([]);
        } catch (e) {
            window.showAppToast?.("Не удалось очистить журнал: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsClearing(false);
        }
    };
    
    const stats = {
        sent: logs.filter(l => l.status === 'sent').length,
        error: logs.filter(l => l.status === 'error').length
    };
    
    const getDialogLink = (userId?: number) => {
        if (!userId || !vkProjectId) return '#';
        return `https://vk.com/gim${vkProjectId}?sel=${userId}`;
    };

    return (
        <div className="opacity-0 animate-fade-in-up h-full flex flex-col">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Журнал отправки призов</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-4 text-sm mr-4">
                            <span className="text-green-600">Успешно: <strong>{stats.sent}</strong></span>
                            <span className="text-red-500">Ошибки: <strong>{stats.error}</strong></span>
                        </div>
                        {stats.error > 0 && (
                            <button
                                onClick={handleRetryAllClick}
                                disabled={isRetryingAll}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
                            >
                                {isRetryingAll && <div className="loader h-3 w-3 border-2 border-white border-t-transparent"></div>}
                                Повторить всем ({stats.error})
                            </button>
                        )}
                        {user?.role === 'admin' && (
                            <button
                                onClick={handleClearLogsClick}
                                disabled={isClearing}
                                className="px-3 py-1.5 text-sm font-medium rounded-md border border-red-300 text-red-600 bg-white hover:bg-red-50 disabled:opacity-50"
                                title="Очистить журнал (история отправок)"
                            >
                                Очистить журнал
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="overflow-y-auto custom-scrollbar flex-grow">
                     {logs.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Нет отправленных призов.</div>
                     ) : (
                         <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Пользователь</th>
                                    <th className="px-4 py-3">Выданный приз (Код)</th>
                                    <th className="px-4 py-3 w-40">Статус отправки</th>
                                    <th className="px-4 py-3 w-40">Время</th>
                                    <th className="px-4 py-3 w-16 text-center">Чат</th>
                                    <th className="px-4 py-3 w-32"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="font-medium text-gray-900">{log.user_name}</div>
                                                    <a href={`https://vk.com/id${log.user_vk_id}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">ID: {log.user_vk_id}</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-mono text-gray-700 font-medium">{log.promo_code}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{log.prize_description}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {log.status === 'sent' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Доставлено (ЛС)
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                                                        Ошибка ЛС
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">Отправлен комментарий</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(log.created_at).toLocaleString('ru-RU')}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <a 
                                                href={getDialogLink(log.user_vk_id)} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-gray-400 hover:text-indigo-600 inline-flex items-center justify-center p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                                title="Открыть диалог с пользователем"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {log.status === 'error' && (
                                                <button
                                                    onClick={() => handleRetry(log.id)}
                                                    disabled={isRetrying === log.id}
                                                    className="text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                                >
                                                    {isRetrying === log.id ? '...' : 'Повторить'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     )}
                </div>
            </div>
            
            {showRetryAllConfirm && (
                <ConfirmationModal
                    title="Повторить отправку всем?"
                    message="Вы уверены, что хотите повторить попытку отправки сообщений для ВСЕХ пользователей со статусом ошибки?"
                    onConfirm={executeRetryAll}
                    onCancel={() => setShowRetryAllConfirm(false)}
                    confirmText="Да, повторить"
                    cancelText="Отмена"
                    isConfirming={isRetryingAll}
                />
            )}
            
            {showClearConfirm && (
                <ConfirmationModal
                    title="Очистить журнал?"
                    message="Вы уверены, что хотите удалить ВСЕ записи из журнала отправок? Это не повлияет на базу промокодов, но история сообщений будет потеряна."
                    onConfirm={executeClearLogs}
                    onCancel={() => setShowClearConfirm(false)}
                    confirmText="Да, очистить"
                    confirmButtonVariant="danger"
                    isConfirming={isClearing}
                />
            )}
        </div>
    );
};
