
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from typing import List
from datetime import datetime

from schemas.automations import ReviewContestSettings, PromoCodeResponse, CreatePromoCodesPayload, DeletePromoCodePayload, DeleteBulkPromoCodesPayload, UpdatePromoCodePayload, ContestEntryResponse, ContestDeliveryLogResponse, RetryDeliveryPayload, BlacklistEntryResponse, AddBlacklistPayload, DeleteBlacklistPayload
from schemas import ProjectIdPayload, GenericSuccess, FinalizeContestResponse
import services.automations.reviews.crud as crud_automations
import crud # Импортируем общий crud для получения проекта
from database import SessionLocal
import services.automations.reviews.scheduler as contest_scheduler
import services.automations.reviews.service as contest_service
from services.automations.reviews.finalizer import retry_delivery, retry_delivery_all

router = APIRouter(prefix="/automations", tags=["Automations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/reviews/getSettings", response_model=ReviewContestSettings)
def get_reviews_settings(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    contest = crud_automations.get_contest_settings(db, payload.projectId)
    
    if not contest:
        project = crud.get_project_by_id(db, payload.projectId)
        short_name = project.vkGroupShortName if project else "club"
        
        return ReviewContestSettings(
            projectId=payload.projectId,
            isActive=False,
            keywords=f"#отзыв@{short_name}",
            startDate=datetime.now().strftime("%Y-%m-%d"),
            finishCondition="date",
            targetCount=10,
            finishDate="",
            finishDayOfWeek=1,
            finishTime="10:00",
            templateComment="Спасибо за отзыв! Ваш номер участника: {number}. Желаем удачи!",
            templateWinnerPost="Поздравляем победителей!\n\n{winners_list}\n\nСпасибо всем за участие!",
            templateDm="Поздравляем! Вы выиграли в конкурсе отзывов.\nВаш приз: {description}\nВаш промокод: {promo_code}",
            templateErrorComment="{user_name}, поздравляем с победой!\n\nНе смогли прислать вам промокод в сообщениях сообщества, возможно вы еще нам не писали или запретили присылать сообщения от лица сообщества.\n\nНапишите нам в сообщения сообщества или разрешите получать сообщения, чтобы забрать приз!",
            winnerPostImages=[]
        )
    
    return ReviewContestSettings(
        projectId=contest.project_id,
        isActive=contest.is_active,
        keywords=contest.keywords or "",
        startDate=contest.start_date or "",
        finishCondition=contest.finish_condition or "date",
        targetCount=contest.target_count,
        finishDate=contest.finish_date,
        finishDayOfWeek=contest.finish_day_of_week,
        finishTime=contest.finish_time,
        templateComment=contest.template_comment or "",
        templateWinnerPost=contest.template_winner_post or "",
        winnerPostImages=json.loads(contest.winner_post_images) if contest.winner_post_images else [],
        templateDm=contest.template_dm or "",
        templateErrorComment=contest.template_error_comment or ""
    )

@router.post("/reviews/saveSettings", response_model=ReviewContestSettings)
def save_reviews_settings(payload: ReviewContestSettings, db: Session = Depends(get_db)):
    contest = crud_automations.upsert_contest_settings(db, payload)
    contest_scheduler.sync_contest_post(db, payload)
    
    return ReviewContestSettings(
        projectId=contest.project_id,
        isActive=contest.is_active,
        keywords=contest.keywords or "",
        startDate=contest.start_date or "",
        finishCondition=contest.finish_condition or "date",
        targetCount=contest.target_count,
        finishDate=contest.finish_date,
        finishDayOfWeek=contest.finish_day_of_week,
        finishTime=contest.finish_time,
        templateComment=contest.template_comment or "",
        templateWinnerPost=contest.template_winner_post or "",
        winnerPostImages=json.loads(contest.winner_post_images) if contest.winner_post_images else [],
        templateDm=contest.template_dm or "",
        templateErrorComment=contest.template_error_comment or ""
    )

@router.post("/reviews/collectPosts", response_model=GenericSuccess)
def collect_reviews_posts(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    result = contest_service.collect_participants(db, payload.projectId)
    print(f"Collect result: {result}")
    return {"success": True}

@router.post("/reviews/processEntries", response_model=GenericSuccess)
def process_reviews_entries(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    result = contest_service.process_new_participants(db, payload.projectId)
    print(f"Process result: {result}")
    return {"success": True}

@router.post("/reviews/finalize", response_model=FinalizeContestResponse)
def finalize_reviews_contest(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return contest_service.finalize_contest(db, payload.projectId)

@router.post("/reviews/getEntries", response_model=List[ContestEntryResponse])
def get_reviews_entries(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return contest_service.get_contest_entries(db, payload.projectId)

@router.post("/reviews/clearEntries", response_model=GenericSuccess)
def clear_reviews_entries(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    contest_service.clear_contest_entries(db, payload.projectId)
    return {"success": True}


# --- Promocodes Endpoints ---

@router.post("/reviews/promocodes/get", response_model=List[PromoCodeResponse])
def get_promocodes(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return crud_automations.get_promocodes(db, payload.projectId)

@router.post("/reviews/promocodes/add", response_model=GenericSuccess)
def add_promocodes(payload: CreatePromoCodesPayload, db: Session = Depends(get_db)):
    crud_automations.bulk_create_promocodes(db, payload.projectId, payload.codes)
    return {"success": True}

@router.post("/reviews/promocodes/delete", response_model=GenericSuccess)
def delete_promocode(payload: DeletePromoCodePayload, db: Session = Depends(get_db)):
    crud_automations.delete_promocode(db, payload.promoId)
    return {"success": True}

@router.post("/reviews/promocodes/deleteBulk", response_model=GenericSuccess)
def delete_promocodes_bulk(payload: DeleteBulkPromoCodesPayload, db: Session = Depends(get_db)):
    crud_automations.delete_promocodes_bulk(db, payload.promoIds)
    return {"success": True}

@router.post("/reviews/promocodes/clear", response_model=GenericSuccess)
def clear_promocodes(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    crud_automations.delete_all_promocodes(db, payload.projectId)
    return {"success": True}

@router.post("/reviews/promocodes/update", response_model=GenericSuccess)
def update_promocode(payload: UpdatePromoCodePayload, db: Session = Depends(get_db)):
    updated = crud_automations.update_promocode_description(db, payload.id, payload.description)
    if not updated:
        raise HTTPException(status_code=404, detail="Promo code not found")
    return {"success": True}

# --- Delivery Logs Endpoints ---

@router.post("/reviews/delivery/get", response_model=List[ContestDeliveryLogResponse])
def get_delivery_logs(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return crud_automations.get_delivery_logs(db, payload.projectId)

@router.post("/reviews/delivery/clear", response_model=GenericSuccess)
def clear_delivery_logs(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    crud_automations.clear_delivery_logs(db, payload.projectId)
    return {"success": True}

@router.post("/reviews/promocodes/retry", response_model=GenericSuccess)
def retry_promocode_delivery(payload: RetryDeliveryPayload, db: Session = Depends(get_db)):
    retry_delivery(db, payload.logId)
    return {"success": True}

@router.post("/reviews/promocodes/retryAll", response_model=GenericSuccess)
def retry_promocode_delivery_all(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    result = retry_delivery_all(db, payload.projectId)
    return {"success": True}

# --- Blacklist Endpoints ---

@router.post("/reviews/blacklist/get", response_model=List[BlacklistEntryResponse])
def get_blacklist(payload: ProjectIdPayload, db: Session = Depends(get_db)):
    return crud_automations.get_blacklist(db, payload.projectId)

@router.post("/reviews/blacklist/add", response_model=GenericSuccess)
def add_blacklist(payload: AddBlacklistPayload, db: Session = Depends(get_db)):
    count = contest_service.add_blacklist_users(db, payload.projectId, payload.urls, payload.untilDate)
    return {"success": True}

@router.post("/reviews/blacklist/delete", response_model=GenericSuccess)
def delete_blacklist(payload: DeleteBlacklistPayload, db: Session = Depends(get_db)):
    crud_automations.delete_from_blacklist(db, payload.itemId)
    return {"success": True}
