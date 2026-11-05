# SmartAssess AI: REST API Documentation
Version: 1.0.0

## Base URL
- Dev Server / Fullstack API: `http://localhost:3000/api`
- Python AI Service: `http://localhost:8000/api/ai`

---

## 1. Authentication & Users

### `POST /api/auth/login`
Authenticates a user with email and password/role.
- **Request Body**:
  ```json
  {
    "email": "aarav.sharma@student.edu",
    "password": "student123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "usr-stud-01",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@student.edu",
      "role": "STUDENT",
      "department": "Computer Science Year 2"
    }
  }
  ```

### `POST /api/auth/register`
Registers a new student or faculty account.
- **Request Body**:
  ```json
  {
    "name": "Maya Lin",
    "email": "maya.lin@nite.edu",
    "role": "TEACHER",
    "department": "Computer Science"
  }
  ```

---

## 2. Courses & Modules

### `GET /api/courses`
Lists all published courses.
- **Query Params**: `category`, `search`

### `GET /api/courses/:id/modules`
Returns all ordered modules and lessons for a course.

### `POST /api/courses/:id/enroll`
Enrolls the authenticated student in the course. Prevents duplicate enrollment.

---

## 3. Assessments & Auto-Grading

### `GET /api/assessments?courseId=crs-py101`
Retrieves published quizzes and examinations.

### `POST /api/assessments/:id/submit`
Submits student answers and triggers instantaneous automated grading.
- **Request Body**:
  ```json
  {
    "studentId": "usr-stud-01",
    "answers": {
      "q-01": ".py",
      "q-04": "[1, 1]",
      "q-05": "True"
    }
  }
  ```
- **Response**:
  ```json
  {
    "attemptId": "att-12345",
    "scoreObtained": 85,
    "totalMarks": 100,
    "percentage": 85.0,
    "passed": true,
    "feedback": [...]
  }
  ```

---

## 4. AI Machine Learning Service (FastAPI)

### `POST /api/ai/predict`
Calculates student failure risk and predicted future examination score using Scikit-learn Random Forest regression and classification.
- **Request Body**:
  ```json
  {
    "student_id": "usr-stud-01",
    "course_id": "crs-py101",
    "quiz_avg": 68.0,
    "assignment_completion_rate": 80.0,
    "min_module_score": 35.0,
    "attempts_per_quiz": 1.2,
    "score_trend_slope": -12.0,
    "module_scores": [
      {"module_id": "mod-py-01", "module_title": "Python Basics", "percentage": 85.0},
      {"module_id": "mod-py-04", "module_title": "Loops and Functions", "percentage": 35.0}
    ]
  }
  ```
- **Response**:
  ```json
  {
    "student_id": "usr-stud-01",
    "course_id": "crs-py101",
    "risk_level": "HIGH",
    "predicted_future_score": 54.5,
    "confidence_score": 0.94,
    "support_priority": "HIGH",
    "requires_mentor": true,
    "weak_topics": ["Loops and Functions"],
    "strong_topics": ["Python Basics"],
    "recommendations": [
      "Review Lesson 4.1 on Iteration Patterns & Nested Loops",
      "Complete 5 targeted practice exercises on recursion and lambda functions"
    ],
    "model_version": "RandomForest-v1.2"
  }
  ```

---

## 5. Automatic Student–Mentor Allocation

### `POST /api/admin/mentor-allocation/run`
Executes batch transactional allocation across all students requiring academic support.
- **Matching Weights**:
  - Weak-Topic Expertise: 35%
  - Subject Mastery: 25%
  - Faculty Workload Availability: 25%
  - Active Course Instructor: 15%
- **Capacity Constraint**: Teachers cannot exceed `max_mentees`.
- **Response**:
  ```json
  {
    "matchedCount": 1,
    "unmatchedCount": 0,
    "details": [
      "Matched Aarav Sharma with Dr. Sarah Jenkins (Suitability: 96.5%) for Loops and Functions"
    ]
  }
  ```

### `POST /api/admin/mentor-allocation/manual`
Allows administrators to manually assign or reassign a mentor with transactional capacity validation.
