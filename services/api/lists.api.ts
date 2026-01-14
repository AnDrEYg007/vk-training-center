

import { ProjectListMeta, SystemListSubscriber, SystemListPost, SystemListInteraction } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';
import { API_BASE_URL } from '../../shared/config';

export interface PostChartData {
    date: string; // "YYYY-MM", "YYYY-MM-DD", etc.
    count: number;
    likes: number;
    comments: number;
    reposts: number;
    views: number;
}

export interface PostTopItem {
    id: string;
    vk_link: string;
    value: number;
}

export interface PostStats {
    total_likes: number;
    total_comments: number;
    total_reposts: number;
    total_views: number;
    avg_likes: number;
    avg_comments: number;
    avg_reposts: number;
    avg_views: number;
    top_likes?: PostTopItem;
    top_comments?: PostTopItem;
    top_reposts?: PostTopItem;
    top_views?: PostTopItem;
    chart_data: PostChartData[];
}

export interface MailingStats {
    allowed_count: number;
    forbidden_count: number;
    active_allowed_count: number;
}

export interface ListStats {
    total_users: number;
    banned_count: number;
    deleted_count: number;
    active_count: number;
    gender_stats: { male: number; female: number; unknown: number };
    online_stats: {
        today: number;
        '3_days': number;
        week: number;
        month_plus: number;
        '3_months_plus': number;
        '6_months_plus': number;
        year_plus: number;
        unknown: number;
    };
    geo_stats: Record<string, number>;
    
    // Новые блоки
    bdate_stats: Record<string, number>; // "1", "2" ... "13" (unknown)
    platform_stats: Record<string, number>; // "1", "2", "unknown" keys
    age_stats: Record<string, number>; // "u16", "16-20", etc.

    last_contact_stats?: {
        today: number;
        '3_days': number;
        week: number;
        month_plus: number;
        '3_months_plus': number;
        '6_months_plus': number;
        year_plus: number;
        unknown: number;
    };
    
    // NEW: Lifetime stats
    lifetime_stats?: {
        total_avg: number;
        allowed_avg: number;
        forbidden_avg: number;
    } | null;

    // График для рассылки
    mailing_chart_data?: PostChartData[]; 

    post_stats?: PostStats;
    mailing_stats?: MailingStats;
}

export interface RefreshProgress {
    status: 'pending' | 'fetching' | 'processing' | 'done' | 'error';
    loaded?: number;
    total?: number;
    message?: string;
    error?: string;
    taskId?: string;
}

export interface TaskStatusResponse extends RefreshProgress {
    updated_at?: number;
    meta?: {
        project_id?: string;
        list_type?: string;
    };
}

export const getListMeta = async (projectId: string): Promise<{ meta: ProjectListMeta }> => {
    return callApi('lists/system/getMeta', { projectId });
};

// FIX: Updated getListStats to accept filterCanWrite as the 7th argument and include it in the payload to fix "Expected 2-6 arguments, but got 7" error.
export const getListStats = async (
    projectId: string, 
    listType: string,
    statsPeriod: string = 'all',
    statsGroupBy: string = 'month',
    statsDateFrom?: string,
    statsDateTo?: string,
    filterCanWrite: string = 'all'
): Promise<ListStats> => {
    return callApi<ListStats>('lists/system/getStats', { 
        projectId, 
        listType,
        statsPeriod,
        statsGroupBy,
        statsDateFrom,
        statsDateTo,
        filterCanWrite
    });
};

export const getSubscribers = async (
    projectId: string, 
    page: number = 1, 
    searchQuery: string = '', 
    listType: 'subscribers' | 'history_join' | 'history_leave' | 'mailing' | 'authors' = 'subscribers',
    filterQuality: string = 'all',
    filterSex: string = 'all',
    filterOnline: string = 'any',
    filter_can_write: string = 'all',
    filterBdateMonth: string = 'any', // NEW
    filterPlatform: string = 'any', // NEW
    filterAge: string = 'any' // NEW
): Promise<{ 
    meta: ProjectListMeta, 
    items: SystemListSubscriber[], 
    total_count: number 
}> => {
    return callApi('lists/system/getSubscribers', { 
        projectId, 
        page, 
        searchQuery, 
        listType, 
        filterQuality, 
        filterSex, 
        filterOnline, 
        filterCanWrite: filter_can_write,
        filterBdateMonth,
        filterPlatform,
        filterAge
    });
};

export const getPostsList = async (projectId: string, page: number = 1, searchQuery: string = ''): Promise<{
    meta: ProjectListMeta,
    items: SystemListPost[],
    total_count: number
}> => {
    return callApi('lists/system/getPosts', { projectId, page, searchQuery, listType: 'posts' });
};

export const getInteractionList = async (
    projectId: string, 
    listType: 'likes' | 'comments' | 'reposts', 
    page: number = 1, 
    searchQuery: string = '',
    filterQuality: string = 'all',
    filterSex: string = 'all',
    filterOnline: string = 'any',
    filterBdateMonth: string = 'any', // NEW
    filterPlatform: string = 'any', // NEW
    filterAge: string = 'any' // NEW
): Promise<{
    meta: ProjectListMeta,
    items: SystemListInteraction[],
    total_count: number
}> => {
    return callApi('lists/system/getInteractions', { 
        projectId, 
        page, 
        searchQuery, 
        listType, 
        filterQuality, 
        filterSex, 
        filterOnline, 
        filterBdateMonth, 
        filterPlatform,
        filterAge
    });
};

export const clearListData = async (projectId: string, listType: string): Promise<{ success: boolean }> => {
    return callApi('lists/system/clear', { projectId, listType });
};

// --- Active Tasks ---
/**
 * Получает список активных задач для проекта.
 * Возвращает объект, где ключи - это типы задач, а значения - taskId.
 */
export const getActiveTasks = async (projectId: string): Promise<Record<string, string>> => {
    return callApi<Record<string, string>>('lists/system/getActiveTasks', { projectId });
};

// --- Task Management ---
export const getAllTasks = async (): Promise<TaskStatusResponse[]> => {
    const result = await callApi<{ tasks: TaskStatusResponse[] }>('tasks/getAll');
    return result.tasks;
};

export const deleteTask = async (taskId: string): Promise<{ success: boolean }> => {
    return callApi(`tasks/delete/${taskId}`);
};

export const deleteAllTasks = async (): Promise<{ success: boolean }> => {
    return callApi('tasks/deleteAll');
};


// --- Task Polling Helpers ---

/**
 * Опрашивает статус задачи по известному ID.
 */
export const pollTask = async (
    taskId: string,
    onProgress: (progress: RefreshProgress) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Сразу отправляем статус pending, чтобы UI отреагировал
        onProgress({ status: 'pending', taskId });

        const intervalId = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/lists/system/getTaskStatus/${taskId}`);
                const data = await response.json();
                
                if (data.status === 'error') {
                    clearInterval(intervalId);
                    reject(new Error(data.error || 'Task failed'));
                } else if (data.status === 'done') {
                    clearInterval(intervalId);
                    onProgress(data);
                    resolve();
                } else {
                    onProgress(data);
                }
            } catch (e) {
                clearInterval(intervalId);
                reject(e);
            }
        }, 1000);
    });
};

/**
 * Запускает новую задачу и сразу начинает её опрос.
 */
const startTaskAndPoll = async (
    startEndpoint: string,
    payload: object,
    onProgress: (progress: RefreshProgress) => void
): Promise<void> => {
    // 1. Start Task
    const { taskId } = await callApi<{ taskId: string }>(startEndpoint, payload);
    
    if (!taskId) {
        throw new Error("Failed to start background task");
    }

    // 2. Poll Status
    return pollTask(taskId, onProgress);
};


export const refreshSubscribersStream = async (projectId: string, onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshSubscribers', { projectId }, onProgress);
};

export const refreshSubscriberDetailsStream = async (projectId: string, onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshSubscriberDetails', { projectId }, onProgress);
};

export const refreshAuthorDetailsStream = async (projectId: string, onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshAuthorDetails', { projectId }, onProgress);
};

export const refreshHistoryStream = async (projectId: string, listType: 'history_join' | 'history_leave', onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshHistory', { projectId, listType }, onProgress);
};

export const refreshPostsStream = async (projectId: string, onProgress: (progress: RefreshProgress) => void, limit: '1000' | 'all' = '1000') => {
    await startTaskAndPoll('lists/system/refreshPosts', { projectId, limit }, onProgress);
};

export const refreshInteractionsStream = async (projectId: string, dateFrom: string, dateTo: string, interactionType: 'all' | 'likes' | 'comments' | 'reposts', onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshInteractions', { projectId, dateFrom, dateTo, interactionType }, onProgress);
};

export const refreshInteractionUsersStream = async (projectId: string, listType: 'likes' | 'comments' | 'reposts', onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshInteractionUsers', { projectId, listType }, onProgress);
};

export const refreshMailingStream = async (projectId: string, onProgress: (progress: RefreshProgress) => void) => {
    await startTaskAndPoll('lists/system/refreshMailing', { projectId }, onProgress);
};

export const analyzeMailingStream = async (projectId: string, onProgress: (progress: RefreshProgress) => void, mode: 'missing' | 'full' = 'missing') => {
    await startTaskAndPoll('lists/system/analyzeMailing', { projectId, mode }, onProgress);
};
