from fastapi import FastAPI

from backend.app.api.router import api_router

app = FastAPI(
    title="Smart Assessment Tool API",
    description="Starter API for rubric-based assessment and certification workflows.",
    version="0.1.0",
)
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "smart-assessment-tool"}
