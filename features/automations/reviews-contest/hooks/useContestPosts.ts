
import { useState, useEffect, useCallback } from 'react';
import * as api from '../../../../services/api/automations.api';
import { ContestEntry } from '../../../../services/api/automations.api';

export const useContestPosts = (projectId: string) => {
    const [entries, setEntries] = useState<ContestEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollecting, setIsCollecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadEntries = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getContestEntries(projectId);
            setEntries(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load entries", err);
            setError("Не удалось загрузить список участников");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    const handleCollectPosts = async () => {
        setIsCollecting(true);
        try {
            await api.collectContestPosts(projectId);
            window.showAppToast?.("Сбор постов завершен. Список обновляется...", 'info');
            await loadEntries();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Ошибка сбора";
            window.showAppToast?.(`Не удалось собрать посты: ${msg}`, 'error');
        } finally {
            setIsCollecting(false);
        }
    };

    return {
        entries,
        isLoading,
        isCollecting,
        error,
        handleCollectPosts,
        refresh: loadEntries
    };
};
