from fastapi import APIRouter

router = APIRouter()


@router.get("/pending")
def pending_reviews() -> dict:
    return {"items": [], "message": "Implement the review queue and instructor authorization."}
