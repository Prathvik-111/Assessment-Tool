from backend.app.agents.nodes.validate_submission import validate_submission


def test_validate_submission_flags_empty_answer():
    state = {"submission_id": "sub-1", "question": "Q?", "answer": " ",
             "rubric": {"max_score": 10}}
    result = validate_submission(state)
    assert result["status"] == "invalid"
    assert "answer is empty" in result["errors"]
