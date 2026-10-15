# Smart Assessment Tool

An AI-assisted assessment and certification platform built with LangGraph, n8n, FastAPI, and PostgreSQL.

## Features
- Automated assessment workflow using LangGraph
- Rubric-based grading architecture
- Human review for uncertain results
- FastAPI endpoints for submissions and results
- n8n workflow automation and notifications
- PostgreSQL integration architecture
- Certificate eligibility and generation workflow
- Testing and GitHub Actions scaffolding

## Technology Stack
- Python
- LangGraph and LangChain
- FastAPI
- PostgreSQL and SQLAlchemy
- n8n
- Docker
- pytest and GitHub Actions

## Project Status
This repository contains the initial project scaffold. Database persistence, production grading integrations, authentication, and actual n8n workflows still need to be implemented and configured.

## Getting Started

Create and activate a virtual environment, then install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` to explore the API.

## Security
Never commit API keys, passwords, environment files, or real student submissions.
