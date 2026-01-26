import { API_BASE_URL } from '../../shared/config';

export interface VkCallbackLog {
    id: number;
    type: string;
    group_id: number;
    group_name?: string | null; // Название группы из базы данных
    payload: string; // JSON string
    timestamp: string;
}

export const getCallbackLogs = async (limit: number = 50): Promise<VkCallbackLog[]> => {
    const response = await fetch(`${API_BASE_URL}/vk/logs?limit=${limit}`);
    if (!response.ok) {
        throw new Error('Failed to fetch callback logs');
    }
    return response.json();
};

export const deleteAllCallbackLogs = async (): Promise<{ deleted: number }> => {
    const response = await fetch(`${API_BASE_URL}/vk/logs`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Failed to delete all logs');
    }
    return response.json();
};

export const deleteCallbackLog = async (logId: number): Promise<{ deleted: number }> => {
    const response = await fetch(`${API_BASE_URL}/vk/logs/${logId}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Failed to delete log');
    }
    return response.json();
};

export const deleteBatchCallbackLogs = async (ids: number[]): Promise<{ deleted: number }> => {
    const response = await fetch(`${API_BASE_URL}/vk/logs/delete-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
    });
    if (!response.ok) {
        throw new Error('Failed to delete batch logs');
    }
    return response.json();
};
