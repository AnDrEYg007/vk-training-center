
import { AiToken, AiTokenLog, AccountStats } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';
import { ChartDataPoint } from './system_accounts.api';

// --- AI TOKENS API ---

/**
 * Получает все AI токены.
 */
export const getAllAiTokens = async (): Promise<AiToken[]> => {
    return callApi<AiToken[]>('ai-tokens/getAll');
};

/**
 * Массово обновляет AI токены (создание, изменение, удаление).
 */
export const updateAiTokens = async (tokens: AiToken[]): Promise<{ success: boolean }> => {
    return callApi('ai-tokens/updateAll', { tokens });
};

/**
 * Удаляет один AI токен.
 */
export const deleteAiToken = async (tokenId: string): Promise<{ success: boolean }> => {
    return callApi('ai-tokens/delete', { tokenId });
};

export interface GetAiLogsFilters {
    tokenIds?: string[];
    searchQuery?: string;
    status?: 'all' | 'success' | 'error';
}

/**
 * Получает логи AI токенов.
 */
export const getAiLogs = async (
    page: number, 
    pageSize: number = 50,
    filters: GetAiLogsFilters = {}
): Promise<{ items: AiTokenLog[], total_count: number, page: number, page_size: number }> => {
    return callApi('ai-tokens/logs/get', { 
        page, 
        pageSize, 
        tokenIds: filters.tokenIds && filters.tokenIds.length > 0 ? filters.tokenIds : undefined,
        searchQuery: filters.searchQuery,
        status: filters.status
    });
};

/**
 * Очищает логи AI токенов.
 */
export const clearAiLogs = async (tokenId: string | null): Promise<{ success: boolean }> => {
    return callApi('ai-tokens/logs/clear', { tokenId });
};

/**
 * Удаляет одну запись лога AI.
 */
export const deleteAiLog = async (logId: string): Promise<{ success: boolean }> => {
    return callApi('ai-tokens/logs/delete', { logId });
};

/**
 * Удаляет несколько записей логов AI.
 */
export const deleteAiLogsBatch = async (logIds: number[]): Promise<{ success: boolean }> => {
    return callApi('ai-tokens/logs/delete-batch', { logIds });
};

/**
 * Получает агрегированную статистику по AI токену.
 */
export const getAiTokenStats = async (tokenId: string): Promise<AccountStats> => {
    return callApi<AccountStats>('ai-tokens/stats', { tokenId });
};

/**
 * Получает данные для графика AI токена.
 */
export const getAiTokenChartData = async (
    tokenId: string, 
    granularity: 'hour' | 'day' | 'week' | 'month',
    metric: 'total' | 'success' | 'error'
): Promise<ChartDataPoint[]> => {
    const response = await callApi<ChartDataPoint[]>('ai-tokens/stats/chart', { 
        accountId: tokenId, // Используем поле accountId в payload, так как схема на бэке общая
        granularity, 
        metric 
    });
    return response;
};

// --- ПРОВЕРКА ТОКЕНОВ ---

export interface AiTokenVerifyResult {
    token_id: string;
    description: string | null;
    is_valid: boolean;
    error: string | null;
    models_count: number;
}

/**
 * Проверяет все AI токены на валидность через Google Gemini API.
 */
export const verifyAiTokens = async (): Promise<{ results: AiTokenVerifyResult[] }> => {
    return callApi<{ results: AiTokenVerifyResult[] }>('ai-tokens/verify');
};
