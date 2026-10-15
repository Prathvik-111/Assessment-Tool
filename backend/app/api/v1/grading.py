from fastapi import APIRouter

router = APIRouter()


@router.post("/{submission_id}/run")
def run_grading(submission_id: str) -> dict:
    # TODO: load submission and invoke the compiled LangGraph graph.
    return {"submission_id": submission_id, "status": "not_implemented"}
