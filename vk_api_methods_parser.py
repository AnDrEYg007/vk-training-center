"""
Парсер методов VK API для определения типов токенов доступа.

Скрипт проходит по всем методам VK API и собирает информацию о том,
какие типы токенов (пользователя, сообщества, сервисный) поддерживает каждый метод.

Используется Selenium для рендеринга JavaScript на страницах документации VK.
Результат сохраняется в JSON-файл с группировкой по типам токенов.

Установка зависимостей:
    pip install selenium webdriver-manager

Запуск:
    python vk_api_methods_parser.py
"""

import json
import time
from typing import Dict, List
from datetime import datetime
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Базовый URL документации VK API
BASE_URL = "https://dev.vk.com"
METHODS_URL = f"{BASE_URL}/ru/method"

# Типы токенов для поиска (ключевые слова)
TOKEN_KEYWORDS = {
    "user_token": [
        "ключ доступа пользователя",
        "токен пользователя"
    ],
    "community_token": [
        "ключ доступа сообщества",
        "ключ доступа группы",
        "токен сообщества"
    ],
    "service_token": [
        "сервисный ключ доступа",
        "сервисный ключ"
    ]
}

# Количество параллельных браузеров
MAX_WORKERS = 4


# Полный список методов VK API (собран из документации)
ALL_METHODS = [
    # Account
    "account.ban", "account.changePassword", "account.getActiveOffers", 
    "account.getAppPermissions", "account.getBanned", "account.getCounters",
    "account.getInfo", "account.getProfileInfo", "account.getPushSettings",
    "account.registerDevice", "account.saveProfileInfo", "account.setInfo",
    "account.setOffline", "account.setOnline", "account.setPushSettings",
    "account.setSettings", "account.unban", "account.unregisterDevice",
    # Ads
    "ads.addOfficeUsers", "ads.checkLink", "ads.createAds", "ads.createCampaigns",
    "ads.createClients", "ads.createLookalikeRequest", "ads.createTargetGroup",
    "ads.createTargetPixel", "ads.deleteAds", "ads.deleteCampaigns", "ads.deleteClients",
    "ads.deleteTargetGroup", "ads.deleteTargetPixel", "ads.getAccounts", "ads.getAds",
    "ads.getAdsLayout", "ads.getAdsTargeting", "ads.getBudget", "ads.getCampaigns",
    "ads.getCategories", "ads.getClients", "ads.getDemographics", "ads.getFloodStats",
    "ads.getLookalikeRequests", "ads.getMusicians", "ads.getMusiciansByIds",
    "ads.getOfficeUsers", "ads.getPostsReach", "ads.getRejectionReason", "ads.getStatistics",
    "ads.getSuggestions", "ads.getTargetGroups", "ads.getTargetPixels", "ads.getTargetingStats",
    "ads.getUploadURL", "ads.getVideoUploadURL", "ads.importTargetContacts",
    "ads.removeOfficeUsers", "ads.removeTargetContacts", "ads.saveLookalikeRequestResult",
    "ads.shareTargetGroup", "ads.updateAds", "ads.updateCampaigns", "ads.updateClients",
    "ads.updateOfficeUsers", "ads.updateTargetGroup", "ads.updateTargetPixel",
    # AppWidgets
    "appWidgets.getAppImageUploadServer", "appWidgets.getAppImages",
    "appWidgets.getGroupImageUploadServer", "appWidgets.getGroupImages",
    "appWidgets.getImagesById", "appWidgets.saveAppImage", "appWidgets.saveGroupImage",
    "appWidgets.update",
    # Apps
    "apps.addSnippet", "apps.addUsersToTestingGroup", "apps.deleteAppRequests",
    "apps.deleteSnippet", "apps.get", "apps.getCatalog", "apps.getFriendsList",
    "apps.getLeaderboard", "apps.getMiniAppPolicies", "apps.getScopes", "apps.getScore",
    "apps.getSnippets", "apps.getTestingGroups", "apps.isNotificationsAllowed",
    "apps.promoHasActiveGift", "apps.promoUseGift", "apps.removeTestingGroup",
    "apps.removeUsersFromTestingGroups", "apps.sendRequest", "apps.updateMetaForTestingGroup",
    # Board
    "board.getComments", "board.getTopics",
    # Bugtracker
    "bugtracker.addCompanyGroupsMembers", "bugtracker.addCompanyMembers",
    "bugtracker.changeBugreportStatus", "bugtracker.createComment",
    "bugtracker.getBugreportById", "bugtracker.getCompanyGroupMembers",
    "bugtracker.getCompanyMembers", "bugtracker.getDownloadVersionUrl",
    "bugtracker.getProductBuildUploadServer", "bugtracker.removeCompanyGroupMember",
    "bugtracker.removeCompanyMember", "bugtracker.saveProductVersion",
    "bugtracker.setCompanyMemberRole", "bugtracker.setProductIsOver",
    # Calls
    "calls.forceFinish", "calls.start",
    # Channels
    "channels.deleteMessage", "channels.editMessage", "channels.get",
    "channels.getById", "channels.getHistory", "channels.getMessagesById",
    "channels.sendMessage",
    # Database
    "database.getCities", "database.getCitiesById", "database.getRegions",
    # Docs
    "docs.get", "docs.getById", "docs.getMessagesUploadServer", "docs.getWallUploadServer",
    # Donut
    "donut.getFriends", "donut.getSubscription", "donut.getSubscriptions", "donut.isDon",
    # Ecosystem
    "ecosystem.addLibverifyEvent", "ecosystem.checkPasskey", "ecosystem.getNextPhone",
    "ecosystem.initCallin", "ecosystem.sendOtpCallReset", "ecosystem.updateCallInStatus",
    # Execute
    "execute",
    # Friends
    "friends.areFriends", "friends.get", "friends.getAppUsers", "friends.getLists",
    "friends.getMutual", "friends.getOnline", "friends.getRecent", "friends.getRequests",
    "friends.getSuggestions", "friends.search",
    # Gifts
    "gifts.get",
    # Groups
    "groups.addAddress", "groups.addCallbackServer", "groups.deleteAddress",
    "groups.deleteCallbackServer", "groups.disableOnline", "groups.editAddress",
    "groups.editCallbackServer", "groups.enableOnline", "groups.get", "groups.getAddresses",
    "groups.getBanned", "groups.getById", "groups.getCallbackConfirmationCode",
    "groups.getCallbackServers", "groups.getCallbackSettings", "groups.getCatalogInfo",
    "groups.getInvitedUsers", "groups.getInvites", "groups.getLongPollServer",
    "groups.getLongPollSettings", "groups.getMembers", "groups.getOnlineStatus",
    "groups.getRequests", "groups.getTagList", "groups.getTokenPermissions",
    "groups.isMember", "groups.search", "groups.setCallbackSettings",
    "groups.setLongPollSettings", "groups.setSettings", "groups.setUserNote",
    "groups.tagAdd", "groups.tagBind", "groups.tagDelete", "groups.tagUpdate",
    "groups.toggleMarket", "groups.unban",
    # LeadForms
    "leadForms.create", "leadForms.delete", "leadForms.get", "leadForms.getLeads",
    "leadForms.getUploadURL", "leadForms.list", "leadForms.update",
    # Likes
    "likes.getList", "likes.isLiked",
    # LoyaltyTeen
    "loyaltyTeen.hasAccount", "loyaltyTeen.partnerCompleteAchievement",
    "loyaltyTeen.partnerCompleteTask", "loyaltyTeen.partnerCreateAccount",
    "loyaltyTeen.partnerGetAchievements", "loyaltyTeen.partnerGetBalance",
    "loyaltyTeen.partnerGetOffers", "loyaltyTeen.partnerHasAccount",
    "loyaltyTeen.sumsubCallback",
    # Market
    "market.add", "market.addAlbum", "market.addProperty", "market.addPropertyVariant",
    "market.addToAlbum", "market.createComment", "market.delete", "market.deleteAlbum",
    "market.deleteComment", "market.deleteProperty", "market.deletePropertyVariant",
    "market.edit", "market.editAlbum", "market.editComment", "market.editOrder",
    "market.editProperty", "market.editPropertyVariant", "market.get",
    "market.getAlbumById", "market.getAlbums", "market.getById", "market.getCategories",
    "market.getComments", "market.getGroupOrders", "market.getOrderById",
    "market.getOrderItems", "market.getOrders", "market.getProductPhotoUploadServer",
    "market.getProperties", "market.groupItems", "market.removeFromAlbum",
    "market.reorderAlbums", "market.reorderItems", "market.report", "market.reportComment",
    "market.restore", "market.restoreComment", "market.saveProductPhoto",
    "market.saveProductPhotoBulk", "market.search", "market.searchItems",
    "market.searchItemsBasic", "market.ungroupItems",
    # Messages
    "messages.addChatUser", "messages.allowMessagesFromGroup", "messages.createChat",
    "messages.delete", "messages.deleteChatPhoto", "messages.deleteConversation",
    "messages.deleteReaction", "messages.denyMessagesFromGroup", "messages.edit",
    "messages.editChat", "messages.forceCallFinish", "messages.getByConversationMessageId",
    "messages.getById", "messages.getChat", "messages.getChatPreview",
    "messages.getConversationMembers", "messages.getConversations",
    "messages.getConversationsById", "messages.getHistory", "messages.getHistoryAttachments",
    "messages.getImportantMessages", "messages.getInviteLink", "messages.getLastActivity",
    "messages.getLongPollHistory", "messages.getLongPollServer",
    "messages.getMessagesReactions", "messages.getReactedPeers",
    "messages.getReactionsAssets", "messages.isMessagesFromGroupAllowed",
    "messages.joinChatByInviteLink", "messages.markAsAnsweredConversation",
    "messages.markAsImportant", "messages.markAsImportantConversation",
    "messages.markAsRead", "messages.markReactionsAsRead", "messages.pin",
    "messages.removeChatUser", "messages.restore", "messages.search",
    "messages.searchConversations", "messages.send", "messages.sendMessageEventAnswer",
    "messages.sendReaction", "messages.setActivity", "messages.setChatPhoto",
    "messages.startCall", "messages.unpin",
    # Newsfeed
    "newsfeed.get", "newsfeed.getBanned", "newsfeed.getComments", "newsfeed.getMentions",
    "newsfeed.getRecommended", "newsfeed.getSuggestedSources", "newsfeed.search",
    # Notifications
    "notifications.get", "notifications.sendMessage",
    # Orders
    "orders.cancelSubscription", "orders.changeState", "orders.get", "orders.getAmount",
    "orders.getById", "orders.getUserSubscriptionById", "orders.getUserSubscriptions",
    # Pages
    "pages.clearCache", "pages.get", "pages.getHistory", "pages.getTitles",
    "pages.getVersion", "pages.parseWiki", "pages.save", "pages.saveAccess",
    # Photos
    "photos.copy", "photos.createAlbum", "photos.createComment", "photos.delete",
    "photos.deleteAlbum", "photos.deleteComment", "photos.edit", "photos.editAlbum",
    "photos.editComment", "photos.get", "photos.getAlbums", "photos.getAlbumsCount",
    "photos.getAll", "photos.getAllComments", "photos.getById", "photos.getChatUploadServer",
    "photos.getComments", "photos.getMarketAlbumUploadServer", "photos.getMessagesUploadServer",
    "photos.getOwnerCoverPhotoUploadServer", "photos.getOwnerPhotoUploadServer",
    "photos.getUploadServer", "photos.getUserPhotos", "photos.getWallUploadServer",
    "photos.makeCover", "photos.move", "photos.reorderAlbums", "photos.reorderPhotos",
    "photos.report", "photos.reportComment", "photos.restore", "photos.restoreComment",
    "photos.save", "photos.saveMarketAlbumPhoto", "photos.saveMessagesPhoto",
    "photos.saveOwnerCoverPhoto", "photos.saveOwnerPhoto", "photos.saveWallPhoto",
    "photos.search",
    # Podcasts
    "podcasts.searchPodcast",
    # Polls
    "polls.create", "polls.edit", "polls.getBackgrounds", "polls.getById",
    "polls.getPhotoUploadServer", "polls.getVoters", "polls.savePhoto",
    # PrettyCards
    "prettyCards.create", "prettyCards.delete", "prettyCards.edit", "prettyCards.get",
    "prettyCards.getById", "prettyCards.getUploadURL",
    # Search
    "search.getHints",
    # Secure
    "secure.addAppEvent", "secure.checkToken", "secure.getAppBalance",
    "secure.getTransactionsHistory", "secure.getUserLevel", "secure.giveEventSticker",
    "secure.sendNotification", "secure.setCounter",
    # Stats
    "stats.get", "stats.getPostReach", "stats.trackVisitor",
    # Status
    "status.get",
    # Storage
    "storage.get", "storage.getKeys", "storage.set",
    # Store
    "store.addStickersToFavorite", "store.getFavoriteStickers", "store.getProducts",
    "store.getStickersKeywords", "store.removeStickersFromFavorite",
    # Stories
    "stories.banOwner", "stories.delete", "stories.get", "stories.getBanned",
    "stories.getById", "stories.getPhotoUploadServer", "stories.getReplies",
    "stories.getStats", "stories.getVideoUploadServer", "stories.getViewers",
    "stories.hideAllReplies", "stories.hideReply", "stories.save", "stories.search",
    "stories.sendInteraction", "stories.unbanOwner",
    # Translations
    "translations.translate",
    # Users
    "users.get", "users.getFollowers", "users.getSubscriptions", "users.search",
    # Utils
    "utils.checkLink", "utils.deleteFromLastShortened", "utils.getLastShortenedLinks",
    "utils.getLinkStats", "utils.getServerTime", "utils.getShortLink",
    "utils.resolveScreenName",
    # Video
    "video.add", "video.addAlbum", "video.addToAlbum", "video.createComment",
    "video.delete", "video.deleteAlbum", "video.deleteComment", "video.edit",
    "video.editAlbum", "video.editComment", "video.get", "video.getAlbumById",
    "video.getAlbums", "video.getAlbumsByVideo", "video.getComments",
    "video.getLongPollServer", "video.getOembed", "video.getPublicSectionFeed",
    "video.getThumbUploadUrl", "video.liveGetCategories", "video.removeFromAlbum",
    "video.reorderAlbums", "video.reorderVideos", "video.report", "video.reportComment",
    "video.restore", "video.restoreComment", "video.save", "video.saveUploadedThumb",
    "video.search", "video.startStreaming", "video.stopStreaming",
    # Wall
    "wall.closeComments", "wall.createComment", "wall.delete", "wall.deleteComment",
    "wall.edit", "wall.editAdsStealth", "wall.editComment", "wall.get", "wall.getById",
    "wall.getComment", "wall.getComments", "wall.getReposts", "wall.openComments",
    "wall.parseAttachedLink", "wall.pin", "wall.post", "wall.postAdsStealth",
    "wall.reportComment", "wall.reportPost", "wall.repost", "wall.restore",
    "wall.restoreComment", "wall.search", "wall.unpin",
    # Widgets
    "widgets.getComments", "widgets.getPages",
]


def create_driver() -> webdriver.Chrome:
    """
    Создаёт настроенный экземпляр Chrome WebDriver.
    
    Returns:
        Настроенный WebDriver
    """
    options = Options()
    options.add_argument("--headless")  # Без графического интерфейса
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    # Отключаем логи
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument("--log-level=3")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    return driver


def extract_token_types_from_page(driver: webdriver.Chrome, method_name: str) -> Dict[str, bool]:
    """
    Извлекает типы токенов со страницы метода.
    
    Args:
        driver: WebDriver
        method_name: Название метода
        
    Returns:
        Словарь с поддерживаемыми типами токенов
    """
    result = {
        "user_token": False,
        "community_token": False,
        "service_token": False
    }
    
    method_url = f"{BASE_URL}/ru/method/{method_name}"
    
    try:
        driver.get(method_url)
        
        # Ждём загрузки контента (максимум 10 секунд)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Даём странице время на полный рендеринг
        time.sleep(1.5)
        
        # Получаем текст страницы
        page_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        
        # Ищем ключевые слова для каждого типа токена
        for token_type, keywords in TOKEN_KEYWORDS.items():
            for keyword in keywords:
                if keyword.lower() in page_text:
                    result[token_type] = True
                    break
        
        logger.info(f"✓ {method_name}: user={result['user_token']}, community={result['community_token']}, service={result['service_token']}")
        
    except TimeoutException:
        logger.warning(f"⚠ Таймаут при загрузке {method_name}")
    except WebDriverException as e:
        logger.error(f"✗ Ошибка WebDriver для {method_name}: {e}")
    except Exception as e:
        logger.error(f"✗ Ошибка при обработке {method_name}: {e}")
    
    return result


def process_methods_batch(methods: List[str]) -> List[Dict]:
    """
    Обрабатывает пакет методов в одном браузере.
    
    Args:
        methods: Список методов для обработки
        
    Returns:
        Список результатов
    """
    results = []
    driver = None
    
    try:
        driver = create_driver()
        
        for method_name in methods:
            tokens = extract_token_types_from_page(driver, method_name)
            results.append({
                "name": method_name,
                "url": f"{BASE_URL}/ru/method/{method_name}",
                "tokens": tokens
            })
            
    except Exception as e:
        logger.error(f"Ошибка в пакете: {e}")
    finally:
        if driver:
            driver.quit()
    
    return results


def scrape_all_methods() -> List[Dict]:
    """
    Парсит все методы VK API с использованием нескольких браузеров.
    
    Returns:
        Список информации о методах
    """
    logger.info(f"Начало парсинга {len(ALL_METHODS)} методов VK API...")
    
    # Разбиваем методы на пакеты для параллельной обработки
    batch_size = len(ALL_METHODS) // MAX_WORKERS + 1
    batches = [ALL_METHODS[i:i + batch_size] for i in range(0, len(ALL_METHODS), batch_size)]
    
    all_results = []
    
    # Используем ThreadPoolExecutor для параллельной работы
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_methods_batch, batch): i for i, batch in enumerate(batches)}
        
        for future in as_completed(futures):
            batch_num = futures[future]
            try:
                results = future.result()
                all_results.extend(results)
                logger.info(f"Пакет {batch_num + 1}/{len(batches)} завершён ({len(results)} методов)")
            except Exception as e:
                logger.error(f"Ошибка в пакете {batch_num + 1}: {e}")
    
    return all_results


def group_methods_by_token_type(methods: List[Dict]) -> Dict[str, List[str]]:
    """
    Группирует методы по типам поддерживаемых токенов.
    
    Args:
        methods: Список информации о методах
        
    Returns:
        Словарь с методами, сгруппированными по типам токенов
    """
    grouped = {
        "user_token": [],      # Методы, работающие с токеном пользователя
        "community_token": [], # Методы, работающие с токеном сообщества
        "service_token": [],   # Методы, работающие с сервисным токеном
        "no_token_info": []    # Методы, для которых не найдена информация о токенах
    }
    
    for method in methods:
        name = method["name"]
        tokens = method["tokens"]
        
        has_any_token = False
        
        if tokens["user_token"]:
            grouped["user_token"].append(name)
            has_any_token = True
        
        if tokens["community_token"]:
            grouped["community_token"].append(name)
            has_any_token = True
        
        if tokens["service_token"]:
            grouped["service_token"].append(name)
            has_any_token = True
        
        if not has_any_token:
            grouped["no_token_info"].append(name)
    
    # Сортируем списки
    for key in grouped:
        grouped[key].sort()
    
    return grouped


def create_report(methods: List[Dict], grouped: Dict[str, List[str]]) -> Dict:
    """
    Создаёт итоговый отчёт.
    
    Args:
        methods: Полный список методов с информацией
        grouped: Методы, сгруппированные по токенам
        
    Returns:
        Полный отчёт
    """
    report = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "total_methods": len(methods),
            "source_url": METHODS_URL
        },
        "summary": {
            "user_token_count": len(grouped["user_token"]),
            "community_token_count": len(grouped["community_token"]),
            "service_token_count": len(grouped["service_token"]),
            "no_token_info_count": len(grouped["no_token_info"])
        },
        "methods_by_token_type": {
            "user_token": {
                "description": "Методы, которые можно вызывать с ключом доступа пользователя",
                "count": len(grouped["user_token"]),
                "methods": grouped["user_token"]
            },
            "community_token": {
                "description": "Методы, которые можно вызывать с ключом доступа сообщества",
                "count": len(grouped["community_token"]),
                "methods": grouped["community_token"]
            },
            "service_token": {
                "description": "Методы, которые можно вызывать с сервисным ключом доступа",
                "count": len(grouped["service_token"]),
                "methods": grouped["service_token"]
            },
            "no_token_info": {
                "description": "Методы, для которых не удалось определить тип токена",
                "count": len(grouped["no_token_info"]),
                "methods": grouped["no_token_info"]
            }
        },
        "all_methods": methods
    }
    
    return report


def save_report(report: Dict, filename: str = "vk_api_methods_tokens.json"):
    """
    Сохраняет отчёт в JSON-файл.
    
    Args:
        report: Отчёт для сохранения
        filename: Имя файла
    """
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Отчёт сохранён в {filename}")


def print_summary(grouped: Dict[str, List[str]]):
    """
    Выводит краткую сводку в консоль.
    
    Args:
        grouped: Методы, сгруппированные по токенам
    """
    print("\n" + "=" * 60)
    print("СВОДКА ПО МЕТОДАМ VK API И ТИПАМ ТОКЕНОВ")
    print("=" * 60)
    
    print(f"\n📱 Токен пользователя ({len(grouped['user_token'])} методов):")
    print("-" * 40)
    if grouped['user_token']:
        for method in grouped['user_token'][:10]:
            print(f"  • {method}")
        if len(grouped['user_token']) > 10:
            print(f"  ... и ещё {len(grouped['user_token']) - 10} методов")
    
    print(f"\n👥 Токен сообщества ({len(grouped['community_token'])} методов):")
    print("-" * 40)
    if grouped['community_token']:
        for method in grouped['community_token'][:10]:
            print(f"  • {method}")
        if len(grouped['community_token']) > 10:
            print(f"  ... и ещё {len(grouped['community_token']) - 10} методов")
    
    print(f"\n🔑 Сервисный ключ ({len(grouped['service_token'])} методов):")
    print("-" * 40)
    if grouped['service_token']:
        for method in grouped['service_token'][:10]:
            print(f"  • {method}")
        if len(grouped['service_token']) > 10:
            print(f"  ... и ещё {len(grouped['service_token']) - 10} методов")
    
    if grouped['no_token_info']:
        print(f"\n⚠️ Без информации о токенах ({len(grouped['no_token_info'])} методов):")
        print("-" * 40)
        for method in grouped['no_token_info'][:5]:
            print(f"  • {method}")
        if len(grouped['no_token_info']) > 5:
            print(f"  ... и ещё {len(grouped['no_token_info']) - 5} методов")
    
    print("\n" + "=" * 60)
    print("Полный отчёт сохранён в vk_api_methods_tokens.json")
    print("=" * 60 + "\n")


def main():
    """
    Главная точка входа.
    """
    try:
        # Парсим методы
        methods = scrape_all_methods()
        
        if not methods:
            logger.error("Не удалось получить данные о методах")
            return
        
        # Группируем по типам токенов
        grouped = group_methods_by_token_type(methods)
        
        # Создаём и сохраняем отчёт
        report = create_report(methods, grouped)
        save_report(report)
        
        # Выводим сводку
        print_summary(grouped)
        
    except Exception as e:
        logger.error(f"Критическая ошибка: {e}")
        raise


if __name__ == "__main__":
    main()
