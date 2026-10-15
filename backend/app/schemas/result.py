from pydantic import BaseModel


class AssessmentResult(BaseModel):
    submission_id: str
    status: str
    score: float | None = None
    feedback: str | None = None
    needs_human_review: bool = True
