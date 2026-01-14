import { callApi } from '../../shared/utils/apiClient';

// --- AUTH API ---
export type LoginPayload = {
    username: string;
    password: string;
}

export const login = async (credentials: LoginPayload): Promise<{ success: boolean; role: 'admin' | 'user', username: string }> => {
    return callApi('auth/login', credentials);
};
