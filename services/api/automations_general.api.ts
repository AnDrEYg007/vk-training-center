
import { callApi } from '../../shared/utils/apiClient';
import { GeneralContest } from '../../features/automations/general-contests/types';
import { PromoCode, PromoCodeCreatePayload, DeliveryLog } from '../../features/automations/reviews-contest/types';
import { ContestEntry } from './automations.api';

function combineDateAndTime(date?: string, time?: string): string | null {
    if (!date) return null;
    try {
        // date is YYYY-MM-DD, time is HH:MM
        // We want to send it as ISO string but preserving the local time value if possible, 
        // OR send it as a naive string so backend treats it as local.
        // However, backend expects ISO format usually.
        
        // If we use new Date('YYYY-MM-DDTHH:MM:00'), browser creates it in Local Time.
        // .toISOString() converts it to UTC.
        // Example: User inputs 17:09 (UTC+3). Date object is 17:09 Local. ISO is 14:09Z.
        // Backend receives 14:09Z.
        // If backend saves it as naive datetime, it might save 14:09.
        // If schedule displays it as naive, it shows 14:09.
        
        // FIX: We should construct the ISO string manually to send "YYYY-MM-DDTHH:MM:00" (naive)
        // or ensure backend handles UTC correctly.
        // But since we see a 3 hour shift, it means conversion happens.
        
        // Let's try sending a naive ISO string without 'Z' or offset.
        if (!time) return `${date}T00:00:00`;
        return `${date}T${time}:00`;
    } catch (e) {
        console.error("Error combining date and time", e);
        return null;
    }
}

const parseBackendDate = (dateStr: string | null | undefined): Date | null => {
    if (!dateStr) return null;
    // We send naive date strings (YYYY-MM-DDTHH:MM:SS) which represent Local time.
    // The backend stores them as is.
    // When reading back, we should treat them as Local time, not UTC.
    // So we do NOT append 'Z'.
    return new Date(dateStr);
};

const transformBackendToFrontend = (backendContest: any): GeneralContest => {
    const startDateObj = parseBackendDate(backendContest.start_date);
    const finishDateObj = parseBackendDate(backendContest.finish_date);

    let start_date = '';
    let start_time = '12:00';
    if (startDateObj) {
        // Convert to local time string YYYY-MM-DD
        const year = startDateObj.getFullYear();
        const month = String(startDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(startDateObj.getDate()).padStart(2, '0');
        start_date = `${year}-${month}-${day}`;
        
        // Convert to local time string HH:MM
        const hours = String(startDateObj.getHours()).padStart(2, '0');
        const minutes = String(startDateObj.getMinutes()).padStart(2, '0');
        start_time = `${hours}:${minutes}`;
    }

    let finish_date = '';
    let finish_time = '12:00';
    if (finishDateObj) {
        const year = finishDateObj.getFullYear();
        const month = String(finishDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(finishDateObj.getDate()).padStart(2, '0');
        finish_date = `${year}-${month}-${day}`;
        
        const hours = String(finishDateObj.getHours()).padStart(2, '0');
        const minutes = String(finishDateObj.getMinutes()).padStart(2, '0');
        finish_time = `${hours}:${minutes}`;
    }
    
    let finish_duration_days = 0;
    let finish_duration_time = '00:00';
    if (backendContest.finish_duration_hours !== undefined && backendContest.finish_duration_hours !== null) {
        finish_duration_days = Math.floor(backendContest.finish_duration_hours / 24);
        const remHours = backendContest.finish_duration_hours % 24;
        const h = Math.floor(remHours);
        const m = Math.round((remHours - h) * 60);
        finish_duration_time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    } else {
        // Default values if not set
        finish_duration_days = 1;
        finish_duration_time = '00:00';
    }

    // Parse JSON fields if they are strings
    let start_post_images = [];
    try {
        start_post_images = typeof backendContest.post_media === 'string' 
            ? JSON.parse(backendContest.post_media) 
            : (backendContest.post_media || []);
    } catch (e) {}

    let conditions_schema = [];
    try {
        conditions_schema = typeof backendContest.conditions_schema === 'string'
            ? JSON.parse(backendContest.conditions_schema)
            : (backendContest.conditions_schema || []);
    } catch (e) {}

    return {
        id: backendContest.id,
        project_id: backendContest.project_id,
        title: backendContest.name || '',
        description: '', 
        is_active: backendContest.is_active,
        start_post_text: backendContest.post_text || '',
        start_post_images,
        start_date,
        start_time,
        conditions_schema,
        finish_type: backendContest.finish_type as any,
        finish_date,
        finish_time,
        finish_duration_hours: backendContest.finish_duration_hours,
        finish_duration_days,
        finish_duration_time,
        winners_count: backendContest.winners_count,
        unique_winner: backendContest.one_prize_per_person,
        is_cyclic: backendContest.is_cyclic,
        restart_delay_hours: backendContest.restart_delay_hours,
        template_result_post: backendContest.template_result_post || '',
        template_dm: backendContest.template_dm || '',
        template_comment_fallback: backendContest.template_fallback_comment || ''
    };
};

export const getGeneralContests = async (projectId: string): Promise<GeneralContest[]> => {
    const contests = await callApi<any[]>('automations/general/list', { project_id: projectId });
    return contests.map(transformBackendToFrontend);
};

export const getGeneralContestById = async (contestId: string): Promise<GeneralContest> => {
    const contest = await callApi<any>('automations/general/get', { contest_id: contestId });
    return transformBackendToFrontend(contest);
};

export const createGeneralContest = async (contest: Partial<GeneralContest>): Promise<GeneralContest> => {
    let durationHours = contest.finish_duration_hours;
    if (contest.finish_type === 'duration') {
        durationHours = (contest.finish_duration_days || 0) * 24;
        if (contest.finish_duration_time) {
             const [h, m] = contest.finish_duration_time.split(':').map(Number);
             durationHours += (h || 0) + (m || 0) / 60;
        }
    }

    // Map frontend fields to backend fields
    const backendPayload = {
        project_id: contest.project_id,
        name: contest.title,
        is_active: contest.is_active,
        post_text: contest.start_post_text,
        post_media: JSON.stringify(contest.start_post_images || []),
        start_date: combineDateAndTime(contest.start_date, contest.start_time),
        conditions_schema: JSON.stringify((contest.conditions_schema || []).map((g: any) => ({ type: 'and_group', ...g }))),
        finish_type: contest.finish_type,
        finish_date: contest.finish_type === 'date' ? combineDateAndTime(contest.finish_date, contest.finish_time) : null,
        finish_duration_hours: durationHours ? Math.round(durationHours) : undefined,
        winners_count: contest.winners_count,
        one_prize_per_person: contest.unique_winner,
        is_cyclic: contest.is_cyclic,
        restart_delay_hours: contest.restart_delay_hours,
        template_result_post: contest.template_result_post,
        template_dm: contest.template_dm,
        template_fallback_comment: contest.template_comment_fallback
    };
    const result = await callApi<any>('automations/general/create', backendPayload);
    return transformBackendToFrontend(result);
};

export const updateGeneralContest = async (contestId: string, contest: Partial<GeneralContest>): Promise<GeneralContest> => {
    if (!contest) {
        throw new Error("Update failed: Contest data is missing");
    }
    let durationHours = contest.finish_duration_hours;
    if (contest.finish_type === 'duration') {
        durationHours = (contest.finish_duration_days || 0) * 24;
        if (contest.finish_duration_time) {
             const [h, m] = contest.finish_duration_time.split(':').map(Number);
             durationHours += (h || 0) + (m || 0) / 60;
        }
    }

    const backendPayload = {
        name: contest.title,
        is_active: contest.is_active,
        post_text: contest.start_post_text,
        post_media: contest.start_post_images ? JSON.stringify(contest.start_post_images) : undefined,
        start_date: combineDateAndTime(contest.start_date, contest.start_time),
        conditions_schema: contest.conditions_schema ? JSON.stringify((contest.conditions_schema || []).map((g: any) => ({ type: 'and_group', ...g }))) : undefined,
        finish_type: contest.finish_type,
        finish_date: contest.finish_type === 'date' ? combineDateAndTime(contest.finish_date, contest.finish_time) : null,
        finish_duration_hours: durationHours ? Math.round(durationHours) : undefined,
        winners_count: contest.winners_count,
        one_prize_per_person: contest.unique_winner,
        is_cyclic: contest.is_cyclic,
        restart_delay_hours: contest.restart_delay_hours,
        template_result_post: contest.template_result_post,
        template_dm: contest.template_dm,
        template_fallback_comment: contest.template_comment_fallback
    };
    const result = await callApi<any>('automations/general/update', { contest_id: contestId, contest: backendPayload });
    return transformBackendToFrontend(result);
};


export const deleteGeneralContest = async (contestId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/delete', { contest_id: contestId });
};

// --- Promocodes (general contests) ---
// API контракты зеркалят логику конкурса отзывов, но работают по contestId
export const getGeneralContestPromocodes = async (contestId: string): Promise<PromoCode[]> => {
    return callApi<PromoCode[]>('automations/general/promocodes/get', { contest_id: contestId });
};

export const addGeneralContestPromocodes = async (contestId: string, codes: PromoCodeCreatePayload[]): Promise<{ success: boolean }> => {
    return callApi('automations/general/promocodes/add', { contest_id: contestId, codes });
};

export const deleteGeneralContestPromocode = async (promoId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/promocodes/delete', { promo_id: promoId });
};

export const deleteGeneralContestPromocodesBulk = async (promoIds: string[]): Promise<{ success: boolean }> => {
    return callApi('automations/general/promocodes/deleteBulk', { promo_ids: promoIds });
};

export const clearGeneralContestPromocodes = async (contestId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/promocodes/clear', { contest_id: contestId });
};

export const updateGeneralContestPromocode = async (id: string, description: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/promocodes/update', { id, description });
};

// --- Participants & Winners ---
export const getGeneralContestParticipants = async (contestId: string): Promise<ContestEntry[]> => {
    return callApi<ContestEntry[]>('automations/general/stats/participants', { contest_id: contestId });
};

export const clearGeneralContestParticipants = async (contestId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/stats/participants/clear', { contest_id: contestId });
};

export const getGeneralContestWinners = async (contestId: string): Promise<DeliveryLog[]> => {
    return callApi<DeliveryLog[]>('automations/general/stats/winners', { contest_id: contestId });
};

// --- Blacklist (general contests) ---
export const getGeneralContestBlacklist = async (contestId: string): Promise<any[]> => {
    return callApi<any[]>('automations/general/blacklist/get', { contest_id: contestId });
};

export const addGeneralContestToBlacklist = async (contestId: string, payload: { user_vk_id: number; until_date?: string; reason?: string }): Promise<{ success: boolean }> => {
    return callApi('automations/general/blacklist/add', { contest_id: contestId, payload });
};

export const deleteGeneralContestBlacklistEntry = async (entryId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/blacklist/delete', { entry_id: entryId });
};

// --- Delivery / Sending list (general contests) ---
export const getGeneralContestDeliveryLogs = async (contestId: string): Promise<DeliveryLog[]> => {
    return callApi<DeliveryLog[]>('automations/general/delivery/logs', { contest_id: contestId });
};

export const retryGeneralContestDelivery = async (logId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/delivery/retry', { log_id: logId });
};

export const retryGeneralContestDeliveryAll = async (contestId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/delivery/retryAll', { contest_id: contestId });
};

export const clearGeneralContestDeliveryLogs = async (contestId: string): Promise<{ success: boolean }> => {
    return callApi('automations/general/delivery/clear', { contest_id: contestId });
};
