import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/contexts/AuthContext';

// VK ID SDK Global Definition
declare global {
  interface Window {
    VKIDSDK: any;
  }
}

// Интерфейс для VK пользователя из БД
interface VkUserFromDb {
    vk_user_id: string;
    first_name: string | null;
    last_name: string | null;
    photo_url: string | null;
    email: string | null;
    scope: string | null;
    app_id: string | null;
    is_active: boolean;
    last_login: string | null;
    created_at: string | null;
    token_expires_at: string | null;
}

const APP_ID_1 = 54423358;
const APP_ID_2 = 54422343;

// 1. Generate Random Verifier (PKCE)
const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16).padStart(2, "0")).join("");
};

// HELPER: Generate Challenge (S256) to verify match if needed (optional debug)
async function sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const VkTestPage: React.FC = () => {
  const { loginWithVk } = useAuth();
  const [activeAppId, setActiveAppId] = useState<number>(APP_ID_1);
  const [authResult, setAuthResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  // Store verifier and redirectUri in state to Ensure Consistency
  const [authContext, setAuthContext] = useState<{verifier: string, redirectUrl: string, scope?: string} | null>(null);
  
  // Список авторизованных VK пользователей из БД
  const [vkUsers, setVkUsers] = useState<VkUserFromDb[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  // Функция загрузки VK пользователей
  const fetchVkUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/vk-test/users');
      if (res.ok) {
        const data = await res.json();
        setVkUsers(data);
        addLog(`Loaded ${data.length} VK users from DB`);
      }
    } catch (e: any) {
      addLog(`Error loading users: ${e.message}`);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Функция удаления VK пользователя
  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/vk-test/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addLog(`Deleted user ${userId}`);
        fetchVkUsers(); // Перезагружаем список
      }
    } catch (e: any) {
      addLog(`Error deleting user: ${e.message}`);
    }
  };

  // Загружаем пользователей при монтировании
  useEffect(() => {
    fetchVkUsers();
  }, []);

  // Обработчик postMessage от callback окна VK авторизации
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'VK_AUTH_CALLBACK') {
        const { code, device_id } = event.data.payload;
        addLog(`Received VK callback via postMessage! Code: ${code?.substring(0, 10)}...`);
        
        if (code && authContext) {
          // Используем verifier из текущего контекста
          handleServerAuth(code, device_id, authContext.verifier, authContext.redirectUrl, activeAppId);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [authContext, activeAppId]);

  // Effect to re-init whenever activeAppId changes
  useEffect(() => {
    setLogs([]); // Clear logs on switch
    addLog(`Switching to App ID: ${activeAppId}`);
    
    // 2. Prepare Context (Generate NEW verifier for new session)
    const verifier = generateCodeVerifier();
    // Use the EXACT string registered in VK App Settings
    const redirectUrl = 'https://718f01ee96c1.ngrok-free.app'; 
    setAuthContext({ verifier, redirectUrl });

    // Dynamically load VK SDK
    if (!document.getElementById('vkid-sdk')) {
       const script = document.createElement('script');
       script.id = 'vkid-sdk';
       script.src = 'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js';
       script.onload = () => initVK(verifier, redirectUrl, activeAppId);
       document.body.appendChild(script);
    } else {
       // Allow small delay for cleanup if switching rapidly
       setTimeout(() => initVK(verifier, redirectUrl, activeAppId), 50);
    }
  }, [activeAppId]);

  const initVK = (verifier: string, redirectUrl: string, appId: number) => {
    if ('VKIDSDK' in window) {
      const VKID = window.VKIDSDK;
      addLog(`VK SDK Init for App ${appId}. Verifier: ${verifier.substring(0,5)}...`);

      // Попытка 5: Добавляем email для проверки
      const scopeList = 'email groups wall photos docs offline';
      // Сохраняем scope в контекст для переиспользования
      setAuthContext({verifier, redirectUrl, scope: scopeList});

      VKID.Config.init({
        app: appId,
        redirectUrl: redirectUrl, 
        responseMode: VKID.ConfigResponseMode.Callback,
        scope: scopeList, 
        codeVerifier: verifier 
      });

      const oneTap = new VKID.OneTap();
      const container = document.getElementById('vk-test-container');
      
      if (container) {
          container.innerHTML = ''; 
          oneTap.render({
            container: container,
            showAlternativeLogin: true
          })
          .on(VKID.WidgetEvents.ERROR, (error: any) => {
             console.error('VK error', error);
             addLog(`VK Widget Error: ${JSON.stringify(error)}`);
          })
          .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
             const { code, device_id } = payload;
             addLog(`OneTap Success! Sending to backend...`);
             handleServerAuth(code, device_id, verifier, redirectUrl, appId);
          });
      }
    }
  };

  // Ручной вызов авторизации
  const manualLogin = () => {
     if ('VKIDSDK' in window) {
         if (!authContext) {
             addLog("Error: Auth Context not ready");
             return;
         }

         // Генерируем НОВЫЙ verifier перед каждым ручным вызовом, чтобы избежать конфликтов
         const newVerifier = generateCodeVerifier();
         const scopeList = authContext.scope || 'email groups wall photos docs offline';
         
         addLog(`Starting Manual Auth.login (forcing params)...`);
         addLog(`New Verifier: ${newVerifier.substring(0,5)}...`);

         const loginParams = {
            codeVerifier: newVerifier,
            scope: scopeList 
        };
         
         // @ts-ignore - Insist on passing params
         window.VKIDSDK.Auth.login(loginParams) 
            .then((payload: any) => {
                addLog(`Manual Login Payload Keys: ${Object.keys(payload).join(', ')}`);
                // console.log('Full Payload:', payload);

                const { code, device_id } = payload;
                
                // ВАЖНО: При ручном вызове мы должны использовать ТОТ ЖЕ verifier, что передали в loginParams
                // SDK может вернуть code_verifier в payload, но лучше полагаться на тот, что мы только что создали
                const msgVerifier = payload.code_verifier || newVerifier;
                
                addLog(`Using verifier for exchange: ${msgVerifier.substring(0,5)}...`);

                handleServerAuth(code, device_id, msgVerifier, authContext.redirectUrl, activeAppId);
            })
            .catch((err: any) => {
                addLog(`Manual Login Error: ${JSON.stringify(err)}`);
            });
     }
  };

  const handleServerAuth = async (code: string, deviceId: string, verifier: string, redirectUrl: string, appId: number) => {
      try {
          const body = { 
            code, 
            device_id: deviceId, 
            code_verifier: verifier,
            redirect_uri: redirectUrl,
            app_id: appId
          };
          
          addLog(`POST /api/vk-test/exchange-token (For App ${appId})`);
          
          const res = await fetch('http://127.0.0.1:8000/api/vk-test/exchange-token', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(body)
          });

          const data = await res.json();
          addLog(`Backend Response: ${res.status}`);
          
          if (!res.ok) {
              addLog(`Error: ${JSON.stringify(data)}`);
              return;
          }

          setAuthResult(data);
          addLog("Success! User saved to DB: " + (data.user_info?.first_name || 'Unknown'));
          addLog(`DEBUG: user_info = ${JSON.stringify(data.user_info)}`);
          addLog(`DEBUG: auth_data.user_id = ${data.auth_data?.user_id}`);
          
          // Авторизуем пользователя в контексте приложения
          if (data.user_info) {
              const vkUserId = String(data.auth_data?.user_id || data.user_info.id);
              const firstName = data.user_info.first_name || 'VK';
              const lastName = data.user_info.last_name || 'User';
              const photoUrl = data.user_info.photo_200 || data.user_info.photo_100;
              
              addLog(`DEBUG: Calling loginWithVk with: ${firstName} ${lastName}, vk_id=${vkUserId}`);
              
              loginWithVk({
                  vk_user_id: vkUserId,
                  first_name: firstName,
                  last_name: lastName,
                  photo_url: photoUrl,
                  access_token: data.auth_data?.access_token || ''
              });
              addLog("User logged into app context");
          } else {
              addLog("ERROR: No user_info in response!");
          }
          
          // Перезагружаем список пользователей после успешной авторизации
          fetchVkUsers();
          
      } catch (e: any) {
          addLog(`Network Error: ${e.message}`);
      }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
       <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-gray-800">VK Auth Test Integration</h1>
           
           <div className="flex bg-gray-200 rounded-lg p-1">
               <button 
                  onClick={() => setActiveAppId(APP_ID_1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeAppId === APP_ID_1 ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
               >
                   Main App ({APP_ID_1})
               </button>
               <button 
                  onClick={() => setActiveAppId(APP_ID_2)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeAppId === APP_ID_2 ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
               >
                   New App ({APP_ID_2})
               </button>
           </div>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-semibold mb-2">Login Area <span className="text-xs font-normal text-gray-500">(App: {activeAppId})</span></h2>
               <div id="vk-test-container" className="flex justify-center my-4 min-h-[50px]"></div>
               
               {authResult && (
                   <div className="mt-4 p-4 bg-green-50 rounded text-sm text-green-800">
                       <p className="font-bold">Authorized Successfully!</p>
                       <pre className="mt-2 overflow-auto max-h-40">{JSON.stringify(authResult, null, 2)}</pre>
                   </div>
               )}

               <div className="mt-8 border-t pt-4">
                  <h3 className="text-md font-bold mb-2">Alternative Method</h3>
                  <button 
                    onClick={manualLogin}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Force Permission Request (Auth.login)
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Use this if OneTap doesn't ask for scopes. <br/>
                    <b>Note:</b> If you already authorized the app, revoke access in VK Settings to trigger permission prompt again.
                  </p>
               </div>
           </div>

           <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs h-96 overflow-auto">
               <div className="border-b border-gray-700 pb-2 mb-2 font-bold text-gray-300">Logs</div>
               {logs.map((L, i) => <div key={i}>{L}</div>)}
           </div>
       </div>

       {/* Таблица авторизованных VK пользователей */}
       <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-gray-800">
                   Авторизованные VK пользователи
                   <span className="ml-2 text-sm font-normal text-gray-500">({vkUsers.length})</span>
               </h2>
               <button 
                   onClick={fetchVkUsers}
                   disabled={isLoadingUsers}
                   className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
               >
                   {isLoadingUsers ? (
                       <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                   ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                       </svg>
                   )}
                   Обновить
               </button>
           </div>

           {vkUsers.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                   <p>Пока нет авторизованных пользователей.</p>
                   <p className="text-sm mt-1">Авторизуйтесь через VK выше, чтобы увидеть данные здесь.</p>
               </div>
           ) : (
               <div className="overflow-x-auto">
                   <table className="w-full text-sm">
                       <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                           <tr>
                               <th className="px-4 py-3 text-left">Пользователь</th>
                               <th className="px-4 py-3 text-left">VK ID</th>
                               <th className="px-4 py-3 text-left">App ID</th>
                               <th className="px-4 py-3 text-left">Последний вход</th>
                               <th className="px-4 py-3 text-left">Токен истекает</th>
                               <th className="px-4 py-3 text-center">Статус</th>
                               <th className="px-4 py-3 text-right">Действия</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y">
                           {vkUsers.map((user) => (
                               <tr key={user.vk_user_id} className="hover:bg-gray-50">
                                   <td className="px-4 py-3">
                                       <div className="flex items-center gap-3">
                                           {user.photo_url ? (
                                               <img 
                                                   src={user.photo_url} 
                                                   alt="" 
                                                   className="w-8 h-8 rounded-full"
                                               />
                                           ) : (
                                               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                                   VK
                                               </div>
                                           )}
                                           <div>
                                               <div className="font-medium text-gray-900">
                                                   {user.first_name} {user.last_name}
                                               </div>
                                               {user.email && (
                                                   <div className="text-xs text-gray-500">{user.email}</div>
                                               )}
                                           </div>
                                       </div>
                                   </td>
                                   <td className="px-4 py-3 font-mono text-gray-600">
                                       {user.vk_user_id}
                                   </td>
                                   <td className="px-4 py-3 text-gray-600">
                                       {user.app_id}
                                   </td>
                                   <td className="px-4 py-3 text-gray-600">
                                       {user.last_login ? new Date(user.last_login + 'Z').toLocaleString('ru-RU') : '-'}
                                   </td>
                                   <td className="px-4 py-3 text-gray-600">
                                       {user.token_expires_at ? new Date(user.token_expires_at + 'Z').toLocaleString('ru-RU') : '-'}
                                   </td>
                                   <td className="px-4 py-3 text-center">
                                       {(() => {
                                           // Проверяем истёк ли токен (с учётом UTC)
                                           const expired = user.token_expires_at ? new Date(user.token_expires_at + 'Z') < new Date() : false;
                                           if (expired) {
                                               return (
                                                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                       Истёк
                                                   </span>
                                               );
                                           }
                                           return user.is_active ? (
                                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                   Активен
                                               </span>
                                           ) : (
                                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                   Неактивен
                                               </span>
                                           );
                                       })()}
                                   </td>
                                   <td className="px-4 py-3 text-right">
                                       <button
                                           onClick={() => handleDeleteUser(user.vk_user_id)}
                                           className="text-red-500 hover:text-red-700"
                                           title="Удалить пользователя"
                                       >
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                           </svg>
                                       </button>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           )}
       </div>
    </div>
  );
};
