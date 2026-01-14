
import React, { useState } from 'react';
import { Project } from '../../../shared/types';
import { ListStatisticsPanel } from './ListStatisticsPanel';
import { InteractionSyncModal } from './modals/InteractionSyncModal';
import { useSystemListsManager } from '../hooks/useSystemListsManager';
import { ListGroup, ListType, FilterCanWrite, StatsPeriod, StatsGroupBy } from '../types';
import * as api from '../../../services/api';
import { useAuth } from '../../auth/contexts/AuthContext';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { AppView } from '../../../App';

// Импорт новых секций
import { ListsNavigation } from './sections/ListsNavigation';
import { ListsFilters } from './sections/ListsFilters';
import { ListsDataView } from './sections/ListsDataView';

export const SystemListsTab: React.FC<{ 
    project: Project;
    activeListGroup: ListGroup;
    onActiveListGroupChange: (group: ListGroup) => void;
    activeView: AppView;
}> = ({ project, activeListGroup, onActiveListGroupChange, activeView }) => {
    const { state, actions } = useSystemListsManager({ project, activeListGroup, onActiveListGroupChange });
    const { user } = useAuth();

    const {
        activeList, meta, items, posts, interactions, stats,
        totalItemsCount, searchQuery, filterQuality, filterSex, filterOnline, filterCanWrite,
        isLoadingStats, isLoadingList, isListLoaded, isRefreshingSubscriberDetails,
        isSyncModalOpen, refreshStates, interactionSyncType,
        statsPeriod, statsGroupBy,
        filterBdateMonth, filterPlatform, filterAge
    } = state;

    const {
        setActiveGroup: handleGroupChange, setSearchQuery, setFilterQuality, setFilterSex, setFilterOnline, setFilterCanWrite,
        setIsSyncModalOpen, handleRefreshList, handleSyncInteractions,
        handleRefreshInteractionUsers, handleRefreshSubscriberDetails,
        handleResetFilters, handleTabChange, handleLoadMore,
        setStatsPeriod, setStatsGroupBy, setStatsDateFrom, setStatsDateTo,
        handleRefreshPostsWithLimit,
        setFilterBdateMonth, setFilterPlatform, setFilterAge
    } = actions;
    
    const [clearListConfirmation, setClearListConfirmation] = useState<{ isOpen: boolean; listType: string } | null>(null);
    const [isClearing, setIsClearing] = useState(false);

    const handleStatsParamsChange = (period: StatsPeriod, groupBy: StatsGroupBy, dateFrom?: string, dateTo?: string, canWrite?: FilterCanWrite) => {
        setStatsPeriod(period);
        setStatsGroupBy(groupBy);
        if (dateFrom) setStatsDateFrom(dateFrom);
        if (dateTo) setStatsDateTo(dateTo);
        if (canWrite) setFilterCanWrite(canWrite);
    };

    const handleInitiateClearList = () => {
        if (activeList) {
            setClearListConfirmation({ isOpen: true, listType: activeList });
        }
    };

    const handleConfirmClearList = async () => {
        if (!clearListConfirmation) return;
        
        setIsClearing(true);
        try {
            await api.clearListData(project.id, clearListConfirmation.listType);
            setIsClearing(false);
            setClearListConfirmation(null);

            if (state.activeProjectIdRef.current === project.id) {
                 setTimeout(() => {
                     window.location.reload();
                 }, 100);
            }
        } catch (e) {
            window.showAppToast?.("Ошибка очистки: " + (e instanceof Error ? e.message : String(e)), 'error');
            setIsClearing(false);
            setClearListConfirmation(null);
        }
    };

    const isCurrentInteractionSyncing = (interactionSyncType && refreshStates[interactionSyncType]?.isRefreshing) || false;

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">
                        {activeView === 'lists-automations' ? 'Списки автоматизаций' : 'Системные списки'}
                    </h1>
                    <p className="text-sm text-gray-500">База данных пользователей и контента проекта "{project.name}"</p>
                </div>
                
                <ListsNavigation 
                    activeGroup={state.activeGroup}
                    activeList={activeList}
                    meta={meta}
                    refreshStates={refreshStates}
                    onGroupChange={handleGroupChange}
                    onTabChange={handleTabChange}
                    onRefreshList={handleRefreshList}
                    onRefreshPostsWithLimit={handleRefreshPostsWithLimit}
                    activeView={activeView}
                />
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col">
                {!activeList ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <p className="text-lg font-medium">Выберите список для просмотра</p>
                    </div>
                ) : (
                     <div className="flex flex-col h-full animate-fade-in-up">
                        <div className="flex-shrink-0">
                            <ListStatisticsPanel 
                                stats={stats} 
                                isLoading={isLoadingStats} 
                                listType={activeList as any}
                                statsPeriod={statsPeriod}
                                statsGroupBy={statsGroupBy}
                                onParamsChange={handleStatsParamsChange}
                                filterCanWrite={filterCanWrite}
                            />

                            <ListsFilters 
                                activeList={activeList}
                                searchQuery={searchQuery}
                                totalItemsCount={totalItemsCount}
                                filterQuality={filterQuality}
                                filterSex={filterSex}
                                filterOnline={filterOnline}
                                filterCanWrite={filterCanWrite}
                                filterBdateMonth={filterBdateMonth}
                                filterPlatform={filterPlatform}
                                filterAge={filterAge}
                                setSearchQuery={setSearchQuery}
                                setFilterQuality={setFilterQuality}
                                setFilterSex={setFilterSex}
                                setFilterOnline={setFilterOnline}
                                setFilterCanWrite={setFilterCanWrite}
                                setFilterBdateMonth={setFilterBdateMonth}
                                setFilterPlatform={setFilterPlatform}
                                setFilterAge={setFilterAge}
                                onResetFilters={handleResetFilters}
                                isRefreshingSubscriberDetails={isRefreshingSubscriberDetails}
                                refreshStates={refreshStates}
                                onRefreshSubscriberDetails={handleRefreshSubscriberDetails}
                                onRefreshList={handleRefreshList}
                                onRefreshInteractionUsers={handleRefreshInteractionUsers}
                                user={user}
                                onInitiateClearList={handleInitiateClearList}
                            />
                        </div>
                        
                        <ListsDataView 
                            activeList={activeList}
                            isListLoaded={isListLoaded}
                            isLoadingList={isLoadingList}
                            items={items}
                            posts={posts}
                            interactions={interactions}
                            projectId={project.id}
                            vkGroupId={String(project.vkProjectId || '')}
                            onLoadMore={handleLoadMore}
                        />
                    </div>
                )}
            </main>
            
             <InteractionSyncModal
                isOpen={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                onConfirm={handleSyncInteractions}
                isSyncing={isCurrentInteractionSyncing}
            />
            
            {clearListConfirmation && (
                 <ConfirmationModal
                    title="Очистить базу списка?"
                    message={`Вы уверены, что хотите ПОЛНОСТЬЮ удалить все данные списка "${clearListConfirmation.listType}" из базы? \n\nЭто действие необратимо.`}
                    onConfirm={handleConfirmClearList}
                    onCancel={() => setClearListConfirmation(null)}
                    confirmText="Да, очистить"
                    confirmButtonVariant="danger"
                    isConfirming={isClearing}
                />
            )}
        </div>
    );
};
