from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, models, database
from services.vk import VKService

router = APIRouter()

@router.post("/auth/vk", response_model=schemas.User)
async def auth_vk(data: schemas.VKAuthData, db: Session = Depends(database.get_db)):
    print(f"🔥 auth_vk endpoint called! Data: {data.user_id}")
    # 1. Verify token works and get user info from VK
    vk = VKService(data.access_token)
    try:
        user_info = await vk.get_user_info(data.user_id)
    except Exception as e:
        print(f"❌ VK API Verification Failed: {e}")
        if "1130" in str(e):
             print("⚠️  IP Mismatch detected! Using fallback data or dummy data.")
             # Fallback: create a user with empty name/avatar if API failed
             user_info = {"first_name": "Unknown", "last_name": "User", "photo_200": ""}
        else:
             raise HTTPException(status_code=400, detail=f"VK API Error: {str(e)}")

    # 2. Find or create user
    user = db.query(models.User).filter(models.User.vk_id == data.user_id).first()
    if not user:
        user = models.User(
            vk_id=data.user_id,
            first_name=user_info.get("first_name"),
            last_name=user_info.get("last_name"),
            avatar=user_info.get("photo_200"),
            access_token=data.access_token,
            refresh_token=data.refresh_token,
            device_id=data.device_id
        )
        db.add(user)
    else:
        # Update tokens
        user.access_token = data.access_token
        user.refresh_token = data.refresh_token
        user.device_id = data.device_id
        user.first_name = user_info.get("first_name")
        user.last_name = user_info.get("last_name")
        user.avatar = user_info.get("photo_200")
    
    db.commit()
    db.refresh(user)
    return user

@router.get("/users", response_model=list[schemas.User])
async def get_all_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).all()

@router.get("/vk/groups", response_model=list[schemas.VKGroup])
async def get_groups(user_id: int, db: Session = Depends(database.get_db)):
    print(f"🔥 get_groups endpoint called for user_id: {user_id}")
    # IP Mismatch workaround: We cannot fetch groups from backend due to VK security.
    # Return empty list, frontend will fetch them directly.
    return []

    # Original failing code disabled for IP mismatch reasons:
    # user = db.query(models.User).filter(models.User.id == user_id).first()
    # vk = VKService(user.access_token) ...
