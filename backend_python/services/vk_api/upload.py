
import requests
from .api_client import call_vk_api as _raw_call_vk_api
from .token_manager import get_candidate_tokens

def upload_wall_photo(group_id: int, file_bytes: bytes, file_name: str, user_token: str) -> dict:
    """
    Загрузка фото на стену. Гарантирует использование ОДНОГО И ТОГО ЖЕ токена
    для всех этапов загрузки (получение сервера -> сохранение).
    """
    print(f"VK_SERVICE: Starting ATOMIC wall photo upload for group_id {group_id}...")
    
    # Получаем список кандидатов (приоритет: user_token -> env -> system)
    tokens = get_candidate_tokens(user_token)
    last_exception = None

    for token in tokens:
        try:
            # Step 1: Get wall upload server
            # Используем _raw_call_vk_api, чтобы избежать внутренней ротации call_vk_api
            upload_server_response = _raw_call_vk_api('photos.getWallUploadServer', {
                'group_id': group_id,
                'access_token': token
            })
            upload_url = upload_server_response.get('upload_url')
            if not upload_url:
                raise Exception("VK API did not return an upload_url")

            # Step 2: Upload photo to the server
            files = {'photo': (file_name, file_bytes, 'image/jpeg')} 
            upload_response_req = requests.post(upload_url, files=files)
            upload_response_req.raise_for_status()
            upload_response = upload_response_req.json()
            
            if 'photo' not in upload_response or 'server' not in upload_response or 'hash' not in upload_response:
                raise Exception(f"Bad upload response: {upload_response}")

            # Step 3: Save the photo on VK's server using the SAME token
            save_params = {
                'group_id': group_id,
                'photo': upload_response['photo'],
                'server': upload_response['server'],
                'hash': upload_response['hash'],
                'access_token': token
            }
            saved_photos = _raw_call_vk_api('photos.saveWallPhoto', save_params)
            
            if not saved_photos or len(saved_photos) == 0:
                raise Exception("VK API did not return photo data after saving.")
            
            print(f"VK_SERVICE: Upload success with token ...{token[-4:]}")
            return saved_photos[0]

        except Exception as e:
            print(f"VK_SERVICE: Upload failed with token ...{token[-4:]}: {e}")
            last_exception = e
            continue
            
    raise last_exception or Exception("All tokens failed to upload photo")

def upload_market_photo(group_id: int, file_bytes: bytes, file_name: str, user_token: str) -> dict:
    """
    Загрузка фото товара. Атомарное использование токена.
    """
    print(f"VK_SERVICE: Starting ATOMIC market photo upload for group_id {group_id}...")
    tokens = get_candidate_tokens(user_token)
    last_exception = None

    for token in tokens:
        try:
            # Step 1
            upload_server_response = _raw_call_vk_api('photos.getMarketUploadServer', {
                'group_id': group_id,
                'main_photo': 1,
                'access_token': token
            })
            upload_url = upload_server_response.get('upload_url')
            if not upload_url: raise Exception("No upload_url")

            # Step 2
            files = {'photo': (file_name, file_bytes, 'image/jpeg')}
            upload_response_req = requests.post(upload_url, files=files)
            upload_response_req.raise_for_status()
            upload_response = upload_response_req.json()

            if 'photo' not in upload_response or 'server' not in upload_response or 'hash' not in upload_response:
                raise Exception(f"Bad upload response: {upload_response}")

            # Step 3
            save_params = {
                'group_id': group_id,
                'photo': upload_response['photo'],
                'server': upload_response['server'],
                'hash': upload_response['hash'],
                'access_token': token
            }
            saved_photos = _raw_call_vk_api('photos.saveMarketPhoto', save_params)
            
            if not saved_photos or len(saved_photos) == 0:
                raise Exception("No photo data after saving")
            
            print(f"VK_SERVICE: Market upload success with token ...{token[-4:]}")
            return saved_photos[0]

        except Exception as e:
            print(f"VK_SERVICE: Market upload failed with token ...{token[-4:]}: {e}")
            last_exception = e
            continue

    raise last_exception or Exception("All tokens failed to upload market photo")

def upload_album_photo(group_id: int, album_id: int, file_bytes: bytes, file_name: str, user_token: str) -> dict:
    """
    Загрузка фото в альбом. Атомарное использование токена.
    """
    print(f"VK_SERVICE: Starting ATOMIC album photo upload for group_id {group_id}...")
    tokens = get_candidate_tokens(user_token)
    last_exception = None

    for token in tokens:
        try:
            # Step 1
            upload_server_response = _raw_call_vk_api('photos.getUploadServer', {
                'group_id': group_id,
                'album_id': album_id,
                'access_token': token
            })
            upload_url = upload_server_response.get('upload_url')
            if not upload_url: raise Exception("No upload_url")

            # Step 2
            files = {'file1': (file_name, file_bytes, 'image/jpeg')}
            upload_response_req = requests.post(upload_url, files=files)
            upload_response_req.raise_for_status()
            upload_response = upload_response_req.json()

            if 'photos_list' not in upload_response or 'server' not in upload_response or 'hash' not in upload_response:
                raise Exception(f"Bad upload response: {upload_response}")

            # Step 3
            save_params = {
                'group_id': group_id,
                'album_id': album_id,
                'photos_list': upload_response['photos_list'],
                'server': upload_response['server'],
                'hash': upload_response['hash'],
                'access_token': token
            }
            saved_photos = _raw_call_vk_api('photos.save', save_params)
            
            if not saved_photos or len(saved_photos) == 0:
                raise Exception("No photo data after saving")
            
            print(f"VK_SERVICE: Album upload success with token ...{token[-4:]}")
            return saved_photos[0]

        except Exception as e:
            print(f"VK_SERVICE: Album upload failed with token ...{token[-4:]}: {e}")
            last_exception = e
            continue

    raise last_exception or Exception("All tokens failed to upload album photo")
