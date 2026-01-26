import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/api/lists.api';
import { TaskStatusResponse } from '../../../services/api/lists.api';
import * as managementApi from '../../../services/api/management.api';

/**
 * Хук для управления фоновыми задачами.
 * Содержит всю логику работы с данными: загрузка, выбор, удаление, автообновление.
 */
export const useActiveTasks = () => {
    const [tasks, setTasks] = useState<TaskStatusResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
    
    // Состояния для выбора задач
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    
    // Состояния для массового удаления
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
    const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [isDeletingSelected, setIsDeletingSelected] = useState(false);

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
            // Убираем из выбранных те, которых уже нет в списке
            setSelectedIds(prev => {
                const currentIds = new Set(allTasks.map(t => t.taskId));
                const next = new Set<string>();
                prev.forEach(id => {
                    if (currentIds.has(id)) next.add(id);
                });
                return next;
            });
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

    // === Обработчики удаления ===

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

    // === Логика выбора ===

    // Выбор/снятие выбора одной задачи
    const toggleSelect = (taskId: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    // Выбрать все / снять выбор со всех
    const toggleSelectAll = () => {
        if (selectedIds.size === tasks.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(tasks.map(t => t.taskId)));
        }
    };

    // Удалить выбранные
    const handleDeleteSelected = async () => {
        setIsDeletingSelected(true);
        try {
            const idsToDelete: string[] = Array.from(selectedIds);
            for (const taskId of idsToDelete) {
                await api.deleteTask(taskId);
            }
            window.showAppToast?.(`Удалено задач: ${idsToDelete.length}`, 'success');
            setSelectedIds(new Set());
            setTimeout(() => fetchTasks(), 500);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            window.showAppToast?.(`Ошибка при удалении: ${msg}`, 'error');
        } finally {
            setIsDeletingSelected(false);
            setShowDeleteSelectedConfirm(false);
        }
    };

    // === Хелперы ===

    const getStatusBadge = (status: string): React.ReactNode => {
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

    const getProjectName = (projectId?: string): React.ReactNode => {
        if (!projectId) return '-';
        if (projectId === 'GLOBAL') return <span className="text-indigo-700 font-bold">ГЛОБАЛЬНОЕ ОБНОВЛЕНИЕ</span>;
        return projectsMap[projectId] || projectId;
    };

    return {
        // Состояние
        state: {
            tasks,
            isLoading,
            selectedIds,
            taskToDeleteId,
            deletingTaskId,
            showDeleteAllConfirm,
            showDeleteSelectedConfirm,
            isDeletingAll,
            isDeletingSelected,
        },
        // Действия
        actions: {
            fetchTasks,
            setIsLoading,
            toggleSelect,
            toggleSelectAll,
            handleDeleteTaskClick,
            handleConfirmDelete,
            handleDeleteAll,
            handleDeleteSelected,
            setTaskToDeleteId,
            setShowDeleteAllConfirm,
            setShowDeleteSelectedConfirm,
        },
        // Хелперы
        helpers: {
            getStatusBadge,
            formatTime,
            getProjectName,
        },
    };
};
