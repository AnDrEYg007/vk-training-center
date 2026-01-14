import re
from typing import Optional

# Используем относительный импорт, так как все модули находятся в одном пакете
from .api_client import call_vk_api

def vk_owner_id_string(group_id: int) -> str:
    """Returns the string owner_id for a community: '-{group_id}'."""
    return f"-{abs(int(group_id))}"

def resolve_vk_group_id(vk_project_id: str, user_token: str) -> int:
    """Resolves any vkProjectId format to a numeric group_id."""
    sanitized_input = str(vk_project_id or '').strip()
    
    if 'vk.com/' in sanitized_input:
        sanitized_input = sanitized_input.split('vk.com/')[-1].split('?')[0].split('#')[0]

    sanitized_input = sanitized_input.replace('@', '').replace('club', '').replace('public', '')

    if sanitized_input.startswith('-'):
        sanitized_input = sanitized_input[1:]

    if sanitized_input.isdigit():
        return int(sanitized_input)

    resp = call_vk_api('groups.getById', {'group_id': sanitized_input, 'access_token': user_token})
    
    if not resp or not isinstance(resp, list) or not resp[0].get('id'):
        raise Exception(f"INVALID_DATA: Cannot resolve VK group by '{sanitized_input}'. Check 'vkProjectId'.")
        
    return int(resp[0]['id'])

def extract_vk_group_identifier(input_str: str) -> Optional[str]:
    """Extracts a group identifier (numeric or screen_name) from various string formats."""
    if not input_str:
        return None
    s = input_str.strip()

    if re.fullmatch(r'-?\d+', s):
        return s

    match = re.search(r'(?:https?://)?(?:www\.)?vk\.com/([^/?#]+)', s, re.IGNORECASE)
    tail = match.group(1) if match else s
    
    clean = re.sub(r'[?#].*$', '', tail)

    club_match = re.match(r'^(club|public|event)(\d+)$', clean, re.IGNORECASE)
    if club_match:
        return club_match.group(2)

    return clean if clean else None


def resolve_screen_name(screen_name: str, user_token: str) -> dict:
    """Resolves a screen name to an object_id and type using utils.resolveScreenName."""
    # The API method can handle numeric IDs as well, simplifying the logic.
    # It will just return the object for that ID.
    param = screen_name.lstrip('-')
    
    response = call_vk_api('utils.resolveScreenName', {
        'screen_name': param,
        'access_token': user_token
    })
    # An empty response {} means the name was not found
    return response if response else {}