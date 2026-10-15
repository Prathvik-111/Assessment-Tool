from typing import TypedDict, NotRequired, Any


class AssessmentState(TypedDict):
    submission_id: str
    question: str
    answer: str
    rubric: dict[str, Any]
    score: NotRequired[float]
    feedback: NotRequired[str]
    confidence: NotRequired[float]
    needs_human_review: NotRequired[bool]
    status: NotRequired[str]
    errors: NotRequired[list[str]]
