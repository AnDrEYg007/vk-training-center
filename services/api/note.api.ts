import { Note } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';

// --- NOTES API ---

/**
 * Загружает все заметки для проекта.
 */
export const getNotes = async (projectId: string): Promise<Note[]> => {
    return callApi<Note[]>('getNotes', { projectId });
};

/**
 * Сохраняет (создает или обновляет) заметку.
 */
export const saveNote = async (note: Note, projectId: string): Promise<Note> => {
    return callApi<Note>('saveNote', { note, projectId });
};

/**
 * Удаляет заметку по ее ID.
 */
export const deleteNote = async (noteId: string): Promise<{ success: boolean }> => {
    return callApi<{ success: true }>('deleteNote', { noteId });
};
