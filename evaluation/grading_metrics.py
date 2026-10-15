def mean_absolute_error(predicted: list[float], reference: list[float]) -> float:
    if len(predicted) != len(reference) or not predicted:
        raise ValueError("predicted and reference must be non-empty lists of equal length")
    return sum(abs(p - r) for p, r in zip(predicted, reference)) / len(predicted)
