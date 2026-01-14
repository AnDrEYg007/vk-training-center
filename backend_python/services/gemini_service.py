
# Этот файл теперь является хабом (Facade), объединяя функциональность
# из пакета `gemini_api`. Это обеспечивает обратную совместимость.

from .gemini_api.client import generate_text, AVAILABLE_MODELS
from .gemini_api.correction import get_corrected_text
from .gemini_api.analysis import get_ai_variables, get_project_context_ai_fill
from .gemini_api.marketing import (
    generate_company_description,
    generate_products_description,
    generate_brand_tone
)

__all__ = [
    'generate_text',
    'get_corrected_text',
    'get_ai_variables',
    'get_project_context_ai_fill',
    'generate_company_description',
    'generate_products_description',
    'generate_brand_tone',
    'AVAILABLE_MODELS'
]
