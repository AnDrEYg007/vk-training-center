import React from 'react';
import { UnifiedStory } from '../types';
import { StoriesDashboard } from './dashboard/StoriesDashboard';
import { StoriesTable } from './table/StoriesTable';

interface StoriesStatsViewProps {
    handleUpdateStats: (mode: 'single' | 'last_n' | 'period', params: any) => void;
    updatingStatsId: string | null;
    loadStories: () => void;
    isLoadingStories: boolean;
    stories: UnifiedStory[];
    getCount: (field: any) => number;
}

export const StoriesStatsView: React.FC<StoriesStatsViewProps> = ({
    handleUpdateStats, updatingStatsId,
    loadStories, isLoadingStories,
    stories, getCount
}) => {
    return (
        <div className="space-y-6">
            <StoriesDashboard stories={stories} getCount={getCount} />
            <StoriesTable 
                stories={stories} 
                isLoading={isLoadingStories}
                updatingStatsId={updatingStatsId}
                onUpdateStats={handleUpdateStats}
                onLoadStories={loadStories}
                onBatchUpdate={handleUpdateStats}
            />
        </div>
    );
};
