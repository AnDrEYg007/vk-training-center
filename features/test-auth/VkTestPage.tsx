import React, { useEffect, useState } from 'react';

// VK ID SDK Global Definition
declare global {
  interface Window {
    VKIDSDK: any;
  }
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
  const [activeAppId, setActiveAppId] = useState<number>(APP_ID_1);
  const [authResult, setAuthResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  // Store verifier and redirectUri in state to Ensure Consistency
  const [authContext, setAuthContext] = useState<{verifier: string, redirectUrl: string, scope?: string} | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  // Effect to re-init whenever activeAppId changes
  useEffect(() => {
    setLogs([]); // Clear logs on switch
    addLog(`Switching to App ID: ${activeAppId}`);
    
    // 2. Prepare Context (Generate NEW verifier for new session)
    const verifier = generateCodeVerifier();
    // Use the EXACT string registered in VK App Settings
    const redirectUrl = 'https://6ec0eb7d692d.ngrok-free.app/callback'; 
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
          addLog("Success! User: " + data.user_id);
          
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
    </div>
  );
};
