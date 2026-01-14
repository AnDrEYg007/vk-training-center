
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../../services/api/management.api';
import * as listsApi from '../../../services/api/lists.api'; // Для поллинга задач
import * as sysAccountsApi from '../../../services/api/system_accounts.api'; // Для получения системных аккаунтов
import { AdministeredGroup, SyncGroupsResult } from '../../../shared/types';
import { RefreshProgress } from '../../../services/api/lists.api';

export const NO_TOKENS_LABEL = "⚠️ Без токенов (Утерян доступ)";

export const useAdministeredGroups = () => {
    const [groups, setGroups] = useState<AdministeredGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [syncStats, setSyncStats] = useState<SyncGroupsResult | null>(null);
    
    // IDs системных аккаунтов для подсветки "наших" админов
    const [systemBotIds, setSystemBotIds] = useState<Set<number>>(new Set());

    // Bulk Admin Sync State
    const [isBulkSyncingAdmins, setIsBulkSyncingAdmins] = useState(false);
    const [bulkSyncProgress, setBulkSyncProgress] = useState<string | null>(null);
    
    // Filtering State
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [selectedCreator, setSelectedCreator] = useState<string>(''); // Новый фильтр по владельцу
    const [searchQuery, setSearchQuery] = useState('');

    const fetchGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            // Параллельно загружаем группы и системные аккаунты
            const [groupsData, accountsData] = await Promise.all([
                api.getAdministeredGroups(),
                sysAccountsApi.getAllSystemAccounts()
            ]);
            
            setGroups(groupsData);
            
            // Собираем ID наших активных системных ботов
            const botIds = new Set<number>();
            accountsData.forEach(acc => {
                if (acc.status === 'active' && acc.vk_user_id) {
                    botIds.add(Number(acc.vk_user_id));
                }
            });
            setSystemBotIds(botIds);

            setError(null);
        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить список групп.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);
    
    // Polling logic for bulk sync task
    const pollBulkTask = useCallback(async (taskId: string) => {
        setIsBulkSyncingAdmins(true);
        try {
            await listsApi.pollTask(taskId, (progress: RefreshProgress) => {
                let label = "Запуск...";
                if (progress.status === 'processing' || progress.status === 'fetching') {
                    label = `${progress.loaded}/${progress.total}`;
                } else if (progress.status === 'done') {
                    label = "Готово";
                }
                setBulkSyncProgress(label);
            });
            await fetchGroups(); // Refresh list after task completes
        } catch (e) {
            window.showAppToast?.("Ошибка фоновой задачи: " + (e instanceof Error ? e.message : String(e)), 'error');
        } finally {
            setIsBulkSyncingAdmins(false);
            setBulkSyncProgress(null);
        }
    }, [fetchGroups]);
    
    // Check for existing task on mount
    useEffect(() => {
        const checkTask = async () => {
            try {
                // Используем GLOBAL проект для этой задачи
                const activeTasks = await listsApi.getActiveTasks('GLOBAL');
                if (activeTasks['sync_admins_bulk']) {
                    pollBulkTask(activeTasks['sync_admins_bulk']);
                }
            } catch (e) {
                console.warn("Failed to check active admin sync tasks", e);
            }
        };
        checkTask();
    }, [pollBulkTask]);

    const handleSync = useCallback(async () => {
        setIsSyncing(true);
        setSyncStats(null);
        try {
            const result = await api.syncAdministeredGroups();
            setSyncStats(result);
            await fetchGroups();
        } catch (err) {
            window.showAppToast?.("Ошибка синхронизации: " + (err instanceof Error ? err.message : String(err)), 'error');
        } finally {
            setIsSyncing(false);
        }
    }, [fetchGroups]);
    
    const handleBulkSyncAdmins = useCallback(async () => {
        try {
            const { taskId } = await api.syncAllGroupAdmins();
            pollBulkTask(taskId);
        } catch (err) {
            window.showAppToast?.("Не удалось запустить сбор админов: " + (err instanceof Error ? err.message : String(err)), 'error');
        }
    }, [pollBulkTask]);

    // Calculate unique admin sources + add "No Tokens" option
    const uniqueSources = useMemo(() => {
        const sources = new Set<string>();
        groups.forEach(g => {
            g.admin_sources.forEach(source => sources.add(source));
        });
        const sortedSources = Array.from(sources).sort();
        // Добавляем опцию "Без токенов" в начало списка
        return [NO_TOKENS_LABEL, ...sortedSources];
    }, [groups]);

    // Calculate unique creators
    const uniqueCreators = useMemo(() => {
        const creators = new Set<string>();
        groups.forEach(g => {
            if (g.creator_name) {
                creators.add(g.creator_name);
            }
        });
        return Array.from(creators).sort();
    }, [groups]);

    // Логика умного поиска
    const matchesSearch = useCallback((group: AdministeredGroup, query: string) => {
        if (!query) return true;
        
        const rawQuery = query.toLowerCase().trim();
        // Нормализация пробелов (убираем двойные)
        const normalizedQuery = rawQuery.replace(/\s+/g, ' '); 
        
        // 1. Поиск по названию (с нормализацией пробелов)
        const normalizedName = group.name.toLowerCase().replace(/\s+/g, ' ');
        if (normalizedName.includes(normalizedQuery)) return true;

        // 2. Поиск по ID
        if (String(group.id).includes(rawQuery)) return true;

        // 3. Поиск по Screen Name
        if (group.screen_name && group.screen_name.toLowerCase().includes(rawQuery)) return true;

        // 4. Умный парсинг ссылок (достаем ID или screen_name из ссылки)
        let cleanQuery = rawQuery
            .replace(/https?:\/\/(www\.)?vk\.com\//, '')
            .replace('vk.com/', '');
            
        cleanQuery = cleanQuery
            .replace(/^public/, '')
            .replace(/^club/, '')
            .replace(/^event/, '');

        cleanQuery = cleanQuery.split('?')[0];

        if (cleanQuery) {
             if (String(group.id) === cleanQuery) return true;
             if (group.screen_name && group.screen_name.toLowerCase() === cleanQuery) return true;
        }

        return false;
    }, []);

    // Filter groups
    const filteredGroups = useMemo(() => {
        return groups.filter(g => {
            // 1. Filter by Creator
            if (selectedCreator && g.creator_name !== selectedCreator) {
                return false;
            }

            // 2. Filter by Sources (Union / OR logic)
            let sourceMatch = true;
            
            if (selectedSources.length > 0) {
                const isLost = g.admin_sources.length === 0;
                
                if (isLost) {
                    // Если группа "потеряна", показываем ее только если выбран фильтр "Без токенов"
                    sourceMatch = selectedSources.includes(NO_TOKENS_LABEL);
                } else {
                    // Если группа нормальная, проверяем совпадение по токенам
                    sourceMatch = g.admin_sources.some(s => selectedSources.includes(s));
                }
            }

            if (!sourceMatch) return false;

            // 3. Filter by Search Query
            return matchesSearch(g, searchQuery);
        });
    }, [groups, selectedCreator, selectedSources, searchQuery, matchesSearch]);

    return {
        groups,
        filteredGroups,
        systemBotIds, // Экспортируем ID ботов
        isLoading,
        isSyncing,
        error,
        syncStats,
        setSyncStats,
        selectedSources,
        setSelectedSources,
        uniqueSources,
        selectedCreator, // New
        setSelectedCreator, // New
        uniqueCreators, // New
        searchQuery,
        setSearchQuery,
        handleSync,
        fetchGroups,
        // Bulk Admin Sync
        handleBulkSyncAdmins,
        isBulkSyncingAdmins,
        bulkSyncProgress
    };
};
