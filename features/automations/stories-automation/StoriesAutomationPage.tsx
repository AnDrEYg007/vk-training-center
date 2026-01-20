import React from 'react';
import { useStoriesAutomation } from './hooks/useStoriesAutomation';
import { StoriesSettingsView } from './components/StoriesSettingsView';
import { StoriesStatsView } from './components/StoriesStatsView'; // Re-import
import { StoriesAutomationPageProps } from './types';

export const StoriesAutomationPage: React.FC<StoriesAutomationPageProps> = ({ projectId }) => {
    const {
        activeTab, setActiveTab,
        stories,
        isLoadingStories,
        loadStories,
        isSaving,
        updatingStatsId,
        isActive, setIsActive,
        keywords, setKeywords,
        isLoading, // Add isLoading
        posts,
        visibleCount, setVisibleCount,
        isPublishing,
        scrollContainerRef,
        handleSave,
        handleUpdateStats,
        handleManualPublish,
        handleScroll,
        getPostStatus,
        getFirstImage,
        getCount
    } = useStoriesAutomation(projectId);

    if (!projectId) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="bg-indigo-50 p-4 rounded-full mb-4">
                     <p>Выберите проект</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header section */}
            <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            Автоматизация историй
                            {isActive ? (
                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 animate-pulse">Активен</span>
                            ) : (
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">Остановлен</span>
                            )}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Автоматический репост подходящих записей в истории сообщества</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                                isSaving 
                                    ? 'bg-indigo-300 text-white cursor-not-allowed' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </div>

                <div className="flex px-6 gap-6">
                    <button 
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Настройки и История
                    </button>
                    <button 
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'stats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Статистика
                    </button>
                </div>
            </div>

            <div 
                className="flex-grow p-6 overflow-hidden flex flex-col"
            >
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
                        {activeTab === 'settings' ? (
                            <StoriesSettingsView 
                                isActive={isActive}
                                setIsActive={setIsActive}
                                keywords={keywords}
                                setKeywords={setKeywords}
                                posts={posts}
                                visibleCount={visibleCount}
                                setVisibleCount={setVisibleCount}
                                // Ref passed to settings view for internal scrolling
                                scrollContainerRef={scrollContainerRef} 
                                handleScroll={handleScroll} 
                                isSaving={isSaving}
                                getPostStatus={getPostStatus}
                                getFirstImage={getFirstImage}
                                handleManualPublish={handleManualPublish}
                                isPublishing={isPublishing}
                            />
                        ) : (
                            <StoriesStatsView 
                                handleUpdateStats={handleUpdateStats}
                                updatingStatsId={updatingStatsId}
                                loadStories={loadStories}
                                isLoadingStories={isLoadingStories}
                                stories={stories}
                                getCount={getCount}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
