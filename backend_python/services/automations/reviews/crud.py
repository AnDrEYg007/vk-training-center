
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
import json
import uuid
from typing import List, Dict
from datetime import datetime, timezone
import models
from schemas.automations import ReviewContestSettings, PromoCodeBase

def get_contest_settings(db: Session, project_id: str) -> models.ReviewContest:
    return db.query(models.ReviewContest).filter(models.ReviewContest.project_id == project_id).first()

def get_all_contest_statuses(db: Session) -> Dict[str, dict]:
    """
    Возвращает словарь {project_id: {isActive, promoCount}} для всех конкурсов.
    Считает количество НЕ выданных (is_issued=False) промокодов.
    """
    results = db.query(
        models.ReviewContest.project_id,
        models.ReviewContest.is_active,
        func.count(models.PromoCode.id)
    ).outerjoin(
        models.PromoCode,
        and_(
            models.PromoCode.contest_id == models.ReviewContest.id,
            models.PromoCode.is_issued == False
        )
    ).group_by(models.ReviewContest.id).all()
    
    return {row[0]: {"isActive": row[1], "promoCount": row[2]} for row in results}

def get_contest_settings_by_id(db: Session, contest_id: str) -> models.ReviewContest:
    """Получает настройки конкурса по его ID."""
    return db.query(models.ReviewContest).filter(models.ReviewContest.id == contest_id).first()

def upsert_contest_settings(db: Session, settings: ReviewContestSettings) -> models.ReviewContest:
    contest = get_contest_settings(db, settings.projectId)
    
    images_json = json.dumps([img.model_dump() for img in settings.winnerPostImages])
    
    if not contest:
        contest = models.ReviewContest(
            id=str(uuid.uuid4()),
            project_id=settings.projectId
        )
        db.add(contest)
    
    # Обновляем поля
    contest.is_active = settings.isActive
    contest.keywords = settings.keywords
    contest.start_date = settings.startDate
    
    contest.finish_condition = settings.finishCondition
    contest.target_count = settings.targetCount
    contest.finish_date = settings.finishDate
    contest.finish_day_of_week = settings.finishDayOfWeek
    contest.finish_time = settings.finishTime
    
    contest.auto_blacklist = settings.autoBlacklist
    contest.auto_blacklist_duration = settings.autoBlacklistDuration
    
    contest.template_comment = settings.templateComment
    contest.template_winner_post = settings.templateWinnerPost
    contest.winner_post_images = images_json
    contest.template_dm = settings.templateDm
    contest.template_error_comment = settings.templateErrorComment
    
    db.commit()
    db.refresh(contest)
    return contest

def delete_contest_entries(db: Session, project_id: str):
    """Удаляет всех участников конкурса для проекта."""
    contest = get_contest_settings(db, project_id)
    if contest:
        db.query(models.ReviewContestEntry).filter(
            models.ReviewContestEntry.contest_id == contest.id
        ).delete(synchronize_session=False)
        db.commit()

# --- Promo Codes CRUD ---

def get_promocodes(db: Session, project_id: str) -> List[models.PromoCode]:
    contest = get_contest_settings(db, project_id)
    if not contest:
        return []
    
    return db.query(models.PromoCode)\
        .filter(models.PromoCode.contest_id == contest.id)\
        .order_by(models.PromoCode.is_issued.asc(), models.PromoCode.created_at.desc())\
        .all()

def bulk_create_promocodes(db: Session, project_id: str, codes: List[PromoCodeBase]):
    contest = get_contest_settings(db, project_id)
    
    # Если конкурса нет, создаем его (неактивным), чтобы было куда привязать коды
    if not contest:
        contest = models.ReviewContest(
            id=str(uuid.uuid4()),
            project_id=project_id,
            is_active=False
        )
        db.add(contest)
        db.commit()
        db.refresh(contest)
    
    new_records = []
    for item in codes:
        new_records.append(models.PromoCode(
            id=str(uuid.uuid4()),
            contest_id=contest.id,
            code=item.code,
            description=item.description,
            is_issued=False
        ))
    
    if new_records:
        db.bulk_save_objects(new_records)
        db.commit()

def delete_promocode(db: Session, promo_id: str) -> bool:
    count = db.query(models.PromoCode).filter(models.PromoCode.id == promo_id).delete()
    db.commit()
    return count > 0

def delete_promocodes_bulk(db: Session, promo_ids: List[str]) -> int:
    count = db.query(models.PromoCode).filter(models.PromoCode.id.in_(promo_ids)).delete(synchronize_session=False)
    db.commit()
    return count

def delete_all_promocodes(db: Session, project_id: str):
    """Удаляет ВСЕ промокоды конкурса."""
    contest = get_contest_settings(db, project_id)
    if contest:
        db.query(models.PromoCode).filter(
            models.PromoCode.contest_id == contest.id
        ).delete(synchronize_session=False)
        db.commit()

def update_promocode_description(db: Session, promo_id: str, description: str) -> models.PromoCode:
    promo = db.query(models.PromoCode).filter(models.PromoCode.id == promo_id).first()
    if promo:
        promo.description = description
        db.commit()
        db.refresh(promo)
    return promo

# --- Delivery Logs CRUD ---

def create_delivery_log(db: Session, log_data: dict) -> models.ReviewContestDeliveryLog:
    db_log = models.ReviewContestDeliveryLog(
        id=str(uuid.uuid4()),
        **log_data
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_delivery_logs(db: Session, project_id: str) -> List[models.ReviewContestDeliveryLog]:
    contest = get_contest_settings(db, project_id)
    if not contest:
        return []
        
    return db.query(models.ReviewContestDeliveryLog)\
        .filter(models.ReviewContestDeliveryLog.contest_id == contest.id)\
        .order_by(models.ReviewContestDeliveryLog.created_at.desc())\
        .all()

def clear_delivery_logs(db: Session, project_id: str):
    contest = get_contest_settings(db, project_id)
    if contest:
        db.query(models.ReviewContestDeliveryLog).filter(
            models.ReviewContestDeliveryLog.contest_id == contest.id
        ).delete(synchronize_session=False)
        db.commit()

def get_delivery_log_by_id(db: Session, log_id: str) -> models.ReviewContestDeliveryLog:
    return db.query(models.ReviewContestDeliveryLog).filter(models.ReviewContestDeliveryLog.id == log_id).first()

def update_delivery_log_status(db: Session, log_id: str, status: str, error_details: str = None):
    log = get_delivery_log_by_id(db, log_id)
    if log:
        log.status = status
        log.error_details = error_details
        db.commit()

# --- Blacklist CRUD ---

def get_blacklist(db: Session, project_id: str) -> List[models.ReviewContestBlacklist]:
    """Возвращает актуальный черный список."""
    contest = get_contest_settings(db, project_id)
    if not contest:
        return []
    
    return db.query(models.ReviewContestBlacklist)\
        .filter(models.ReviewContestBlacklist.contest_id == contest.id)\
        .order_by(models.ReviewContestBlacklist.created_at.desc())\
        .all()

def add_to_blacklist(db: Session, contest_id: str, users_data: List[Dict], until_date: datetime = None):
    """
    Добавляет пользователей в черный список.
    users_data: [{id: 123, name: '...', screen_name: '...'}, ...]
    """
    for user in users_data:
        # Проверяем, есть ли уже этот пользователь в ЧС этого конкурса
        existing = db.query(models.ReviewContestBlacklist).filter(
            models.ReviewContestBlacklist.contest_id == contest_id,
            models.ReviewContestBlacklist.user_vk_id == user['id']
        ).first()

        if existing:
            # Обновляем срок бана
            existing.until_date = until_date
            existing.user_name = user.get('name')
            existing.user_screen_name = user.get('screen_name')
        else:
            # Создаем новую запись
            new_entry = models.ReviewContestBlacklist(
                id=str(uuid.uuid4()),
                contest_id=contest_id,
                user_vk_id=user['id'],
                user_name=user.get('name'),
                user_screen_name=user.get('screen_name'),
                until_date=until_date
            )
            db.add(new_entry)
            
    db.commit()

def delete_from_blacklist(db: Session, item_id: str):
    db.query(models.ReviewContestBlacklist).filter(models.ReviewContestBlacklist.id == item_id).delete()
    db.commit()

def cleanup_expired_blacklist(db: Session, contest_id: str) -> int:
    """Удаляет записи с истекшим сроком действия."""
    now = datetime.now(timezone.utc)
    deleted_count = db.query(models.ReviewContestBlacklist).filter(
        models.ReviewContestBlacklist.contest_id == contest_id,
        models.ReviewContestBlacklist.until_date.isnot(None),
        models.ReviewContestBlacklist.until_date < now
    ).delete(synchronize_session=False)
    
    db.commit()
    return deleted_count

def get_active_blacklist_user_ids(db: Session, contest_id: str) -> List[int]:
    """Возвращает список ID пользователей, находящихся в активном бане."""
    # При финализации мы уже запустили cleanup, так что просто берем всех оставшихся
    results = db.query(models.ReviewContestBlacklist.user_vk_id).filter(
        models.ReviewContestBlacklist.contest_id == contest_id
    ).all()
    return [r[0] for r in results]
