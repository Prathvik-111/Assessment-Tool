from backend.app.agents.state import AssessmentState


def verify_score(state: AssessmentState) -> dict:
    score = float(state.get("score", 0.0))
    maximum = float(state.get("rubric", {}).get("max_score", 100.0))
    valid = 0 <= score <= maximum
    return {"errors": state.get("errors", []) + ([] if valid else ["score_out_of_range"])}
