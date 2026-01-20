
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models_library.automations import StoriesAutomation, StoriesAutomationLog
from models_library.projects import Project
from services import vk_service
from pydantic import BaseModel
import requests
import uuid
from config import settings
from services.automations import stories_service
from datetime import datetime, timedelta, timezone

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class StoriesAutomationSchema(BaseModel):
    is_active: bool
    keywords: str | None = None

class GetPayload(BaseModel):
    projectId: str
    refresh: bool = False

class UpdatePayload(BaseModel):
    projectId: str
    settings: StoriesAutomationSchema

class ManualPublishPayload(BaseModel):
    projectId: str
    vkPostId: int

class UpdateStatsPayload(BaseModel):
    projectId: str
    mode: str 
    logId: str | None = None
    vkStoryId: int | None = None
    count: int | None = None
    days: int | None = None

@router.post("/getStoriesAutomation")
def get_stories_automation(payload: GetPayload, db: Session = Depends(get_db)):
    """
    Get settings for stories automation.
    Using POST because many other endpoints here use POST for getters.
    """
    settings = db.query(StoriesAutomation).filter(StoriesAutomation.project_id == payload.projectId).first()
    if not settings:
        return {"is_active": False, "keywords": ""}
    return {"is_active": settings.is_active, "keywords": settings.keywords}

@router.post("/getStoriesAutomationLogs")
def get_stories_automation_logs(payload: GetPayload, db: Session = Depends(get_db)):
    """
    Get logs for stories automation.
    """
    logs = db.query(StoriesAutomationLog).filter(StoriesAutomationLog.project_id == payload.projectId).order_by(StoriesAutomationLog.created_at.desc()).all()
    return logs

@router.post("/updateStoriesAutomation")
def update_stories_automation(payload: UpdatePayload, db: Session = Depends(get_db)):
    settings = db.query(StoriesAutomation).filter(StoriesAutomation.project_id == payload.projectId).first()
    if not settings:
        settings = StoriesAutomation(id=str(uuid.uuid4()), project_id=payload.projectId)
        db.add(settings)
    
    settings.is_active = payload.settings.is_active
    settings.keywords = payload.settings.keywords
    db.commit()
    return {"status": "ok", "settings": {"is_active": settings.is_active, "keywords": settings.keywords}}

@router.post("/manualPublishStory")
def manual_publish_story(payload: ManualPublishPayload, db: Session = Depends(get_db)):
    user_token = settings.vk_user_token
    project = db.query(Project).filter(Project.id == payload.projectId).first()
    if not project:
         raise HTTPException(404, "Project not found")

    try:
        group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
    except Exception as e:
        raise HTTPException(400, f"Failed to resolve group ID: {e}")
    
    # Call service logic (assuming it exists or moved code here)
    # For now just existing implementation...
    
    post_full_id = f"-{group_id}_{payload.vkPostId}"
    
    resp = requests.post("https://api.vk.com/method/wall.getById", data={
        "posts": post_full_id,
        "access_token": user_token,
        "v": "5.131"
    }).json()
    
    if 'error' in resp:
         raise HTTPException(400, f"VK Error: {resp['error'].get('error_msg')}")
    
    posts = resp.get('response', [])
    if not posts:
         raise HTTPException(404, "Post not found in VK")
    
    raw_post = posts[0]

    result = stories_service.process_single_story_for_post(
        db, 
        payload.projectId, 
        raw_post, 
        group_id, 
        user_token, 
        force=True
    )
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    
    return result

@router.post("/getUnifiedStories")
def get_unified_stories_endpoint(payload: GetPayload, db: Session = Depends(get_db)):
    """
    Get active stories. Defaults to DB cache unless refresh=True.
    """
    return stories_service.get_unified_stories(db, payload.projectId, refresh=payload.refresh)

@router.post("/getStoriesStats")
def get_stories_stats(payload: GetPayload, db: Session = Depends(get_db)):
    """
    Get statistics for published stories from DB.
    """
    logs = db.query(StoriesAutomationLog).filter(
        StoriesAutomationLog.project_id == payload.projectId,
        StoriesAutomationLog.status == 'published'
    ).order_by(StoriesAutomationLog.created_at.desc()).limit(100).all()

    result = []
    import json
    
    for log in logs:
        try:
            stats_data = json.loads(log.stats) if log.stats else None
        except:
            stats_data = None
            
        story_link = None
        if log.log:
             try:
                 log_data = json.loads(log.log)
                 story_link = log_data.get('story_link')
             except: pass
        
        result.append({
            "logId": log.id,
            "vkPostId": log.vk_post_id,
            "date": log.created_at,
            "stats": stats_data,
            "statsUpdatedAt": log.stats_updated_at,
            "storyLink": story_link
        })
        
    return result

@router.post("/updateStoriesStats")
def update_stories_stats(payload: UpdateStatsPayload, db: Session = Depends(get_db)):
    """
    Updates statistics for stories based on criteria.
    """
    user_token = settings.vk_user_token
    
    if payload.mode == 'single':
        if payload.logId:
             log = db.query(StoriesAutomationLog).filter(
                 StoriesAutomationLog.project_id == payload.projectId,
                 StoriesAutomationLog.id == payload.logId
             ).first()
             logs = [log] if log else []
             return stories_service.batch_update_stats(db, logs, user_token)
             
        elif payload.vkStoryId:
             # Manual story tracking logic: Find or Create Log
             # 1. Resolve Group ID
             project = db.query(Project).filter(Project.id == payload.projectId).first()
             if not project:
                 return {"status": "error", "message": "Project not found"}
                 
             group_id = None
             try:
                group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
             except: pass
             
             if not group_id:
                 return {"status": "error", "message": "Group ID not found"}
                 
             owner_id = -group_id
             story_link = f"https://vk.com/story{owner_id}_{payload.vkStoryId}"
             
             # Check if exists by searching in log text (optimization: add index or column later)
             log_to_update = db.query(StoriesAutomationLog).filter(
                 StoriesAutomationLog.project_id == payload.projectId,
                 StoriesAutomationLog.log.contains(story_link)
             ).first()
             
             if not log_to_update:
                 import json
                 # Create new tracking log
                 log_to_update = StoriesAutomationLog(
                     id=str(uuid.uuid4()),
                     project_id=payload.projectId,
                     vk_post_id=0, # Manual / External
                     status='published',
                     log=json.dumps({"story_link": story_link}),
                     # We rely on default created_at=now(). 
                     # Ideally we should fetch story date but that requires another API call.
                 )
                 db.add(log_to_update)
                 db.commit()
                 
             return stories_service.batch_update_stats(db, [log_to_update], user_token)

    query = db.query(StoriesAutomationLog).filter(
        StoriesAutomationLog.project_id == payload.projectId,
        StoriesAutomationLog.status == 'published'
    )

    if payload.mode == 'last_n' and payload.count:
        # For batch updates, we fetch the IDs first
        logs_to_update = query.order_by(StoriesAutomationLog.created_at.desc()).limit(payload.count).all()
        return stories_service.batch_update_stats(db, logs_to_update, user_token)
    elif payload.mode == 'period' and payload.days:
        cutoff = datetime.now(timezone.utc) - timedelta(days=payload.days)
        query = query.filter(StoriesAutomationLog.created_at >= cutoff)
        
    logs = query.order_by(StoriesAutomationLog.created_at.desc()).all()
    return stories_service.batch_update_stats(db, logs, user_token)

@router.post("/getCommunityStories")
def get_community_stories_endpoint(payload: GetPayload, db: Session = Depends(get_db)):
    """
    Get all active stories from the community (VK).
    """
    user_token = settings.vk_user_token
    result = stories_service.get_community_stories(db, payload.projectId, user_token)
    if 'error' in result:
         # Return a simplified error if needed, or raise HTTPException
         # For this specific case, 200 OK with error field is often easier for frontend to handle gracefully
         # But let's raise HTTPException for consistency if it's a hard failure
         if 'Project not found' in result['error']: 
             raise HTTPException(404, detail=result['error'])
         # We'll return the error object so frontend can show the VK message
         return result
    return result
