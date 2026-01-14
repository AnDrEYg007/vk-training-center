import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../../services/api/automations_general.api';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { AddBlacklistModal } from './modals/AddBlacklistModal';
import { useToast } from '../../../../shared/components/ToastProvider';

interface Props { contestId?: string }

export const GeneralBlacklistTab: React.FC<Props> = ({ contestId }) => {
    const toast = useToast();
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toDelete, setToDelete] = useState<any | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const load = useCallback(async () => {
        if (!contestId) { setItems([]); setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const data = await api.getGeneralContestBlacklist(contestId);
            setItems(data);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [contestId]);

    useEffect(() => { load(); }, [load]);

    const handleDelete = (it: any) => setToDelete(it);
    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(toDelete.id);
        try {
            await api.deleteGeneralContestBlacklistEntry(toDelete.id);
            setItems(prev => prev.filter(p => p.id !== toDelete.id));
            setToDelete(null);
        } catch (e) { toast.error('Не удалось удалить'); }
        finally { setDeleting(null); }
    };

    if (isLoading) return <div className="h-full flex items-center justify-center"><div className="loader h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div></div>;

    return (
        <div className="opacity-0 animate-fade-in-up h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Черный список (Конкурс)</h3>
                    <p className="text-sm text-gray-500">Участники, исключённые для этого конкурса.</p>
                </div>
                <div>
                    <button
                        onClick={() => {
                            if (!contestId) {
                                window.showAppToast?.('Сохраните конкурс перед добавлением в чёрный список.', 'warning');
                                return;
                            }
                            setIsAddOpen(true);
                        }}
                        className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100"
                    >
                        Добавить в ЧС
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-grow flex flex-col">
                {items.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center p-8 text-gray-400">Пусто.</div>
                ) : (
                    <div className="overflow-y-auto custom-scrollbar flex-grow">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Пользователь</th>
                                    <th className="px-6 py-3">Срок</th>
                                    <th className="px-6 py-3">Добавлен</th>
                                    <th className="px-6 py-3 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map(it => (
                                    <tr key={it.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{it.user_name || `ID ${it.user_vk_id}`}</td>
                                        <td className="px-6 py-4">{it.until_date ? new Date(it.until_date).toLocaleDateString() : 'Навсегда'}</td>
                                        <td className="px-6 py-4 text-gray-500">{it.created_at ? new Date(it.created_at).toLocaleDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(it)} className="text-red-600">Удалить</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {toDelete && (
                <ConfirmationModal title="Удалить из чёрного списка?" message={`Разблокировать ${toDelete.user_name || toDelete.user_vk_id}?`} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} confirmText="Разблокировать" isConfirming={!!deleting} />
            )}

            {isAddOpen && contestId && (
                <AddBlacklistModal contestId={contestId} onClose={() => setIsAddOpen(false)} onSuccess={() => { setIsAddOpen(false); load(); }} />
            )}
        </div>
    );
};
