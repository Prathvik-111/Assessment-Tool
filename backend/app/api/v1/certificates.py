from fastapi import APIRouter

router = APIRouter()


@router.get("/{student_id}")
def list_certificates(student_id: str) -> dict:
    return {"student_id": student_id, "items": []}
