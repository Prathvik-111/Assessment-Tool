from backend.app.agents.tools.rubric_tool import validate_rubric


def test_rubric_requires_max_score():
    assert "rubric must define max_score" in validate_rubric({})
