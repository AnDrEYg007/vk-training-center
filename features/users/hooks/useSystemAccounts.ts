
import { useState, useEffect, useCallback, useRef } from 'react';
import { SystemAccount } from '../../../shared/types';
import * as api from '../../../services/api';

export const useSystemAccounts = () => {
    const [accounts, setAccounts] = useState<SystemAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Состояния UI
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
    const [editingTokenId, setEditingTokenId] = useState<string | null>(null);

    // Модальные окна
    const [accountToDelete, setAccountToDelete] = useState<SystemAccount | null>(null);
    const [accountToAuthorize, setAccountToAuthorize] = useState<SystemAccount | null>(null);

    // Отслеживание изменений
    const [editedAccounts, setEditedAccounts] = useState<Record<string, SystemAccount>>({});
    
    // Проверка токенов
    const [isCheckingTokens, setIsCheckingTokens] = useState(false);
    const [checkingAccountIds, setCheckingAccountIds] = useState<Set<string>>(new Set());
    const hasAutoCheckedRef = useRef(false);

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getAllSystemAccounts();
            
            // Получаем статистику для ENV токена
            let envStats = { success: 0, error: 0 };
            try {
                const envStatsData = await api.getAccountStats('env');
                envStats = {
                    success: envStatsData.success_count,
                    error: envStatsData.error_count
                };
            } catch (e) {
                console.warn("Failed to fetch env stats", e);
            }

            // Внедряем "призрак" ENV токена
            const envAccount: SystemAccount = {
                id: 'env',
                vk_user_id: '0', // Плейсхолдер
                full_name: 'ENV TOKEN (Системный)',
                profile_url: '#',
                avatar_url: null,
                token: '********************', // Маскировка
                status: 'unknown',
                notes: 'Токен из переменных окружения (.env)',
                stats: envStats // Добавляем статистику
            };
            
            setAccounts([envAccount, ...data]);
            setEditedAccounts({});
        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить список аккаунтов");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleCheckTokens = useCallback(async (silent = false, onlyUnknown = false) => {
        // 1. Определяем, кого нужно проверить
        const accountsToCheck = accounts.filter(acc => {
            if (!acc.token) return false;
            if (onlyUnknown && acc.status !== 'unknown') return false;
            return true;
        });

        if (accountsToCheck.length === 0) {
            if (!silent) window.showAppToast?.("Нет токенов для проверки.", 'info');
            return;
        }

        setIsCheckingTokens(true);
        // Устанавливаем лоадеры на нужные ID
        setCheckingAccountIds(new Set(accountsToCheck.map(a => a.id)));
        
        // Асинхронно проверяем каждого
        for (const acc of accountsToCheck) {
            try {
                if (acc.id === 'env') {
                    // Специальная проверка для ENV токена
                    const userInfo = await api.verifyEnvToken();
                    const updatedAcc: SystemAccount = { 
                        ...acc, 
                        status: 'active',
                        vk_user_id: String(userInfo.id),
                        full_name: `${userInfo.first_name} ${userInfo.last_name} (ENV)`,
                        avatar_url: userInfo.photo_100 || null
                    };
                    
                    setAccounts(prev => prev.map(a => a.id === acc.id ? updatedAcc : a));
                } else {
                    // Обычная проверка
                    await api.verifyToken(acc.token!);
                    const updatedAcc = { ...acc, status: 'active' as const };
                    await api.updateSystemAccount(updatedAcc);
                    
                    setAccounts(prev => prev.map(a => a.id === acc.id ? updatedAcc : a));
                }
            } catch (error) {
                console.error(`Error checking token for account ${acc.id} (${acc.full_name}):`, error);
                const updatedAcc = { ...acc, status: 'error' as const };
                // Для ENV токена мы не можем обновить статус в БД через API updateSystemAccount
                if (acc.id !== 'env') {
                    await api.updateSystemAccount(updatedAcc);
                }
                
                setAccounts(prev => prev.map(a => a.id === acc.id ? updatedAcc : a));
            } finally {
                // Снимаем лоадер с конкретного аккаунта
                setCheckingAccountIds(prev => {
                    const next = new Set(prev);
                    next.delete(acc.id);
                    return next;
                });
            }
        }
        
        setIsCheckingTokens(false);
        if (!silent) window.showAppToast?.("Проверка токенов завершена.", 'success');

    }, [accounts]);

    useEffect(() => {
        if (!isLoading && accounts.length > 0 && !hasAutoCheckedRef.current) {
            const hasUnknown = accounts.some(a => a.token && a.status === 'unknown');
            if (hasUnknown) {
                console.log("Auto-checking unknown tokens...");
                handleCheckTokens(true, true);
            }
            hasAutoCheckedRef.current = true;
        }
    }, [accounts, isLoading, handleCheckTokens]);

    const handleAccountChange = (id: string, field: keyof SystemAccount, value: string) => {
        const accountToUpdate = accounts.find(a => a.id === id);
        if (!accountToUpdate) return;

        let finalValue = value;
        if (field === 'token' && value.includes('access_token=')) {
            const match = value.match(/access_token=([^&]+)/);
            if (match) {
                finalValue = match[1];
            }
        }

        const updatedAccount = { ...accountToUpdate, ...editedAccounts[id], [field]: finalValue };
        
        if (field === 'token' && finalValue !== accountToUpdate.token) {
            updatedAccount.status = 'unknown';
        }
        
        setAccounts(prev => prev.map(a => a.id === id ? updatedAccount : a));
        
        setEditedAccounts(prev => ({
            ...prev,
            [id]: updatedAccount
        }));
    };

    const handleAddFromUrls = async (urlsString: string) => {
        setIsAddModalOpen(false);
        setIsLoading(true);
        try {
            await api.addSystemAccountsByUrls(urlsString);
            hasAutoCheckedRef.current = false;
            await fetchAccounts(); 
        } catch (err) {
            window.showAppToast?.(`Ошибка при добавлении: ${err instanceof Error ? err.message : String(err)}`, 'error');
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!accountToDelete) return;
        
        setIsSaving(true);
        try {
            await api.deleteSystemAccount(accountToDelete.id);
            setAccounts(prev => prev.filter(a => a.id !== accountToDelete.id));
            
            const newEdits = { ...editedAccounts };
            delete newEdits[accountToDelete.id];
            setEditedAccounts(newEdits);
            
            setAccountToDelete(null);
        } catch (err) {
                const msg = err instanceof Error ? err.message : "Не удалось удалить аккаунт.";
            window.showAppToast?.(msg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAuthorizationSuccess = (token: string, userInfo?: { id: number, first_name: string, last_name: string, photo_100?: string }) => {
        if (accountToAuthorize) {
            let updatedAccount: SystemAccount = { ...accountToAuthorize, token, status: 'active' as const };

            if (userInfo) {
                updatedAccount = {
                    ...updatedAccount,
                    vk_user_id: String(userInfo.id),
                    full_name: `${userInfo.first_name} ${userInfo.last_name}`,
                    avatar_url: userInfo.photo_100 || null,
                    profile_url: `https://vk.com/id${userInfo.id}`
                };
            }
            
            setAccounts(prev => prev.map(a => a.id === accountToAuthorize.id ? updatedAccount : a));
            
            api.updateSystemAccount(updatedAccount).catch(err => {
                window.showAppToast?.("Ошибка при сохранении данных аккаунта.", 'error');
                console.error(err);
            });
            
            setAccountToAuthorize(null);
        }
    };

    const handleSave = async () => {
        // Фильтруем ENV аккаунт из списка на сохранение
        const idsToUpdate = Object.keys(editedAccounts).filter(id => id !== 'env');
        if (idsToUpdate.length === 0) return;

        setIsSaving(true);
        try {
            const promises = idsToUpdate.map(id => api.updateSystemAccount(editedAccounts[id]));
            await Promise.all(promises);
            
            window.showAppToast?.('Изменения сохранены.', 'success');
            setEditedAccounts({});
            await fetchAccounts();
        } catch (err) {
            window.showAppToast?.("Ошибка при сохранении.", 'error');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleRowExpand = (id: string) => {
        setExpandedAccountId(prev => prev === id ? null : id);
    };

    return {
        state: {
            accounts,
            isLoading,
            isSaving,
            error,
            isAddModalOpen,
            expandedAccountId,
            editingTokenId,
            accountToDelete,
            accountToAuthorize,
            editedAccounts,
            isCheckingTokens,
            checkingAccountIds, 
        },
        actions: {
            setIsAddModalOpen,
            setExpandedAccountId,
            setEditingTokenId,
            setAccountToDelete,
            setAccountToAuthorize,
            handleCheckTokens,
            handleAccountChange,
            handleAddFromUrls,
            handleConfirmDelete,
            handleAuthorizationSuccess,
            handleSave,
            toggleRowExpand,
        }
    };
};
