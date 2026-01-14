import { GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

// --- GLOBAL VARIABLES API ---

/**
 * Загружает все определения глобальных переменных.
 */
export const getAllGlobalVariableDefinitions = async (): Promise<GlobalVariableDefinition[]> => {
    return callApi<GlobalVariableDefinition[]>('global-variables/getAllDefinitions');
};

/**
 * Обновляет все определения глобальных переменных.
 */
export const updateAllGlobalVariableDefinitions = async (definitions: GlobalVariableDefinition[]): Promise<{ success: boolean }> => {
    return callApi('global-variables/updateAllDefinitions', { definitions });
};

/**
 * Загружает определения и значения глобальных переменных для одного проекта.
 */
export const getGlobalVariablesForProject = async (projectId: string): Promise<{ definitions: GlobalVariableDefinition[], values: ProjectGlobalVariableValue[] }> => {
    return callApi('global-variables/getForProject', { projectId });
};

/**
 * Обновляет значения глобальных переменных для одного проекта.
 */
export const updateGlobalVariablesForProject = async (projectId: string, values: Omit<ProjectGlobalVariableValue, 'id' | 'project_id'>[]): Promise<{ success: boolean }> => {
    return callApi('global-variables/updateForProject', { projectId, values });
};
