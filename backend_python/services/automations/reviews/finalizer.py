
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
import random
import json

import crud
import models
import services.automations.reviews.crud as crud_automations
from services import vk_service, global_variable_service
# Импортируем низкоуровневый клиент для прямого вызова без ротации
from services.vk_api.api_client import call_vk_api as raw_vk_call
from config import settings
# Импортируем сервис получения постов для обновления кеша
from services import post_retrieval_service

def finalize_contest(db: Session, project_id: str) -> dict:
    """
    Подводит итоги конкурса: выбирает победителя, отправляет приз, публикует пост.
    Возвращает dict с результатом. Если участников мало для условий 'mixed'/'count',
    возвращает {skipped: True}, не выбирая победителя.
    """
    contest = crud_automations.get_contest_settings(db, project_id)
    if not contest:
        raise HTTPException(404, "Contest settings not found")
        
    project = crud.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    # 1. Получаем подходящих участников (статус 'commented')
    # Это те, кто уже прошел проверку и получил номер
    all_participants = db.query(models.ReviewContestEntry).filter(
        models.ReviewContestEntry.contest_id == contest.id,
        models.ReviewContestEntry.status == 'commented'
    ).all()
    
    current_count = len(all_participants)
    target = contest.target_count or 0

    print(f"CONTEST ({project_id}): Finalizing. Found {current_count} active participants. Condition: {contest.finish_condition}. Target: {target}")

    # 2. Проверка условий завершения
    if contest.finish_condition == 'mixed':
        # Смешанный режим: День настал (раз мы здесь), но проверяем количество.
        if current_count < target:
            msg = f"Недостаточно участников для подведения итогов ({current_count} из {target}). Конкурс переносится на следующий цикл."
            print(f"CONTEST: {msg}")
            return {"success": True, "skipped": True, "message": msg, "winner_name": None, "post_link": None}
            
    elif contest.finish_condition == 'count':
        # Режим по количеству: Если запущено по расписанию, проверяем, достигли ли цели.
        if current_count < target:
            msg = f"Целевое количество участников не достигнуто ({current_count} из {target}). Ждем новых отзывов."
            print(f"CONTEST: {msg}")
            return {"success": True, "skipped": True, "message": msg, "winner_name": None, "post_link": None}
            
    # Для режима 'date' количество не проверяем (розыгрыш состоится при любом кол-ве > 0)
    
    if current_count == 0:
        # Если участников совсем нет, и это режим 'date', то тут уж ничего не поделаешь,
        # пропускаем, чтобы не постить пустой пост.
        return {"success": True, "skipped": True, "message": "Нет участников (0 принятых отзывов). Розыгрыш не состоялся.", "winner_name": None, "post_link": None}

    # --- ФИЛЬТРАЦИЯ ПО ЧЕРНОМУ СПИСКУ ---
    # 1. Очищаем просроченные баны
    expired_count = crud_automations.cleanup_expired_blacklist(db, contest.id)
    if expired_count > 0:
        print(f"CONTEST: Cleaned up {expired_count} expired blacklist entries.")
        
    # 2. Получаем актуальные ID из ЧС
    blacklisted_ids = set(crud_automations.get_active_blacklist_user_ids(db, contest.id))
    
    # 3. Фильтруем участников
    valid_participants = [p for p in all_participants if p.user_vk_id not in blacklisted_ids]
    
    print(f"CONTEST: Filtering by blacklist. Total: {len(all_participants)}, Blocked: {len(all_participants) - len(valid_participants)}, Valid: {len(valid_participants)}")
    
    if not valid_participants:
         msg = f"Все участники ({len(all_participants)}) находятся в черном списке. Нет валидных кандидатов для победы."
         return {"success": True, "skipped": True, "message": msg, "winner_name": None, "post_link": None}

    # 3. Выбор победителя (из отфильтрованного списка)
    winner = random.choice(valid_participants)
    print(f"CONTEST: Selected winner for {project_id}: {winner.user_name} (ID {winner.user_vk_id})")
    
    # 4. Получение свободного промокода
    promos = crud_automations.get_promocodes(db, project_id)
    promo = next((p for p in promos if not p.is_issued), None)
    
    if not promo:
        # Вот тут критическая ошибка, так как условия выполнены, но призов нет
        raise HTTPException(400, "Ошибка: В базе закончились свободные промокоды. Розыгрыш не может быть проведен.")

    # 5. Отправка сообщения (ЛС или Комментарий)
    token_to_use = project.communityToken
    if not token_to_use:
        raise HTTPException(400, "Ошибка: Не настроен токен сообщества. Отправка сообщений невозможна.")
        
    log_msg = []
    
    # Формируем текст ЛС
    dm_text = contest.template_dm\
        .replace('{promo_code}', promo.code)\
        .replace('{description}', promo.description or '')\
        .replace('{user_name}', winner.user_name)
    
    # Подстановка глобальных переменных в ЛС
    dm_text = global_variable_service.substitute_global_variables(db, dm_text, project_id)

    delivery_status = 'sent'
    error_details = None

    try:
        # СТРОГО ИСПОЛЬЗУЕМ ТОКЕН СООБЩЕСТВА через raw_vk_call
        raw_vk_call('messages.send', {
            'user_id': winner.user_vk_id,
            'message': dm_text,
            'random_id': int(datetime.now().timestamp() * 1000000),
            'access_token': token_to_use
        })
        log_msg.append("DM sent")
    except Exception as e:
        print(f"CONTEST: Failed to send DM to {winner.user_vk_id}: {e}")
        delivery_status = 'error'
        error_details = str(e)
        log_msg.append(f"DM failed: {e}")
        
        # Fallback: Комментарий под постом победителя
        try:
            # Формируем текст ошибки
            err_comment = contest.template_error_comment.replace('{user_name}', f"[id{winner.user_vk_id}|{winner.user_name}]")
            
            # Подстановка глобальных переменных в комментарий ошибки
            err_comment = global_variable_service.substitute_global_variables(db, err_comment, project_id)
            
            raw_vk_call('wall.createComment', {
                'owner_id': winner.vk_owner_id,
                'post_id': winner.vk_post_id,
                'message': err_comment,
                'from_group': 1, # Важно: от имени сообщества
                'access_token': token_to_use
            })
            log_msg.append("Fallback comment posted")
        except Exception as e2:
            print(f"CONTEST: Failed to post fallback comment: {e2}")
            log_msg.append(f"Error comment failed: {e2}")
            
    # СОХРАНЕНИЕ В ЖУРНАЛ ДОСТАВКИ
    delivery_log = crud_automations.create_delivery_log(db, {
        "contest_id": contest.id,
        "user_vk_id": winner.user_vk_id,
        "user_name": winner.user_name,
        "promo_code": promo.code,
        "prize_description": promo.description,
        "message_text": dm_text,
        "status": delivery_status,
        "error_details": error_details,
        "winner_post_link": winner.post_link
    })

    results_link = None

    # 6. Публикация поста с итогами на стене
    numeric_group_id = vk_service.resolve_vk_group_id(project.vkProjectId, settings.vk_user_token)
    
    try:
        # Формат: "1. Name (№X)"
        winners_list_str = f"1. [id{winner.user_vk_id}|{winner.user_name}] (№{winner.entry_number})"
        
        # Подстановка переменных в пост
        post_text = contest.template_winner_post\
            .replace('{winners_list}', winners_list_str)\
            .replace('{user_name}', winner.user_name)\
            .replace('{user_id}', str(winner.user_vk_id))\
            .replace('{post_link}', winner.post_link or "")\
            .replace('{promo_code}', promo.code)\
            .replace('{description}', promo.description or '')
        
        # Подстановка глобальных переменных в пост итогов
        post_text = global_variable_service.substitute_global_variables(db, post_text, project_id)
        
        # Вложения (картинки)
        images_data = json.loads(contest.winner_post_images) if contest.winner_post_images else []
        attachments_str = ",".join([img['id'] for img in images_data])
        
        published_post = vk_service.publish_with_fallback({
            'owner_id': -numeric_group_id,
            'message': post_text,
            'attachments': attachments_str,
            'from_group': 1
        }, method='wall.post', preferred_token=token_to_use)
        
        log_msg.append("Winner post published")
        
        # --- ОБНОВЛЕНИЕ ССЫЛКИ НА ИТОГИ В ЛОГЕ ---
        if published_post and 'post_id' in published_post:
            results_link = f"https://vk.com/wall-{numeric_group_id}_{published_post['post_id']}"
            delivery_log.results_post_link = results_link
            # Коммит будет в конце

        # ВАЖНО: После публикации обновляем кеш опубликованных постов
        try:
            post_retrieval_service.refresh_published_posts(db, project_id, settings.vk_user_token)
            log_msg.append("Cache updated")
        except Exception as cache_err:
            print(f"CONTEST: Failed to refresh published posts: {cache_err}")
            
    except Exception as e:
        log_msg.append(f"Winner post failed: {e}")

    # 7. Авто-бан победителя (Если включено)
    if contest.auto_blacklist:
        try:
            duration_days = contest.auto_blacklist_duration or 7
            ban_until = datetime.now(timezone.utc) + timedelta(days=duration_days)
            # Конец дня
            ban_until = ban_until.replace(hour=23, minute=59, second=59)
            
            user_data = [{
                'id': winner.user_vk_id,
                'name': winner.user_name,
                'screen_name': None # Не обязательно
            }]
            
            crud_automations.add_to_blacklist(db, contest.id, user_data, ban_until)
            log_msg.append(f"User auto-banned for {duration_days} days")
            print(f"CONTEST: Auto-blacklisted winner {winner.user_vk_id} until {ban_until}")
        except Exception as e:
            print(f"CONTEST: Failed to auto-blacklist winner: {e}")
            log_msg.append(f"Auto-ban failed: {e}")

    # 8. Обновление БД
    # Обновляем победителя
    winner.status = 'winner'
    winner.log = "; ".join(log_msg)
    
    # Обновляем промокод (только статус выдачи, история теперь отдельно)
    promo.is_issued = True
    promo.issued_at = datetime.now(timezone.utc)
    promo.issued_to_user_id = winner.user_vk_id
    promo.issued_to_user_name = winner.user_name
    
    # Обновляем статус остальных участников
    other_participants = [p for p in all_participants if p.id != winner.id]
    for p in other_participants:
        p.status = 'used' 
        
    db.commit()

    # 9. Обновляем метаданные списков (счетчик победителей)
    winners_count = db.query(models.ReviewContestEntry).filter(
        models.ReviewContestEntry.contest_id == contest.id,
        models.ReviewContestEntry.status == 'winner'
    ).count()
    
    crud.update_list_meta(db, project_id, {
        "reviews_winners_count": winners_count
    })
    
    return {
        "success": True, 
        "winner_name": winner.user_name, 
        "post_link": results_link,
        "log": log_msg, 
        "skipped": False
    }

def retry_delivery(db: Session, log_id: str) -> dict:
    """
    Повторная попытка отправки сообщения по ID лога.
    """
    log = crud_automations.get_delivery_log_by_id(db, log_id)
    if not log:
        raise HTTPException(404, "Log entry not found")
        
    if log.status != 'error':
        raise HTTPException(400, "Retry is available only for failed deliveries.")
        
    contest = crud_automations.get_contest_settings_by_id(db, log.contest_id)
    if not contest:
        raise HTTPException(404, "Contest not found")
        
    project = crud.get_project_by_id(db, contest.project_id)
    if not project or not project.communityToken:
        raise HTTPException(400, "Community token missing.")

    try:
        # Для повтора используем уже сохраненный текст сообщения из лога (в нем уже подставлены переменные)
        raw_vk_call('messages.send', {
            'user_id': log.user_vk_id,
            'message': log.message_text,
            'random_id': int(datetime.now().timestamp() * 1000000),
            'access_token': project.communityToken
        })
        
        # Обновляем статус при успехе
        log.status = 'sent'
        log.error_details = None
        db.commit()
        return {"success": True}
        
    except Exception as e:
        print(f"CONTEST: Retry delivery failed: {e}")
        # Обновляем ошибку
        log.error_details = str(e)
        db.commit()
        raise HTTPException(500, f"Retry failed: {str(e)}")

def retry_delivery_all(db: Session, project_id: str) -> dict:
    """
    Массовая повторная отправка сообщений для всех логов с ошибкой.
    """
    contest = crud_automations.get_contest_settings(db, project_id)
    if not contest:
        raise HTTPException(404, "Contest settings not found")
        
    project = crud.get_project_by_id(db, project_id)
    if not project or not project.communityToken:
        raise HTTPException(400, "Community token missing.")
        
    failed_logs = db.query(models.ReviewContestDeliveryLog).filter(
        models.ReviewContestDeliveryLog.contest_id == contest.id,
        models.ReviewContestDeliveryLog.status == 'error'
    ).all()
    
    if not failed_logs:
        return {"success": True, "processed": 0, "errors": 0}
    
    processed = 0
    errors = 0
    
    for log in failed_logs:
        try:
            raw_vk_call('messages.send', {
                'user_id': log.user_vk_id,
                'message': log.message_text,
                'random_id': int(datetime.now().timestamp() * 1000000),
                'access_token': project.communityToken
            })
            
            log.status = 'sent'
            log.error_details = None
            processed += 1
        except Exception as e:
            print(f"CONTEST: Retry delivery failed for log {log.id}: {e}")
            log.error_details = str(e)
            errors += 1
            
    db.commit()
    return {"success": True, "processed": processed, "errors": errors}
