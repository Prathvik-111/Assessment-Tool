def validate_rubric(rubric: dict) -> list[str]:
    errors = []
    if "max_score" not in rubric:
        errors.append("rubric must define max_score")
    elif not isinstance(rubric["max_score"], (int, float)) or rubric["max_score"] <= 0:
        errors.append("max_score must be a positive number")
    return errors
