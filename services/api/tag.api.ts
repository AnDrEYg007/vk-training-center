import { Tag } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

// --- TAGS API ---

/**
 * Загружает все теги для проекта.
 */
export const getTags = async (projectId: string): Promise<Tag[]> => {
    return callApi<Tag[]>('tags/getForProject', { projectId });
};

/**
 * Создает новый тег.
 */
export const createTag = async (projectId: string, tag: Omit<Tag, 'id' | 'project_id'>): Promise<Tag> => {
    return callApi<Tag>('tags/create', { projectId, tag });
};

/**
 * Обновляет существующий тег.
 */
export const updateTag = async (tagId: string, tag: Omit<Tag, 'id' | 'project_id'>): Promise<Tag> => {
    return callApi<Tag>(`tags/update/${tagId}`, { tag });
};

/**
 * Удаляет тег.
 */
export const deleteTag = async (tagId: string): Promise<{ success: boolean }> => {
    return callApi(`tags/delete/${tagId}`);
};

/**
 * Запускает принудительное перетегирование постов для проекта.
 */
export const retagProject = async (projectId: string): Promise<{ success: boolean }> => {
    return callApi('tags/retagProject', { projectId });
};
