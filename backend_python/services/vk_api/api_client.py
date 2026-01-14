
import requests
import time
import json
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import Dict, Any, Optional

# Импортируем сервис логирования
# Используем отложенный импорт внутри функции, чтобы избежать циклических зависимостей,
# если вдруг token_log_service будет использовать vk_api (хотя не должен).
# from services import token_log_service 

VK_API_VERSION = '5.199'
VK_API_BASE_URL = 'https://api.vk.com/method/'
MAX_RETRIES = 5
INITIAL_DELAY = 2 # seconds

# --- SESSION MANAGEMENT ---
# Используем глобальную сессию для переиспользования TCP-соединений (Keep-Alive).
# Это критически важно для предотвращения "Connection reset by peer" при частых запросах.
_session = requests.Session()

# Настройка стратегии повторных попыток на уровне TCP/HTTP
retries = Retry(
    total=3,
    backoff_factor=0.5,
    status_forcelist=[500, 502, 503, 504],
    allowed_methods=["POST"]
)
_session.mount('https://', HTTPAdapter(max_retries=retries))


class VkApiError(Exception):
    """Custom exception for VK API errors."""
    def __init__(self, message, code):
        super().__init__(message)
        self.code = code
    def __str__(self):
        return f"VK_API_ERROR: {self.args[0]} (Code: {self.code})"

def call_vk_api(method: str, params: Dict[str, Any], project_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Universal function to call VK API methods with intelligent retry logic.
    Added optional project_id for better logging context.
    """
    
    # Отложенный импорт сервиса логирования
    from services import token_log_service 

    url = f"{VK_API_BASE_URL}{method}"
    
    # Формируем payload
    payload = params.copy()
    
    # ВАЖНО: Гарантируем, что если 'v' передан в params, он используется.
    # Если нет - используем глобальную константу.
    if 'v' not in payload:
        payload['v'] = VK_API_VERSION

    # Извлекаем токен для логирования (он может быть не в params, если это public метод, но у нас почти все приватные)
    token_for_log = params.get('access_token')

    # --- ФОРМИРОВАНИЕ ЧИТАЕМОГО ИМЕНИ ДЛЯ ЛОГОВ ---
    log_method_name = method
    if method == 'wall.get':
        filter_val = params.get('filter')
        if filter_val == 'postponed':
            log_method_name = 'wall.get (scheduled)'
        elif filter_val == 'suggests':
            log_method_name = 'wall.get (suggested)'
        else:
            log_method_name = 'wall.get (published)'
    elif method == 'execute':
        code = params.get('code', '')
        if 'API.wall.get' in code:
            log_method_name = 'execute (posts)'
        elif 'API.groups.getMembers' in code:
            log_method_name = 'execute (subscribers)'
        elif 'API.likes.getList' in code:
            log_method_name = 'execute (likes)'
        elif 'API.wall.getComments' in code:
            log_method_name = 'execute (comments)'
        elif 'API.wall.getReposts' in code:
            log_method_name = 'execute (reposts)'
        elif 'API.users.get' in code:
            log_method_name = 'execute (users)'
    # ----------------------------------------------

    last_exception = None
    # Error codes that are "permanent" - retrying with the same token/params won't help.
    # Added 901 (Can't send messages) and 902 (Privacy settings) to stop retries immediately.
    # REMOVED 6 (Too many requests) from permanent list explicitly to be safe, though it wasn't there.
    PERMANENT_ERROR_CODES = {
        5, 7, 9, 15, 27, 100, 113, 200, 210, 211, 212, 213, 214, 219, 901, 902
    }

    for attempt in range(MAX_RETRIES):
        try:
            log_payload = payload.copy()
            if 'access_token' in log_payload:
                token = log_payload['access_token']
                log_payload['access_token'] = f"{token[:8]}..." if isinstance(token, str) and len(token) > 8 else "HIDDEN"
            
            # Логируем версию API для отладки
            # print(f"🚀 VK API Call [SENDING] (Attempt {attempt + 1}/{MAX_RETRIES}) -> {method} (v={payload['v']})")
            
            # ИСПОЛЬЗУЕМ ГЛОБАЛЬНУЮ СЕССИЮ ВМЕСТО requests.post
            response = _session.post(url, data=payload, timeout=30)
            
            data = response.json()

            # print(f"⬅️ VK API Response [RAW JSON] from {method}:\n{json.dumps(data, indent=2, ensure_ascii=False)}")

            response.raise_for_status()

            if 'error' in data:
                error_msg = data['error']['error_msg']
                error_code = data['error']['error_code']
                
                # ЛОГИРОВАНИЕ ОШИБКИ
                if token_for_log:
                    token_log_service.log_api_call(
                        token=token_for_log,
                        method=log_method_name,
                        project_id=project_id,
                        success=False,
                        error_details=f"Code {error_code}: {error_msg}"
                    )

                raise VkApiError(error_msg, error_code)
            
            # ЛОГИРОВАНИЕ УСПЕХА
            if token_for_log:
                 token_log_service.log_api_call(
                    token=token_for_log,
                    method=log_method_name,
                    project_id=project_id,
                    success=True
                )

            return data.get('response', {})

        except VkApiError as e:
            last_exception = e
            
            # СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ CODE 6 (Too many requests)
            if e.code == 6:
                sleep_time = 1.5 * (attempt + 1) # Увеличиваем паузу
                print(f"⚠️ VK Code 6 (Too many requests). Sleeping {sleep_time}s and retrying...")
                time.sleep(sleep_time)
                continue # Принудительно идем на следующий круг цикла ретраев

            if e.code in PERMANENT_ERROR_CODES:
                print(f"VK API Error {e.code} is permanent. Stopping retries for this token.")
                raise e
            
            print(f"VK API call failed on attempt {attempt + 1}/{MAX_RETRIES} for method '{method}'. Error: {e}")
            
        except requests.exceptions.RequestException as e:
            last_exception = e
            
            # ЛОГИРОВАНИЕ СЕТЕВОЙ ОШИБКИ
            if token_for_log:
                token_log_service.log_api_call(
                    token=token_for_log,
                    method=log_method_name,
                    project_id=project_id,
                    success=False,
                    error_details=f"Network Error: {str(e)}"
                )

            print(f"Network or JSON Decode error on attempt {attempt + 1}/{MAX_RETRIES} for method '{method}'. Error: {e}")


        if attempt < MAX_RETRIES - 1:
            delay = INITIAL_DELAY * (2 ** attempt)
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
        else:
            print(f"All {MAX_RETRIES} retries failed for method '{method}'.")
            raise last_exception

    raise last_exception or Exception("VK API call failed after all retries.")
