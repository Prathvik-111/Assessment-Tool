from langgraph.graph import END, START, StateGraph

from backend.app.agents.state import AssessmentState
from backend.app.agents.nodes.validate_submission import validate_submission
from backend.app.agents.nodes.evaluate_answer import evaluate_answer
from backend.app.agents.nodes.verify_score import verify_score
from backend.app.agents.nodes.detect_uncertainty import detect_uncertainty
from backend.app.agents.nodes.finalize_result import finalize_result


def build_assessment_graph():
    graph = StateGraph(AssessmentState)
    graph.add_node("validate_submission", validate_submission)
    graph.add_node("evaluate_answer", evaluate_answer)
    graph.add_node("verify_score", verify_score)
    graph.add_node("detect_uncertainty", detect_uncertainty)
    graph.add_node("finalize_result", finalize_result)

    graph.add_edge(START, "validate_submission")
    graph.add_edge("validate_submission", "evaluate_answer")
    graph.add_edge("evaluate_answer", "verify_score")
    graph.add_edge("verify_score", "detect_uncertainty")
    graph.add_conditional_edges(
        "detect_uncertainty",
        lambda state: "review" if state.get("needs_human_review") else "finalize",
        {"review": END, "finalize": "finalize_result"},
    )
    graph.add_edge("finalize_result", END)
    return graph.compile()
