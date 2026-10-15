from pydantic import BaseModel, Field


class SubmissionCreate(BaseModel):
    assessment_id: str
    student_id: str
    answer: str = Field(min_length=1, max_length=50000)
