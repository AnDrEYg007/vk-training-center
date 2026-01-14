
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/api/lists.api';
import { TaskStatusResponse } from '../../../services/api/lists.api';
import * as managementApi from '../../../services/api/management.api';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

export const ActiveTasksTab: React.FC = () => {
    const [tasks, setTasks] = useState<TaskStatusResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
    
    // Состояния для массового удаления
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);

    // Загружаем список проектов для отображения имен
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projects = await managementApi.getAllProjectsForManagement();
                const map: Record<string, string> = {};
                projects.forEach(p => map[p.id] = p.name);
                setProjectsMap(map);
            } catch (e) {
                console.warn("Failed to load projects for name mapping", e);
            }
        };
        loadProjects();
    }, []);

    const fetchTasks = useCallback(async () => {
        // Не ставим setIsLoading(true) при автообновлении, чтобы не мигало
        try {
            const allTasks = await api.getAllTasks();
            setTasks(allTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true); // Только при первом маунте
        fetchTasks();
        
        // Автообновление каждые 3 секунды
        const intervalId = setInterval(() => {
            fetchTasks();
        }, 3000);
        return () => clearInterval(intervalId);
    }, [fetchTasks]);

    const handleDeleteTaskClick = (e: React.MouseEvent, taskId: string) => {
        // Останавливаем всплытие, чтобы клик не ушел куда-то еще
        e.preventDefault();
        e.stopPropagation();
        setTaskToDeleteId(taskId);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDeleteId) return;
        
        console.log("Attempting to delete task:", taskToDeleteId);
        setDeletingTaskId(taskToDeleteId);
        
        try {
            await api.deleteTask(taskToDeleteId);
            console.log("Task deleted successfully");
            // Ждем немного, чтобы сервер успел удалить, и обновляем список
            setTimeout(() => fetchTasks(), 500);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            window.showAppToast?.(`Не удалось удалить задачу: ${msg}. Если проблема сохраняется, проверьте логи сервера.`, 'error');
            console.error("Delete task error:", error);
        } finally {
            setDeletingTaskId(null);
            setTaskToDeleteId(null);
        }
    };

    const handleDeleteAll = async () => {
        setIsDeletingAll(true);
        try {
            await api.deleteAllTasks();
            window.showAppToast?.("Все задачи успешно удалены.", 'success');
            setTimeout(() => fetchTasks(), 500);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            window.showAppToast?.(`Не удалось очистить задачи: ${msg}`, 'error');
        } finally {
            setIsDeletingAll(false);
            setShowDeleteAllConfirm(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'done': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Готово</span>;
            case 'error': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Ошибка</span>;
            case 'pending': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Очередь</span>;
            case 'fetching': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">Загрузка</span>;
            case 'processing': return <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 animate-pulse">Обработка</span>;
            default: return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const formatTime = (timestamp?: number) => {
        if (!timestamp) return '-';
        return new Date(timestamp * 1000).toLocaleTimeString('ru-RU');
    };

    const getProjectName = (projectId?: string) => {
        if (!projectId) return '-';
        if (projectId === 'GLOBAL') return <span className="text-indigo-700 font-bold">ГЛОБАЛЬНОЕ ОБНОВЛЕНИЕ</span>;
        return projectsMap[projectId] || projectId;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                     <h2 className="text-lg font-semibold text-gray-800">Менеджер фоновых задач</h2>
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Автообновление</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => setShowDeleteAllConfirm(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50" 
                        title="Удалить все задачи из списка"
                        disabled={tasks.length === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Сбросить все
                    </button>
                    <button 
                        type="button"
                        onClick={() => { setIsLoading(true); fetchTasks(); }} 
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" 
                        title="Обновить принудительно"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        Обновить
                    </button>
                </div>
            </div>
            
            <div className="flex-grow overflow-auto custom-scrollbar bg-white p-4">
                 {isLoading && tasks.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="loader border-t-indigo-500 w-8 h-8"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg">
                        Нет активных или недавних задач.
                    </div>
                ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Проект</th>
                                    <th className="px-4 py-3">Тип</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3">Прогресс</th>
                                    <th className="px-4 py-3">Сообщение</th>
                                    <th className="px-4 py-3">Обновлено</th>
                                    <th className="px-4 py-3 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {tasks.map((task) => (
                                    <tr key={task.taskId} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 max-w-xs truncate" title={task.meta?.project_id}>
                                            <span className="font-medium text-gray-800">
                                                {getProjectName(task.meta?.project_id)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs text-gray-600">{task.meta?.list_type || '-'}</td>
                                        <td className="px-4 py-2">{getStatusBadge(task.status)}</td>
                                        <td className="px-4 py-2">
                                            {task.status === 'fetching' || task.total ? (
                                                <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                                                        <span>{task.loaded}</span>
                                                        <span>{task.total || '?'}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                                                            style={{ width: `${Math.min(100, ((task.loaded || 0) / (task.total || 1)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : task.status === 'processing' && task.loaded ? (
                                                 <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                                                        <span>{task.loaded}</span>
                                                        <span>{task.total}</span>
                                                    </div>
                                                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                                                            style={{ width: `${Math.min(100, ((task.loaded || 0) / (task.total || 1)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                 </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-2 max-w-xs truncate text-gray-600" title={task.error || task.message}>
                                            {task.error ? <span className="text-red-600">{task.error}</span> : task.message}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{formatTime(task.updated_at)}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button 
                                                type="button"
                                                onClick={(e) => handleDeleteTaskClick(e, task.taskId)}
                                                disabled={deletingTaskId === task.taskId}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-wait"
                                                title="Удалить задачу из памяти сервера"
                                            >
                                                {deletingTaskId === task.taskId ? '...' : 'Сброс'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {taskToDeleteId && (
                <ConfirmationModal
                    title="Сбросить задачу?"
                    message="Вы уверены, что хотите принудительно удалить эту задачу из памяти сервера? Это действие не остановит уже запущенные процессы в базе данных, но очистит запись о задаче."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setTaskToDeleteId(null)}
                    confirmText="Да, сбросить"
                    confirmButtonVariant="danger"
                    isConfirming={!!deletingTaskId}
                />
            )}

            {showDeleteAllConfirm && (
                <ConfirmationModal
                    title="Сбросить ВСЕ задачи?"
                    message="ВНИМАНИЕ: Вы собираетесь очистить список ВСЕХ фоновых задач. Это действие не остановит запущенные процессы, но очистит историю и статус всех задач в базе данных. Вы уверены?"
                    onConfirm={handleDeleteAll}
                    onCancel={() => setShowDeleteAllConfirm(false)}
                    confirmText="Да, сбросить все"
                    confirmButtonVariant="danger"
                    isConfirming={isDeletingAll}
                />
            )}
        </div>
    );
};
