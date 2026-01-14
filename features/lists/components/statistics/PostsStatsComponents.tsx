
import React from 'react';
import { PostTopItem } from '../../../../services/api/lists.api';

export const MetricBlock: React.FC<{ label: string; total: number; avg: number; icon: React.ReactNode }> = ({ label, total, avg, icon }) => (
    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-1 text-gray-500">
            {icon}
            <span className="text-xs font-medium uppercase">{label}</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{total.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">⌀ {avg} / пост</div>
    </div>
);

export const TopPostCard: React.FC<{ item?: PostTopItem; type: string; icon: React.ReactNode; color: string }> = ({ item, type, icon, color }) => {
    if (!item) return null;
    return (
        <a href={item.vk_link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors group">
            <div className="flex items-center gap-2">
                 <div className={`p-1.5 rounded-md bg-opacity-20 ${color} text-gray-700`}>
                    {icon}
                 </div>
                 <span className="text-sm text-gray-600 font-medium">Топ по {type}</span>
            </div>
             <div className="flex items-center gap-1">
                <span className="font-bold text-gray-800">{item.value}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
             </div>
        </a>
    );
};
