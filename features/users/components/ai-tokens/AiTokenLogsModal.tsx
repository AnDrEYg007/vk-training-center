
import React, { useState, useEffect, useCallback } from 'react';
import { AiToken, AiTokenLog } from '../../../../shared/types';
import * as api from '../../../../services/api';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface AiTokenLogsModalProps {
    token: AiToken | 'env'; // 'env' для ENV токена
    onClose: () => void;
}

export const AiTokenLogsModal: React.FC<AiTokenLogsModalProps> = ({ token, onClose }) => {
    const [logs, setLogs] = useState<AiTokenLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isClearing, setIsClearing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const tokenId = token === 'env' ? 'env' : token.id;
    const tokenName = token === 'env' ? 'ENV KEY (Основной)' : (token.description || token.token.substring(0, 10) + '...');

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getAiLogs(page, 50, { tokenIds: [tokenId] });
            setLogs(data.items);
            setTotalCount(data.total_count);
        } catch (err) {
            console.error(err);
            window.showAppToast?.("Не удалось загрузить логи", 'error');
        } finally {
            setIsLoading(false);
        }
    }, [tokenId, page]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleClearLogs = async () => {
        setIsClearing(true);
        try {
            await api.clearAiLogs(tokenId);
            setLogs([]);
            setTotalCount(0);
            setShowClearConfirm(false);
        } catch (err) {
            console.error(err);
            window.showAppToast?.("Не удалось очистить логи", 'error');
        } finally {
            setIsClearing(false);
        }
    };
    
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ru-RU');
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                    <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Логи AI токена: <span className="text-indigo-600">{tokenName}</span></h2>
                            <p className="text-xs text-gray-500">Всего записей: {totalCount}</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowClearConfirm(true)} 
                                disabled={logs.length === 0}
                                className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50"
                            >
                                Очистить логи
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </header>
                    
                    <main className="flex-grow p-0 overflow-auto custom-scrollbar bg-gray-50">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="loader border-t-indigo-500 w-8 h-8"></div>
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">Логи пусты.</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 w-40">Дата</th>
                                        <th className="px-4 py-3 w-40">Модель</th>
                                        <th className="px-4 py-3 w-24">Статус</th>
                                        <th className="px-4 py-3">Детали / Ошибка</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-gray-600">{formatDate(log.timestamp)}</td>
                                            <td className="px-4 py-2 font-mono text-xs text-indigo-700">{log.model_name}</td>
                                            <td className="px-4 py-2">
                                                {log.status === 'success' ? (
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Успех</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Ошибка</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-gray-600 break-all max-w-lg">{log.error_details || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </main>

                    {totalCount > 50 && (
                        <footer className="p-3 border-t flex justify-center items-center gap-4 bg-white flex-shrink-0">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))} 
                                disabled={page === 1 || isLoading}
                                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                            >
                                Назад
                            </button>
                            <span className="text-sm text-gray-600">Страница {page}</span>
                            <button 
                                onClick={() => setPage(p => p + 1)} 
                                disabled={logs.length < 50 || isLoading}
                                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                            >
                                Вперед
                            </button>
                        </footer>
                    )}
                </div>
            </div>

            {showClearConfirm && (
                <ConfirmationModal
                    title="Очистить логи?"
                    message={`Вы уверены, что хотите удалить все записи логов для этого токена? Это действие необратимо.`}
                    onConfirm={handleClearLogs}
                    onCancel={() => setShowClearConfirm(false)}
                    confirmText="Очистить"
                    confirmButtonVariant="danger"
                    isConfirming={isClearing}
                />
            )}
        </>
    );
};
