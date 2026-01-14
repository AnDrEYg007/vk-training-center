import React from 'react';

type TabType = 'updates' | 'unchanged' | 'not_found' | 'ambiguous';

interface UpdateFileTabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    updatesCount: number;
    unchangedCount: number;
    notFoundCount: number;
    ambiguousCount: number;
}

export const UpdateFileTabs: React.FC<UpdateFileTabsProps> = ({
    activeTab,
    setActiveTab,
    updatesCount,
    unchangedCount,
    notFoundCount,
    ambiguousCount,
}) => {
    return (
        <div className="flex bg-gray-200 rounded-lg p-1 gap-1 mb-4 flex-shrink-0 self-start">
            <button
                onClick={() => setActiveTab('updates')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm focus:outline-none focus:ring-0 ${
                    activeTab === 'updates'
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none bg-transparent'
                }`}
            >
                Товары для обновления - {updatesCount}
            </button>
            <button
                onClick={() => setActiveTab('unchanged')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm focus:outline-none focus:ring-0 ${
                    activeTab === 'unchanged'
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none bg-transparent'
                }`}
            >
                Без изменений - {unchangedCount}
            </button>
            <button
                onClick={() => setActiveTab('ambiguous')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm focus:outline-none focus:ring-0 ${
                    activeTab === 'ambiguous'
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none bg-transparent'
                }`}
            >
                Дубликаты - {ambiguousCount}
            </button>
            <button
                onClick={() => setActiveTab('not_found')}
                className={`px-4 h-8 text-sm font-medium rounded-md transition-all shadow-sm focus:outline-none focus:ring-0 ${
                    activeTab === 'not_found'
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none bg-transparent'
                }`}
            >
                Не найдено / Новые - {notFoundCount}
            </button>
        </div>
    );
};
