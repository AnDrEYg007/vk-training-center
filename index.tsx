import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { ToastProvider } from './shared/components/ToastProvider';
import './shared/toastBridge';
import './index.css';

const container = document.getElementById('root');
if(container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <ProjectsProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </ProjectsProvider>
            </AuthProvider>
        </React.StrictMode>
    );
}