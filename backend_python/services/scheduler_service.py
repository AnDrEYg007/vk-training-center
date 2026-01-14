
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import logging
from datetime import datetime

from database import redis_client
import services.post_tracker_service as post_tracker

# Настройка логгера
logging.basicConfig()
logging.getLogger('apscheduler').setLevel(logging.WARNING)

scheduler = BackgroundScheduler()

# Ключ блокировки в Redis для предотвращения гонки воркеров
LOCK_KEY = "vk_planner:tracker_lock"
LOCK_TTL = 55 # Чуть больше интервала запуска (50 сек)

def job_system_post_publisher():
    """
    Задача: Публикация и верификация системных постов.
    Запускается каждые 50 секунд.
    Использует Redis Lock, чтобы гарантировать выполнение только в одном процессе.
    """
    is_leader = False
    
    if redis_client:
        try:
            # Пытаемся захватить лидерство.
            # nx=True: установить только если ключа нет.
            # ex=LOCK_TTL: ключ сам исчезнет через 55 секунд.
            if redis_client.set(LOCK_KEY, "locked", nx=True, ex=LOCK_TTL):
                is_leader = True
                # print(f"SCHEDULER: Acquired lock at {datetime.now()}, running post tracker.")
        except Exception as e:
            print(f"SCHEDULER: Redis lock error: {e}. Skipping cycle.")
    else:
        # Если Redis не настроен (локальная разработка), считаем себя лидером.
        is_leader = True

    if is_leader:
        try:
            # Вызываем функции проверки из старого сервиса напрямую
            # Они сами создают и закрывают сессию БД, поэтому это безопасно
            post_tracker._publication_check()
            post_tracker._verification_check()
        except Exception as e:
            print(f"SCHEDULER ERROR (Post Tracker): {e}")

# --- ЗАПУСК ---

def start():
    """Инициализация и запуск планировщика."""
    
    # Добавляем задачу с интервалом 50 секунд
    scheduler.add_job(
        job_system_post_publisher,
        IntervalTrigger(seconds=50),
        id='system_post_tracker',
        replace_existing=True
    )

    scheduler.start()
    print("✅ APScheduler started (Post Tracker ONLY mode).")
