import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// VK SDK типизация
declare global {
  interface Window {
    VKIDSDK: any;
  }
}

type ApiEnvironment = 'production' | 'pre-production' | 'local';

// Конфигурация VK приложения
const VK_APP_ID = 54423358;
const VK_REDIRECT_URI = 'https://718f01ee96c1.ngrok-free.app';

// Генератор code_verifier для PKCE (для локального режима)
const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16).padStart(2, "0")).join("");
};

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isVkLoading, setIsVkLoading] = useState(false);
    const { login, loginWithVk } = useAuth();
    
    // Ref для контейнера OneTap виджета и verifier
    const vkContainerRef = useRef<HTMLDivElement>(null);
    const vkVerifierRef = useRef<string>('');
    
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

    // Загрузка VK SDK и рендеринг OneTap виджета (ТОЛЬКО для продакшен/препрод)
    useEffect(() => {
        // На локальном окружении OneTap не используем — он не работает на localhost
        if (apiEnv === 'local') {
            console.log('[VK Auth] Локальное окружение — OneTap отключен, будет использован popup');
            return;
        }

        const initVkOneTap = () => {
            if ('VKIDSDK' in window && vkContainerRef.current) {
                const VKID = window.VKIDSDK;
                
                // Инициализация конфигурации VK ID
                VKID.Config.init({
                    app: VK_APP_ID,
                    redirectUrl: VK_REDIRECT_URI,
                    responseMode: VKID.ConfigResponseMode.Callback,
                    source: VKID.ConfigSource.LOWCODE,
                    scope: '', // Пустой scope для базовой авторизации
                });

                // Создаём и рендерим OneTap виджет
                const oneTap = new VKID.OneTap();
                
                // Очищаем контейнер перед рендером
                vkContainerRef.current.innerHTML = '';

                oneTap.render({
                    container: vkContainerRef.current,
                    showAlternativeLogin: true
                })
                .on(VKID.WidgetEvents.ERROR, (err: any) => {
                    console.log('[VK OneTap] Error event:', err);
                    // Код 2 = "New tab has been closed" - это не ошибка, а просто закрытие окна
                    if (err?.code === 2) {
                        console.log('[VK OneTap] Ignoring tab closed event');
                        return;
                    }
                    setError('Ошибка VK авторизации');
                    setIsVkLoading(false);
                })
                .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload: any) => {
                    console.log('[VK OneTap] Login success payload:', payload);
                    setIsVkLoading(true);
                    setError(null);
                    
                    const code = payload.code;
                    const deviceId = payload.device_id;

                    try {
                        // Обмениваем код через SDK (SDK сам знает code_verifier)
                        const data = await VKID.Auth.exchangeCode(code, deviceId);
                        console.log('[VK OneTap] Exchange success, full data:', JSON.stringify(data, null, 2));
                        
                        // VK SDK возвращает данные в разных форматах, проверяем все варианты
                        const userId = data.user_id || data.id_token?.user_id || payload.user?.id;
                        let firstName = 'VK';
                        let lastName = 'User';
                        let photoUrl = '';

                        // Пробуем получить данные из разных мест ответа
                        if (data.user) {
                            firstName = data.user.first_name || firstName;
                            lastName = data.user.last_name || lastName;
                            photoUrl = data.user.avatar || data.user.photo_200 || data.user.photo_100 || '';
                        } else if (payload.user) {
                            // Данные могут быть в исходном payload
                            firstName = payload.user.first_name || firstName;
                            lastName = payload.user.last_name || lastName;
                            photoUrl = payload.user.avatar || payload.user.photo_200 || '';
                        }

                        // Если данных нет - получаем через VK API
                        if (firstName === 'VK' && data.access_token) {
                            try {
                                console.log('[VK OneTap] Fetching user info from VK API...');
                                const userInfoResponse = await fetch(
                                    `https://api.vk.com/method/users.get?access_token=${data.access_token}&fields=photo_200,first_name,last_name&v=5.131`
                                );
                                const userInfo = await userInfoResponse.json();
                                console.log('[VK OneTap] User info from API:', userInfo);
                                
                                if (userInfo.response && userInfo.response[0]) {
                                    const vkUser = userInfo.response[0];
                                    firstName = vkUser.first_name || firstName;
                                    lastName = vkUser.last_name || lastName;
                                    photoUrl = vkUser.photo_200 || photoUrl;
                                }
                            } catch (apiErr) {
                                console.warn('[VK OneTap] Failed to fetch user info:', apiErr);
                            }
                        }

                        console.log('[VK OneTap] Final user data:', { userId, firstName, lastName, photoUrl });
                        
                        // Авторизуем пользователя в системе
                        loginWithVk({
                            vk_user_id: userId?.toString() || '',
                            first_name: firstName,
                            last_name: lastName,
                            photo_url: photoUrl,
                            access_token: data.access_token,
                        });

                        window.showAppToast?.('Вы успешно авторизованы через VK!', 'success');
                    } catch (err) {
                        console.error('[VK OneTap] Exchange error:', err);
                        const message = err instanceof Error ? err.message : 'Ошибка обмена кода VK';
                        setError(message);
                    } finally {
                        setIsVkLoading(false);
                    }
                });
            }
        };

        // Загружаем SDK если ещё не загружен
        if (!document.getElementById('vkid-sdk-login')) {
            const script = document.createElement('script');
            script.id = 'vkid-sdk-login';
            script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
            script.onload = () => setTimeout(initVkOneTap, 100);
            document.body.appendChild(script);
        } else if ('VKIDSDK' in window) {
            setTimeout(initVkOneTap, 100);
        }
    }, [loginWithVk, apiEnv]);
    
    // Слушатель postMessage для получения callback от popup (локальный режим)
    useEffect(() => {
        if (apiEnv !== 'local') return;
        
        const handleMessage = async (event: MessageEvent) => {
            // Проверяем источник — ожидаем от нашего ngrok домена
            if (!event.origin.includes('ngrok') && event.origin !== window.location.origin) return;
            
            if (event.data?.type === 'VK_AUTH_CALLBACK') {
                const { code, device_id, state } = event.data.payload;
                console.log('[VK Popup] Получен callback:', { code: code?.substring(0, 20) + '...', device_id, state });
                
                // Проверяем state — должен содержать наш verifier
                const expectedState = vkVerifierRef.current;
                if (state !== expectedState) {
                    console.warn('[VK Popup] State mismatch!', { expected: expectedState, got: state });
                }
                
                if (code && vkVerifierRef.current) {
                    setIsVkLoading(true);
                    setError(null);
                    
                    try {
                        // Определяем URL бэкенда для текущего окружения
                        const apiBaseUrl = window.localStorage.getItem('api_environment') === 'local' 
                            ? 'http://localhost:8000' 
                            : 'https://preprod.vk-planner.ru';
                        
                        // Обмениваем код на токен через бэкенд
                        const response = await fetch(`${apiBaseUrl}/api/vk-test/exchange-token`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                code,
                                device_id,
                                code_verifier: vkVerifierRef.current,
                                redirect_uri: VK_REDIRECT_URI
                            })
                        });
                        
                        const data = await response.json();
                        console.log('[VK Popup] Exchange response:', data);
                        
                        if (!response.ok) {
                            throw new Error(data.detail || 'Ошибка обмена кода');
                        }
                        
                        // Данные приходят в структуре { auth_data: {...}, user_info: {...} }
                        const authData = data.auth_data || {};
                        const userInfo = data.user_info || {};
                        
                        // Получаем данные пользователя из ответа бэкенда
                        const userId = authData.user_id || userInfo.id;
                        const firstName = userInfo.first_name || 'VK';
                        const lastName = userInfo.last_name || 'User';
                        const photoUrl = userInfo.photo_200 || userInfo.photo_100 || '';
                        const accessToken = authData.access_token || '';
                        
                        console.log('[VK Popup] Extracted user data:', { userId, firstName, lastName, photoUrl: photoUrl ? '✓' : '✗' });
                        
                        // Авторизуем пользователя
                        loginWithVk({
                            vk_user_id: userId?.toString() || '',
                            first_name: firstName,
                            last_name: lastName,
                            photo_url: photoUrl,
                            access_token: accessToken,
                        });
                        
                        window.showAppToast?.('Вы успешно авторизованы через VK!', 'success');
                    } catch (err) {
                        console.error('[VK Popup] Auth error:', err);
                        setError(err instanceof Error ? err.message : 'Ошибка авторизации');
                    } finally {
                        setIsVkLoading(false);
                        vkVerifierRef.current = '';
                    }
                }
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [apiEnv, loginWithVk]);

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

    // Popup-авторизация VK через SDK (для локального окружения)
    const handlePopupVkLogin = async () => {
        setIsVkLoading(true);
        setError(null);

        // Генерируем code_verifier для PKCE
        const codeVerifier = generateCodeVerifier();
        vkVerifierRef.current = codeVerifier;
        
        console.log('[VK Popup] Starting auth with verifier:', codeVerifier.substring(0, 10) + '...');
        
        // Загружаем SDK если ещё не загружен
        const loadSdkAndAuth = () => {
            if ('VKIDSDK' in window) {
                const VKID = window.VKIDSDK;
                
                // Инициализируем конфиг
                VKID.Config.init({
                    app: VK_APP_ID,
                    redirectUrl: VK_REDIRECT_URI,
                    responseMode: VKID.ConfigResponseMode.Callback,
                    scope: '',
                    codeVerifier: codeVerifier
                });
                
                // Вызываем Auth.login — это откроет popup
                VKID.Auth.login({ codeVerifier })
                    .then(async (payload: any) => {
                        console.log('[VK Popup] Auth.login success:', payload);
                        const { code, device_id } = payload;
                        
                        try {
                            // Обмениваем код на токен через SDK
                            const data = await VKID.Auth.exchangeCode(code, device_id);
                            console.log('[VK Popup] Exchange success, full data:', JSON.stringify(data, null, 2));
                            
                            const userId = data.user_id || data.id_token?.user_id;
                            let firstName = 'VK';
                            let lastName = 'User';
                            let photoUrl = '';
                            
                            // Пробуем получить данные из ответа SDK (разные форматы)
                            if (data.user) {
                                console.log('[VK Popup] Found user in data.user:', data.user);
                                firstName = data.user.first_name || firstName;
                                lastName = data.user.last_name || lastName;
                                photoUrl = data.user.avatar || data.user.photo_200 || data.user.photo_100 || '';
                            }
                            
                            // Если в SDK ответе нет данных — пробуем VK API
                            if (firstName === 'VK' && data.access_token) {
                                try {
                                    console.log('[VK Popup] Fetching user info from VK API...');
                                    const userInfoResponse = await fetch(
                                        `https://api.vk.com/method/users.get?access_token=${data.access_token}&fields=photo_200,first_name,last_name&v=5.131`
                                    );
                                    const userInfo = await userInfoResponse.json();
                                    console.log('[VK Popup] VK API response:', userInfo);
                                    
                                    if (userInfo.response && userInfo.response[0]) {
                                        const vkUser = userInfo.response[0];
                                        firstName = vkUser.first_name || firstName;
                                        lastName = vkUser.last_name || lastName;
                                        photoUrl = vkUser.photo_200 || photoUrl;
                                    } else if (userInfo.error) {
                                        console.warn('[VK Popup] VK API error:', userInfo.error);
                                    }
                                } catch (apiErr) {
                                    console.warn('[VK Popup] Failed to fetch user info:', apiErr);
                                }
                            }
                            
                            console.log('[VK Popup] Final user data:', { userId, firstName, lastName, photoUrl });
                            
                            // Авторизуем пользователя
                            loginWithVk({
                                vk_user_id: userId?.toString() || '',
                                first_name: firstName,
                                last_name: lastName,
                                photo_url: photoUrl,
                                access_token: data.access_token,
                            });
                            
                            window.showAppToast?.('Вы успешно авторизованы через VK!', 'success');
                        } catch (err) {
                            console.error('[VK Popup] Exchange error:', err);
                            setError(err instanceof Error ? err.message : 'Ошибка обмена кода');
                        } finally {
                            setIsVkLoading(false);
                        }
                    })
                    .catch((err: any) => {
                        console.error('[VK Popup] Auth.login error:', err);
                        // Код 2 = пользователь закрыл окно
                        if (err?.code === 2) {
                            setIsVkLoading(false);
                            return;
                        }
                        setError('Ошибка авторизации VK');
                        setIsVkLoading(false);
                    });
            }
        };
        
        // Загружаем SDK если ещё не загружен
        if (!document.getElementById('vkid-sdk-popup')) {
            const script = document.createElement('script');
            script.id = 'vkid-sdk-popup';
            script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
            script.onload = () => setTimeout(loadSdkAndAuth, 100);
            script.onerror = () => {
                setError('Не удалось загрузить VK SDK');
                setIsVkLoading(false);
            };
            document.body.appendChild(script);
        } else if ('VKIDSDK' in window) {
            loadSdkAndAuth();
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
                            disabled={isLoggingIn || isVkLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-wait"
                        >
                            {isLoggingIn ? <div className="loader h-5 w-5 border-white border-t-transparent"></div> : 'Войти'}
                        </button>
                    </div>
                </form>

                {/* Разделитель */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">или</span>
                    </div>
                </div>

                {/* Контейнер для VK: OneTap (продакшен/препрод) или кнопка popup (локальный) */}
                {apiEnv === 'local' ? (
                    // Кнопка popup-авторизации для локального окружения
                    <button
                        type="button"
                        onClick={handlePopupVkLogin}
                        disabled={isLoggingIn || isVkLoading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-wait transition-colors"
                    >
                        {isVkLoading ? (
                            <>
                                <div className="loader h-5 w-5 border-blue-500 border-t-transparent"></div>
                                <span>Авторизация...</span>
                            </>
                        ) : (
                            <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#0077FF"/>
                                    <path d="M12.766 16.489h.858s.259-.028.391-.169c.121-.129.117-.372.117-.372s-.017-1.136.51-1.303c.52-.164 1.188 1.093 1.897 1.577.536.366.943.286.943.286l1.896-.026s.991-.061.521-.84c-.038-.063-.274-.573-1.411-1.619-1.19-1.095-1.031-.918.403-2.812.873-1.155 1.222-1.86 1.113-2.163-.104-.288-.743-.212-.743-.212l-2.135.013s-.158-.022-.275.048c-.114.069-.188.23-.188.23s-.337.899-.787 1.664c-.949 1.614-1.328 1.699-1.483 1.599-.36-.234-.27-1.059-.27-1.624 0-1.765.268-2.501-.521-2.692-.262-.063-.455-.105-1.124-.112-.858-.009-1.585.003-1.996.204-.273.134-.484.432-.355.449.158.021.517.097.707.356.245.335.236 1.087.236 1.087s.141 2.076-.328 2.334c-.322.177-.764-.184-1.713-1.636-.486-.743-.853-1.565-.853-1.565s-.071-.173-.197-.266c-.153-.112-.366-.148-.366-.148l-2.028.013s-.304.009-.416.141c-.1.117-.008.36-.008.36s1.585 3.71 3.379 5.578c1.645 1.714 3.513 1.601 3.513 1.601z" fill="#fff"/>
                                </svg>
                                <span>Войти через VK</span>
                            </>
                        )}
                    </button>
                ) : (
                    // OneTap виджет для продакшен/препрод
                    <div 
                        ref={vkContainerRef} 
                        className="w-full min-h-[44px] flex items-center justify-center"
                    >
                        {/* VK OneTap виджет будет отрендерен сюда */}
                        {isVkLoading && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <div className="loader h-5 w-5 border-blue-500 border-t-transparent"></div>
                                <span className="text-sm">Авторизация...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
