from backend.app.agents.graph import build_assessment_graph


def grade_submission(payload: dict) -> dict:
    graph = build_assessment_graph()
    return graph.invoke(payload)
