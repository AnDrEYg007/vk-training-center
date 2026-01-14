
import React, { useState } from 'react';
import * as api from '../../../../services/api';
import { SystemAccount } from '../../../../shared/types';

interface AuthorizeAccountModalProps {
    account: SystemAccount;
    onClose: () => void;
    onSuccess: (token: string, userInfo?: any) => void;
}

const DEFAULT_APP_ID = '7556576'; 

// Обновленный список приложений (удален 7497650)
const PRESET_APPS = [
    { id: '7556576', name: 'Android (Офиц.)' },
    { id: '7793118', name: 'VK Me (Android)' },
    { id: '7799655', name: 'VK Me (iPhone)' },
    { id: '5530956', name: 'VK Admin (Android)' },
    { id: '2685278', name: 'Kate Mobile' }
];

export const AuthorizeAccountModal: React.FC<AuthorizeAccountModalProps> = ({ account, onClose, onSuccess }) => {
    // ID выбранного пресета
    const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_APP_ID);
    // ID введенный вручную
    const [customAppId, setCustomAppId] = useState('');
    
    const [urlInput, setUrlInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Логика приоритета: Если введено кастомное значение, используем его. Иначе - выбранный пресет.
    const currentAppId = customAppId.trim() ? customAppId.trim() : selectedPresetId;
    
    const authUrl = `https://oauth.vk.com/authorize?client_id=${currentAppId}&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=offline,notifications,email,ads,adsmanagement,docs,market,photos,video,pages,status,notes,wall,groups,friends,messages,stats,stories&response_type=token&v=5.199`;

    const handlePresetClick = (id: string) => {
        setSelectedPresetId(id);
        setCustomAppId(''); // Очищаем кастомное поле при выборе пресета
    };

    const handleCustomAppIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAppId(e.target.value);
        // При вводе кастомного ID, визуально снимаем выделение с пресетов (логически selectedPresetId остается, но игнорируется)
    };

    const handleVerify = async () => {
        setError(null);
        
        // 1. Извлечение токена
        let token = '';
        // Пытаемся найти токен в URL
        const match = urlInput.match(/access_token=([^&]+)/);
        if (match) {
            token = match[1];
        } else if (urlInput.length > 80 && !urlInput.includes('http')) {
             // Возможно, пользователь вставил сам токен
             token = urlInput.trim();
        } else {
             setError("Не удалось найти access_token в ссылке. Убедитесь, что вы скопировали полную ссылку из адресной строки.");
             return;
        }

        setIsVerifying(true);
        try {
            // 2. Проверка через бэкенд
            const userInfo = await api.verifyToken(token);
            
            // 3. Строгая сверка ID
            if (Number(userInfo.id) !== Number(account.vk_user_id)) {
                throw new Error(
                    `Ошибка! Токен принадлежит пользователю "${userInfo.first_name} ${userInfo.last_name}" (ID: ${userInfo.id}), ` + 
                    `а вы авторизуете "${account.full_name}" (ID: ${account.vk_user_id}). ` +
                    `Пожалуйста, перелогиньтесь в VK и получите токен заново.`
                );
            }

            // 4. Успех
            onSuccess(token, userInfo);
            onClose();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Ошибка проверки токена.";
            setError(msg);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Авторизация аккаунта</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Вы авторизуете аккаунт: <strong>{account.full_name}</strong> (ID: {account.vk_user_id}).<br/>
                                    Перед получением токена убедитесь, что в браузере вы вошли именно в этот профиль ВКонтакте.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Шаг 1: Выберите приложение</h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {PRESET_APPS.map(app => {
                                // Кнопка активна только если нет кастомного ввода и ID совпадает
                                const isActive = !customAppId && selectedPresetId === app.id;
                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => handlePresetClick(app.id)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md border transition-all text-left flex flex-col ${
                                            isActive
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500 shadow-sm'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                        }`}
                                    >
                                        <span className="font-bold">{app.name}</span>
                                        <span className="text-xs text-gray-500 font-mono mt-0.5">ID: {app.id}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-2 text-sm text-gray-500">ИЛИ введите свой ID</span>
                            </div>
                        </div>

                        <div>
                             <input 
                                type="text" 
                                value={customAppId} 
                                onChange={handleCustomAppIdChange}
                                placeholder="Например: 1234567"
                                className={`w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${customAppId ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Шаг 2: Получите токен</h3>
                        <p className="text-xs text-gray-500">Нажмите кнопку ниже. Откроется новая вкладка VK. Разрешите доступ. Когда увидите предупреждение "Пожалуйста, не копируйте данные...", скопируйте <strong>всю ссылку</strong> из адресной строки браузера.</p>
                        <a 
                            href={authUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Получить токен (открыть VK)
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Шаг 3: Вставьте ссылку</h3>
                        <textarea
                            value={urlInput}
                            onChange={(e) => { setUrlInput(e.target.value); setError(null); }}
                            placeholder="https://oauth.vk.com/blank.html#access_token=..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs custom-scrollbar"
                        />
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fade-in-up">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button 
                        onClick={handleVerify} 
                        disabled={isVerifying || !urlInput.trim()}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center min-w-[120px] justify-center"
                    >
                        {isVerifying ? <div className="loader border-white border-t-transparent h-4 w-4 mr-2"></div> : null}
                        {isVerifying ? 'Проверка...' : 'Сохранить'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
