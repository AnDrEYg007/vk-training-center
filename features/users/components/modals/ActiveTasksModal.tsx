
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../../services/api/lists.api';
import { TaskStatusResponse } from '../../../../services/api/lists.api';
import { Project } from '../../../../shared/types';
import * as managementApi from '../../../../services/api/management.api'; // Импорт API управления для получения списка проектов

interface ActiveTasksModalProps {
    onClose: () => void;
}

export const ActiveTasksModal: React.FC<ActiveTasksModalProps> = ({ onClose }) => {
    const [tasks, setTasks] = useState<TaskStatusResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});

    // Загружаем список проектов для отображения имен
    useEffect(() => {
        const loadProjects = async () => {
            try {
                // Здесь используем существующий API для получения всех проектов
                // Если этот метод недоступен или тяжелый, можно показывать просто ID
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
        setIsLoading(true);
        try {
            const allTasks = await api.getAllTasks();
            setTasks(allTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            window.showAppToast?.("Не удалось загрузить список задач.", 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
        // Автообновление каждые 3 секунды
        const intervalId = setInterval(() => {
            api.getAllTasks().then(setTasks).catch(console.error);
        }, 3000);
        return () => clearInterval(intervalId);
    }, [fetchTasks]);

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Вы уверены? Это сбросит задачу на сервере. Если процесс реально завис, это поможет.")) return;
        
        try {
            await api.deleteTask(taskId);
            fetchTasks(); // Сразу обновляем
        } catch (error) {
            window.showAppToast?.("Не удалось удалить задачу: " + String(error), 'error');
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Менеджер фоновых задач</h2>
                        <p className="text-xs text-gray-500">Мониторинг активных процессов синхронизации на сервере</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => fetchTasks()} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100" title="Обновить">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>
                
                <main className="flex-grow p-0 overflow-auto custom-scrollbar bg-gray-50">
                     {isLoading && tasks.length === 0 ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="loader border-t-indigo-500 w-8 h-8"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">Нет активных или недавних задач.</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Проект</th>
                                    <th className="px-4 py-3">Тип</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3">Прогресс</th>
                                    <th className="px-4 py-3">Сообщение</th>
                                    <th className="px-4 py-3">Обновлено</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {tasks.map((task) => (
                                    <tr key={task.taskId} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 max-w-xs truncate" title={task.meta?.project_id}>
                                            <span className="font-medium text-gray-800">
                                                {projectsMap[task.meta?.project_id || ''] || task.meta?.project_id || '-'}
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
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-2 max-w-xs truncate text-gray-600" title={task.error || task.message}>
                                            {task.error ? <span className="text-red-600">{task.error}</span> : task.message}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{formatTime(task.updated_at)}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button 
                                                onClick={() => handleDeleteTask(task.taskId)}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 hover:bg-red-50 px-2 py-1 rounded"
                                                title="Удалить задачу из памяти сервера"
                                            >
                                                Сброс
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </div>
    );
};
