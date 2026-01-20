from sqlalchemy.orm import Session
from models_library.automations import StoriesAutomationLog
from models_library.projects import Project
from services import vk_service
from utils import image_utils
import requests
import uuid
import json

def process_single_story_for_post(db: Session, project_id: str, post: dict, group_id: int | None, user_token: str, force: bool = False):
    """
    Processes a single post: generates an image, adds a link, and publishes as a story.
    Does NOT check keywords or age if force=True.
    Does NOT check existing logs if force=True.
    
    If group_id is None, it will be resolved from project_id.
    """
    post_id = post.get('id')
    text = post.get('text', '')
    
    # Validation
    if not post_id:
        return {"status": "error", "message": "Post ID is missing"}

    # Resolve group_id if needed
    if not group_id:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"status": "error", "message": "Project not found"}
        try:
            group_id = vk_service.resolve_vk_group_id(project.vkProjectId, user_token)
        except Exception as e:
            msg = f"STORIES_AUTO: Failed to resolve group ID for {project_id}: {e}"
            print(msg)
            return {"status": "error", "message": msg}

    if not force:
        # Check if already processed
        existing_log = db.query(StoriesAutomationLog).filter(
            StoriesAutomationLog.project_id == project_id,
            StoriesAutomationLog.vk_post_id == post_id
        ).first()
        
        if existing_log:
            return {"status": "skipped", "message": "Already processed"}

    print(f"STORIES_AUTO: Processing post {post_id} for project {project_id}. Reposting to stories...")
    
    try:
        # Prepare image
        image_url = None
        attachments = post.get('attachments', [])
        
        for att in attachments:
            if att['type'] == 'photo':
                # Get largest
                sizes = att['photo']['sizes']
                best_size = next((s for s in sizes if s.get('type') == 'w'), sizes[-1]) # w is usually large
                image_url = best_size.get('url')
                break
        
        if not image_url and not text:
            msg = f"STORIES_AUTO: Post {post_id} has no content (no image, no text). Skipping."
            print(msg)
            return {"status": "error", "message": "No content"}

        # Download image
        img_data = None
        if image_url:
            try:
                img_data = requests.get(image_url).content
            except:
                pass
        
        # If no image data, but we have text -> proceed with text-only mode
        if not img_data and not text:
             return {"status": "error", "message": "Image download failed and no text."}
        
        # Fetch Group Info for "Repost Card" style
        group_name = None
        group_photo_bytes = None
        try:
            # Need to fetch group info. Since we don't have a direct method readily available in context,
            # we'll use a raw call or helper if exists.
            # Actually, resolve_vk_group_id returns ID. We need 'groups.getById'
            # Let's do a raw request via vk_service internal logic if possible, or just requests.
            # Simplest is just requests to VK API since we have the token
            g_info = requests.post("https://api.vk.com/method/groups.getById", data={
                "group_id": group_id,
                "access_token": user_token,
                "v": "5.131"
            }).json()
            
            if 'response' in g_info and len(g_info['response']) > 0:
                    g_data = g_info['response'][0]
                    group_name = g_data.get('name')
                    photo_url = g_data.get('photo_200') or g_data.get('photo_100')
                    if photo_url:
                        group_photo_bytes = requests.get(photo_url).content
        except Exception as e:
            print(f"STORIES_AUTO: Failed to fetch group info for card: {e}")

        # Generate Story Image (Blurred background + Card)
        story_image_bytes, render_metrics = image_utils.create_story_image(
            post_image_bytes=img_data,
            group_name=group_name,
            group_photo_bytes=group_photo_bytes,
            post_text=text
        )
        
        # Link to post
        # owner_id is -group_id
        post_link = f"https://vk.com/wall-{group_id}_{post_id}"
        
        clickable_stickers = None
        if render_metrics:
            # Calculate relative coordinates for sticker
            card_w = render_metrics['width']
            card_h = render_metrics['height']
            card_x = render_metrics['x']
            card_y = render_metrics['y']
            
            screen_w = int(render_metrics['target_width'])
            screen_h = int(render_metrics['target_height'])
            
            p1 = {"x": int(card_x), "y": int(card_y)}
            p2 = {"x": int(card_x + card_w), "y": int(card_y)}
            p3 = {"x": int(card_x + card_w), "y": int(card_y + card_h)}
            p4 = {"x": int(card_x), "y": int(card_y + card_h)}
            
            stickers_data = {
                "original_width": screen_w,
                "original_height": screen_h,
                "clickable_stickers": [
                    {
                        "type": "link",
                        "clickable_area": [p1, p2, p3, p4],
                        "link": post_link,
                        "tooltip_text_key": "tooltip_open_post"
                    }
                ]
            }
            clickable_stickers = json.dumps(stickers_data)
        
        uploaded_story = vk_service.upload_story(
            group_id=group_id,
            file_bytes=story_image_bytes,
            file_name="story.jpg",
            user_token=user_token,
            # attachment=f"wall-{group_id}_{post_id}",  <-- Commented to rely on custom sticker
            link_url=post_link,
            link_text='go_to',
            clickable_stickers=clickable_stickers
        )
        
        # Extract story link
        story_link = None
        story_preview = None
        
        if uploaded_story:
                owner_id = uploaded_story.get('owner_id')
                story_id = uploaded_story.get('id')
                if owner_id and story_id:
                    story_link = f"https://vk.com/story{owner_id}_{story_id}"
                
                # Extract preview image
                if 'photo' in uploaded_story and 'sizes' in uploaded_story['photo']:
                    sizes = uploaded_story['photo']['sizes']
                    # Pick best size (type 'w' or last one)
                    best_size = next((s for s in sizes if s.get('type') == 'w'), sizes[-1])
                    story_preview = best_size.get('url')
        
        # Log
        log_data = {}
        if story_link:
                log_data['story_link'] = story_link
        
        if story_preview:
                log_data['image_url'] = story_preview

        log_entry = StoriesAutomationLog(
            id=str(uuid.uuid4()),
            project_id=project_id,
            vk_post_id=post_id,
            log=json.dumps(log_data) if log_data else None,
            status='published',
            image_url=story_preview,
            post_text=text,
            post_link=post_link
        )
        db.add(log_entry)
        db.commit()
        print(f"STORIES_AUTO: Successfully posted story for {post_id}. Link: {story_link}")
        return {"status": "success", "story_link": story_link}

    except Exception as e:
        db.rollback()
        msg = f"STORIES_AUTO: Failed to link post {post_id} to story: {e}"
        print(msg)
        return {"status": "error", "message": str(e)}
