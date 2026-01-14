
import React, { useState } from 'react';
import { useAdministeredGroups } from '../hooks/useAdministeredGroups';
import { GroupsHeader } from './administered-groups/GroupsHeader';
import { GroupsTable } from './administered-groups/GroupsTable';
import { OwnersTable } from './administered-groups/OwnersTable';
import { AdminsTable } from './administered-groups/AdminsTable';

interface AdministeredGroupsPageProps {
    onGoBack: () => void;
}

export const AdministeredGroupsPage: React.FC<AdministeredGroupsPageProps> = ({ onGoBack }) => {
    const {
        groups,
        filteredGroups,
        systemBotIds,
        isLoading,
        isSyncing,
        error,
        syncStats,
        setSyncStats,
        selectedSources,
        setSelectedSources,
        uniqueCreators,
        selectedCreator,
        setSelectedCreator,
        searchQuery,
        setSearchQuery,
        uniqueSources,
        handleSync,
        handleBulkSyncAdmins,
        isBulkSyncingAdmins,
        bulkSyncProgress,
    } = useAdministeredGroups();

    const [activeTab, setActiveTab] = useState<'groups' | 'owners' | 'admins'>('groups');

    const tabButtonClass = (tab: 'groups' | 'owners' | 'admins') => `
        px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap
        ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}
    `;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <GroupsHeader 
                onGoBack={onGoBack}
                totalGroupsCount={groups.length}
                isLoading={isLoading}
                isSyncing={isSyncing}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                uniqueSources={uniqueSources}
                selectedSources={selectedSources}
                setSelectedSources={setSelectedSources}
                uniqueCreators={uniqueCreators}
                selectedCreator={selectedCreator}
                setSelectedCreator={setSelectedCreator}
                handleSync={handleSync}
                syncStats={syncStats}
                setSyncStats={setSyncStats}
                lastUpdated={groups.length > 0 ? groups[0].last_updated : undefined}
                handleBulkSyncAdmins={handleBulkSyncAdmins}
                isBulkSyncingAdmins={isBulkSyncingAdmins}
                bulkSyncProgress={bulkSyncProgress}
            />

            <div className="px-4 pt-4 flex-shrink-0">
                <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit">
                    <button onClick={() => setActiveTab('groups')} className={tabButtonClass('groups')}>
                        Сообщества
                    </button>
                    <button onClick={() => setActiveTab('owners')} className={tabButtonClass('owners')}>
                        Все владельцы
                    </button>
                    <button onClick={() => setActiveTab('admins')} className={tabButtonClass('admins')}>
                        Все админы
                    </button>
                </div>
            </div>

            <main className="flex-grow p-4 overflow-auto custom-scrollbar">
                {activeTab === 'groups' && (
                    <GroupsTable 
                        isLoading={isLoading}
                        error={error}
                        filteredGroups={filteredGroups}
                        totalGroups={groups.length}
                        selectedSources={selectedSources}
                        systemBotIds={systemBotIds}
                    />
                )}
                {activeTab === 'owners' && (
                    <OwnersTable 
                        groups={groups} 
                        isLoading={isLoading} 
                        searchQuery={searchQuery}
                    />
                )}
                {activeTab === 'admins' && (
                    <AdminsTable 
                        groups={groups} 
                        isLoading={isLoading} 
                        searchQuery={searchQuery}
                    />
                )}
            </main>
        </div>
    );
};
