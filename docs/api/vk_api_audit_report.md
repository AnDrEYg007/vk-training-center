# 🔍 Аудит использования VK API токенов

**Дата проверки:** 2026-01-23  
**Основание:** vk_api_methods_tokens.json (360 методов проанализировано)

---

## 📊 Сводка по системе

В проекте используются **2 типа токенов**:
- **User Token** (токен пользователя) - из `.env` или системных аккаунтов
- **Community Token** (токен сообщества) - хранится в проекте как `communityToken`

---

## ⚠️ КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. ❌ Методы `wall.*` - НЕ ПОДДЕРЖИВАЮТ токен сообщества!

Согласно документации VK API, следующие методы работают **ТОЛЬКО с токеном пользователя**:

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `wall.post` | ✅ | ❌ | ❌ |
| `wall.edit` | ✅ | ❌ | ❌ |
| `wall.delete` | ✅ | ❌ | ❌ |
| `wall.get` | ✅ | ❌ | ❌ |
| `wall.getById` | ✅ | ❌ | ❌ |
| `wall.createComment` | ✅ | ❌ | ❌ |
| `wall.getComments` | ✅ | ❌ | ❌ |
| `wall.getReposts` | ✅ | ❌ | ❌ |

**Вывод:** Все методы работы со стеной в VK API работают ТОЛЬКО с токеном пользователя. Это значит:
- ✅ Система правильно использует `user_token` для публикации
- ✅ `publish_with_fallback` использует токены из `.env` и системных аккаунтов (user tokens)

### 2. ❌ Методы `photos.*` для загрузки на стену

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `photos.getWallUploadServer` | ✅ | ❌ | ❌ |
| `photos.saveWallPhoto` | ✅ | ❌ | ❌ |
| `photos.getMarketUploadServer` | ✅ | ❌ | ❌ |
| `photos.saveMarketPhoto` | ✅ | ❌ | ❌ |
| `photos.getUploadServer` | ✅ | ❌ | ❌ |
| `photos.save` | ✅ | ❌ | ❌ |
| `photos.createAlbum` | ✅ | ❌ | ❌ |
| `photos.getAlbums` | ✅ | ❌ | ✅ |
| `photos.get` | ✅ | ❌ | ✅ |

**Вывод:** Загрузка фото требует user_token. Текущая реализация `upload.py` правильно использует токены из системных аккаунтов.

### 3. ✅ Методы `stories.*` 

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `stories.getPhotoUploadServer` | ✅ | ❌ | ❌ |
| `stories.save` | ✅ | ❌ | ❌ |
| `stories.get` | ✅ | ❌ | ❌ |

**Вывод:** Stories работают только с user_token. Текущая реализация корректна.

### 4. ❌ Методы `market.*`

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `market.add` | ✅ | ❌ | ❌ |
| `market.addAlbum` | ✅ | ❌ | ❌ |
| `market.edit` | ✅ | ❌ | ❌ |
| `market.delete` | ✅ | ❌ | ❌ |
| `market.get` | ✅ | ❌ | ❌ |
| `market.getAlbums` | ✅ | ❌ | ❌ |
| `market.getCategories` | ✅ | ❌ | ❌ |
| `market.addToAlbum` | ✅ | ❌ | ❌ |
| `market.removeFromAlbum` | ✅ | ❌ | ❌ |

**Вывод:** Все market методы требуют user_token. Текущая реализация корректна.

---

## ✅ КОРРЕКТНО ИСПОЛЬЗУЕМЫЕ МЕТОДЫ

### 5. Методы `groups.*`

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `groups.getById` | ✅ | ✅ | ✅ |
| `groups.getMembers` | ✅ | ✅ | ✅ |
| `groups.get` | ✅ | ❌ | ✅ |
| `groups.getAddresses` | ✅ | ❌ | ✅ |

**Использование в коде:**
- `ai_service.py` - `groups.getById` ✅
- `management_service.py` - `groups.getById` ✅
- `project_context_service.py` - `groups.getById`, `groups.getAddresses` ✅
- `admin_tools_service.py` - `groups.get`, `groups.getMembers` ✅

### 6. Методы `users.*`

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `users.get` | ✅ | ❌ | ❌ |

⚠️ **Примечание:** `users.get` в списке `community_token` согласно vk_group_token_methods.json, но согласно парсеру (vk_api_methods_tokens.json) он НЕ указан как поддерживающий community_token.

**Использование в коде:**
- `account_service.py` - `users.get` с user_token ✅
- `list_sync_utils.py` - `users.get` с user_token ✅
- `blacklist_service.py` - `users.get` с user_token ✅

### 7. Методы `messages.*`

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `messages.send` | ✅ | ✅ | ❌ |
| `messages.getConversations` | ✅ | ✅ | ❌ |

**Использование в коде:**
- `finalizer.py` (reviews) - `messages.send` ✅ (можно использовать community token)
- `list_sync_mailing.py` - `messages.getConversations` ✅ (можно использовать community token)

### 8. Методы `likes.*`

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `likes.getList` | ✅ | ❌ | ✅ |

**Использование в коде:**
- `collector.py` (automations) - `likes.getList` с user_token ✅

### 9. Метод `execute`

| Метод | user_token | community_token | service_token |
|-------|------------|-----------------|---------------|
| `execute` | ✅ | ✅ | ❌ |

**Вывод:** Execute может использоваться с обоими типами токенов.

---

## 📋 ПОЛНЫЙ СПИСОК ВЫЗОВОВ API В ПРОЕКТЕ

### Backend (`backend_python/services/`)

| Файл | Метод VK API | Текущий токен | Статус |
|------|--------------|---------------|--------|
| `vk_api/upload.py` | `photos.getWallUploadServer` | user_token | ✅ OK |
| `vk_api/upload.py` | `photos.saveWallPhoto` | user_token | ✅ OK |
| `vk_api/upload.py` | `photos.getMarketUploadServer` | user_token | ✅ OK |
| `vk_api/upload.py` | `photos.saveMarketPhoto` | user_token | ✅ OK |
| `vk_api/upload.py` | `stories.getPhotoUploadServer` | user_token | ✅ OK |
| `vk_api/upload.py` | `stories.save` | user_token | ✅ OK |
| `vk_api/upload.py` | `photos.getUploadServer` | user_token | ✅ OK |
| `vk_api/upload.py` | `photos.save` | user_token | ✅ OK |
| `vk_api/methods.py` | `photos.createAlbum` | user_token | ✅ OK |
| `vk_api/methods.py` | `photos.getAlbums` | user_token | ✅ OK |
| `vk_api/methods.py` | `photos.get` | user_token | ✅ OK |
| `vk_api/methods.py` | `wall.get` | user_token | ✅ OK |
| `vk_api/methods.py` | `wall.createComment` | user_token | ✅ OK |
| `vk_api/methods.py` | `stories.get` | user_token | ✅ OK |
| `vk_api/utils.py` | `groups.getById` | user_token | ✅ OK |
| `vk_api/utils.py` | `utils.resolveScreenName` | user_token | ✅ OK |
| `post_actions/publish.py` | `wall.post` | user_token | ✅ OK |
| `post_actions/publish.py` | `wall.getById` | user_token | ✅ OK |
| `post_actions/save_vk.py` | `wall.post` | user_token | ✅ OK |
| `post_actions/save_vk.py` | `wall.edit` | user_token | ✅ OK |
| `post_actions/save_vk.py` | `wall.getById` | user_token | ✅ OK |
| `post_actions/delete.py` | `wall.delete` | user_token | ✅ OK |
| `post_retrieval/helpers.py` | `wall.get` | user_token | ✅ OK |
| `post_retrieval/suggested.py` | `wall.get` | user_token | ✅ OK |
| `market_*.py` | `market.*` | user_token | ✅ OK |
| `system_accounts/account_service.py` | `users.get` | user_token | ✅ OK |
| `lists/list_sync_utils.py` | `groups.getById` | user_token | ✅ OK |
| `lists/list_sync_utils.py` | `users.get` | user_token | ✅ OK |
| `lists/subscribers/sync_task.py` | `groups.getMembers` | user_token | ✅ OK |
| `lists/list_sync_posts.py` | `wall.get` | user_token | ✅ OK |
| `lists/list_sync_mailing.py` | `messages.getConversations` | user_token | ✅ OK |
| `automations/general/collector.py` | `likes.getList` | user_token | ✅ OK |
| `automations/general/collector.py` | `wall.getComments` | user_token | ✅ OK |
| `automations/general/collector.py` | `wall.getReposts` | user_token | ✅ OK |
| `automations/reviews/finalizer.py` | `messages.send` | user_token | ✅ OK |
| `automations/reviews/finalizer.py` | `wall.createComment` | user_token | ✅ OK |
| `automations/reviews/finalizer.py` | `wall.post` | user_token | ✅ OK |
| `automations/reviews/collector.py` | `wall.getById` | user_token | ✅ OK |
| `automations/reviews/collector.py` | `users.get` | user_token | ✅ OK |
| `ai_service.py` | `groups.getById` | user_token | ✅ OK |
| `project_context_service.py` | `groups.getById` | user_token | ✅ OK |
| `project_context_service.py` | `groups.getAddresses` | user_token | ✅ OK |
| `management_service.py` | `groups.getById` | user_token | ✅ OK |
| `admin_tools_service.py` | `groups.get` | user_token | ✅ OK |
| `admin_tools_service.py` | `groups.getMembers` | user_token | ✅ OK |

---

## 🎯 ИТОГОВЫЙ ВЕРДИКТ

### ✅ Система использует токены ПРАВИЛЬНО!

Все методы VK API в системе вызываются с правильным типом токена:

1. **wall.*** - требуют user_token → система использует user_token ✅
2. **photos.*** - требуют user_token → система использует user_token ✅
3. **stories.*** - требуют user_token → система использует user_token ✅
4. **market.*** - требуют user_token → система использует user_token ✅
5. **groups.*** - поддерживают все типы → система использует user_token ✅
6. **users.*** - требуют user_token → система использует user_token ✅
7. **messages.*** - поддерживают user_token и community_token → система использует user_token ✅
8. **likes.*** - требуют user_token → система использует user_token ✅

### 💡 Рекомендации

1. **Community Token** в проекте (`communityToken`) НЕ используется для VK API вызовов, что правильно, т.к. большинство методов его не поддерживают.

2. Для методов `messages.*` МОЖНО использовать community_token (токен сообщества) для отправки сообщений от имени сообщества. Но текущая реализация с user_token тоже корректна.

3. Архитектура Token Rotation в `token_manager.py` правильно использует user токены из:
   - `.env` (VK_USER_TOKEN)
   - Системных аккаунтов (таблица system_accounts)

---

## 📌 Важное замечание о методе `users.get`

Согласно файлу `vk_group_token_methods.json`, метод `users.get` указан в списке методов для токена сообщества. Однако по результатам парсинга документации VK API (`vk_api_methods_tokens.json`), этот метод **НЕ поддерживает** community_token.

Это расхождение может быть связано с:
- Устаревшей информацией в `vk_group_token_methods.json`
- Изменениями в VK API
- Особенностями парсинга документации

**Рекомендация:** Продолжать использовать user_token для `users.get` - это гарантированно работает.

---

*Отчёт сгенерирован автоматически на основе анализа кода и документации VK API*
