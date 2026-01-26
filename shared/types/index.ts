
export interface Project {
    id: string;
    name: string;
    team?: string;
    disabled?: boolean;
    archived?: boolean;
    sort_order?: number;
    notes?: string;
    
    // VK specific
    vkGroupName?: string;
    vkGroupShortName?: string;
    vkLink?: string;
    vkProjectId?: number;
    avatar_url?: string; // Новое поле для аватарки

    // Settings
    communityToken?: string;
    additional_community_tokens?: string[];
    vk_confirmation_code?: string;
    
    variables?: string;
}

export interface User {
    id: string;
    username: string;
    password?: string;
    full_name: string;
    role: 'admin' | 'user';
}

export interface AuthUser {
    username: string;
    role: 'admin' | 'user';
    // VK авторизация (опционально)
    vk_user_id?: string;
    photo_url?: string;
}

export interface Attachment {
    id: string;
    type: 'photo' | 'video' | 'poll' | 'doc' | 'audio' | 'link';
    url?: string;
    description?: string;
    owner_id?: number;
    access_key?: string;
}

export interface PhotoAttachment extends Attachment {
    url: string; 
}

export interface Tag {
    id: string;
    project_id: string;
    name: string;
    keyword: string;
    color: string;
    note?: string;
}

export interface ScheduledPost {
    id: string;
    project_id?: string;
    text: string;
    date: string;
    images: PhotoAttachment[];
    attachments?: Attachment[];
    
    is_cyclic?: boolean;
    recurrence_interval?: number;
    recurrence_type?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
    recurrence_end_type?: 'infinite' | 'count' | 'date';
    recurrence_end_count?: number;
    recurrence_end_date?: string;
    recurrence_fixed_day?: number;
    recurrence_is_last_day?: boolean;

    aiGenerationParams?: {
        systemPrompt: string;
        userPrompt: string;
        productId?: string;
        productFields?: string[];
        companyFields?: string[];
    };
    
    vkPostUrl?: string;
    tags?: Tag[];
    
    status?: 'pending_publication' | 'publishing' | 'error' | 'possible_error';

    // Новые поля для автоматизации
    title?: string;
    description?: string;
    is_active?: boolean;
}

export interface SystemPost extends ScheduledPost {
    publication_date: string;
    status: 'pending_publication' | 'publishing' | 'error' | 'possible_error';
    post_type: 'regular' | 'contest_winner' | 'ai_feed' | 'GENERAL_CONTEST_START' | 'GENERAL_CONTEST_END' | 'general_contest_start' | 'general_contest_result';
    images: any; 
    
    // Новые поля для автоматизации
    title?: string;
    description?: string;
    is_active?: boolean;
    related_id?: string; // ID сущности, к которой относится пост
}

export interface SuggestedPost {
    id: string;
    text: string;
    date: number;
    imageUrl?: string[];
    authorLink?: string;
    _groupName?: string;
    link?: string;
}

export interface Note {
    id: string;
    projectId: string;
    title?: string;
    text: string;
    date: string;
    color?: string;
}

export interface AiPromptPreset {
    id: string;
    project_id: string;
    name: string;
    prompt: string;
}

export interface GlobalVariableDefinition {
    id: string;
    name: string;
    placeholder_key: string;
    note?: string;
    is_global?: boolean;
    project_ids?: string[] | null;
}

export interface ProjectGlobalVariableValue {
    id: string;
    project_id: string;
    definition_id: string;
    value: string;
}

export interface Album {
    id: string;
    name: string;
    size: number;
}

export interface Photo {
    id: string;
    url: string;
}

export type AllPosts = Record<string, ScheduledPost[]>;

export interface MarketAlbum {
    id: number;
    owner_id: number;
    title: string;
    count: number;
    updated_time?: number;
}

export interface MarketCategory {
    id: number;
    name: string;
    section_id: number;
    section_name: string;
}

export interface MarketPrice {
    amount: string;
    currency: { id: number; name: string };
    text: string;
    old_amount?: string;
}

export interface MarketItem {
    id: number;
    owner_id: number;
    title: string;
    description: string;
    price: MarketPrice;
    dimensions?: any;
    weight?: number;
    category: MarketCategory;
    thumb_photo: string;
    date?: number;
    availability: number;
    album_ids: number[];
    sku?: string;
    reviews_count?: number;
    rating?: number;
}

export interface ProjectListMeta {
    subscribers_count: number;
    subscribers_last_updated?: string;
    mailing_count: number;
    mailing_last_updated?: string;
    history_join_count: number;
    history_join_last_updated?: string;
    history_leave_count: number;
    history_leave_last_updated?: string;
    posts_count: number;
    posts_last_updated?: string;
    likes_count: number;
    likes_last_updated?: string;
    comments_count: number;
    comments_last_updated?: string;
    reposts_count: number;
    reposts_last_updated?: string;
    reviews_winners_count?: number;
    reviews_participants_count?: number;
    reviews_posts_count?: number;
    stored_posts_count?: number;
    authors_count?: number;
    authors_last_updated?: string;
}

export interface SystemListSubscriber {
    id: string;
    vk_user_id: number;
    first_name: string;
    last_name: string;
    domain?: string;
    photo_url?: string;
    sex?: number;
    bdate?: string;
    city?: string;
    country?: string;
    has_mobile?: number;
    last_seen?: number;
    platform?: number;
    added_at: string;
    deactivated?: string;
    is_closed?: boolean;
    can_access_closed?: boolean;
    source: string;
}

export interface SystemListMailingItem extends SystemListSubscriber {
    conversation_status?: string;
    first_message_date?: string;
    first_message_from_id?: number;
}

export interface SystemListPost {
    id: string;
    vk_id: number;
    date: number;
    text: string;
    image_url?: string;
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    views_count: number;
    user_likes: number;
    last_updated: string;
    vk_link: string;
}

export interface SystemListInteraction {
    id: string;
    vk_user_id: number;
    first_name: string;
    last_name: string;
    domain?: string;
    photo_url?: string;
    interaction_count: number;
    last_interaction_date: string;
    post_ids?: number[];
    sex?: number;
    bdate?: string;
    city?: string;
    last_seen?: number;
    platform?: number;
    deactivated?: string;
    is_closed?: boolean;
    has_mobile?: number;
}

export interface SystemListAuthor extends SystemListSubscriber {
    event_date?: string;
}

export interface SystemAccount {
    id: string;
    vk_user_id: string;
    full_name: string;
    profile_url: string;
    avatar_url: string | null;
    token?: string;
    status: 'active' | 'error' | 'unknown';
    notes?: string;
    stats?: {
        success: number;
        error: number;
    };
}

export interface TokenLog {
    id: string;
    timestamp: string;
    method: string;
    status: 'success' | 'error';
    account_id?: string;
    project_id?: string;
    error_details?: string;
    is_env_token?: boolean;
}

export interface LogStatItem {
    method: string;
    count: number;
    last_used: string;
    project_id?: string;
    status?: 'success' | 'error';
}

export interface AccountStats {
    total_requests: number;
    success_count: number;
    error_count: number;
    items: LogStatItem[];
}

export interface AiToken {
    id: string;
    token: string;
    description?: string;
    // Статус проверки токена
    status?: 'active' | 'error' | 'unknown';
    status_error?: string | null;
    last_checked?: string | null;
    stats?: {
        success: number;
        error: number;
    };
}

export interface AiTokenLog {
    id: string;
    timestamp: string;
    model_name: string;
    status: 'success' | 'error';
    token_id?: string;
    error_details?: string;
    is_env_token?: boolean;
}

export interface ProjectContextField {
    id: string;
    name: string;
    description?: string;
    is_global: boolean;
    project_ids?: string[] | null;
}

export interface ProjectContextValue {
    id: string;
    project_id: string;
    field_id: string;
    value: string;
}

export interface ApiErrorAction {
    type: 'GENERIC_ERROR' | 'PERMISSION_ERROR';
    message: string;
    projectId?: string;
}

export interface GroupAdmin {
    id: number;
    first_name: string;
    last_name: string;
    role: 'creator' | 'administrator' | 'editor' | 'moderator';
    status: 'active' | 'inactive';
    permissions: string[]; // ['ads', 'wall', etc.]
}

// NEW: Administered Group
export interface AdministeredGroup {
    id: number; // VK Group ID
    name: string;
    screen_name?: string;
    photo_200?: string;
    members_count?: number;
    activity?: string;
    description?: string;
    admin_sources: string[]; // List of account names
    last_updated?: string;
    
    // New fields for admins info
    creator_id?: number;
    creator_name?: string;
    admins_data?: GroupAdmin[]; // JSON data of admins
}

export interface SyncGroupsResult {
    success: boolean;
    total_groups: number;
    tokens_scanned: number;
    errors: number;
}

// Новый тип для статуса конкурса
export interface ContestStatus {
    isActive: boolean;
    promoCount: number;
}

export interface UnifiedStory {
    vk_story_id: number;
    date: number; // Unix timestamp for display order
    type: string;
    preview: string | null;
    link: string | null;
    
    // Status flags
    is_expired: boolean;
    is_deleted: boolean;
    
    // If we have detailed stats (optional)
    stats?: any; 
}
