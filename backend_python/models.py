
# Этот файл выступает в роли единой точки входа (хаба) для всех моделей SQLAlchemy.
# Он импортирует Base и все модели из подмодулей в `models_library`.
# Это обеспечивает совместимость с существующим кодом, который делает `import models`.

from database import Base

# Импорт ассоциативных таблиц
from models_library.associations import (
    published_post_tags_association,
    scheduled_post_tags_association
)

# Импорт моделей
from models_library.projects import Project, User, ProjectContextField, ProjectContextValue, ProjectContextFieldVisibility
from models_library.tags import Tag
from models_library.posts import Post, ScheduledPost, SystemPost, SuggestedPost, Note
from models_library.media import Album, Photo
from models_library.settings import AiPromptPreset, GlobalVariableDefinition, ProjectGlobalVariableValue
from models_library.market import MarketCategory, MarketAlbum, MarketItem
from models_library.lists import (
    ProjectListMeta,
    SystemListSubscriber,
    SystemListHistoryJoin,
    SystemListHistoryLeave,
    SystemListPost,
    SystemListLikes,
    SystemListComments,
    SystemListReposts,
    SystemListMailing,
    SystemListAuthor
)
# Обновленный импорт: SystemAccount и TokenLog теперь тоже живут в system.py вместе с SystemTask
from models_library.system import SystemAccount, TokenLog, SystemTask
# Новая модель AI токенов
from models_library.ai_tokens import AiToken, AiTokenLog
# Новая модель автоматизаций (Добавлен ReviewContestEntry и ReviewContestDeliveryLog и StoriesAutomation)
from models_library.automations import (
    ReviewContest, 
    PromoCode, 
    ReviewContestEntry, 
    ReviewContestDeliveryLog, 
    ReviewContestBlacklist,
    StoriesAutomation,
    StoriesAutomationLog
)
# NEW: Администрируемые группы
from models_library.admin_tools import AdministeredGroup
