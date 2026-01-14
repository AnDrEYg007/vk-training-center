import { useState, useEffect } from 'react';
import * as api from '../../services/api';

/**
 * Хук для инкапсуляции логики фонового опроса (polling)
 * на наличие обновлений с бэкенда.
 */
export const useUpdatePolling = () => {
    const [updatedProjectIds, setUpdatedProjectIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const { updatedProjectIds: updates } = await api.getUpdates();
                if (updates.length > 0) {
                    console.log('Получены обновления для проектов:', updates);
                    setUpdatedProjectIds(prev => new Set([...prev, ...updates]));
                }
            } catch (error) {
                console.warn("Ошибка при опросе обновлений:", error);
            }
        };

        const intervalId = setInterval(checkForUpdates, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return { updatedProjectIds, setUpdatedProjectIds };
};
