import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../auth/contexts/AuthContext';
import { ContestEntry } from '../../../../services/api/automations.api';
import * as api from '../../../../services/api/automations_general.api';

interface GeneralParticipantsTabProps {
    contestId?: string;
}

const statusBadge = (status: string) => {
    switch (status) {
        case 'commented':
        case 'processed':
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Обработан</span>;
        case 'processing':
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">В очереди</span>;
        case 'winner':
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Победитель</span>;
        case 'error':
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Ошибка</span>;
        default:
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">Новый</span>;
    }
};

export const GeneralParticipantsTab: React.FC<GeneralParticipantsTabProps> = ({ contestId }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [participants, setParticipants] = useState<ContestEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);

    const loadParticipants = useCallback(async () => {
        if (!contestId) {
            setParticipants([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const data = await api.getGeneralContestParticipants(contestId);
            setParticipants(data);
        } catch (error) {
            console.error("Failed to load general contest participants:", error);
        } finally {
            setIsLoading(false);
        }
    }, [contestId]);

    useEffect(() => {
        loadParticipants();
    }, [loadParticipants]);

    const handleClear = async () => {
        if (!contestId) return;
        if (!confirm('Очистить список участников?')) return;
        setIsClearing(true);
        try {
            await api.clearGeneralContestParticipants(contestId);
            setParticipants([]);
        } catch (error) {
            window.showAppToast?.('Не удалось очистить список участников.', 'error');
            console.error(error);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden opacity-0 animate-fade-in-up h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="text-sm text-gray-500">Всего участников: <strong>{participants.length}</strong></div>
                <div className="flex gap-2">
                    {isAdmin && (
                        <button 
                            onClick={handleClear}
                            disabled={isClearing}
                            className="px-3 py-1.5 text-sm bg-white border border-red-200 rounded hover:bg-red-50 text-red-600 disabled:opacity-50"
                        >
                            {isClearing ? '...' : 'Очистить'}
                        </button>
                    )}
                    <button 
                        onClick={loadParticipants}
                        className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-gray-50 text-gray-600"
                    >
                        Обновить
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="loader h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : participants.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    Нет участников. Сбор начнется после публикации стартового поста.
                </div>
            ) : (
                <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3">Участник</th>
                                <th className="px-4 py-3">Пост</th>
                                <th className="px-4 py-3 w-24 text-center">Номер</th>
                                <th className="px-4 py-3 w-32">Статус</th>
                                <th className="px-4 py-3 w-40">Дата</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {participants.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <a 
                                            className="font-medium text-indigo-600 hover:underline"
                                            href={`https://vk.com/id${p.user_vk_id}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                        >
                                            {p.user_name || `ID: ${p.user_vk_id}`}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 truncate max-w-xs">
                                        {p.post_link ? (
                                            <a 
                                                href={p.post_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 hover:underline"
                                            >
                                                Пост #{p.vk_post_id}
                                            </a>
                                        ) : <span className="text-gray-400">-</span>}
                                        {p.post_text && (
                                            <div className="text-xs text-gray-500 line-clamp-2">{p.post_text}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {p.entry_number && p.entry_number > 0 ? (
                                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{p.entry_number}</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {p.created_at ? new Date(p.created_at).toLocaleString('ru-RU') : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
