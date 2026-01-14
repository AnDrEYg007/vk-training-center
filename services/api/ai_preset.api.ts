import { AiPromptPreset } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

// --- AI PROMPT PRESETS API ---

/**
 * Загружает все шаблоны AI-инструкций для проекта.
 */
export const getAiPresets = async (projectId: string): Promise<AiPromptPreset[]> => {
    return callApi<AiPromptPreset[]>('ai-presets/getForProject', { projectId });
};

/**
 * Создает новый шаблон AI-инструкции.
 */
export const createAiPreset = async (projectId: string, preset: Omit<AiPromptPreset, 'id' | 'project_id'>): Promise<AiPromptPreset> => {
    return callApi<AiPromptPreset>('ai-presets/create', { projectId, preset });
};

/**
 * Обновляет существующий шаблон AI-инструкции.
 */
export const updateAiPreset = async (presetId: string, preset: Omit<AiPromptPreset, 'id' | 'project_id'>): Promise<AiPromptPreset> => {
    return callApi<AiPromptPreset>(`ai-presets/update/${presetId}`, { preset });
};

/**
 * Удаляет шаблон AI-инструкции.
 */
export const deleteAiPreset = async (presetId: string): Promise<{ success: boolean }> => {
    return callApi(`ai-presets/delete/${presetId}`);
};