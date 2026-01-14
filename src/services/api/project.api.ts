
import { Project, AllPosts, ScheduledPost, SuggestedPost, SystemPost, Note, ContestStatus } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

// --- PROJECTS & DATA API ---

/**
 * Загружает начальные данные по проектам и счетчики предложенных постов.
 */
export const getInitialData = async (): Promise<{ 
    projects: Project[], 
    allPosts: AllPosts, 
    suggestedPostCounts: Record<string, number>,
    reviewsContestStatuses: Record<string, ContestStatus> // Новое поле
}> => {
    return callApi<{ 
        projects: Project[], 
        allPosts: AllPosts, 
        suggestedPostCounts: Record<string, number>,
        reviewsContestStatuses: Record<string, ContestStatus>
    }>('getInitialData');
};

/**
 * Принудительно очищает кеш проектов на сервере и возвращает свежий список.
 */
export const forceRefreshProjects = async (): Promise<{ projects: Project[], suggestedPostCounts: Record<string, number> }> => {
    return callApi<{ projects: Project[], suggestedPostCounts: Record<string, number> }>('forceRefreshProjects');
};

/**
 * Проверяет свежесть кешированных данных для всех проектов.
 */
export const getProjectUpdateStatus = async (): Promise<{ stalePublished: string[], staleScheduled: string[], staleSuggested: string[] }> => {
    return callApi<{ stalePublished: string[], staleScheduled: string[], staleSuggested: string[] }>('getProjectUpdateStatus');
};

/**
 * Запрашивает у бэкенда список ID проектов, которые были обновлены.
 */
export const getUpdates = async (): Promise<{ updatedProjectIds: string[] }> => {
    return callApi<{ updatedProjectIds: string[] }>('getUpdates');
};

/**
 * Загружает свежие детали для одного проекта, обходя основной кеш.
 */
export const getProjectDetails = async (projectId: string): Promise<Project> => {
    return callApi<Project>('getProjectDetails', { projectId });
};

/**
 * Обновляет настройки проекта.
 */
export const updateProjectSettings = async (project: Project): Promise<Project> => {
    return callApi<Project>('updateProjectSettings', { project });
};

// --- PROJECT VARIABLES ---

/**
 * Загружает переменные для конкретного проекта.
 */
export const getProjectVariables = async (projectId: string): Promise<{ name: string; value: string }[]> => {
    const result = await callApi<{ variables: { name: string; value: string }[] }>('getProjectVariables', { projectId });
    return result.variables || [];
};

// --- BULK DATA API ---

/**
 * Загружает все типы постов и заметок для списка проектов из базы данных.
 */
export const getAllPostsForProjects = async (projectIds: string[]): Promise<{
    allPosts: AllPosts;
    allScheduledPosts: Record<string, ScheduledPost[]>;
    allSuggestedPosts: Record<string, SuggestedPost[]>;
    allSystemPosts: Record<string, SystemPost[]>;
    allNotes: Record<string, Note[]>;
}> => {
    return callApi('getAllPostsForProjects', { projectIds });
};

/**
 * Запускает глобальное фоновое обновление всех проектов с учетом текущего вида.
 */
export const bulkRefreshProjects = async (viewType: string = 'schedule'): Promise<{ taskId: string }> => {
    return callApi<{ taskId: string }>('bulkRefreshProjects', { viewType });
};