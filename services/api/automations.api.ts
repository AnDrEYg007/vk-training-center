
import { callApi } from '../../shared/utils/apiClient';
import { PhotoAttachment } from '../../shared/types';
import { PromoCode, PromoCodeCreatePayload, DeliveryLog } from '../../features/automations/reviews-contest/types';

// Типы дублируют интерфейс ContestSettings из фичи, но находятся в слое API для независимости
export interface ReviewContestSettingsDto {
    projectId: string;
    isActive: boolean;
    keywords: string;
    startDate: string;
    
    finishCondition: 'count' | 'date' | 'mixed';
    targetCount?: number;
    finishDate?: string;
    finishDayOfWeek?: number;
    finishTime?: string;
    
    autoBlacklist?: boolean;
    autoBlacklistDuration?: number;

    templateComment: string;
    templateWinnerPost: string;
    winnerPostImages: PhotoAttachment[];
    templateDm: string;
    templateErrorComment: string;
}

export interface ContestEntry {
    id: string;
    vk_post_id: number;
    user_name?: string;
    user_photo?: string;
    user_vk_id: number;
    post_link?: string;
    post_text?: string;
    status: string; // new, processing, commented, error, winner
    entry_number?: number;
    created_at: string;
}

export interface BlacklistEntry {
    id: string;
    user_vk_id: number;
    user_name?: string;
    user_screen_name?: string;
    until_date?: string; // null if forever
    created_at: string;
}

export interface FinalizeContestResponse {
    success: boolean;
    skipped?: boolean;
    message?: string;
    winner_name?: string;
    post_link?: string;
    error_reason?: string;
}


/**
 * Получает настройки конкурса отзывов для проекта.
 */
export const getReviewsContestSettings = async (projectId: string): Promise<ReviewContestSettingsDto> => {
    return callApi<ReviewContestSettingsDto>('automations/reviews/getSettings', { projectId });
};

/**
 * Сохраняет настройки конкурса отзывов.
 */
export const saveReviewsContestSettings = async (settings: ReviewContestSettingsDto): Promise<ReviewContestSettingsDto> => {
    return callApi<ReviewContestSettingsDto>('automations/reviews/saveSettings', settings);
};

/**
 * Запускает сбор постов.
 */
export const collectContestPosts = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/collectPosts', { projectId });
};

/**
 * Запускает обработку новых участников (нумерация + комментарий).
 */
export const processContestEntries = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/processEntries', { projectId });
};

/**
 * Запускает подведение итогов (выбор победителя, публикация).
 */
export const finalizeContest = async (projectId: string): Promise<FinalizeContestResponse> => {
    return callApi<FinalizeContestResponse>('automations/reviews/finalize', { projectId });
};

/**
 * Получает список участников.
 */
export const getContestEntries = async (projectId: string): Promise<ContestEntry[]> => {
    return callApi<ContestEntry[]>('automations/reviews/getEntries', { projectId });
};

/**
 * Очищает список участников конкурса (Только для админов).
 */
export const clearContestEntries = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/clearEntries', { projectId });
};

// --- Promocodes ---

/**
 * Получает список промокодов для конкурса.
 */
export const getContestPromocodes = async (projectId: string): Promise<PromoCode[]> => {
    return callApi<PromoCode[]>('automations/reviews/promocodes/get', { projectId });
};

/**
 * Массово добавляет промокоды.
 */
export const addContestPromocodes = async (projectId: string, codes: PromoCodeCreatePayload[]): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/add', { projectId, codes });
};

/**
 * Удаляет промокод.
 */
export const deleteContestPromocode = async (promoId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/delete', { promoId });
};

/**
 * Массово удаляет промокоды.
 */
export const deleteContestPromocodesBulk = async (promoIds: string[]): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/deleteBulk', { promoIds });
};

/**
 * Полностью очищает базу промокодов конкурса (Только для админов).
 */
export const clearContestPromocodes = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/clear', { projectId });
};

/**
 * Обновляет описание промокода.
 */
export const updateContestPromocode = async (id: string, description: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/update', { id, description });
};

// --- Delivery Logs ---

/**
 * Получает журнал отправки призов.
 */
export const getDeliveryLogs = async (projectId: string): Promise<DeliveryLog[]> => {
    return callApi<DeliveryLog[]>('automations/reviews/delivery/get', { projectId });
};

/**
 * Очищает журнал отправки призов.
 */
export const clearDeliveryLogs = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/delivery/clear', { projectId });
};

/**
 * Повторная попытка отправки сообщения по ID лога.
 */
export const retryPromocodeDelivery = async (logId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/retry', { logId });
};

/**
 * Массовая повторная попытка отправки промокодов для проекта.
 */
export const retryPromocodeDeliveryAll = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/promocodes/retryAll', { projectId });
};

// --- Blacklist ---

export const getBlacklist = async (projectId: string): Promise<BlacklistEntry[]> => {
    return callApi<BlacklistEntry[]>('automations/reviews/blacklist/get', { projectId });
};

export const addToBlacklist = async (projectId: string, urls: string, untilDate: string | null): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/blacklist/add', { projectId, urls, untilDate });
};

export const deleteFromBlacklist = async (itemId: string): Promise<{ success: boolean }> => {
    return callApi('automations/reviews/blacklist/delete', { itemId });
};
