
import { PhotoAttachment } from '../../../shared/types';

export type ConditionType = 'like' | 'repost' | 'comment' | 'subscription' | 'mailing' | 'member_of_group';

export interface ContestCondition {
    id: string;
    type: ConditionType;
    params?: {
        text_contains?: string; // Для комментариев
        group_id?: string; // Для подписки (если спонсор)
    };
}

export interface ConditionGroup {
    id: string;
    conditions: ContestCondition[];
}

export interface GeneralContestStats {
    participants: number;
    promocodes_available: number;
    promocodes_total: number;
    status: 'paused_manual' | 'awaiting_start' | 'running' | 'results_published' | 'completed' | 'active_no_cycle' | 'created' | 'active' | 'evaluating' | 'finished' | 'archived';
    start_post_status?: string;
    result_post_status?: string;
    dms_sent_count: number;
    active_cycle_id?: string;
}

export interface GeneralContestCycle {
    id: string;
    contest_id: string;
    status: string;
    start_scheduled_post_id?: string;
    end_scheduled_post_id?: string;
    vk_start_post_id?: number | string;
    vk_result_post_id?: number | string;
    started_at?: string;
    finished_at?: string;
    participants_count: number;
    winners_snapshot?: string;
    created_at?: string;
}

export interface GeneralContest {
    id: string;
    project_id: string;
    
    // 1. Основные
    title: string; // Internal Name (backend: name)
    description?: string; // Internal Description
    is_active: boolean;
    
    // 2. Старт
    start_type: 'new_post' | 'existing_post';
    existing_post_link?: string;
    
    post_text?: string;
    post_media?: string; // JSON
    start_date?: string; // ISO
    
    // 3. Логика
    conditions_schema?: string; // JSON
    
    // 4. Финиш
    finish_type: 'date' | 'duration';
    finish_date?: string;
    finish_duration_hours?: number;
    
    // 5. Победители
    winners_count: number;
    one_prize_per_person: boolean;
    
    // 6. Циклы
    is_cyclic: boolean;
    restart_type: 'manual' | 'interval' | 'daily' | 'weekly';
    restart_settings?: string;
    
    // 7. Шаблоны
    template_result_post?: string;
    template_dm?: string;
    template_fallback_comment?: string;
    
    created_at?: string;
    updated_at?: string;
    
    // Rich Data from API
    stats?: GeneralContestStats;
    active_cycle?: GeneralContestCycle;

    // Frontend helpers
    start_time?: string;
    finish_time?: string;
    finish_duration_days?: number;
    finish_duration_time?: string;
    start_post_images?: PhotoAttachment[];
    result_post_images?: PhotoAttachment[];
}
