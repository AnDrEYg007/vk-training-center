
import requests
import time
from typing import Optional, List, Set
from config import settings
from database import SessionLocal
import crud.ai_token_crud as ai_token_crud
# Отложенный импорт во избежание циклических зависимостей
import services.ai_log_service as ai_log_service

# === ОПРЕДЕЛЕНИЕ СЕМЕЙСТВ МОДЕЛЕЙ ===

# Gemma: От самой сильной к самой слабой (оптимизированы для инструкций и аналитики)
GEMMA_SERIES = [
    'gemma-3-27b-it',
    'gemma-3-12b-it',
    'gemma-3-4b-it',
    'gemma-3-1b-it',
]

# Gemini: От наиболее актуальной/передовой к более старым (оптимизированы для генерации)
GEMINI_SERIES_NEW_TO_OLD = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash-lite-preview-09-2025',
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-lite-preview-02-05',
]

# Полный список для обратной совместимости и фоллбэков
AVAILABLE_MODELS = GEMINI_SERIES_NEW_TO_OLD + GEMMA_SERIES

BASE_URL_TEMPLATE = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'

def _get_models_for_strategy(strategy: str) -> List[str]:
    """
    Возвращает приоритетный список моделей в зависимости от стратегии.
    """
    if strategy == 'ANALYTICAL':
        # Для аналитики (JSON, структура) лучше подходят модели Gemma или старые стабильные версии Gemini
        return GEMMA_SERIES + list(reversed(GEMINI_SERIES_NEW_TO_OLD))
    else:
        # CREATIVE: Для генерации текста используем самые новые и мощные модели Gemini
        return GEMINI_SERIES_NEW_TO_OLD + GEMMA_SERIES

def _get_candidate_keys() -> List[str]:
    """
    Собирает список API ключей для использования.
    Приоритет: 1. ENV Key, 2. DB Tokens.
    """
    keys = []
    
    # 1. Ключ из переменных окружения
    if settings.gemini_api_key:
        keys.append(settings.gemini_api_key)
    
    # 2. Ключи из базы данных
    db = SessionLocal()
    try:
        db_tokens = ai_token_crud.get_all_tokens(db)
        for t in db_tokens:
            if t.token and t.token.strip():
                keys.append(t.token.strip())
    except Exception as e:
        print(f"⚠️ Error fetching AI tokens from DB: {e}")
    finally:
        db.close()
        
    # Убираем дубликаты, сохраняя порядок
    unique_keys = list(dict.fromkeys(keys))
    
    if not unique_keys:
        raise Exception("No Gemini API keys found (neither in ENV nor in DB).")
        
    return unique_keys

class KeySpecificError(Exception):
    """Ошибка, относящаяся к конкретному ключу (400, 429, 403)."""
    pass

class ModelSpecificError(Exception):
    """Ошибка, относящаяся к конкретной модели (404)."""
    pass

def _execute_single_request(api_key: str, model_name: str, payload: dict, proxies: dict) -> str:
    """
    Выполняет запрос к одной конкретной модели с одним конкретным ключом.
    """
    url = BASE_URL_TEMPLATE.format(model=model_name) + f"?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    
    key_masked = f"...{api_key[-4:]}" if len(api_key) > 4 else "???"

    max_retries = 2
    delay = 0.5
    backoff_factor = 1.5

    for attempt in range(max_retries):
        try:
            print(f"🤖 [Model: {model_name}] [Key: {key_masked}] (Attempt {attempt + 1})...")
            
            response = requests.post(url, headers=headers, json=payload, timeout=60, proxies=proxies)
            
            # --- Логирование ошибок по кодам ---
            if response.status_code == 429:
                print(f"   ⚠️ Quota Exceeded (429).")
                ai_log_service.log_ai_request(api_key, model_name, success=False, error_details="429: Quota Exceeded")
                raise KeySpecificError(f"Quota exceeded for key {key_masked}")

            if response.status_code == 400:
                data = response.json()
                error_msg = data.get('error', {}).get('message', '')
                if 'API key not valid' in error_msg or 'key' in error_msg.lower():
                     print(f"   ❌ Invalid API Key.")
                     ai_log_service.log_ai_request(api_key, model_name, success=False, error_details=f"400: Invalid Key ({error_msg})")
                     raise KeySpecificError(f"INVALID_KEY: {error_msg}")
                
                print(f"   ⚠️ Bad Request (400): {error_msg}")
                ai_log_service.log_ai_request(api_key, model_name, success=False, error_details=f"400: Bad Request ({error_msg})")
                raise Exception(f"Bad Request: {error_msg}")

            if response.status_code == 404:
                print(f"   ⚠️ Model Not Found (404).")
                ai_log_service.log_ai_request(api_key, model_name, success=False, error_details="404: Model Not Found")
                raise ModelSpecificError(f"Model not found: {model_name}")

            if response.status_code == 503:
                print(f"   -> 503 Service Unavailable. Waiting {delay:.2f}s...")
                # Не логируем как ошибку сразу, пробуем ретрай
                if attempt < max_retries - 1:
                    time.sleep(delay)
                    delay *= backoff_factor
                    continue
                else:
                    ai_log_service.log_ai_request(api_key, model_name, success=False, error_details="503: Service Unavailable")
                    raise Exception("503 Service Unavailable after retries")

            response.raise_for_status()
            data = response.json()

            if 'candidates' not in data or not data['candidates'][0].get('content', {}).get('parts', []):
                error_message = data.get('error', {}).get('message', 'Unknown Gemini API error: No candidates.')
                print(f"   ⚠️ Invalid response content: {error_message}")
                ai_log_service.log_ai_request(api_key, model_name, success=False, error_details=f"No candidates: {error_message}")
                raise Exception(f"Gemini API Error: {error_message}")

            # УСПЕХ
            print(f"   ✅ SUCCESS with [{model_name}]")
            # ЛОГИРУЕМ УСПЕХ
            ai_log_service.log_ai_request(api_key, model_name, success=True)
            
            return data['candidates'][0]['content']['parts'][0]['text']

        except requests.exceptions.RequestException as e:
            print(f"   ❌ Network error: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= backoff_factor
                continue
            else:
                ai_log_service.log_ai_request(api_key, model_name, success=False, error_details=f"Network Error: {str(e)}")
                raise Exception(f"Network error after retries: {e}")
                
    raise Exception("Request failed after all retries")


def generate_text(user_prompt: str, system_instruction: Optional[str] = None, strategy: str = 'CREATIVE') -> str:
    """
    Главная точка входа.
    """
    print(f"--- GEMINI GENERATION STARTED (Strategy: {strategy}) ---")
    
    candidate_keys = _get_candidate_keys()
    models_to_try = _get_models_for_strategy(strategy)
    
    proxies = {}
    if settings.gemini_proxy_url:
        proxy_url = settings.gemini_proxy_url.replace('http://', 'socks5h://', 1)
        proxies = { 'http': proxy_url, 'https': proxy_url }
    
    permanently_invalid_keys: Set[str] = set()
    last_global_error = None

    for model_name in models_to_try:
        payload = {
            "contents": [{"parts": [{"text": user_prompt}]}]
        }
        
        if system_instruction:
            if 'gemma' in model_name.lower():
                combined_text = f"System Instruction:\n{system_instruction}\n\nUser Request:\n{user_prompt}"
                payload["contents"][0]["parts"][0]["text"] = combined_text
            else:
                payload["systemInstruction"] = {
                    "parts": [{"text": system_instruction}]
                }

        for api_key in candidate_keys:
            if api_key in permanently_invalid_keys:
                continue
            
            try:
                result = _execute_single_request(api_key, model_name, payload, proxies)
                return result
                
            except KeySpecificError as e:
                if "INVALID_KEY" in str(e):
                    permanently_invalid_keys.add(api_key)
                last_global_error = e
                continue
                
            except ModelSpecificError as e:
                print(f"   🚫 Model {model_name} seems unavailable/deprecated. Skipping to next model.")
                last_global_error = e
                break 
                
            except Exception as e:
                last_global_error = e
                continue

    print("❌ ❌ ❌ CRITICAL: All models and API keys failed.")
    
    if last_global_error:
        print(f"Last error: {last_global_error}")

    raise Exception("❌ Все модели и API ключи перегружены или невалидны. Попробуйте позже.")