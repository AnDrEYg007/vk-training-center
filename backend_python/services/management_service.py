
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
import uuid

import crud
import schemas
import models
from . import vk_service
from .vk_service import VkApiError

def get_all_projects_for_management(db: Session) -> List[models.Project]:
    """Возвращает все НЕАРХИВИРОВАННЫЕ проекты из БД."""
    print("SERVICE: Fetching all active projects for management page.")
    return crud.get_all_projects(db)

def get_archived_projects(db: Session) -> List[models.Project]:
    """Возвращает все архивированные проекты."""
    print("SERVICE: Fetching all archived projects.")
    return crud.get_archived_projects(db)

def permanently_delete_project(db: Session, project_id: str):
    """Вызывает CRUD для безвозвратного удаления проекта."""
    print(f"SERVICE: Attempting to permanently delete project {project_id}.")
    success = crud.permanently_delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found for deletion.")


def update_projects(db: Session, projects_to_update: List[schemas.Project]):
    """Массово обновляет проекты."""
    print(f"SERVICE: Starting bulk update for {len(projects_to_update)} projects.")
    for project_data in projects_to_update:
        updated = crud.update_project_settings(db, project_data)
        if not updated:
            print(f"WARNING: Project with id {project_data.id} not found during bulk update. Skipping.")
    print("SERVICE: Bulk update completed.")

def add_projects_by_urls(db: Session, urls_string: str, user_token: str) -> dict:
    """Обрабатывает список URL-адресов VK, добавляя новые проекты в базу данных."""
    urls = [url.strip() for url in urls_string.strip().splitlines() if url.strip()]
    print(f"SERVICE: Received {len(urls)} URLs to process for new projects.")

    existing_vk_ids = crud.get_all_vk_project_ids(db)
    print(f"SERVICE: Found {len(existing_vk_ids)} existing project VK IDs in the database.")

    new_project_ids_to_fetch = set()
    stats = {"added": 0, "skipped": 0, "errors": 0}

    # Шаг 1: Разрешение URL в числовые ID и фильтрация дубликатов
    for url in urls:
        try:
            print(f"\n[Processing URL]: {url}")
            identifier = vk_service.extract_vk_group_identifier(url)
            if not identifier:
                print(f"[Error] Could not extract a valid identifier from URL.")
                stats["errors"] += 1
                continue
            
            print(f"  > Extracted identifier: '{identifier}'")
            
            numeric_id = None
            # Check if identifier is numeric (can be negative for events)
            is_numeric = identifier.lstrip('-').isdigit()

            if is_numeric:
                print(f"  > Identifier is numeric. Using '{identifier.lstrip('-')}' as the ID.")
                numeric_id = identifier.lstrip('-')
            else: # It's a screen name, needs resolving
                print(f"  > Identifier is a screen name. Resolving via utils.resolveScreenName...")
                resolved = vk_service.resolve_screen_name(identifier, user_token)
                
                if resolved and resolved.get('type') in ['group', 'page', 'event']:
                    numeric_id = str(resolved.get('object_id'))
                    print(f"  > Resolved to type '{resolved.get('type')}' with ID: {numeric_id}")
                else:
                    print(f"[Error] Could not resolve screen name '{identifier}' or it resolved to an unsupported type '{resolved.get('type', 'None')}'.")
                    stats["errors"] += 1
                    continue
            
            if numeric_id in existing_vk_ids:
                print(f"  > Project with VK ID {numeric_id} already exists. Skipping.")
                stats["skipped"] += 1
            else:
                new_project_ids_to_fetch.add(numeric_id)
                print(f"  > Added new project ID for batch fetching: {numeric_id}")
                
        except Exception as e:
            print(f"[Critical Error] while processing URL '{url}': {e}")
            stats["errors"] += 1


    if not new_project_ids_to_fetch:
        print("SERVICE: No new unique projects to add.")
        return stats

    # Шаг 2: Массовое получение информации о новых проектах
    print(f"SERVICE: Fetching details for {len(new_project_ids_to_fetch)} new projects from VK...")
    try:
        group_ids_str = ",".join(new_project_ids_to_fetch)
        # ВАЖНО: Добавлен photo_200 в fields
        vk_response = vk_service.call_vk_api('groups.getById', {
            'group_ids': group_ids_str,
            'fields': 'screen_name,photo_200',
            'access_token': user_token
        })
        
        groups_info = vk_response
        if isinstance(vk_response, dict) and 'groups' in vk_response:
            groups_info = vk_response['groups']

        if not isinstance(groups_info, list):
            raise Exception("VK API returned unexpected format for groups.getById")

        # Шаг 3: Создание и добавление новых проектов в БД
        max_sort_order = crud.get_max_sort_order(db)
        current_sort_order = max_sort_order + 1
        
        new_db_projects = []
        for group in groups_info:
            vk_project_id = str(group['id'])
            
            # Последняя проверка на случай гонки состояний
            if vk_project_id in existing_vk_ids:
                continue

            new_project = models.Project(
                id=str(uuid.uuid4()),
                vkProjectId=vk_project_id,
                vkGroupShortName=group.get('screen_name', f"club{vk_project_id}"),
                vkGroupName=group.get('name', 'Unknown Name'),
                vkLink=f"https://vk.com/{group.get('screen_name', f'club{vk_project_id}')}",
                avatar_url=group.get('photo_200'), # Сохраняем аватарку
                name=group.get('name', 'Unknown Name'),
                disabled=False,
                sort_order=current_sort_order
            )
            new_db_projects.append(new_project)
            existing_vk_ids.add(vk_project_id) # Добавляем в сет, чтобы избежать дублей из одного запроса
            current_sort_order += 1

        if new_db_projects:
            db.add_all(new_db_projects)
            db.commit()
            stats["added"] = len(new_db_projects)
            print(f"SERVICE: Successfully added {len(new_db_projects)} new projects to the database.")

    except Exception as e:
        print(f"CRITICAL ERROR: Failed during bulk fetch or DB insertion of new projects: {e}")
        stats["errors"] += len(new_project_ids_to_fetch) - stats["added"]

    return stats
