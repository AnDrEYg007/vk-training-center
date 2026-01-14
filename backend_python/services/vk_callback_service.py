
from sqlalchemy.orm import Session
from fastapi.responses import PlainTextResponse

import crud
import models
from schemas import VkCallbackRequest
from . import vk_service
from . import update_tracker
from .post_helpers import assign_tags_to_post
from .post_retrieval_service import refresh_suggested_posts, refresh_scheduled_posts
# Импортируем сервис автоматизации
import services.automations.reviews.service as contest_service
import services.automations.reviews.crud as crud_automations
from config import settings

def _handle_confirmation_callback(db: Session, request: VkCallbackRequest) -> PlainTextResponse:
    project = crud.get_project_by_vk_id(db, request.group_id)
    if not project or not project.vk_confirmation_code:
        print(f"Confirmation failed: Project for group_id {request.group_id} or confirmation code not found.")
        return PlainTextResponse(content='ok')
    print(f"Confirmation successful for project '{project.name}'.")
    return PlainTextResponse(content=project.vk_confirmation_code)

def _handle_wall_post_new_callback(db: Session, project: models.Project, post_data: dict):
    if post_data.get('post_type') == 'suggest':
        try:
            print(f"Callback 'wall_post_new' (suggested) received. Refreshing all suggested posts for project '{project.name}'...")
            refresh_suggested_posts(db, project.id, settings.vk_user_token)
            update_tracker.add_updated_project(project.id)
            print(f"Successfully refreshed suggested posts and marked project '{project.name}' for update.")
        except Exception as e:
            print(f"ERROR: Failed to handle suggested post callback for project '{project.name}': {e}")
    else:
        # Это опубликованный пост
        if 'owner_id' not in post_data: post_data['owner_id'] = -project.vkProjectId
        if 'id' not in post_data and 'post_id' in post_data: post_data['id'] = post_data['post_id']
        
        formatted_post = vk_service.format_vk_post(post_data, is_published=True)
        assign_tags_to_post(db, formatted_post, project.id)
        crud.upsert_post(db, formatted_post, is_published=True, project_id=project.id)
        update_tracker.add_updated_project(project.id)
        
        # --- EVENT TRIGGER: Запуск автоматизации конкурса ---
        try:
            print(f"EVENT TRIGGER: Checking automation for project '{project.name}'...")
            contest = crud_automations.get_contest_settings(db, project.id)
            if contest and contest.is_active:
                print(f"  -> Active contest found. Running collector...")
                # Запускаем сбор и процессинг
                contest_service.collect_participants(db, project.id)
                contest_service.process_new_participants(db, project.id)
        except Exception as e:
            print(f"  -> Automation trigger failed: {e}")
        # --------------------------------------------------

        print(f"Successfully processed wall_post_new (published) for project '{project.name}' (post_id: {formatted_post['id']}).")

def _handle_postponed_callback(db: Session, project: models.Project, event_type: str):
    try:
        print(f"Callback '{event_type}' received. Refreshing all scheduled posts for project '{project.name}'...")
        refresh_scheduled_posts(db, project.id, settings.vk_user_token)
        update_tracker.add_updated_project(project.id)
        print(f"Successfully refreshed scheduled posts and marked project '{project.name}' for update.")
    except Exception as e:
        print(f"ERROR: Failed to handle scheduled post callback '{event_type}' for project '{project.name}': {e}")

def handle_vk_callback(db: Session, request: VkCallbackRequest) -> PlainTextResponse:
    """Маршрутизатор для обработки всех входящих уведомлений от VK."""
    print(f"\n--- Callback Received ---")
    print(f"Type: {request.type}, Group ID: {request.group_id}")

    if request.type == 'confirmation':
        return _handle_confirmation_callback(db, request)
    
    project = crud.get_project_by_vk_id(db, request.group_id)
    if not project:
        print(f"Callback ignored: No project found for group_id: {request.group_id}")
        return PlainTextResponse(content='ok')

    if request.type == 'wall_post_new' and request.object:
        _handle_wall_post_new_callback(db, project, request.object)
    elif request.type in ('postponed_new', 'wall_schedule_post_new', 'postponed_delete', 'wall_schedule_post_delete'):
        _handle_postponed_callback(db, project, request.type)
    else:
        print(f"Received unhandled event type '{request.type}'. Responding 'ok'.")

    return PlainTextResponse(content='ok')
