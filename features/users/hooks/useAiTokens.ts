
import { useState, useEffect, useCallback } from 'react';
import { AiToken } from '../../../shared/types';
import * as api from '../../../services/api';
import { v4 as uuidv4 } from 'uuid';

export const useAiTokens = () => {
    const [initialTokens, setInitialTokens] = useState<AiToken[]>([]);
    const [tokens, setTokens] = useState<AiToken[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ token: AiToken; onConfirm: () => void; } | null>(null);
    const [tokenToShowLogs, setTokenToShowLogs] = useState<AiToken | 'env' | null>(null);
    
    // Состояние для развернутой строки
    const [expandedTokenId, setExpandedTokenId] = useState<string | null>(null);
    
    // Получаем статистику для ENV токена
    const [envStats, setEnvStats] = useState({ success: 0, error: 0 });

    const fetchTokens = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getAllAiTokens();
            setInitialTokens(data);
            setTokens(data);
            
            // Пытаемся загрузить статистику ENV токена
            try {
                const stats = await api.getAiTokenStats('env');
                setEnvStats({ success: stats.success_count, error: stats.error_count });
            } catch (e) {
                console.warn(e);
            }
            
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Не удалось загрузить токены";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    const handleTokenChange = (tokenId: string, field: keyof AiToken, value: string) => {
        setTokens(currentTokens => currentTokens.map(t => t.id === tokenId ? { ...t, [field]: value } : t));
    };

    const handleRemoveToken = (tokenId: string) => {
        setTokens(currentTokens => currentTokens.filter(t => t.id !== tokenId));
    };

    const handleAddToken = () => {
        const newToken: AiToken = {
            id: `new-${uuidv4()}`,
            description: '',
            token: '',
        };
        setTokens(currentTokens => [...currentTokens, newToken]);
    };

    const executeSave = async () => {
        setDeleteConfirmation(null);
        setIsSaving(true);
        try {
            // Валидация: токены не должны быть пустыми
            for (const t of tokens) {
                if (!t.token.trim()) {
                     throw new Error('Поле "Токен" обязательно для заполнения.');
                }
            }

            await api.updateAiTokens(tokens);
            window.showAppToast?.("Токены успешно сохранены!", 'success');
            await fetchTokens(); 
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Произошла ошибка';
            window.showAppToast?.(`Не удалось сохранить: ${msg}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveChanges = async () => {
        // 1. Определяем удаленные токены для подтверждения
        const initialIds = new Set(initialTokens.map(t => t.id));
        const currentIds = new Set(tokens.map(t => t.id));
        const deletedIds = [...initialIds].filter(id => !currentIds.has(id));
        
        if (deletedIds.length > 0) {
             const deletedToken = initialTokens.find(t => t.id === deletedIds[0]); 
             if (deletedToken) {
                 setDeleteConfirmation({
                    token: deletedToken,
                    onConfirm: executeSave
                 });
                 return;
             }
        }

        await executeSave();
    };
    
    const toggleRowExpand = (id: string) => {
        setExpandedTokenId(prev => prev === id ? null : id);
    };

    return {
        state: {
            tokens,
            isLoading,
            isSaving,
            error,
            deleteConfirmation,
            tokenToShowLogs,
            envStats,
            expandedTokenId
        },
        actions: {
            handleTokenChange,
            handleRemoveToken,
            handleAddToken,
            handleSaveChanges,
            setDeleteConfirmation,
            setTokenToShowLogs,
            toggleRowExpand
        }
    };
};
