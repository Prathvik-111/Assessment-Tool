from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_assessments() -> dict:
    return {"items": [], "message": "Connect the assessment repository to list records."}
