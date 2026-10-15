def weighted_score(criteria: list[dict]) -> float:
    total = 0.0
    for criterion in criteria:
        score = float(criterion.get("score", 0))
        weight = float(criterion.get("weight", 1))
        total += score * weight
    return total
