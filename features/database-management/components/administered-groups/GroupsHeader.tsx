
import React from 'react';
import { SyncGroupsResult } from '../../../../shared/types';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { SingleSelectSearchableDropdown } from './SingleSelectSearchableDropdown';

interface GroupsHeaderProps {
    onGoBack: () => void;
    totalGroupsCount: number;
    isLoading: boolean;
    isSyncing: boolean;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    uniqueSources: string[];
    selectedSources: string[];
    setSelectedSources: (val: string[]) => void;
    
    uniqueCreators: string[]; // New
    selectedCreator: string; // New
    setSelectedCreator: (val: string) => void; // New

    handleSync: () => void;
    syncStats: SyncGroupsResult | null;
    setSyncStats: (stats: SyncGroupsResult | null) => void;
    lastUpdated?: string;
    // New props for bulk admins
    handleBulkSyncAdmins: () => void;
    isBulkSyncingAdmins: boolean;
    bulkSyncProgress: string | null;
}

export const GroupsHeader: React.FC<GroupsHeaderProps> = ({
    onGoBack,
    totalGroupsCount,
    isLoading,
    isSyncing,
    searchQuery,
    setSearchQuery,
    uniqueSources,
    selectedSources,
    setSelectedSources,
    uniqueCreators,
    selectedCreator,
    setSelectedCreator,
    handleSync,
    syncStats,
    setSyncStats,
    lastUpdated,
    handleBulkSyncAdmins,
    isBulkSyncingAdmins,
    bulkSyncProgress
}) => {
    
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('ru-RU');
    };

    return (
        <header className="flex-shrink-0 bg-white shadow-sm z-10">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">
                    Администрируемые сообщества 
                    {!isLoading && <span className="ml-2 text-gray-500 text-lg font-normal">({totalGroupsCount})</span>}
                </h1>
                <p className="text-sm text-gray-500">Список всех сообществ, в которых у подключенных аккаунтов есть права администратора.</p>
            </div>
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto flex-wrap">
                    <button
                        onClick={onGoBack}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Назад
                    </button>
                    
                    <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
                            <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <SingleSelectSearchableDropdown 
                        label="Владелец"
                        options={uniqueCreators}
                        value={selectedCreator}
                        onChange={setSelectedCreator}
                        placeholder="Все владельцы"
                    />

                    <MultiSelectDropdown 
                        label="Фильтр токенов"
                        options={uniqueSources}
                        selected={selectedSources}
                        onChange={setSelectedSources}
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {totalGroupsCount > 0 && !syncStats && (
                        <span className="text-xs text-gray-500 hidden xl:inline-block">
                            Обновлено: {formatDate(lastUpdated)}
                        </span>
                    )}
                    
                    <button
                        onClick={handleBulkSyncAdmins}
                        disabled={isBulkSyncingAdmins || isSyncing}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
                        title="Получить список администраторов для всех групп (распределенная загрузка)"
                    >
                        {isBulkSyncingAdmins ? (
                            <>
                                <div className="loader h-4 w-4 border-2 border-gray-500 border-t-transparent mr-2"></div>
                                {bulkSyncProgress || "Сбор..."}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Получить админов
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleSync}
                        disabled={isSyncing || isBulkSyncingAdmins}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:bg-indigo-400 disabled:cursor-wait whitespace-nowrap"
                    >
                        {isSyncing ? (
                            <>
                                <div className="loader h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Обновление...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                </svg>
                                Обновить список
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {syncStats && (
                <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center justify-between text-sm animate-fade-in-up">
                    <div className="flex gap-4 text-green-800">
                        <span><strong>Обновление завершено:</strong></span>
                        <span>Всего групп: <strong>{syncStats.total_groups}</strong></span>
                        <span>Просканировано токенов: <strong>{syncStats.tokens_scanned}</strong></span>
                        {syncStats.errors > 0 && <span className="text-red-600">Ошибок: <strong>{syncStats.errors}</strong></span>}
                    </div>
                    <button onClick={() => setSyncStats(null)} className="text-green-600 hover:text-green-800">&times;</button>
                </div>
            )}
        </header>
    );
};
