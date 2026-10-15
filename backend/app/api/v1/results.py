from fastapi import APIRouter

router = APIRouter()


@router.get("/{submission_id}")
def get_result(submission_id: str) -> dict:
    return {"submission_id": submission_id, "status": "not_found"}
