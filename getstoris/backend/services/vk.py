import httpx
from schemas import VKGroup

class VKService:
    BASE_URL = "https://api.vk.com/method/"
    VERSION = "5.199"

    def __init__(self, access_token: str):
        self.access_token = access_token

    async def _request(self, method: str, params: dict):
        params["access_token"] = self.access_token
        params["v"] = self.VERSION
        
        # Force IPv4 by binding to 0.0.0.0
        # This helps when localhost resolves to ::1 vs 127.0.0.1
        transport = httpx.AsyncHTTPTransport(local_address="0.0.0.0")
        
        async with httpx.AsyncClient(transport=transport) as client:
            response = await client.get(f"{self.BASE_URL}{method}", params=params)
            response.raise_for_status()
            data = response.json()
            if "error" in data:
                raise Exception(f"VK API Error: {data['error']}")
            return data["response"]

    async def get_user_info(self, user_id: int):
        # users.get
        response = await self._request("users.get", {"user_ids": user_id, "fields": "photo_200"})
        return response[0] if response else None

    async def get_groups(self) -> list[VKGroup]:
        # groups.get with filter=admin,editor,moderator
        params = {
            "extended": 1,
            "filter": "admin,editor,moderator",
            "fields": "description"
        }
        response = await self._request("groups.get", params)
        items = response.get("items", [])
        
        groups = []
        for item in items:
            groups.append(VKGroup(
                id=item["id"],
                name=item["name"],
                screen_name=item.get("screen_name"),
                photo_100=item.get("photo_100"),
                is_admin=item.get("is_admin", 0) == 1
            ))
        return groups
