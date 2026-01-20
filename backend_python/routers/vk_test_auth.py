from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/vk-test", tags=["vk-test"])

# Configuration (In production, use env vars)
# App 1 (Original)
VK_APP_ID_1 = 54423358
VK_CLIENT_SECRET_1 = "wQ0ANYum4o5HK0cVoGxt"

# App 2 (New)
VK_APP_ID_2 = 54422343
VK_CLIENT_SECRET_2 = "TJW7a1TlVEnjgskq5d7w"

APPS_CONFIG = {
    str(VK_APP_ID_1): VK_CLIENT_SECRET_1,
    str(VK_APP_ID_2): VK_CLIENT_SECRET_2
}

# Redirect URI must match what is configured in VK App (even if not used for redirect in embedded OneTap)
# For OneTap/SDK, it's often the origin or a specific callback
VK_REDIRECT_URI = "https://6ec0eb7d692d.ngrok-free.app/callback" # Update this to your current ngrok

class VKExchangeRequest(BaseModel):
    code: str
    device_id: str
    code_verifier: str = "" 
    redirect_uri: str = "" # Allow frontend to dictate redirect_uri to match exactly
    app_id: int = VK_APP_ID_1 # Default to App 1 if not specified

@router.post("/exchange-token")
async def exchange_token(data: VKExchangeRequest):
    # Use URI from frontend if provided, else fallback to env/const
    final_redirect_uri = data.redirect_uri if data.redirect_uri else VK_REDIRECT_URI
    
    current_app_id = str(data.app_id)
    current_client_secret = APPS_CONFIG.get(current_app_id)
    
    if not current_client_secret:
         raise HTTPException(status_code=400, detail=f"Unknown App ID: {data.app_id}")

    print(f"🔄 VK Test (App {data.app_id}): Exchanging code {data.code[:5]}...")
    print(f"    Verifier: {data.code_verifier[:5] if data.code_verifier else 'None'}")
    print(f"    RedirectURI: {final_redirect_uri}")
    
    # 1. Exchange Code for Access Token (Server-Side)
    async with httpx.AsyncClient() as client:
        # ⚠️ REVERTED: id.vk.com/oauth2/auth is the correct endpoint for VK ID codes
        # despite the confusing name (it handles exchange too).
        url = "https://id.vk.com/oauth2/auth"
        
        data_body = {
            "grant_type": "authorization_code",
            "client_id": data.app_id,
            "client_secret": current_client_secret,
            "redirect_uri": final_redirect_uri,
            "code": data.code,
            "device_id": data.device_id
        }
        
        # If frontend sent code_verifier (PKCE), add it
        if data.code_verifier:
             data_body["code_verifier"] = data.code_verifier

        # LOGGING PARAMS (Safety: mask secret)
        safe_params = data_body.copy()
        safe_params['client_secret'] = '***'
        print(f"📡 Sending POST request to VK: {url} with body: {safe_params}")

        try:
            # Note: id.vk.com usually expects POST for token exchange
            resp = await client.post(url, data=data_body)
            
            print(f"DEBUG: VK Response Status: {resp.status_code}")
            # print(f"DEBUG: VK Response Body: {resp.text}")

            resp_data = resp.json()
        except Exception as e:
            print(f"❌ JSON/Network Error: {e}")
            raise HTTPException(status_code=500, detail=f"Network error: {e}")

        if "error" in resp_data:
            print(f"❌ VK Error: {resp_data}")
            raise HTTPException(status_code=400, detail=f"VK Error: {resp_data.get('error_description')}")

        print(f"✅ Token received! User ID: {resp_data.get('user_id')}")
        print(f"🔍 Token Scopes: {resp_data.get('scope')}") # Log the actual scopes
        
        # 2. (Optional) Fetch User Info Server-Side to prove we have access
        access_token = resp_data["access_token"]
        user_id = resp_data["user_id"]
        
        # Test request to groups.get
        # NOTE: filter='admin,editor,moderator' only returns managed groups.
        # If testing with a regular user, this might be empty.
        groups_params = {
            "access_token": access_token,
            "v": "5.199",
            "user_id": user_id,
            "extended": 1,
            # "filter": "admin,editor,moderator" # Commented out to see ALL groups for debugging
        }
        
        groups_resp = await client.get(
            "https://api.vk.com/method/groups.get",
            params=groups_params
        )
        groups_data = groups_resp.json()
        
        if "error" in groups_data:
            print(f"❌ groups.get Error: {groups_data['error']}")
            # Don't fail the whole request, but include error in response
            groups_sample = {"error": groups_data['error']}
        else:
            groups_sample = groups_data.get("response", {}).get("items", [])[:3]

        print(f"DEBUG: VK Response Body: {resp.text}")
        return {
            "auth_data": resp_data,
            "groups_sample": groups_sample
        }
