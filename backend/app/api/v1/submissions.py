from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


class SubmissionRequest(BaseModel):
    assessment_id: str
    student_id: str
    answer: str = Field(min_length=1, max_length=50000)


@router.post("/")
def create_submission(payload: SubmissionRequest) -> dict:
    # TODO: persist submission and dispatch the LangGraph workflow.
    return {"status": "accepted", "assessment_id": payload.assessment_id,
            "student_id": payload.student_id, "grading_status": "not_started"}
