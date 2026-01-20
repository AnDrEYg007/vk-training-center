
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

def upload_story(group_id: int, file_bytes: bytes, file_name: str, user_token: str, link_text: str = None, link_url: str = None, attachment: str = None, clickable_stickers: str = None) -> dict:
    """
    Загрузка истории. Атомарное использование токена.
    
    :param attachment: Строка вида typeOwnerId_ObjectId (например, wall-123_456) для прикрепления объекта (репоста).
                       Примечание: Сам по себе attachment добавляет визуальную карточку поста. 
                       Чтобы появилась кнопка "Смотреть запись" (или "Перейти"), 
                       нужно также передать link_text='go_to' и link_url='https://vk.com/wall...'.
    :param clickable_stickers: JSON-строка с массивом кликабельных стикеров.
                               Позволяет размещать интерактивные области (mention, hashtag и т.д.).
                               Для ссылки на пост обычно используется attachment + link_url,
                               но можно использовать стикеры типа 'mention' или 'link' (если доступно).
    :param link_text: Текст кнопки снизу (например, 'go_to', 'more', 'view'). Обязателен, если есть link_url.
    :param link_url: Ссылка для кнопки снизу.
    """
    print(f"VK_SERVICE: Starting ATOMIC story upload for group_id {group_id}...")
    tokens = get_candidate_tokens(user_token)
    last_exception = None

    for token in tokens:
        try:
            # Step 1: Get upload server
            get_server_params = {
                'add_to_news': 1,
                'group_id': group_id, 
                'access_token': token
            }
            
            # MOVE PARAMS TO GET_SERVER STEP
            if link_text:
                get_server_params['link_text'] = link_text
            if link_url:
                get_server_params['link_url'] = link_url
            if clickable_stickers:
                get_server_params['clickable_stickers'] = clickable_stickers

            print(f"VK_SERVICE DEBUG: Calling stories.getPhotoUploadServer with params: {get_server_params}")
            upload_server_response = _raw_call_vk_api('stories.getPhotoUploadServer', get_server_params)
            
            upload_url = upload_server_response.get('upload_url')
            if not upload_url: raise Exception("No upload_url")

            # Step 2: Upload
            files = {'photo': (file_name, file_bytes, 'image/jpeg')}
            upload_response_req = requests.post(upload_url, files=files)
            upload_response_req.raise_for_status()
            upload_response = upload_response_req.json()
            
            upload_result = None
            if 'upload_result' in upload_response:
                upload_result = upload_response['upload_result']
            elif 'response' in upload_response:
                if isinstance(upload_response['response'], dict) and 'upload_result' in upload_response['response']:
                     upload_result = upload_response['response']['upload_result']
            
            if not upload_result:
                raise Exception(f"Bad upload response for story: {upload_response}")

            # Step 3: Save
            save_params = {
                'upload_results': upload_result,
                'access_token': token
            }
            
            if attachment:
                save_params['attachment'] = attachment

            # REMOVED link_text, link_url, clickable_stickers from save_params 
            # as they are now passed to getPhotoUploadServer

            print(f"VK_SERVICE DEBUG: Calling stories.save with params: {save_params}")
            saved_stories = _raw_call_vk_api('stories.save', save_params)
            print(f"VK_SERVICE DEBUG: stories.save response: {saved_stories}")
            
            if saved_stories and isinstance(saved_stories, dict) and 'items' in saved_stories and len(saved_stories['items']) > 0:
                 return saved_stories['items'][0]
                 
            if saved_stories and isinstance(saved_stories, dict) and saved_stories.get('count', 0) > 0:
                 if 'items' in saved_stories: return saved_stories['items'][0]

            raise Exception(f"No story data after saving: {saved_stories}")

        except Exception as e:
            print(f"VK_SERVICE: Story upload failed with token ...{token[-4:]}: {e}")
            last_exception = e
            continue
            
    raise last_exception or Exception("All tokens failed to upload story")

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
