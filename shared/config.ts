// ===================================================================
// КОНФИГУРАЦИЯ API
// ===================================================================
// Этот файл определяет, к какому бэкенд-серверу будет подключаться
// приложение, основываясь на выборе пользователя в localStorage.
// ===================================================================

// URL "боевого" бэкенда, развернутого в Yandex.Cloud Containers.
const PRODUCTION_API_URL = 'https://bba15i6uulg2j0uk90sm.containers.yandexcloud.net/api';

// НОВЫЙ URL: URL предпродакшен-бэкенда.
// Обновлено на новый контейнер от 03.12.2025
const PRE_PRODUCTION_API_URL = 'https://bbaeoc78aed6qkfe5tsv.containers.yandexcloud.net/api';

// URL локального бэкенда для разработки.
const LOCAL_API_URL = 'http://127.0.0.1:8000/api';

/**
 * Определяет базовый URL API на основе значения в localStorage.
 * По умолчанию используется "локальный" URL для удобства разработки.
 * @returns {string} Базовый URL для всех запросов к API.
 */
const getApiBaseUrl = (): string => {
  try {
    // ИЗМЕНЕНО: По умолчанию теперь 'local'
    const storedEnv = window.localStorage.getItem('api_environment') || 'local';
    switch (storedEnv) {
        case 'production':
            console.log('%c[API Config] Using PRODUCTION environment: %s', 'color: green; font-weight: bold;', PRODUCTION_API_URL);
            return PRODUCTION_API_URL;
        case 'pre-production':
            console.log('%c[API Config] Using PRE-PRODUCTION environment: %s', 'color: orange; font-weight: bold;', PRE_PRODUCTION_API_URL);
            return PRE_PRODUCTION_API_URL;
        case 'local':
        default:
            console.log('%c[API Config] Using LOCAL environment by default: %s', 'color: blue; font-weight: bold;', LOCAL_API_URL);
            return LOCAL_API_URL;
    }
  } catch (error) {
    console.error('Не удалось прочитать localStorage для определения окружения API:', error);
  }
  
  // Фоллбэк на случай ошибки чтения localStorage
  console.log('%c[API Config] Using LOCAL environment as fallback: %s', 'color: blue; font-weight: bold;', LOCAL_API_URL);
  return LOCAL_API_URL;
};

// Экспортируем результат вызова функции, чтобы URL определялся один раз при загрузке.
export const API_BASE_URL = getApiBaseUrl();