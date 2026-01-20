import { useState, useEffect, useRef, useCallback } from 'react';
import * as api from '../../services/api';

/**
 * Хук для инкапсуляции логики фонового опроса (polling)
 * на наличие обновлений с бэкенда.
 */
export const useUpdatePolling = () => {
    const [updatedProjectIds, setUpdatedProjectIds] = useState<Set<string>>(new Set());
    const recentlyRefreshedRef = useRef<Map<string, number>>(new Map());

    const addRecentRefresh = useCallback((projectId: string) => {
        recentlyRefreshedRef.current.set(projectId, Date.now());
        const now = Date.now();
        recentlyRefreshedRef.current.forEach((time, id) => {
            if (now - time > 60000) {
                recentlyRefreshedRef.current.delete(id);
            }
        });
    }, []);

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const { updatedProjectIds: updates } = await api.getUpdates();
                if (updates.length > 0) {
                    setUpdatedProjectIds(prev => {
                        const newSet = new Set(prev);
                        const now = Date.now();
                        let hasChanges = false;

                        updates.forEach(id => {
                            const lastRefreshTime = recentlyRefreshedRef.current.get(id);
                            if (lastRefreshTime && (now - lastRefreshTime < 10000)) {
                                // console.log(`[Polling] Игнорируем обновление для проекта ${id}.`);
                                return;
                            }
                            if (!newSet.has(id)) {
                                newSet.add(id);
                                hasChanges = true;
                            }
                        });
                        return hasChanges ? newSet : prev;
                    });
                }
            } catch (error) {
                console.warn("Ошибка при опросе обновлений:", error);
            }
        };

        const initialTimer = setTimeout(checkForUpdates, 1000);
        const intervalId = setInterval(checkForUpdates, 5000);
        return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalId);
        };
    }, []);

    return { updatedProjectIds, setUpdatedProjectIds, addRecentRefresh };
};
