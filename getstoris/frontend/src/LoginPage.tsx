import React, { useEffect, useState } from 'react';

// Types for VK ID SDK
declare global {
  interface Window {
    VKIDSDK: any;
  }
}

const APP_ID = 54423358; 

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  useEffect(() => {
    if ('VKIDSDK' in window) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: APP_ID,
        redirectUrl: window.location.origin + '/callback',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: 'groups offline',
      });

      const oneTap = new VKID.OneTap();
      const container = document.getElementById('vk-auth-container');

      if (container) {
          // Clear previous instances to prevent duplicates
          container.innerHTML = '';
          
          oneTap.render({
            container: container,
            showAlternativeLogin: true
          })
          .on(VKID.WidgetEvents.ERROR, (error: any) => {
              console.error('VK ID Widget Error:', error);
          })
          .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
            const code = payload.code;
            const deviceId = payload.device_id;
            
            // Assuming SDK handles exchange in LowCode mode via internal magic or we handle code
            // For now, we manually exchange code if SDK doesn't do it automatically in the background for LowCode?
            // Actually ConfigSource.LOWCODE usually implies the SDK handles a lot. 
            // But let's stick to the previous logic which worked for fetching token.
            
            VKID.Auth.exchangeCode(code, deviceId)
              .then((data: any) => {
                  onLogin({ ...data, device_id: deviceId });
              });
          });
      }
    }
  }, [onLogin]);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2937' }}>
          GetStoris
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Войдите через ВКонтакте, чтобы начать планировать контент
        </p>
        
        <div 
          id="vk-auth-container" 
          style={{ display: 'flex', justifyContent: 'center' }}
        ></div>
        
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2rem' }}>
          Безопасная авторизация через VK ID
        </p>
      </div>
    </div>
  );
};
