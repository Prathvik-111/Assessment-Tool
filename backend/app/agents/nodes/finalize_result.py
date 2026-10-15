from backend.app.agents.state import AssessmentState


def finalize_result(state: AssessmentState) -> dict:
    return {"status": "completed", "feedback": state.get("feedback", "")}
