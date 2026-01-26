
import { API_BASE_URL } from '../config';

// Re-export for use in other modules
export { API_BASE_URL };

// The FastAPI backend might return validation errors in this format
interface FastApiErrorDetail {
    loc: (string | number)[];
    msg: string;
    type: string;
}

// Unified API response structure for error handling from the old backend (for compatibility)
interface LegacyApiResponse<T> {
    success?: boolean;
    data?: T;
    error?: string;
}

// FastAPI error response structure
interface FastApiResponseError {
     detail?: FastApiErrorDetail[] | string;
}


/**
 * Custom error class to include HTTP status.
 */
class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Универсальная функция для вызова бэкенда FastAPI с логикой повторных попыток.
 * @param endpoint - Название эндпоинта (например, 'getInitialData' или 'project-context/data').
 * @param payload - Данные, которые будут отправлены в теле запроса (для POST).
 * @param method - HTTP метод (по умолчанию POST).
 * @returns Промис, который разрешается с данными от бэкенда.
 * @throws Ошибку, если сетевой запрос не удался или бэкенд сообщил об ошибке.
 */
export const callApi = async <T = any>(endpoint: string, payload: object = {}, method: string = 'POST'): Promise<T> => {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const headers = { 'Content-Type': 'application/json' };
    const options: RequestInit = {
        method: method,
        headers: headers,
    };

    if (method === 'POST' || method === 'PUT') {
        options.body = JSON.stringify(payload);
    }

    const MAX_RETRIES = 1;
    const INITIAL_DELAY = 1000; // 1 second

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            console.log(`🚀 API Call [SENDING] (Attempt ${attempt + 1}/${MAX_RETRIES})
URL: ${url}
Method: ${method}
Endpoint: ${endpoint}
Payload:`, payload);

            const response = await fetch(url, options);
            
            // Handle non-JSON responses (like 500 Internal Server Error from Nginx/Gunicorn)
            const text = await response.text();
            let result: T & LegacyApiResponse<T> & FastApiResponseError;
            
            try {
                // Если ответ пустой (например, 204 No Content), возвращаем null/undefined
                if (!text) return {} as T;
                result = JSON.parse(text);
            } catch (e) {
                // If parsing fails, assume it's a server error text
                throw new HttpError(`Server error (${response.status}): ${text.substring(0, 200)}`, response.status);
            }

            if (!response.ok) {
                let errorText = `Сетевой ответ был некорректен: ${response.status} ${response.statusText}`;
                
                if (result.detail) {
                   if (Array.isArray(result.detail)) {
                       errorText = `Ошибка валидации: ${result.detail.map(d => `${d.loc.join('.')} - ${d.msg}`).join('; ')}`;
                   } else {
                       errorText = String(result.detail);
                   }
                } else if(result.error) {
                    errorText = result.error;
                }

                // --- ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ОШИБОК AI ---
                if (errorText.includes('ALL MODELS FAILED') || errorText.includes('Все модели и API перегружены')) {
                    // Генерируем событие для глобального модального окна
                    window.dispatchEvent(new Event('vk-planner:critical-ai-error'));
                    // Мы все равно выбрасываем ошибку, чтобы локальный компонент снял лоадер
                }
                // ----------------------------------------

                throw new HttpError(errorText, response.status);
            }

            // console.log(`✅ API Call [RECEIVED] ... `); // Reduced logging

            // Handling legacy success:false from old backend if it ever happens
            if (result.success === false) {
                 throw new Error(result.error || 'Произошла неизвестная ошибка на бэкенде.');
            }

            // FastAPI doesn't use a `data` wrapper, it returns the object directly
            return result.data !== undefined ? result.data : result;

        } catch (error) {
            console.error(`Ошибка при вызове эндпоинта API "${endpoint}" (попытка ${attempt + 1}):`, error);

            // Do not retry on client-side errors (4xx), as they are likely permanent.
            if (error instanceof HttpError && error.status >= 400 && error.status < 500) {
                throw error; // Re-throw immediately to stop retries.
            }

            if (attempt === MAX_RETRIES - 1) {
                if (error instanceof Error && error.message.includes('Failed to fetch')) {
                    const detailedInstructions = `
КРИТИЧЕСКАЯ ОШИБКА: Failed to fetch.
--------------------------------------------------

Это может означать, что бэкенд на Python не запущен или недоступен.

1. Убедитесь, что вы запустили сервер командой 'uvicorn main:app --reload' в папке 'backend_python'.
2. Проверьте, что сервер доступен по адресу ${API_BASE_URL.replace('/api', '')} в браузере.
3. Убедитесь, что URL в 'shared/config.ts' правильный.
                    `;
                    console.warn(detailedInstructions);
                }
                throw error;
            }

            const delayTime = INITIAL_DELAY * Math.pow(2, attempt);
            console.log(`Следующая попытка через ${delayTime / 1000} секунд...`);
            await delay(delayTime);
        }
    }

    throw new Error(`Эндпоинт API "${endpoint}" не удалось выполнить после ${MAX_RETRIES} попыток.`);
};
