import React, { useState, useEffect } from 'react';
import { DeliveryLog } from '../../reviews-contest/types';
import * as api from '../../../../services/api/automations_general.api';
import { useProjects } from '../../../../contexts/ProjectsContext';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface Props {
    contestId?: string;
}

export const GeneralSendingListTab: React.FC<Props> = ({ contestId }) => {
    const [logs, setLogs] = useState<DeliveryLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState<string | null>(null);
    const [isRetryingAll, setIsRetryingAll] = useState(false);
    const [showRetryAllConfirm, setShowRetryAllConfirm] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const { projects } = useProjects();

    const load = async () => {
        if (!contestId) { setLogs([]); setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const data = await api.getGeneralContestDeliveryLogs(contestId);
            setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { load(); }, [contestId]);

    const handleRetry = async (logId: string) => {
        setIsRetrying(logId);
        try {
            await api.retryGeneralContestDelivery(logId);
            await load();
        } catch (e) {
            window.showAppToast?.('Повтор не удался', 'error');
        } finally { setIsRetrying(null); }
    };

    const executeRetryAll = async () => {
        if (!contestId) return;
        setShowRetryAllConfirm(false);
        setIsRetryingAll(true);
        try {
            await api.retryGeneralContestDeliveryAll(contestId);
            await load();
        } catch (e) {
            window.showAppToast?.('Массовая отправка не удалась', 'error');
        } finally { setIsRetryingAll(false); }
    };

    const executeClear = async () => {
        if (!contestId) return;
        setShowClearConfirm(false);
        setIsClearing(true);
        try {
            await api.clearGeneralContestDeliveryLogs(contestId);
            setLogs([]);
        } catch (e) {
            window.showAppToast?.('Не удалось очистить журнал', 'error');
        } finally { setIsClearing(false); }
    };

    const stats = { sent: logs.filter(l => l.status === 'sent').length, error: logs.filter(l => l.status === 'error').length };

    if (isLoading) return <div className="h-full flex items-center justify-center"><div className="loader h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div></div>;

    return (
        <div className="opacity-0 animate-fade-in-up h-full flex flex-col">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Журнал отправки призов (Конкурс)</h3>
                    <div className="flex items-center gap-3">
                        <div className="text-sm">
                            <span className="text-green-600">Успешно: <strong>{stats.sent}</strong></span>
                            <span className="ml-3 text-red-500">Ошибки: <strong>{stats.error}</strong></span>
                        </div>
                        {stats.error > 0 && <button onClick={() => setShowRetryAllConfirm(true)} className="px-3 py-1.5 bg-indigo-600 text-white rounded">Повторить всем</button>}
                        <button onClick={() => setShowClearConfirm(true)} className="px-3 py-1.5 border rounded">Очистить</button>
                    </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-grow">
                    {logs.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Нет записей.</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Пользователь</th>
                                    <th className="px-4 py-3">Код / Приз</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3">Время</th>
                                    <th className="px-4 py-3 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map(l => (
                                    <tr key={l.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{l.user_name || `ID ${l.user_vk_id}`}</td>
                                        <td className="px-4 py-3 font-mono">{l.promo_code}</td>
                                        <td className="px-4 py-3">{l.status}</td>
                                        <td className="px-4 py-3 text-gray-500">{l.created_at ? new Date(l.created_at).toLocaleString('ru-RU') : '-'}</td>
                                        <td className="px-4 py-3 text-right">{l.status === 'error' && <button disabled={isRetrying === l.id} onClick={() => handleRetry(l.id)} className="text-xs text-indigo-600">{isRetrying === l.id ? '...' : 'Повторить'}</button>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showRetryAllConfirm && (
                <ConfirmationModal title="Повторить отправку всем?" message="Вы уверены?" onConfirm={executeRetryAll} onCancel={() => setShowRetryAllConfirm(false)} confirmText="Да" />
            )}
            {showClearConfirm && (
                <ConfirmationModal title="Очистить журнал?" message="Удалить все записи?" onConfirm={executeClear} onCancel={() => setShowClearConfirm(false)} confirmText="Да" confirmButtonVariant="danger" isConfirming={isClearing} />
            )}
        </div>
    );
};
