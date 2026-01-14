
import { callApi } from '../../shared/utils/apiClient';

/**
 * Генерирует текст для поста с помощью AI.
 */
export const generatePostText = async (prompt: string, systemPrompt?: string): Promise<string> => {
    const result = await callApi<{ generatedText: string }>('ai/generatePostText', { prompt, system_prompt: systemPrompt });
    return result.generatedText;
};

/**
 * Генерирует несколько вариаций текста для поста.
 */
export const generateBatchPostTexts = async (prompt: string, count: number, systemPrompt?: string): Promise<string[]> => {
    const result = await callApi<{ variations: string[] }>('ai/generateBatchPostTexts', { prompt, count, system_prompt: systemPrompt });
    return result.variations;
};

/**
 * Получает системный промпт по умолчанию для AI-генератора.
 */
export const getDefaultSystemPrompt = async (): Promise<string> => {
    const result = await callApi<{ default_prompt: string }>('ai/defaultSystemPrompt');
    return result.default_prompt;
};

/**
 * Отправляет текст предложенного поста для коррекции в Gemini AI.
 */
export const correctSuggestedPostText = async (text: string, projectId: string): Promise<string> => {
    const result = await callApi<{ correctedText: string }>('ai/correctSuggestedPostText', { text, projectId });
    return result.correctedText;
};

/**
 * Запускает "умную" настройку переменных проекта.
 */
export const runAiVariableSetup = async (
    projectId: string, 
    emptyVariables: { name: string; value: string }[]
): Promise<{ filled: { name: string, value: string }[], new: { name: string, value: string }[] }> => {
    const result = await callApi<{ filled: { name: string, value: string }[], new: { name: string, value: string }[] }>(
        'ai/runAiVariableSetup', 
        { projectId, emptyVariables }
    );
    return result || { filled: [], new: [] };
};

/**
 * Отправляет текст поста на обработку (рерайт, исправление ошибок и др.).
 */
export const processPostTextWithAI = async (text: string, action: 'rewrite' | 'fix_errors' | 'shorten' | 'expand' | 'add_emoji' | 'remove_emoji', projectId: string): Promise<string> => {
    const result = await callApi<{ generatedText: string }>('ai/processPostText', { text, action, projectId });
    return result.generatedText;
};
