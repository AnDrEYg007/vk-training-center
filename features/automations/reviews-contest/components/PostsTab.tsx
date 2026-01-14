
import React, { useMemo, useState } from 'react';
import { useContestPosts } from '../hooks/useContestPosts';
import { useProjects } from '../../../../contexts/ProjectsContext'; // Для получения ID активного проекта
import { ContestEntry, FinalizeContestResponse } from '../../../../services/api/automations.api';
import * as api from '../../../../services/api/automations.api';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { FinalizeResultModal } from './modals/FinalizeResultModal';
import { useAuth } from '../../../../features/auth/contexts/AuthContext'; // Импорт useAuth

interface PostsTabProps {
    // В текущей архитектуре ReviewsContestPage не передает projectId в PostsTab явно, 
    // но лучше бы передавал. Пока возьмем из контекста, если пропс не передан (для совместимости)
    projectId?: string; 
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
        case 'new': return <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">Новый</span>;
        case 'processing': return <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100 animate-pulse">В работе</span>;
        case 'commented': return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-100">Принят</span>;
        case 'error': return <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs border border-red-100">Ошибка</span>;
        case 'winner': return <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">Победитель</span>;
        case 'used': return <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded text-xs border border-gray-200">Использован</span>;
        default: return <span className="text-gray-500 text-xs">{status}</span>;
    }
};

export const PostsTab: React.FC<PostsTabProps> = ({ projectId: propProjectId }) => {
    // Хак для получения ID, если он не передан сверху. 
    // В идеале ReviewsContestPage должен прокидывать его.
    const { projects, allScheduledPosts } = useProjects(); 
    const { user } = useAuth(); // Получаем пользователя
    
    // Пока используем проп, ожидая, что он будет
    const projectId = propProjectId || ""; 

    const { entries, isLoading, isCollecting, error, handleCollectPosts, refresh } = useContestPosts(projectId);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
    
    // Состояния для очистки базы
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false); 

    // Состояния для результата финализации
    const [finalizeResult, setFinalizeResult] = useState<FinalizeContestResponse | null>(null);
    const [finalizeError, setFinalizeError] = useState<string | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    
    const handleProcessEntries = async () => {
        setIsProcessing(true);
        try {
            await api.processContestEntries(projectId);
            await refresh();
        } catch (e) {
            window.showAppToast?.("Ошибка при обработке участников: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleFinalizeClick = () => {
        setShowFinalizeConfirm(true);
    };

    const handleFinalizeConfirm = async () => {
        setIsProcessing(true);
        setFinalizeError(null);
        setFinalizeResult(null);
        
        try {
            const result = await api.finalizeContest(projectId);
            setFinalizeResult(result);
            setShowFinalizeConfirm(false);
            setShowResultModal(true); // Показываем модалку результата
            await refresh();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            setFinalizeError(msg);
            setShowFinalizeConfirm(false);
            setShowResultModal(true); // Показываем модалку с ошибкой
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleClearClick = () => {
        setShowClearConfirm(true);
    };

    const handleClearConfirm = async () => {
        setIsClearing(true);
        try {
            await api.clearContestEntries(projectId);
            await refresh();
            setShowClearConfirm(false);
        } catch (e) {
            window.showAppToast?.("Ошибка очистки: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsClearing(false);
        }
    };
    
    const newEntriesCount = entries.filter(e => e.status === 'new').length;
    const readyEntriesCount = entries.filter(e => e.status === 'commented').length;

    return (
        <div className="flex flex-col h-full opacity-0 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700">
                        Все участники
                    </button>
                </div>
                
                <div className="flex gap-2">
                     <button 
                        onClick={refresh} 
                        className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        title="Обновить список"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                    </button>

                    {/* Кнопка очистки перенесена сюда */}
                    {user?.role === 'admin' && (
                         <button 
                            onClick={handleClearClick}
                            disabled={isClearing}
                            className="p-2 text-red-500 bg-white border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors shadow-sm"
                            title="Полностью очистить список участников (для тестов)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                    
                    <button 
                        onClick={handleProcessEntries}
                        disabled={isProcessing || newEntriesCount === 0}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 flex items-center gap-2 shadow-sm transition-colors"
                        title="Присвоить номера новым участникам"
                    >
                        {isProcessing ? <div className="loader h-4 w-4 border-2 border-green-600 border-t-transparent"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
                        Прокомментировать ({newEntriesCount})
                    </button>
                    
                    <button 
                        onClick={handleFinalizeClick}
                        disabled={isProcessing || readyEntriesCount === 0}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 flex items-center gap-2 shadow-sm transition-colors"
                        title="Выбрать победителя и опубликовать итоги"
                    >
                        {isProcessing ? <div className="loader h-4 w-4 border-2 border-amber-600 border-t-transparent"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                        Подвести итоги ({readyEntriesCount})
                    </button>

                    <button 
                        onClick={handleCollectPosts}
                        disabled={isCollecting}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2 shadow-sm"
                    >
                        {isCollecting ? <div className="loader h-4 w-4 border-2 border-white border-t-transparent"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        Собрать посты
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="text-sm text-gray-500">
                        Найдено участников: <strong>{entries.length}</strong>
                    </div>
                </div>
                
                <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-grow">
                    {entries.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                             <p>Список пуст.</p>
                             <p className="text-sm mt-1">Нажмите "Собрать посты", чтобы найти участников.</p>
                         </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0 shadow-sm z-10">
                                <tr>
                                    <th className="px-4 py-3 w-16 text-center">№</th>
                                    <th className="px-4 py-3 w-16">Фото</th>
                                    <th className="px-4 py-3 w-48">Автор</th>
                                    <th className="px-4 py-3">Текст поста</th>
                                    <th className="px-4 py-3 w-32">Статус</th>
                                    <th className="px-4 py-3 w-40">Дата</th>
                                    <th className="px-4 py-3 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {entries.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-center font-bold text-gray-700">
                                            {p.entry_number ? p.entry_number : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.user_photo ? (
                                                <img src={p.user_photo} className="w-8 h-8 rounded-full" alt="" />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                 <a href={`https://vk.com/id${p.user_vk_id}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium hover:underline truncate">
                                                    {p.user_name || `ID ${p.user_vk_id}`}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            <p className="truncate max-w-xs" title={p.post_text || ''}>{p.post_text}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={p.status} />
                                            {p.status === 'error' && (
                                                 <div className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title="Ошибка комментирования">Ошибка VK</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <a 
                                                href={p.post_link} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                title="Открыть пост ВКонтакте"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showFinalizeConfirm && (
                <ConfirmationModal
                    title="Подвести итоги конкурса?"
                    message={`Вы уверены, что хотите подвести итоги?\n\nБудет выбран 1 случайный победитель из ${readyEntriesCount} участников (статус "Принят").\nСистема опубликует пост с результатами на стене и попытается отправить приз победителю.`}
                    onConfirm={handleFinalizeConfirm}
                    onCancel={() => setShowFinalizeConfirm(false)}
                    confirmText="Да, подвести итоги"
                    cancelText="Отмена"
                    confirmButtonVariant="success"
                    isConfirming={isProcessing}
                />
            )}
            
            {showClearConfirm && (
                <ConfirmationModal
                    title="Очистить базу участников?"
                    message="ВНИМАНИЕ: Вы собираетесь удалить ВСЕХ участников текущего конкурса из базы данных. \n\nЭто действие необратимо. Статусы 'Победитель' и 'Использован' будут потеряны. Вы уверены?"
                    onConfirm={handleClearConfirm}
                    onCancel={() => setShowClearConfirm(false)}
                    confirmText="Да, очистить"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    isConfirming={isClearing}
                />
            )}
            
            {/* Модальное окно результата */}
            <FinalizeResultModal 
                isOpen={showResultModal}
                onClose={() => setShowResultModal(false)}
                result={finalizeResult}
                error={finalizeError}
            />
        </div>
    );
};
