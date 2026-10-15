# Smart Assessment Tool

An AI-assisted assessment and certification platform built around **LangGraph**, **n8n**, **FastAPI**, and **PostgreSQL**.

## Core workflow
1. Student submits an answer or assessment.
2. FastAPI validates the request and stores the submission.
3. LangGraph evaluates the response against a defined rubric.
4. Validation and uncertainty checks determine whether the result can be finalized or needs human review.
5. PostgreSQL stores the result and audit events.
6. n8n handles notifications and downstream automations.
7. Certificates are generated only when the configured eligibility rules are met.

## Repository layout
- `backend/` — API, LangGraph graph, grading services, persistence and integrations.
- `n8n/workflows/` — n8n workflow export placeholders and examples.
- `evaluation/` — rubrics, test data and grading-quality metrics.
- `frontend/` — placeholder for a student/instructor web interface.
- `docs/` — architecture and workflow documentation.
- `certificates/` — templates and ignored generated files.

## Quick start (backend skeleton)
Use Python 3.11 or 3.12 for a predictable dependency ecosystem.

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

API docs: http://127.0.0.1:8000/docs

The initial repository is a starter scaffold, not a finished production grading system. Configure an LLM provider, database, authentication, and real n8n workflows before deploying.
