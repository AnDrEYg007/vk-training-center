import React, { useState } from 'react';
import { CallbackApiSettings } from './CallbackApiSettings';
import { TokenLogsDashboard } from '../../users/components/TokenLogsDashboard';

export const LogsSettings: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'callback' | 'vk' | 'ai'>('callback');
    
    // Унифицированный стиль вкладок (border-b-2 underline)
    const subTabClass = (tabName: string) => `py-2 px-2 text-sm font-medium border-b-2 transition-colors ${
        activeSubTab === tabName 
            ? 'border-indigo-600 text-indigo-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

    return (
        <div className="flex flex-col h-full">
            {/* Вкладки логов */}
            <div className="px-4 pt-2 bg-white border-b border-gray-200">
                <div className="flex gap-4">
                    <button onClick={() => setActiveSubTab('callback')} className={subTabClass('callback')}>
                        Callback API
                    </button>
                    <button onClick={() => setActiveSubTab('vk')} className={subTabClass('vk')}>
                        VK Логи
                    </button>
                    <button onClick={() => setActiveSubTab('ai')} className={subTabClass('ai')}>
                        AI Логи
                    </button>
                </div>
            </div>

            {/* Контент */}
            <div className="flex-1 overflow-hidden">
                {activeSubTab === 'callback' && <CallbackApiSettings />}
                {activeSubTab === 'vk' && <TokenLogsDashboard mode="vk" />}
                {activeSubTab === 'ai' && <TokenLogsDashboard mode="ai" />}
            </div>
        </div>
    );
};
