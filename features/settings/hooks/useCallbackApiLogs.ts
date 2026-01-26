import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/api';
import { VkCallbackLog } from '../../../services/api/vk.api';
import { useProjects } from '../../../contexts/ProjectsContext';

// Типы для модального окна подтверждения
export type ConfirmAction = 'deleteOne' | 'deleteSelected' | 'deleteAll' | null;

/**
 * Хук для управления логами Callback API.
 * Содержит всю логику работы с данными: загрузка, выбор, удаление, фильтрация.
 */
export const useCallbackApiLogs = () => {
    const { projects } = useProjects();
    const [logs, setLogs] = useState<VkCallbackLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    
    // Состояние для модального окна подтверждения
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    // === Состояние фильтров ===
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEventTypes, setSelectedEventTypes] = useState<Set<string>>(new Set());
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<number>>(new Set());

    // Загрузка логов
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getCallbackLogs(200); // Загружаем больше для фильтрации
            setLogs(data);
            setSelectedIds(new Set()); // Сбрасываем выбор после обновления
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить логи');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // === Вычисляемые данные для фильтров ===
    
    // Уникальные типы событий из логов
    const availableEventTypes = useMemo(() => {
        const types = new Set<string>();
        logs.forEach(log => types.add(log.type));
        return Array.from(types).sort();
    }, [logs]);

    // Уникальные группы из логов
    const availableGroups = useMemo(() => {
        const groupsMap = new Map<number, string>();
        logs.forEach(log => {
            if (!groupsMap.has(log.group_id)) {
                groupsMap.set(log.group_id, log.group_name || `Группа ${log.group_id}`);
            }
        });
        return Array.from(groupsMap.entries()).map(([id, name]) => ({ id, name }));
    }, [logs]);

    // Отфильтрованные логи
    const filteredLogs = useMemo(() => {
        let result = logs;

        // Фильтр по типам событий
        if (selectedEventTypes.size > 0) {
            result = result.filter(log => selectedEventTypes.has(log.type));
        }

        // Фильтр по группам
        if (selectedGroupIds.size > 0) {
            result = result.filter(log => selectedGroupIds.has(log.group_id));
        }

        // Поиск
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(log => {
                // Поиск по названию группы
                const groupName = log.group_name || '';
                if (groupName.toLowerCase().includes(query)) return true;
                
                // Поиск по ID группы
                if (String(log.group_id).includes(query)) return true;
                
                // Поиск по типу события
                if (log.type.toLowerCase().includes(query)) return true;
                
                // Поиск по JSON содержимому
                if (log.payload.toLowerCase().includes(query)) return true;
                
                return false;
            });
        }

        return result;
    }, [logs, selectedEventTypes, selectedGroupIds, searchQuery]);

    // === Хелперы форматирования ===
    
    const formatPayload = (jsonStr: string) => {
        try {
            const obj = JSON.parse(jsonStr);
            return JSON.stringify(obj, null, 2);
        } catch {
            return jsonStr;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ru-RU');
    };

    const getGroupName = (groupId: number) => {
        const project = projects.find(p => p.vkProjectId === groupId);
        if (project) {
            return project.vkGroupName || project.vkGroupShortName || project.name;
        }
        return `Группа ${groupId}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        window.showAppToast?.('Скопировано в буфер обмена', 'success');
    };

    const copyAllTypes = () => {
        copyToClipboard(logs.map(log => log.type).join('\n'));
    };

    const copyAllPayloads = () => {
        copyToClipboard(logs.map(log => formatPayload(log.payload)).join('\n\n'));
    };

    // === Логика выбора ===

    // Выбор/снятие выбора одной записи
    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Выбрать все / снять выбор со всех (работает с отфильтрованными логами)
    const toggleSelectAll = () => {
        const filteredIds = filteredLogs.map(l => l.id);
        const allSelected = filteredIds.every(id => selectedIds.has(id));
        
        if (allSelected && filteredIds.length > 0) {
            // Снимаем выбор только с отфильтрованных
            setSelectedIds(prev => {
                const next = new Set(prev);
                filteredIds.forEach(id => next.delete(id));
                return next;
            });
        } else {
            // Добавляем к выбору все отфильтрованные
            setSelectedIds(prev => {
                const next = new Set(prev);
                filteredIds.forEach(id => next.add(id));
                return next;
            });
        }
    };

    // === Логика удаления ===

    // Удалить одну запись
    const handleDeleteOne = (id: number) => {
        setDeleteTargetId(id);
        setConfirmAction('deleteOne');
    };

    // Удалить выбранные
    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;
        setConfirmAction('deleteSelected');
    };

    // Удалить все
    const handleDeleteAll = () => {
        if (logs.length === 0) return;
        setConfirmAction('deleteAll');
    };

    // Подтверждение удаления
    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            if (confirmAction === 'deleteOne' && deleteTargetId !== null) {
                await api.deleteCallbackLog(deleteTargetId);
                window.showAppToast?.('Запись удалена', 'success');
            } else if (confirmAction === 'deleteSelected') {
                await api.deleteBatchCallbackLogs(Array.from(selectedIds));
                window.showAppToast?.(`Удалено ${selectedIds.size} записей`, 'success');
            } else if (confirmAction === 'deleteAll') {
                await api.deleteAllCallbackLogs();
                window.showAppToast?.('Все логи удалены', 'success');
            }
            await fetchLogs();
        } catch (err) {
            console.error(err);
            setError('Не удалось удалить');
            window.showAppToast?.('Не удалось удалить', 'error');
        } finally {
            setIsDeleting(false);
            setConfirmAction(null);
            setDeleteTargetId(null);
        }
    };

    // Отмена удаления
    const cancelDelete = () => {
        setConfirmAction(null);
        setDeleteTargetId(null);
    };

    // Получение текста для модального окна
    const getConfirmMessage = () => {
        switch (confirmAction) {
            case 'deleteOne':
                return 'Удалить эту запись?';
            case 'deleteSelected':
                return `Удалить выбранные записи (${selectedIds.size} шт.)?`;
            case 'deleteAll':
                return 'Удалить ВСЕ логи? Это действие нельзя отменить.';
            default:
                return '';
        }
    };

    // === Функции управления фильтрами ===

    const toggleEventType = (type: string) => {
        setSelectedEventTypes(prev => {
            const next = new Set(prev);
            if (next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };

    const toggleGroup = (groupId: number) => {
        setSelectedGroupIds(prev => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedEventTypes(new Set());
        setSelectedGroupIds(new Set());
    };

    // Проверка, все ли отфильтрованные логи выбраны
    const allFilteredSelected = filteredLogs.length > 0 && 
        filteredLogs.every(log => selectedIds.has(log.id));

    return {
        // Состояние
        state: {
            logs,
            filteredLogs,
            isLoading,
            isDeleting,
            error,
            selectedIds,
            confirmAction,
            // Состояние фильтров
            searchQuery,
            selectedEventTypes,
            selectedGroupIds,
        },
        // Действия
        actions: {
            fetchLogs,
            toggleSelect,
            toggleSelectAll,
            handleDeleteOne,
            handleDeleteSelected,
            handleDeleteAll,
            executeDelete,
            cancelDelete,
            // Фильтры
            setSearchQuery,
            toggleEventType,
            toggleGroup,
            clearFilters,
        },
        // Хелперы
        helpers: {
            formatPayload,
            formatDate,
            getGroupName,
            copyToClipboard,
            copyAllTypes,
            copyAllPayloads,
            getConfirmMessage,
            // Данные для фильтров
            availableEventTypes,
            availableGroups,
            allFilteredSelected,
        },
    };
};