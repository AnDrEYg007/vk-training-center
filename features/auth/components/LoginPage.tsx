import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

type ApiEnvironment = 'production' | 'pre-production' | 'local';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAuth();
    
    // Состояние для переключателя окружения
    const [apiEnv, setApiEnv] = useState<ApiEnvironment>('local');

    // При первой загрузке компонента читаем значение из localStorage
    useEffect(() => {
        try {
            const storedEnv = window.localStorage.getItem('api_environment') as ApiEnvironment | null;
            if (storedEnv && ['production', 'pre-production', 'local'].includes(storedEnv)) {
                setApiEnv(storedEnv);
            } else {
                setApiEnv('local');
            }
        } catch (error) {
            console.error('Не удалось прочитать localStorage для api_environment', error);
        }
    }, []);

    const handleEnvChange = (newEnv: ApiEnvironment) => {
        try {
            const currentEnv = (window.localStorage.getItem('api_environment') as ApiEnvironment | null) || 'local';
            if (newEnv !== currentEnv) {
                window.localStorage.setItem('api_environment', newEnv);
                window.showAppToast?.(`Окружение API изменено на "${newEnv}". Страница будет перезагружена для применения настроек.`, 'info');
                window.location.reload();
            }
        } catch (error) {
            window.showAppToast?.('Не удалось сохранить настройки окружения. Проверьте настройки браузера.', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoggingIn(true);
        try {
            await login({ username, password });
            // Перерисовка на основное приложение будет обработана компонентом App
        } catch (err) {
            const message = err instanceof Error ? err.message : "Произошла неизвестная ошибка.";
            setError(message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md animate-fade-in-up">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Планировщик контента</h1>
                    <p className="mt-2 text-sm text-gray-600">Пожалуйста, войдите в свой аккаунт</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Логин
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="username"
                            disabled={isLoggingIn}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Пароль
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="current-password"
                            disabled={isLoggingIn}
                        />
                    </div>

                    {/* Обновленный блок для выбора окружения */}
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Окружение API</label>
                        <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                            <button
                                type="button"
                                onClick={() => handleEnvChange('production')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${apiEnv === 'production' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                Продакшен
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEnvChange('pre-production')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${apiEnv === 'pre-production' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                Предпродакшен
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEnvChange('local')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${apiEnv === 'local' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                Локальный
                            </button>
                        </div>
                    </div>


                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-wait"
                        >
                            {isLoggingIn ? <div className="loader h-5 w-5 border-white border-t-transparent"></div> : 'Войти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
