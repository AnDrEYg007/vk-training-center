from sqlalchemy.orm import Session, subqueryload
from sqlalchemy import func
import json
from collections import defaultdict
from datetime import datetime, timezone, timedelta

import models
from schemas import ScheduledPost, SystemPost, SuggestedPost, Note

# ===============================================
# POSTS (Published, Scheduled, Suggested)
# ===============================================

def get_posts_by_project_id(db: Session, project_id: str) -> list[models.Post]:
    return db.query(models.Post).options(subqueryload(models.Post.tags)).filter(models.Post.projectId == project_id).all()

def get_scheduled_posts_by_project_id(db: Session, project_id: str) -> list[models.ScheduledPost]:
    return db.query(models.ScheduledPost).options(subqueryload(models.ScheduledPost.tags)).filter(models.ScheduledPost.projectId == project_id).all()

def get_scheduled_post_count_for_project(db: Session, project_id: str) -> int:
    vk_scheduled_count = db.query(models.ScheduledPost).filter(models.ScheduledPost.projectId == project_id).count()
    system_post_count = db.query(models.SystemPost).filter(models.SystemPost.project_id == project_id).count()
    return vk_scheduled_count + system_post_count


def get_suggested_posts_by_project_id(db: Session, project_id: str) -> list[models.SuggestedPost]:
    return db.query(models.SuggestedPost).filter(models.SuggestedPost.projectId == project_id).all()

def get_suggested_post_counts(db: Session) -> dict[str, int]:
    results = db.query(models.SuggestedPost.projectId, func.count(models.SuggestedPost.postId)).group_by(models.SuggestedPost.projectId).all()
    return {project_id: count for project_id, count in results}
    
def replace_published_posts(db: Session, project_id: str, posts: list[dict], timestamp: str):
    # 1. Очищаем связи тегов для старых постов этого проекта
    posts_subquery = db.query(models.Post.id).filter(models.Post.projectId == project_id).subquery()
    db.execute(
        models.published_post_tags_association.delete().where(
            models.published_post_tags_association.c.post_id.in_(posts_subquery)
        )
    )
    
    # 2. Удаляем старые посты текущего проекта
    db.query(models.Post).filter(models.Post.projectId == project_id).delete(synchronize_session=False)

    if posts:
        # 3. FIX: Агрессивная очистка конфликтов. 
        # Если в базе есть посты с такими же ID (от других проектов или мусор), удаляем их, 
        # чтобы избежать IntegrityError при вставке. Кэш "захватывается" текущим проектом.
        new_ids = [p['id'] for p in posts]
        db.query(models.Post).filter(models.Post.id.in_(new_ids)).delete(synchronize_session=False)

        new_db_posts = [models.Post(
            id=p['id'],
            projectId=project_id,
            date=p['date'],
            text=p['text'],
            images=json.dumps(p['images']),
            attachments=json.dumps(p.get('attachments', [])),
            vkPostUrl=p.get('vkPostUrl'),
            tags=p.get('tags', []),
            _lastUpdated=timestamp
        ) for p in posts]
        db.add_all(new_db_posts)
    db.commit()

def upsert_published_posts(db: Session, project_id: str, posts: list[dict], timestamp: str) -> bool:
    """
    Updates existing published posts or inserts new ones based on ID.
    Does NOT delete other posts.
    Returns True if any post was inserted or updated (content changed).
    """
    if not posts:
        return False

    has_changes = False

    # Extract IDs to check existence
    post_ids = [str(p['id']) for p in posts]
    
    # Find existing posts
    existing_posts = db.query(models.Post).filter(
        models.Post.projectId == project_id,
        models.Post.id.in_(post_ids)
    ).all()
    
    existing_map = {p.id: p for p in existing_posts}
    
    new_objects = []
    
    for p_data in posts:
        pid = str(p_data['id'])
        if pid in existing_map:
            # Update
            db_obj = existing_map[pid]
            
            new_images_json = json.dumps(p_data['images'])
            new_attachments_json = json.dumps(p_data.get('attachments', []))
            
            changes_detected = False
            if db_obj.date != p_data['date']: changes_detected = True
            if db_obj.text != p_data['text']: changes_detected = True
            if db_obj.images != new_images_json: changes_detected = True
            if db_obj.attachments != new_attachments_json: changes_detected = True
            if db_obj.vkPostUrl != p_data.get('vkPostUrl'): changes_detected = True
            
            if changes_detected:
                db_obj.date = p_data['date']
                db_obj.text = p_data['text']
                db_obj.images = new_images_json
                db_obj.attachments = new_attachments_json
                db_obj.vkPostUrl = p_data.get('vkPostUrl')
                db_obj._lastUpdated = timestamp
                has_changes = True
        else:
            # Insert
            new_obj = models.Post(
                id=pid,
                projectId=project_id,
                date=p_data['date'],
                text=p_data['text'],
                images=json.dumps(p_data['images']),
                attachments=json.dumps(p_data.get('attachments', [])),
                vkPostUrl=p_data.get('vkPostUrl'),
                tags=p_data.get('tags', []), 
                _lastUpdated=timestamp
            )
            new_objects.append(new_obj)
            has_changes = True
            
    if new_objects:
        db.add_all(new_objects)
        
    db.commit()
    return has_changes

def replace_scheduled_posts(db: Session, project_id: str, posts: list[dict], timestamp: str):
    # 1. Очищаем связи тегов
    posts_subquery = db.query(models.ScheduledPost.id).filter(models.ScheduledPost.projectId == project_id).subquery()
    db.execute(
        models.scheduled_post_tags_association.delete().where(
            models.scheduled_post_tags_association.c.post_id.in_(posts_subquery)
        )
    )

    # 2. Удаляем старые посты текущего проекта
    db.query(models.ScheduledPost).filter(models.ScheduledPost.projectId == project_id).delete(synchronize_session=False)

    if posts:
        # 3. FIX: Агрессивная очистка конфликтов для отложенных постов
        new_ids = [p['id'] for p in posts]
        db.query(models.ScheduledPost).filter(models.ScheduledPost.id.in_(new_ids)).delete(synchronize_session=False)

        new_db_posts = [models.ScheduledPost(
            id=p['id'],
            projectId=project_id,
            date=p['date'],
            text=p['text'],
            images=json.dumps(p['images']),
            attachments=json.dumps(p.get('attachments', [])),
            vkPostUrl=p.get('vkPostUrl'),
            tags=p.get('tags', []),
            _lastUpdated=timestamp
        ) for p in posts]
        db.add_all(new_db_posts)
    db.commit()

def replace_suggested_posts(db: Session, project_id: str, posts: list[dict], timestamp: str):
    db.query(models.SuggestedPost).filter(models.SuggestedPost.projectId == project_id).delete()
    if posts:
        # Для предложенных постов ID формируется как ownerId_postId, риск конфликта такой же.
        # Добавляем очистку и здесь на всякий случай.
        new_ids = [p['id'] for p in posts]
        db.query(models.SuggestedPost).filter(models.SuggestedPost.postId.in_(new_ids)).delete(synchronize_session=False)

        new_db_posts = [models.SuggestedPost(
            postId=p['id'],
            authorId=p['authorId'],
            projectId=project_id,
            date=p['date'],
            text=p['text'],
            link=p['link'],
            imageUrl="\n".join(p['imageUrl']),
            authorLink=p.get('authorLink', ''),
            _groupName=p.get('_groupName', ''),
            _groupShort=p.get('_groupShort', ''),
            _lastUpdated=timestamp
        ) for p in posts]
        db.add_all(new_db_posts)
    db.commit()

def upsert_post(db: Session, post_data: dict, is_published: bool, project_id: str):
    """Atomically inserts or updates a single post in the database cache."""
    model = models.Post if is_published else models.ScheduledPost
    post_id = post_data['id']
    
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')

    db_post = db.query(model).filter(model.id == post_id).first()

    if db_post:
        # Update existing post
        db_post.date = post_data['date']
        db_post.text = post_data['text']
        db_post.images = json.dumps(post_data['images'])
        db_post.attachments = json.dumps(post_data.get('attachments', []))
        db_post.vkPostUrl = post_data.get('vkPostUrl')
        db_post.tags = post_data.get('tags', [])
        db_post._lastUpdated = timestamp
        # Если пост существовал, но был привязан к другому проекту (конфликт), 
        # обновляем привязку на текущий.
        db_post.projectId = project_id 
        print(f"DB: Updated {'published' if is_published else 'scheduled'} post {post_id}.")
    else:
        # Insert new post
        db_post = model(
            id=post_id,
            projectId=project_id,
            date=post_data['date'],
            text=post_data['text'],
            images=json.dumps(post_data['images']),
            attachments=json.dumps(post_data.get('attachments', [])),
            vkPostUrl=post_data.get('vkPostUrl'),
            tags=post_data.get('tags', []),
            _lastUpdated=timestamp
        )
        db.add(db_post)
        print(f"DB: Inserted new {'published' if is_published else 'scheduled'} post {post_id}.")
    
    db.commit()

def delete_post_from_cache(db: Session, post_id: str, is_published: bool):
    """Deletes a single post from the appropriate cache table."""
    model = models.Post if is_published else models.ScheduledPost
    deleted_count = db.query(model).filter(model.id == post_id).delete()
    db.commit()
    print(f"DB: Deleted {deleted_count} {'published' if is_published else 'scheduled'} post(s) with id {post_id}.")

# ===============================================
# BULK READ & UTILS
# ===============================================

def get_all_publication_times_for_project(db: Session, project_id: str) -> set[str]:
    """Возвращает набор всех временных слотов (отложенных VK и системных) для проекта."""
    scheduled_times = db.query(models.ScheduledPost.date).filter(models.ScheduledPost.projectId == project_id).all()
    system_times = db.query(models.SystemPost.publication_date).filter(models.SystemPost.project_id == project_id).all()
    
    # all() возвращает список кортежей, например [('date1',), ('date2',)], поэтому извлекаем первый элемент
    all_times = {time[0] for time in scheduled_times}
    all_times.update({time[0] for time in system_times})
    
    return all_times

def get_all_data_for_project_ids(db: Session, project_ids: list[str]) -> dict:
    all_posts = {pid: [] for pid in project_ids}
    all_scheduled = {pid: [] for pid in project_ids}
    all_suggested = {pid: [] for pid in project_ids}
    all_system = {pid: [] for pid in project_ids}
    all_notes = {pid: [] for pid in project_ids}
    all_stories = {pid: [] for pid in project_ids}

    # Fetch stories using service (Lazy import to avoid circular deps)
    from services.automations.stories_service import get_unified_stories

    for pid in project_ids:
        try:
           result = get_unified_stories(db, pid)
           if isinstance(result, dict) and 'items' in result:
               all_stories[pid] = result['items']
           else:
               all_stories[pid] = [] # Fallback
        except Exception:
           pass # Fail silently for stories to not break main flow

    for p in db.query(models.Post).options(subqueryload(models.Post.tags)).filter(models.Post.projectId.in_(project_ids)).all():
        all_posts[p.projectId].append(ScheduledPost.model_validate(p, from_attributes=True))
    
    for p in db.query(models.ScheduledPost).options(subqueryload(models.ScheduledPost.tags)).filter(models.ScheduledPost.projectId.in_(project_ids)).all():
        all_scheduled[p.projectId].append(ScheduledPost.model_validate(p, from_attributes=True))

    for p in db.query(models.SuggestedPost).filter(models.SuggestedPost.projectId.in_(project_ids)).all():
        all_suggested[p.projectId].append(SuggestedPost.model_validate(p, from_attributes=True))

    for p in db.query(models.SystemPost).filter(models.SystemPost.project_id.in_(project_ids)).all():
        all_system[p.project_id].append(SystemPost.model_validate(p, from_attributes=True))

    for n in db.query(models.Note).filter(models.Note.projectId.in_(project_ids)).all():
        all_notes[n.projectId].append(Note.model_validate(n, from_attributes=True))
        
    return {
        "allPosts": all_posts,
        "allScheduledPosts": all_scheduled,
        "allSuggestedPosts": all_suggested,
        "allSystemPosts": all_system,
        "allNotes": all_notes,
        "allStories": all_stories
    }


def get_project_update_status(db: Session) -> dict[str, list[str]]:
    """Проверяет свежесть данных для проектов, используя новые поля в таблице Project."""
    stale_published = []
    stale_scheduled = []
    
    # Устанавливаем временную отметку на 12 часов назад
    twelve_hours_ago = datetime.utcnow() - timedelta(hours=12)
    twelve_hours_ago_str = twelve_hours_ago.isoformat() + 'Z'

    # Находим проекты, где last_published_update либо NULL, либо старше 12 часов
    stale_published_projects = db.query(models.Project.id).filter(
        (models.Project.last_published_update == None) |
        (models.Project.last_published_update < twelve_hours_ago_str)
    ).all()
    stale_published = [p.id for p in stale_published_projects]

    # Находим проекты, где last_scheduled_update либо NULL, либо старше 12 часов
    stale_scheduled_projects = db.query(models.Project.id).filter(
        (models.Project.last_scheduled_update == None) |
        (models.Project.last_scheduled_update < twelve_hours_ago_str)
    ).all()
    stale_scheduled = [p.id for p in stale_scheduled_projects]

    # Логика для предложенных постов остается прежней, так как для них нет отдельного поля
    stale_suggested_ids = set()
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    results = db.query(models.SuggestedPost.projectId, func.max(models.SuggestedPost._lastUpdated)).group_by(models.SuggestedPost.projectId).all()
    timestamps = {pid: datetime.fromisoformat(ts_str.replace('Z', '+00:00')) for pid, ts_str in results if ts_str}
    all_project_ids = {p.id for p in db.query(models.Project).all()}
    stale_suggested_ids.update({pid for pid in all_project_ids if timestamps.get(pid, datetime.min.replace(tzinfo=timezone.utc)) < today_start})
    
    return {
        "stalePublished": stale_published,
        "staleScheduled": stale_scheduled,
        "staleSuggested": list(stale_suggested_ids)
    }