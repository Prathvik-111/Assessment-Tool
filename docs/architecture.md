# Architecture

## Components
- Frontend: student and instructor experience.
- FastAPI: authentication boundary, request validation, REST API.
- LangGraph: stateful evaluation pipeline and routing.
- Evaluation tools: deterministic scoring, rubric validation, optional similarity checks.
- PostgreSQL: durable records, results, audit events and certificate status.
- n8n: event-driven integrations, email and operational notifications.

## Trust boundaries
Treat uploaded answers and files as untrusted input. Never allow submission content to change system policy or call arbitrary tools. Validate tool outputs and LLM structured output. Require human review for low-confidence or flagged cases. Certificate eligibility must be checked server-side.
