
import React, { useState, useEffect, useCallback } from 'react';
import { BlacklistEntry } from '../types';
import * as api from '../../../../services/api/automations.api';
import { useProjects } from '../../../../contexts/ProjectsContext'; // Для получения ID, если не передан
import { AddBlacklistModal } from './modals/AddBlacklistModal';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface BlacklistTabProps {
    projectId?: string;
}

export const BlacklistTab: React.FC<BlacklistTabProps> = ({ projectId: propProjectId }) => {
    // Получаем ID проекта (либо из пропсов, либо пытаемся найти активный)
    // В текущей структуре ReviewsContestPage передает projectId, но для безопасности:
    const { projects } = useProjects();
    // Этот хак нужен, если компонент рендерится вне контекста страницы (редкий кейс)
    // Обычно propProjectId будет передан.
    const projectId = propProjectId || ""; 

    const [items, setItems] = useState<BlacklistEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Состояние для удаления
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<BlacklistEntry | null>(null);

    const loadData = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const data = await api.getBlacklist(projectId);
            setItems(data);
        } catch (e) {
            console.error(e);
            window.showAppToast?.("Не удалось загрузить черный список.", 'error');
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAddSuccess = () => {
        setIsAddModalOpen(false);
        loadData();
    };

    const handleDeleteClick = (item: BlacklistEntry) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setDeletingId(itemToDelete.id);
        try {
            await api.deleteFromBlacklist(itemToDelete.id);
            setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
            setItemToDelete(null);
        } catch (e) {
            window.showAppToast?.("Не удалось удалить: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setDeletingId(null);
        }
    };
    
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return <span className="text-gray-400">Навсегда</span>;
        return new Date(dateStr).toLocaleDateString('ru-RU');
    };
    
    const isDateExpired = (dateStr?: string) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loader h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full opacity-0 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Черный список</h3>
                    <p className="text-sm text-gray-500">Участники, которые будут исключены из розыгрыша.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Добавить в ЧС
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-grow flex flex-col">
                {items.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <p>Черный список пуст.</p>
                    </div>
                ) : (
                    <div className="overflow-y-auto custom-scrollbar flex-grow">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Пользователь</th>
                                    <th className="px-6 py-3">Срок блокировки</th>
                                    <th className="px-6 py-3">Дата добавления</th>
                                    <th className="px-6 py-3 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item) => {
                                    const expired = isDateExpired(item.until_date);
                                    return (
                                        <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${expired ? 'bg-gray-50 opacity-60' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{item.user_name || `ID ${item.user_vk_id}`}</span>
                                                    <a 
                                                        href={`https://vk.com/id${item.user_vk_id}`} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="text-xs text-indigo-500 hover:underline"
                                                    >
                                                        Link
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${expired ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                        {formatDate(item.until_date)}
                                                    </span>
                                                    {expired && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded">Истек</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Удалить из ЧС"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <AddBlacklistModal 
                    projectId={projectId}
                    onClose={() => setIsAddModalOpen(false)} 
                    onSuccess={handleAddSuccess} 
                />
            )}

            {itemToDelete && (
                <ConfirmationModal
                    title="Удалить из черного списка?"
                    message={`Вы уверены, что хотите разблокировать пользователя "${itemToDelete.user_name || itemToDelete.user_vk_id}"? Он снова сможет участвовать в конкурсах.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setItemToDelete(null)}
                    confirmText="Разблокировать"
                    confirmButtonVariant="danger"
                    isConfirming={!!deletingId}
                />
            )}
        </div>
    );
};
