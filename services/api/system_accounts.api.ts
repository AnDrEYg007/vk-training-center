
import { SystemAccount, TokenLog, AccountStats } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

// --- SYSTEM ACCOUNTS API ---

/**
 * Получает все системные аккаунты.
 */
export const getAllSystemAccounts = async (): Promise<SystemAccount[]> => {
    return callApi<SystemAccount[]>('system-accounts/getAll');
};

/**
 * Добавляет аккаунты по списку ссылок.
 */
export const addSystemAccountsByUrls = async (urls: string): Promise<{ success: boolean }> => {
    return callApi('system-accounts/addByUrls', { urls });
};

/**
 * Обновляет данные аккаунта (токен).
 */
export const updateSystemAccount = async (account: SystemAccount): Promise<SystemAccount> => {
    return callApi<SystemAccount>('system-accounts/update', { account });
};

/**
 * Удаляет системный аккаунт.
 */
export const deleteSystemAccount = async (accountId: string): Promise<{ success: boolean }> => {
    return callApi('system-accounts/delete', { accountId });
};

/**
 * Проверяет токен и возвращает данные пользователя VK.
 */
export const verifyToken = async (token: string): Promise<{ id: number, first_name: string, last_name: string, photo_100?: string }> => {
    return callApi('system-accounts/verifyToken', { token });
};

/**
 * Проверяет ENV токен.
 */
export const verifyEnvToken = async (): Promise<{ id: number, first_name: string, last_name: string, photo_100?: string }> => {
    return callApi('system-accounts/verifyEnv');
};

// --- LOGS API ---

export interface GetLogsFilters {
    accountIds?: string[];
    searchQuery?: string;
    status?: 'all' | 'success' | 'error';
}

export const getLogs = async (
    page: number, 
    pageSize: number = 50,
    filters: GetLogsFilters = {}
): Promise<{ items: TokenLog[], total_count: number, page: number, page_size: number }> => {
    return callApi('system-accounts/logs/get', { 
        page, 
        pageSize, 
        accountIds: filters.accountIds && filters.accountIds.length > 0 ? filters.accountIds : undefined,
        searchQuery: filters.searchQuery,
        status: filters.status
    });
};

export const clearLogs = async (accountId: string | null): Promise<{ success: boolean }> => {
    return callApi('system-accounts/logs/clear', { accountId });
};

/**
 * Удаляет одну запись лога VK.
 */
export const deleteVkLog = async (logId: string): Promise<{ success: boolean }> => {
    return callApi('system-accounts/logs/delete', { logId });
};

/**
 * Удаляет несколько записей логов VK.
 */
export const deleteVkLogsBatch = async (logIds: number[]): Promise<{ success: boolean }> => {
    return callApi('system-accounts/logs/delete-batch', { logIds });
};

/**
 * Получает агрегированную статистику по аккаунту.
 */
export const getAccountStats = async (accountId: string): Promise<AccountStats> => {
    return callApi<AccountStats>('system-accounts/stats', { accountId });
};

export interface ChartDataPoint {
    date: string;
    methods: Record<string, number>;
}

/**
 * Получает данные для графика.
 */
export const getAccountChartData = async (
    accountId: string, 
    granularity: 'hour' | 'day' | 'week' | 'month',
    metric: 'total' | 'success' | 'error',
    projectId?: string
): Promise<ChartDataPoint[]> => {
    // callApi автоматически разворачивает свойство 'data' из ответа (из-за логики в apiClient.ts),
    // поэтому мы получаем сразу массив ChartDataPoint[], а не объект { data: ... }
    const response = await callApi<ChartDataPoint[]>('system-accounts/stats/chart', { 
        accountId, granularity, metric, projectId: projectId === 'all' ? undefined : projectId 
    });
    return response;
};
