import httpx

from backend.app.config import settings


async def trigger_webhook(payload: dict) -> dict:
    if not settings.n8n_webhook_url:
        return {"sent": False, "reason": "N8N_WEBHOOK_URL is not configured"}
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(settings.n8n_webhook_url, json=payload)
        response.raise_for_status()
        return {"sent": True, "status_code": response.status_code}
