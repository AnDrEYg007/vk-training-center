import React, { useState } from 'react';
import { ActiveTasksSettings } from './ActiveTasksSettings';
import { AiTokensSettings } from './AiTokensSettings';
import { SystemPagesSettings } from './SystemPagesSettings';
import { LogsSettings } from './LogsSettings';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'ai-tokens' | 'system-pages' | 'logs'>('logs');
    
    const tabClass = (tabName: string) => `py-2 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tabName ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                 <div className="p-4 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Настройки</h1>
                        <p className="text-sm text-gray-500">Глобальные настройки приложения и интеграций.</p>
                    </div>
                </div>
                <div className="px-4 pt-2 border-b border-gray-200 overflow-x-auto">
                    <div className="flex gap-4 min-w-max">
                        <button onClick={() => setActiveTab('logs')} className={tabClass('logs')}>Логи</button>
                        <button onClick={() => setActiveTab('tasks')} className={tabClass('tasks')}>Фоновые задачи</button>
                        <button onClick={() => setActiveTab('ai-tokens')} className={tabClass('ai-tokens')}>AI Токены</button>
                        <button onClick={() => setActiveTab('system-pages')} className={tabClass('system-pages')}>Системные страницы</button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="w-full h-full">
                    {activeTab === 'logs' && <LogsSettings />}
                    {activeTab === 'tasks' && <ActiveTasksSettings />}
                    {activeTab === 'ai-tokens' && <AiTokensSettings />}
                    {activeTab === 'system-pages' && <SystemPagesSettings />}
                </div>
            </main>
        </div>
    );
};
