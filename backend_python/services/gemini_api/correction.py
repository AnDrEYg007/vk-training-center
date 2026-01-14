
from .client import generate_text

def get_corrected_text(text_to_correct: str, group_info: dict, dlvry_link: str) -> str:
    hashtag = f"#отзыв@{group_info.get('screen_name', '')}" if group_info.get('screen_name') else ''

    link_instruction = ""
    if dlvry_link:
        link_instruction = f"В самом конце, после благодарности, добавь ссылку на заказ в формате [{dlvry_link}| Оформить заказ]."

    full_text = text_to_correct.strip()

    prompt = (
        f"Твоя задача — отредактировать отзыв клиента. "
        f"1. Исправь все орфографические, пунктуационные и грамматические ошибки в тексте отзыва. "
        f"2. После исправленного текста отзыва, с новой пустой строки, добавь хештег: {hashtag}. "
        f"3. Затем, с новой пустой строки после хештега, напиши 2 предложения благодарности клиенту за его отзыв и заказ. "
        f"{link_instruction} "
        f"Верни только итоговый текст без каких-либо дополнительных комментариев, объяснений или заголовков. "
        f'Вот текст отзыва для обработки: "{full_text}"'
    )
    
    # ИЗМЕНЕНО: Используем 'CREATIVE' стратегию для более качественного текста благодарности.
    return generate_text(prompt, strategy='CREATIVE')
