import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../../../services/api';
import { AuthUser } from '../../../shared/types';
import { LoginPayload } from '../../../services/api';

// Данные VK пользователя после авторизации
interface VkAuthData {
    vk_user_id: string;
    first_name: string;
    last_name: string;
    photo_url?: string;
    access_token: string;
}

interface IAuthContext {
    user: AuthUser | null;
    isLoading: boolean;
    login: (credentials: LoginPayload) => Promise<void>;
    loginWithVk: (vkData: VkAuthData) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const SESSION_STORAGE_KEY = 'vk-content-planner-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Не удалось загрузить пользователя из сессии', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials: LoginPayload) => {
        const response = await api.login(credentials);
        if (response.success) {
            // При обычном логине явно НЕ устанавливаем vk_user_id и photo_url
            const authUser: AuthUser = { 
                username: response.username, 
                role: response.role as 'admin' | 'user',
                vk_user_id: undefined,
                photo_url: undefined
            };
            setUser(authUser);
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
        }
    }, []);

    // Авторизация через VK
    const loginWithVk = useCallback((vkData: VkAuthData) => {
        console.log('🔐 loginWithVk called with:', vkData);
        const authUser: AuthUser = { 
            username: `${vkData.first_name} ${vkData.last_name}`.trim(),
            role: 'user', // VK пользователи получают роль user по умолчанию
            vk_user_id: vkData.vk_user_id,
            photo_url: vkData.photo_url
        };
        console.log('🔐 Setting authUser:', authUser);
        setUser(authUser);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }, []);

    const value = { user, isLoading, login, loginWithVk, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
