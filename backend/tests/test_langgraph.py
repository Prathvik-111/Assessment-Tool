from backend.app.agents.graph import build_assessment_graph


def test_graph_routes_unconfigured_evaluator_to_review():
    graph = build_assessment_graph()
    result = graph.invoke({
        "submission_id": "sub-1",
        "question": "Explain a concept",
        "answer": "A sample answer",
        "rubric": {"max_score": 10},
    })
    assert result["needs_human_review"] is True
