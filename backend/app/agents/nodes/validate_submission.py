from backend.app.agents.state import AssessmentState


def validate_submission(state: AssessmentState) -> dict:
    errors = []
    if not state.get("submission_id"):
        errors.append("submission_id is required")
    if not state.get("answer", "").strip():
        errors.append("answer is empty")
    return {"errors": errors, "status": "invalid" if errors else "validated"}
