
import { ScheduledPost, SuggestedPost } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';
import { RefreshProgress } from './lists.api';
import { API_BASE_URL } from '../../shared/config';

// --- POSTS API ---

/**
 * Загружает опубликованные посты для проекта только из серверного кеша.
 */
export const getCachedPublishedPosts = async (projectId: string): Promise<ScheduledPost[]> => {
    return callApi<ScheduledPost[]>('getCachedPublishedPosts', { projectId });
};

/**
 * Загружает отложенные посты для проекта только из серверного кеша.
 */
export const getCachedScheduledPosts = async (projectId: string): Promise<ScheduledPost[]> => {
    return callApi<ScheduledPost[]>('getCachedScheduledPosts', { projectId });
};

/**
 * Принудительно обновляет опубликованные посты.
 */
export const refreshPublishedPosts = async (projectId: string): Promise<ScheduledPost[]> => {
    return callApi<ScheduledPost[]>('refreshPublishedPosts', { projectId });
};

/**
 * Принудительно обновляет отложенные посты.
 */
export const refreshScheduledPosts = async (projectId: string): Promise<ScheduledPost[]> => {
    return callApi<ScheduledPost[]>('refreshScheduledPosts', { projectId });
};

/**
 * Атомарно обновляет и опубликованные, и отложенные посты.
 * Гарантирует, что тегирование происходит после получения всех данных.
 */
export const refreshAllScheduleData = async (projectId: string): Promise<{ published: ScheduledPost[], scheduled: ScheduledPost[] }> => {
    return callApi<{ published: ScheduledPost[], scheduled: ScheduledPost[] }>('refreshAllScheduleData', { projectId });
};

/**
 * Загружает только количество запланированных постов для проекта.
 */
export const getScheduledPostCount = async (projectId: string): Promise<{ count: number }> => {
    return callApi<{ count: number }>('getScheduledPostCount', { projectId });
}

/**
 * Сохраняет пост (создает новый или обновляет существующий) в VK.
 * Обработка конфликтов времени (ошибка 214) теперь полностью на стороне бэкенда.
 */
export const savePost = async (
    post: ScheduledPost,
    projectId: string,
    publishNow: boolean = false,
    scheduleInVk: boolean = true 
): Promise<ScheduledPost> => {
    const savedPost = await callApi<ScheduledPost>('savePost', {
        post,
        projectId,
        publishNow,
        scheduleInVk,
    });
    return savedPost;
};

/**
 * Запускает фоновую задачу для сохранения поста в VK (Drag-and-Drop).
 * Используется для избежания таймаутов при ротации токенов.
 */
export const schedulePostTask = async (
    post: ScheduledPost,
    projectId: string,
    deleteOriginalId?: string
): Promise<{ taskId: string }> => {
    return callApi<{ taskId: string }>('schedulePostTask', {
        post,
        projectId,
        scheduleInVk: true, // Всегда true для этого метода
        deleteOriginalId
    });
};

/**
 * Удаляет ЗАПЛАНИРОВАННЫЙ пост из очереди отложенных постов VK.
 */
export const deletePost = async (postId: string, projectId: string): Promise<{ success: boolean }> => {
    return callApi<{ success: true }>('deletePost', { postId, projectId });
};

/**
 * Удаляет ОПУБЛИКОВАННЫЙ пост со стены VK и из базы данных на бэкенде.
 */
export const deletePublishedPost = async (postId: string, projectId: string): Promise<{ success: boolean; message?: 'deleted' | 'already_deleted' }> => {
    return callApi<{ success: true; message?: 'deleted' | 'already_deleted' }>('deletePublishedPost', { postId, projectId });
};

/**
 * Удаляет СИСТЕМНЫЙ пост из базы данных на бэкенде.
 */
export const deleteSystemPost = async (postId: string): Promise<{ success: boolean }> => {
    return callApi<{ success: true }>('deleteSystemPost', { postId });
};

/**
 * Перемещает системный пост в отложенные посты VK.
 */
export const moveSystemPostToScheduled = async (postId: string): Promise<{ success: boolean }> => {
    return callApi('moveSystemPostToScheduled', { postId });
};

/**
 * Подтверждает, что системный пост с ошибкой был опубликован.
 */
export const confirmSystemPostPublication = async (postId: string): Promise<{ success: boolean }> => {
    return callApi('confirmSystemPostPublication', { postId });
};

/**
 * Публикует системный пост немедленно (синхронно, legacy).
 * Используется для кнопок в карточке системного поста.
 */
export const publishSystemPost = async (postId: string): Promise<{ success: boolean }> => {
    return callApi('publishSystemPostNow', { postId });
};

/**
 * Публикует пост немедленно через фоновую задачу.
 * Возвращает taskId для отслеживания прогресса.
 */
export const publishPost = async (post: ScheduledPost, projectId: string): Promise<{ taskId: string }> => {
    return callApi<{ taskId: string }>('publishPost', { post, projectId });
};

/**
 * Опрашивает статус задачи.
 */
export const pollPostTask = async (
    taskId: string,
    onProgress?: (progress: RefreshProgress) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/lists/system/getTaskStatus/${taskId}`);
                const data = await response.json();
                
                if (onProgress) onProgress(data);

                if (data.status === 'error') {
                    clearInterval(intervalId);
                    reject(new Error(data.error || 'Task failed'));
                } else if (data.status === 'done') {
                    clearInterval(intervalId);
                    resolve();
                }
            } catch (e) {
                clearInterval(intervalId);
                reject(e);
            }
        }, 1000);
    });
};

// --- SUGGESTED POSTS API ---

/**
 * Загружает предложенные посты для проекта из кеша на бэкенде.
 */
export const getSuggestedPosts = async (projectId: string): Promise<SuggestedPost[]> => {
    return callApi<SuggestedPost[]>('getSuggestedPosts', { projectId });
};

/**
 * Принудительно обновляет предложенные посты из VK и кеш на бэкенде.
 */
export const refreshSuggestedPosts = async (projectId: string): Promise<SuggestedPost[]> => {
    return callApi<SuggestedPost[]>('refreshSuggestedPosts', { projectId });
};
