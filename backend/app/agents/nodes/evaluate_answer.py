from backend.app.agents.state import AssessmentState


def evaluate_answer(state: AssessmentState) -> dict:
    # Safe placeholder: replace with a provider-backed evaluator that follows the rubric.
    # Do not treat this placeholder as a real grade.
    if state.get("errors"):
        return {"score": 0.0, "feedback": "Submission validation failed.", "confidence": 0.0}
    return {
        "score": 0.0,
        "feedback": "Evaluation provider is not configured. No grade has been assigned.",
        "confidence": 0.0,
        "status": "requires_evaluator",
    }
