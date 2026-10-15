from fastapi import APIRouter

from backend.app.api.v1 import assessments, submissions, grading, reviews, results, certificates

api_router = APIRouter()
api_router.include_router(assessments.router, prefix="/assessments", tags=["assessments"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(grading.router, prefix="/grading", tags=["grading"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(results.router, prefix="/results", tags=["results"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["certificates"])
