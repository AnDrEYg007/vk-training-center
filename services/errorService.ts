import { ApiErrorAction } from '../shared/types';

interface ErrorContext {
  projectId?: string;
  projectName?: string;
}

/**
 * Interprets an error from an API call and returns a structured action for the UI.
 * This centralizes error message parsing.
 * @param error The error object caught from an API call.
 * @param context Additional context like projectId to create more specific messages.
 * @returns An ApiErrorAction object describing what the UI should do.
 */
export const interpretApiError = (error: unknown, context: ErrorContext = {}): ApiErrorAction => {
  const errorMessage = (error instanceof Error) ? error.message : String(error);

  // Specific Error: VK Access Denied (Code: 15)
  // This is a critical error that needs a specific UI response.
  if (errorMessage.includes('Access denied') || errorMessage.includes('(Code: 15)')) {
    const projectName = context.projectName ? `"${context.projectName}"` : (context.projectId ? `с ID ${context.projectId}`: 'в проекте');
    return {
      type: 'PERMISSION_ERROR',
      projectId: context.projectId,
      message: `Ошибка доступа для проекта ${projectName}.\n\nНе удалось загрузить данные. Убедитесь, что сервисный токен имеет права администратора в этом сообществе.`,
    };
  }
  
  // Generic fallback for all other errors.
  const projectNameContext = context.projectName ? ` для проекта "${context.projectName}"` : '';
  return {
    type: 'GENERIC_ERROR',
    message: `Произошла ошибка${projectNameContext}. Пожалуйста, проверьте ваше соединение и попробуйте снова.\n\nДетали: ${errorMessage}`,
  };
};
