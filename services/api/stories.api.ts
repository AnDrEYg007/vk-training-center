import { UnifiedStory } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

export const getCommunityStories = async (projectId: string, refresh: boolean = false): Promise<UnifiedStory[]> => {
    try {
        const response = await callApi<{ items: UnifiedStory[] }>('getUnifiedStories', { projectId, refresh });
        console.log(`[STORIES_API] getCommunityStories raw response for project ${projectId} (refresh=${refresh}):`, response);
        const items = response.items || [];
        return items;
    } catch (error) {
        console.error('Error fetching community stories:', error);
        return [];
    }
};
