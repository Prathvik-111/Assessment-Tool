def check_similarity(answer: str, reference_texts: list[str] | None = None) -> dict:
    # TODO: integrate an approved similarity checker; similarity is not proof of misconduct.
    return {"checked": False, "similarity": None, "flagged": False,
            "note": "No similarity provider configured."}
