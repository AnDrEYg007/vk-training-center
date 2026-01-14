
import { callApi } from '../../shared/utils/apiClient';
import { AiPost } from '../../features/automations/ai-posts/types';
import { ScheduledPost } from '../../shared/types';

export const getAiPostsList = async (projectId: string): Promise<AiPost[]> => {
    return callApi<AiPost[]>('automations/ai-posts/list', { projectId });
};

export const createAiPost = async (post: ScheduledPost, projectId: string): Promise<AiPost> => {
    return callApi<AiPost>('automations/ai-posts/create', { 
        post, 
        projectId,
        scheduleInVk: false,
        publishNow: false
    });
};

export const deleteAiPost = async (postId: string): Promise<{ success: boolean }> => {
    return callApi('automations/ai-posts/delete', { postId });
};
