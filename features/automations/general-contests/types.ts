
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

export interface GeneralContest {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    is_active: boolean;
    
    // Пост старта
    start_post_text: string;
    start_post_images: PhotoAttachment[];
    start_date: string; // ISO
    start_time: string; // HH:MM
    
    // Условия и итоги
    conditions_schema: ConditionGroup[]; // Группы (OR), внутри (AND)
    
    finish_type: 'date' | 'duration';
    finish_date?: string;
    finish_time?: string;
    finish_duration_hours?: number;
    finish_duration_days?: number;
    finish_duration_time?: string;
    
    winners_count: number;
    unique_winner: boolean; // 1 приз в 1 руки
    
    is_cyclic: boolean;
    restart_delay_hours?: number;
    
    // Шаблоны
    template_result_post: string;
    result_post_images?: PhotoAttachment[];
    template_dm: string;
    template_comment_fallback: string;

    // Статистика (для списка)
    stats?: {
        participants: number;
        promocodes_available: number;
        promocodes_total: number;
        // Расширенный статус для UI
        status: 'awaiting_start' | 'running' | 'results_published' | 'completed' | 'paused_no_codes' | 'paused_manual';
        start_post_status?: 'published' | 'pending' | 'error';
        result_post_status?: 'published' | 'pending' | 'error';
        dms_sent_count?: number;
    };
}
