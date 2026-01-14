
import React, { useState, useEffect } from 'react';
import * as api from '../../../../services/api/automations.api';
import { DeliveryLog } from '../types';

interface WinnersTabProps {
    projectId: string;
}

export const WinnersTab: React.FC<WinnersTabProps> = ({ projectId }) => {
    const [winners, setWinners] = useState<DeliveryLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWinners = async () => {
            setIsLoading(true);
            try {
                // Используем журнал доставки как источник правды о победителях
                const logs = await api.getDeliveryLogs(projectId);
                setWinners(logs);
            } catch (error) {
                console.error("Failed to load winners:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWinners();
    }, [projectId]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                 <div className="loader h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="opacity-0 animate-fade-in-up h-full flex flex-col">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-amber-50">
                    <h3 className="text-lg font-semibold text-amber-800">Список победителей</h3>
                    <p className="text-xs text-amber-700 mt-1">История всех проведенных розыгрышей и выданных призов.</p>
                </div>
                
                {winners.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <p>Победители еще не выбраны.</p>
                        <p className="text-sm mt-1">Здесь появится список, когда вы проведете первый розыгрыш.</p>
                    </div>
                ) : (
                    <div className="overflow-y-auto custom-scrollbar flex-grow">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Дата розыгрыша</th>
                                    <th className="px-6 py-3">Победитель</th>
                                    <th className="px-6 py-3">Пост автора</th>
                                    <th className="px-6 py-3">Итоги конкурса</th>
                                    <th className="px-6 py-3">Приз</th>
                                    <th className="px-6 py-3">Промокод</th>
                                    <th className="px-6 py-3 text-right">Статус доставки</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {winners.map((winner) => (
                                    <tr key={winner.id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(winner.created_at).toLocaleString('ru-RU')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a 
                                                href={`https://vk.com/id${winner.user_vk_id}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="font-medium text-indigo-600 hover:underline"
                                            >
                                                {winner.user_name || `ID: ${winner.user_vk_id}`}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            {winner.winner_post_link ? (
                                                <a 
                                                    href={winner.winner_post_link} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded text-xs transition-colors border border-gray-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    Отзыв
                                                </a>
                                            ) : <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {winner.results_post_link ? (
                                                <a 
                                                    href={winner.results_post_link} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded text-xs transition-colors border border-amber-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                                    Итоги
                                                </a>
                                            ) : <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {winner.prize_description || <span className="text-gray-400 italic">Без описания</span>}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-700 bg-gray-100 px-2 rounded w-fit text-xs">
                                            {winner.promo_code}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {winner.status === 'sent' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Вручено (ЛС)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="ЛС закрыто, отправлен комментарий">
                                                    Вручено (Коммент)
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
