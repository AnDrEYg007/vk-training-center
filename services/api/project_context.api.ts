
import { ProjectContextField, ProjectContextValue } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

export interface ProjectContextResponse {
    fields: ProjectContextField[];
    values: ProjectContextValue[];
}

export interface ProjectSpecificContextResponse {
    project_id: string;
    values: Record<string, string>; // { "Название поля": "Значение" }
}

export const getContextStructure = async (): Promise<ProjectContextField[]> => {
    return callApi<ProjectContextField[]>('project-context/structure', {}, 'GET');
};

export const createContextField = async (name: string, description?: string, is_global: boolean = true, project_ids: string[] | null = null): Promise<ProjectContextField> => {
    return callApi<ProjectContextField>('project-context/fields', { name, description, is_global, project_ids });
};

export const updateContextField = async (fieldId: string, data: { name?: string, description?: string, is_global?: boolean, project_ids?: string[] | null }): Promise<ProjectContextField> => {
    return callApi<ProjectContextField>(`project-context/fields/${fieldId}`, data, 'PUT');
};

export const deleteContextField = async (fieldId: string): Promise<{ success: boolean }> => {
    return callApi<{ success: boolean }>(`project-context/fields/${fieldId}`, {}, 'DELETE');
};

export const getAllContextData = async (): Promise<ProjectContextResponse> => {
    return callApi<ProjectContextResponse>('project-context/data', {}, 'GET');
};

export const updateContextValues = async (values: { project_id: string, field_id: string, value: string }[]): Promise<{ success: boolean }> => {
    return callApi('project-context/values', { values });
};

export const getProjectSpecificContext = async (projectId: string): Promise<ProjectSpecificContextResponse> => {
    return callApi<ProjectSpecificContextResponse>(`project-context/project/${projectId}`, {}, 'GET');
};

export const runAiAutofill = async (projectId: string): Promise<ProjectContextValue[]> => {
    return callApi<ProjectContextValue[]>('project-context/ai-autofill', { projectId });
};

// --- NEW AI METHODS ---

export const generateCompanyDesc = async (projectId: string): Promise<string> => {
    const result = await callApi<{ value: string }>('project-context/ai-company-desc', { projectId });
    return result.value;
};

export const generateProductsDesc = async (projectId: string): Promise<string> => {
    const result = await callApi<{ value: string }>('project-context/ai-products-desc', { projectId });
    return result.value;
};

export const generateTone = async (projectId: string): Promise<string> => {
    const result = await callApi<{ value: string }>('project-context/ai-tone', { projectId });
    return result.value;
};
