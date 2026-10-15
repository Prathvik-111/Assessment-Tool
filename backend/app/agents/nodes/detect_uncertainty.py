from backend.app.agents.state import AssessmentState


def detect_uncertainty(state: AssessmentState) -> dict:
    # Conservative default: human review is required until a real evaluator is configured.
    confidence = float(state.get("confidence", 0.0))
    needs_review = bool(state.get("errors")) or confidence < 0.85 or state.get("status") == "requires_evaluator"
    return {"needs_human_review": needs_review}
