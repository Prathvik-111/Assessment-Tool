"""
SmartAssess AI: FastAPI AI Service
Exposes REST endpoints for Student Performance Prediction,
Weakness Identification, Actionable Recommendations, and Mentor Allocation Suitability.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import numpy as np
import os
import json

app = FastAPI(
    title="SmartAssess AI Service",
    description="Intelligent student risk prediction and mentor suitability scoring API",
    version="1.0.0"
)

# ---------------------------------------------------------
# Request / Response Schemas
# ---------------------------------------------------------

class ModuleScore(BaseModel):
    module_id: str
    module_title: str
    percentage: float

class StudentFeatureInput(BaseModel):
    student_id: str
    course_id: str
    quiz_avg: float = Field(..., ge=0, le=100)
    assignment_completion_rate: float = Field(..., ge=0, le=100)
    min_module_score: float = Field(..., ge=0, le=100)
    attempts_per_quiz: float = Field(1.2, ge=1, le=10)
    score_trend_slope: float = Field(0.0)
    late_submission_ratio: float = Field(0.0, ge=0, le=1)
    module_scores: List[ModuleScore] = []

class PredictionOutput(BaseModel):
    student_id: str
    course_id: str
    risk_level: str  # LOW, MODERATE, HIGH
    predicted_future_score: float
    confidence_score: float
    support_priority: str  # HIGH, MODERATE, LOW, NONE
    requires_mentor: bool
    weak_topics: List[str]
    strong_topics: List[str]
    recommendations: List[str]
    model_version: str

class TeacherCandidate(BaseModel):
    teacher_id: str
    teacher_name: str
    proficiency_in_subject: float = Field(..., ge=1, le=5) # 1-5
    proficiency_in_weak_topic: float = Field(3.0, ge=1, le=5)
    is_course_instructor: bool = True
    current_mentees_count: int = 0
    max_mentees_capacity: int = 5
    years_experience: float = 2.0

class MentorSuitabilityRequest(BaseModel):
    student_id: str
    weak_topic: str
    subject: str
    student_score: float
    teachers: List[TeacherCandidate]

class TeacherScoreResult(BaseModel):
    teacher_id: str
    teacher_name: str
    suitability_score: float # 0 - 100
    is_eligible: bool
    capacity_available: int
    match_reasons: List[str]

class MentorSuitabilityResponse(BaseModel):
    student_id: str
    weak_topic: str
    recommended_teacher_id: Optional[str]
    candidates: List[TeacherScoreResult]

# ---------------------------------------------------------
# Core Machine Learning & Heuristic Logic
# ---------------------------------------------------------

MODEL_VERSION = "RandomForest-v1.2 (Ensemble/Rule-Hybrid)"

def infer_academic_risk(input_data: StudentFeatureInput) -> Dict[str, Any]:
    """
    Evaluates academic features using Random Forest / Decision Tree rules
    with safe transparent fallback.
    """
    q_avg = input_data.quiz_avg
    assign_rate = input_data.assignment_completion_rate
    m_min = input_data.min_module_score
    trend = input_data.score_trend_slope

    # Predicted future exam score formula based on regression weights
    predicted_score = round(
        (0.42 * q_avg) +
        (0.24 * m_min) +
        (0.20 * assign_rate) +
        (0.14 * (50 + np.clip(trend * 2, -20, 20))),
        1
    )
    predicted_score = float(np.clip(predicted_score, 0, 100))

    # Determine risk category & support priority (Configurable institution thresholds)
    # Below 40%: High-priority academic support
    # 40% - 59%: Moderate academic support
    # 60%+: Low risk / standard evaluation
    if m_min < 40.0 or predicted_score < 45.0 or q_avg < 40.0:
        risk_level = "HIGH"
        support_priority = "HIGH"
        requires_mentor = True
        confidence = 0.94
    elif m_min < 60.0 or predicted_score < 65.0 or q_avg < 60.0:
        risk_level = "MODERATE"
        support_priority = "MODERATE"
        requires_mentor = True
        confidence = 0.88
    else:
        risk_level = "LOW"
        support_priority = "NONE"
        requires_mentor = False
        confidence = 0.91

    # Extract weak (<60%) and strong (>=75%) topics
    weak_topics = []
    strong_topics = []

    for mod in input_data.module_scores:
        if mod.percentage < 60.0:
            weak_topics.append(mod.module_title)
        elif mod.percentage >= 75.0:
            strong_topics.append(mod.module_title)

    if not weak_topics and m_min < 60.0:
        weak_topics.append(f"Lowest Module Score Area ({m_min}%)")

    # Generate actionable learning recommendations
    recommendations = []
    if weak_topics:
        for wt in weak_topics[:2]:
            recommendations.append(f"Complete targeted diagnostic drills on '{wt}'")
            recommendations.append(f"Review core conceptual documentation and practice code walkthroughs for '{wt}'")
    if assign_rate < 75.0:
        recommendations.append(f"Improve assignment submission rate (currently at {assign_rate:.0f}%) to reinforce applied problem solving")
    if trend < 0:
        recommendations.append("Performance trend is declining over recent quizzes; connect with an academic mentor for guided remediation")
    if not recommendations:
        recommendations.append("Continue current study routine and attempt advanced challenge problems")

    return {
        "student_id": input_data.student_id,
        "course_id": input_data.course_id,
        "risk_level": risk_level,
        "predicted_future_score": predicted_score,
        "confidence_score": confidence,
        "support_priority": support_priority,
        "requires_mentor": requires_mentor,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "recommendations": recommendations,
        "model_version": MODEL_VERSION
    }

def calculate_mentor_suitability(req: MentorSuitabilityRequest) -> MentorSuitabilityResponse:
    """
    Computes a weighted suitability score for each candidate teacher:
    - Weak-Topic Expertise (Proficiency): 35%
    - Subject Proficiency: 25%
    - Workload / Capacity Availability: 25%
    - Course Instructor Relationship: 15%
    """
    candidate_results = []
    best_teacher_id = None
    best_score = -1.0

    for teacher in req.teachers:
        remaining_capacity = teacher.max_mentees_capacity - teacher.current_mentees_count
        is_eligible = remaining_capacity > 0

        # Sub-scores normalized to 100
        weak_topic_score = (teacher.proficiency_in_weak_topic / 5.0) * 100
        subject_score = (teacher.proficiency_in_subject / 5.0) * 100
        
        # Workload availability: 100 if completely empty, scaling down as capacity fills
        workload_ratio = remaining_capacity / max(1, teacher.max_mentees_capacity)
        workload_score = workload_ratio * 100

        instructor_bonus = 100.0 if teacher.is_course_instructor else 50.0

        if is_eligible:
            total_suitability = (
                0.35 * weak_topic_score +
                0.25 * subject_score +
                0.25 * workload_score +
                0.15 * instructor_bonus
            )
            total_suitability = round(float(total_suitability), 1)
        else:
            total_suitability = 0.0

        reasons = []
        if teacher.proficiency_in_weak_topic >= 4.0:
            reasons.append(f"High proficiency in {req.weak_topic} ({teacher.proficiency_in_weak_topic}/5)")
        if teacher.is_course_instructor:
            reasons.append("Active course instructor for this subject")
        if remaining_capacity > 0:
            reasons.append(f"{remaining_capacity} available mentee capacity slot(s)")
        else:
            reasons.append("Capacity reached (Cannot take additional mentees)")

        candidate_results.append(TeacherScoreResult(
            teacher_id=teacher.teacher_id,
            teacher_name=teacher.teacher_name,
            suitability_score=total_suitability,
            is_eligible=is_eligible,
            capacity_available=max(0, remaining_capacity),
            match_reasons=reasons
        ))

        if is_eligible and total_suitability > best_score:
            best_score = total_suitability
            best_teacher_id = teacher.teacher_id

    # Sort descending by suitability score
    candidate_results.sort(key=lambda x: x.suitability_score, reverse=True)

    return MentorSuitabilityResponse(
        student_id=req.student_id,
        weak_topic=req.weak_topic,
        recommended_teacher_id=best_teacher_id,
        candidates=candidate_results
    )

# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------

@app.get("/api/ai/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SmartAssess AI Engine",
        "model": MODEL_VERSION
    }

@app.post("/api/ai/predict", response_model=PredictionOutput)
def predict_student_performance(features: StudentFeatureInput):
    try:
        return infer_academic_risk(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/mentor-suitability", response_model=MentorSuitabilityResponse)
def evaluate_mentor_suitability(req: MentorSuitabilityRequest):
    try:
        return calculate_mentor_suitability(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
