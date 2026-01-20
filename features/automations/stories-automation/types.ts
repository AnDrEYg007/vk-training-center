export interface StoriesAutomationPageProps {
    projectId?: string;
}

export interface PublishedPost {
    id: string;
    projectId: string;
    text: string;
    date: string;
    vkPostUrl: string;
    images?: string | any[];
}

export interface StoryLog {
    id: string;
    project_id: string;
    vk_post_id: number;
    created_at: string;
    status: string;
    log: string;
}

export interface StoryStats {
    id: string; // Log ID
    vkPostId: number;
    date: string;
    storyLink: string;
    stats: any;
    statsUpdatedAt?: string;
}

export interface DetailedStats {
    answer: { state: string; count: number };
    bans: { state: string; count: number };
    open_link: { state: string; count: number };
    replies: { state: string; count: number };
    shares: { state: string; count: number };
    subscribers: { state: string; count: number };
    views: { state: string; count: number };
    likes: { state: string; count: number };
}

export interface UnifiedStory {
    vk_story_id: number;
    date: number; // Unix timestamp for display order
    type: string;
    preview: string | null;
    link: string | null;
    
    // Status flags
    is_active: boolean; // From VK stories.get
    is_automated: boolean; // From DB logs
    
    // DB / Log info
    log_id: string | null;
    vk_post_id: number | null;
    
    // Stats
    views: number; // Basic views
    detailed_stats: DetailedStats | null;
    stats_updated_at: string | null;
}
