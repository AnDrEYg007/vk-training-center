
import { PhotoAttachment } from '../../../../shared/types';

export type FinishConditionType = 'count' | 'date' | 'mixed';

export interface ContestSettings {
    isActive: boolean; // Тумблер активности
    keywords: string;
    startDate: string; // "С какой даты учитывать посты?"
    
    finishCondition: FinishConditionType;
    targetCount?: number;
    finishDate?: string; // Legacy (можно оставить для совместимости или удалить)
    
    // Новые поля для периодичности
    finishDayOfWeek?: number; // 1 - Понедельник, 7 - Воскресенье
    finishTime?: string; // "HH:MM"
    
    // Автоматический черный список
    autoBlacklist?: boolean;
    autoBlacklistDuration?: number; // Количество дней бана

    templateComment: string;
    
    templateWinnerPost: string;
    winnerPostImages: PhotoAttachment[]; // Изображения для поста с итогами

    templateDm: string;
    templateErrorComment: string;
}

export type ParticipantStatus = 'new' | 'processing' | 'commented' | 'error' | 'winner' | 'used';

export interface ParticipantMock {
    id: string; // Внутренний ID записи
    vkPostId: number; // Номер поста
    date: string; // Дата и время
    postLink: string; // Ссылка на пост
    postTextShort: string; // Короткий текст поста
    
    authorId: number; // ID автора
    authorName: string; // ФИО
    authorUrl: string; // Ссылка на автора
    
    status: ParticipantStatus; // Статус
    
    entryNumber?: number; // Присвоенный номер (может не быть, если еще не обработан)
    replyCommentText?: string; // Текст комментария который был под постом
}

export interface PromoCode {
    id: string;
    code: string;
    description?: string; // Описание промокода (напр. "Скидка 500р")
    is_issued: boolean;
    issued_at?: string;
    issued_to_user_id?: number;
    issued_to_user_name?: string;
    
    // Legacy поля (могут приходить, но лучше использовать DeliveryLog)
    delivery_status?: 'sent' | 'error';
    delivery_message?: string;
}

export interface DeliveryLog {
    id: string;
    user_vk_id: number;
    user_name?: string;
    promo_code?: string;
    prize_description?: string;
    message_text: string;
    status: 'sent' | 'error';
    error_details?: string;
    created_at: string;
    
    // Новые ссылки
    winner_post_link?: string; // Ссылка на пост победителя (отзыв)
    results_post_link?: string; // Ссылка на пост с итогами конкурса
}

export interface PromoCodeCreatePayload {
    code: string;
    description?: string;
}

export interface BlacklistEntry {
    id: string;
    user_vk_id: number;
    user_name?: string;
    user_screen_name?: string;
    until_date?: string; // null if forever
    created_at: string;
}
