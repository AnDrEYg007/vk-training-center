
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, time, timezone
import json
import uuid

import models
import schemas.automations
from services.post_helpers import get_rounded_timestamp

def calculate_next_run(day_of_week: int, time_str: str) -> str:
    """
    Рассчитывает дату следующего запуска.
    Входящие параметры трактуются по Московскому времени (UTC+3).
    day_of_week: 1 (Пн) - 7 (Вс)
    time_str: "HH:MM"
    """
    # 1. Получаем текущее время в UTC и переводим в МСК для расчетов
    now_utc = datetime.utcnow()
    now_msk = now_utc + timedelta(hours=3)
    
    try:
        hour, minute = map(int, time_str.split(':'))
    except:
        hour, minute = 10, 0

    # day_of_week в python: 0=Mon, 6=Sun. В настройках у нас 1=Mon, 7=Sun
    target_weekday = day_of_week - 1
    
    # Сравниваем с текущим днем недели по МСК
    today_weekday = now_msk.weekday()
    
    days_ahead = target_weekday - today_weekday
    
    target_time = time(hour, minute)
    
    # Если день прошел или сегодня, но время (по МСК) уже прошло
    if days_ahead < 0 or (days_ahead == 0 and now_msk.time() > target_time):
        days_ahead += 7
            
    # Формируем целевую дату в МСК
    next_date_msk = now_msk + timedelta(days=days_ahead)
    next_date_msk = next_date_msk.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    # 2. Конвертируем обратно в UTC для сохранения в базу данных (-3 часа)
    next_date_utc = next_date_msk - timedelta(hours=3)
    
    return next_date_utc.strftime('%Y-%m-%dT%H:%M:%S.000Z')

def sync_contest_post(db: Session, settings: schemas.automations.ReviewContestSettings):
    """
    Создает, обновляет или удаляет системный пост для конкурса отзывов.
    """
    # 1. Ищем существующий пост этого типа для этого проекта
    existing_post = db.query(models.SystemPost).filter(
        models.SystemPost.project_id == settings.projectId,
        models.SystemPost.post_type == 'contest_winner'
    ).first()

    # Если механика выключена или условие не по дате/смешанное - удаляем пост
    should_exist = settings.isActive and settings.finishCondition in ['date', 'mixed']

    if not should_exist:
        if existing_post:
            db.delete(existing_post)
            db.commit()
            print(f"CONTEST_SCHEDULER: Deleted system post for project {settings.projectId}")
        return

    # Если должен существовать - рассчитываем данные
    next_run_iso = calculate_next_run(settings.finishDayOfWeek or 1, settings.finishTime or "10:00")
    
    # Текст берем из шаблона
    display_text = settings.templateWinnerPost
    
    # Формируем JSON для картинок
    images_json = json.dumps([img.model_dump() for img in settings.winnerPostImages])

    if existing_post:
        # Обновляем
        existing_post.publication_date = next_run_iso
        existing_post.text = display_text
        existing_post.images = images_json
        # Обновляем параметры цикличности
        existing_post.is_cyclic = True
        existing_post.recurrence_interval = 1 
        existing_post.recurrence_type = 'weeks'
        
        # Сбрасываем статус, если он был error/done, чтобы он снова стал актуальным
        if existing_post.status != 'publishing':
            existing_post.status = 'pending_publication'
            
        print(f"CONTEST_SCHEDULER: Updated system post {existing_post.id} for project {settings.projectId}")
    else:
        # Создаем новый
        new_post = models.SystemPost(
            id=str(uuid.uuid4()),
            project_id=settings.projectId,
            publication_date=next_run_iso,
            text=display_text,
            images=images_json,
            attachments="[]",
            status='pending_publication',
            post_type='contest_winner', # ВАЖНО: Спец тип
            
            # Настраиваем цикличность: Еженедельно
            is_cyclic=True,
            recurrence_type='weeks',
            recurrence_interval=1,
            recurrence_end_type='infinite'
        )
        db.add(new_post)
        print(f"CONTEST_SCHEDULER: Created new system post {new_post.id} for project {settings.projectId}")

    db.commit()

def ensure_future_contest_posts(db: Session, project_id: str):
    """
    Проверяет посты автоматизаций (contest_winner).
    Если их время прошло, а они не опубликованы (так как игнорируются трекером),
    автоматически переносит их на следующий цикл (неделю вперед), чтобы в календаре
    они отображались в будущем.
    """
    now = datetime.now(timezone.utc)
    
    posts = db.query(models.SystemPost).filter(
        models.SystemPost.project_id == project_id,
        models.SystemPost.post_type == 'contest_winner',
        models.SystemPost.status == 'pending_publication'
    ).all()

    updates_count = 0
    for post in posts:
        try:
            # Парсим дату (предполагаем, что в БД она в UTC с суффиксом Z или без)
            date_str = post.publication_date.replace('Z', '+00:00')
            pub_date = datetime.fromisoformat(date_str)
            
            # Если дата в прошлом
            if pub_date < now:
                # Сдвигаем на недели вперед, пока не станет будущим
                # (предполагаем недельный цикл для конкурса отзывов)
                while pub_date < now:
                    pub_date += timedelta(weeks=1)
                
                new_date_iso = pub_date.strftime('%Y-%m-%dT%H:%M:%S.000Z')
                post.publication_date = new_date_iso
                updates_count += 1
                print(f"CONTEST_SCHEDULER: Auto-shifted past automation post {post.id} to {new_date_iso}")
        except Exception as e:
            print(f"CONTEST_SCHEDULER: Error checking/shifting post {post.id}: {e}")

    if updates_count > 0:
        db.commit()
