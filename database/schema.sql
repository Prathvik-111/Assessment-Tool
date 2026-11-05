-- ============================================================================
-- SmartAssess AI: Relational PostgreSQL Database Schema
-- Version: 1.0.0
-- 23 Relational Tables with Primary Keys, Foreign Keys, Indexes & Constraints
-- ============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS
CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(100),
    address TEXT,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE account_status AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'DEACTIVATED', 'SUSPENDED');

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) REFERENCES institutions(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    status account_status NOT NULL DEFAULT 'ACTIVE',
    avatar_url TEXT,
    phone VARCHAR(50),
    department VARCHAR(100),
    max_mentees INTEGER DEFAULT 5, -- For teachers
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_institution ON users(institution_id);

-- 3. TEACHER EXPERTISE
CREATE TABLE IF NOT EXISTS teacher_expertise (
    id VARCHAR(64) PRIMARY KEY,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5), -- 1: Novice to 5: Master
    years_experience NUMERIC(4, 1) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teacher_expertise_teacher ON teacher_expertise(teacher_id);
CREATE INDEX idx_teacher_expertise_subject_topic ON teacher_expertise(subject, topic);

-- 4. COURSES
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) REFERENCES institutions(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    thumbnail_url TEXT,
    difficulty_level VARCHAR(50) DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    is_published BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_category ON courses(category);

-- 5. TEACHER COURSES (Course Instructors)
CREATE TABLE IF NOT EXISTS teacher_courses (
    id VARCHAR(64) PRIMARY KEY,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    is_primary_instructor BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_teacher_course UNIQUE (teacher_id, course_id)
);

CREATE INDEX idx_teacher_courses_teacher ON teacher_courses(teacher_id);
CREATE INDEX idx_teacher_courses_course ON teacher_courses(course_id);

-- 6. COURSE ENROLLMENTS
CREATE TYPE enrollment_status AS ENUM ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED');

CREATE TABLE IF NOT EXISTS course_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'ENROLLED',
    progress_percentage NUMERIC(5, 2) DEFAULT 0.00,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- 7. MODULES
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    weight_percentage NUMERIC(5, 2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_modules_course ON modules(course_id);

-- 8. LESSONS
CREATE TYPE material_type AS ENUM ('ARTICLE', 'VIDEO', 'PDF', 'DOCUMENT', 'PRACTICE');

CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    material_type material_type DEFAULT 'ARTICLE',
    media_url TEXT,
    duration_minutes INTEGER DEFAULT 15,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_module ON lessons(module_id);

-- 9. QUESTIONS (Question Bank)
CREATE TYPE question_type AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) REFERENCES modules(id) ON DELETE CASCADE,
    teacher_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    difficulty difficulty_level NOT NULL DEFAULT 'MEDIUM',
    options JSONB, -- Array of string choices for MCQ
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points NUMERIC(5, 2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_module ON questions(module_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);

-- 10. ASSESSMENTS (Quizzes / Exams)
CREATE TYPE assessment_type AS ENUM ('MODULE_QUIZ', 'MIDTERM', 'FINAL_EXAM', 'PRACTICE_TEST');

CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id VARCHAR(64) REFERENCES modules(id) ON DELETE SET NULL,
    created_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type assessment_type NOT NULL DEFAULT 'MODULE_QUIZ',
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    passing_marks NUMERIC(6, 2) NOT NULL DEFAULT 40.00,
    is_auto_graded BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_course ON assessments(course_id);
CREATE INDEX idx_assessments_module ON assessments(module_id);

-- 11. ASSESSMENT QUESTIONS (Join table for assessments & questions)
CREATE TABLE IF NOT EXISTS assessment_questions (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 1,
    allocated_marks NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    CONSTRAINT uq_assessment_question UNIQUE (assessment_id, question_id)
);

CREATE INDEX idx_assessment_questions_assessment ON assessment_questions(assessment_id);

-- 12. ASSESSMENT ATTEMPTS
CREATE TYPE attempt_status AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'GRADED', 'ABANDONED');

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    status attempt_status NOT NULL DEFAULT 'SUBMITTED',
    score_obtained NUMERIC(6, 2) DEFAULT 0.00,
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attempts_student ON assessment_attempts(student_id);
CREATE INDEX idx_attempts_assessment ON assessment_attempts(assessment_id);

-- 13. ASSESSMENT ANSWERS
CREATE TABLE IF NOT EXISTS assessment_answers (
    id VARCHAR(64) PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    submitted_answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded NUMERIC(5, 2) DEFAULT 0.00,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_answers_attempt ON assessment_answers(attempt_id);

-- 14. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id VARCHAR(64) REFERENCES modules(id) ON DELETE SET NULL,
    teacher_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    max_marks NUMERIC(6, 2) DEFAULT 100.00,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    allowed_formats TEXT DEFAULT 'PDF, DOCX, ZIP, PY, TXT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_course ON assignments(course_id);

-- 15. SUBMISSIONS
CREATE TYPE submission_status AS ENUM ('SUBMITTED', 'LATE', 'EVALUATED', 'RETURNED');

CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url TEXT,
    text_content TEXT,
    status submission_status DEFAULT 'SUBMITTED',
    marks_obtained NUMERIC(6, 2),
    feedback TEXT,
    evaluated_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    evaluated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_student_assignment UNIQUE (student_id, assignment_id)
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- 16. ASSESSMENT RESULTS
CREATE TABLE IF NOT EXISTS assessment_results (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id VARCHAR(64) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id VARCHAR(64) REFERENCES modules(id) ON DELETE SET NULL,
    score NUMERIC(6, 2) NOT NULL,
    total_marks NUMERIC(6, 2) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_results_student ON assessment_results(student_id);
CREATE INDEX idx_results_course ON assessment_results(course_id);
CREATE INDEX idx_results_module ON assessment_results(module_id);

-- 17. STUDENT PERFORMANCE (Aggregated metrics)
CREATE TABLE IF NOT EXISTS student_performance (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    overall_average NUMERIC(5, 2) DEFAULT 0.00,
    quizzes_attempted INTEGER DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,
    module_scores JSONB, -- Key-value map of moduleId => percentage
    trend VARCHAR(50) DEFAULT 'STABLE', -- IMPROVING, STABLE, DECLINING
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_course_perf UNIQUE (student_id, course_id)
);

CREATE INDEX idx_student_perf_student ON student_performance(student_id);

-- 18. AI PREDICTIONS
CREATE TYPE risk_level AS ENUM ('LOW', 'MODERATE', 'HIGH');

CREATE TABLE IF NOT EXISTS ai_predictions (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    model_version VARCHAR(50) DEFAULT 'RandomForest-v1.2',
    predicted_future_score NUMERIC(5, 2),
    risk_level risk_level NOT NULL DEFAULT 'LOW',
    weak_topics JSONB, -- Array of strings e.g. ["Loops and Functions"]
    strong_topics JSONB, -- Array of strings e.g. ["File Handling"]
    recommendations JSONB, -- Array of text suggestions
    requires_mentor BOOLEAN DEFAULT FALSE,
    support_priority VARCHAR(50) DEFAULT 'NONE', -- HIGH, MODERATE, LOW, NONE
    confidence_score NUMERIC(5, 2) DEFAULT 0.88,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_predictions_student ON ai_predictions(student_id);
CREATE INDEX idx_ai_predictions_course ON ai_predictions(course_id);

-- 19. MENTOR ASSIGNMENTS
CREATE TYPE mentor_status AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REASSIGNED', 'CANCELLED');
CREATE TYPE allocation_method AS ENUM ('AUTOMATIC', 'ADMIN_MANUAL', 'ADMIN_APPROVED');

CREATE TABLE IF NOT EXISTS mentor_assignments (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    target_module_id VARCHAR(64) REFERENCES modules(id) ON DELETE SET NULL,
    status mentor_status NOT NULL DEFAULT 'ASSIGNED',
    allocation_method allocation_method NOT NULL DEFAULT 'AUTOMATIC',
    suitability_score NUMERIC(5, 2) DEFAULT 90.00,
    reason TEXT NOT NULL,
    student_score_at_allocation NUMERIC(5, 2),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    review_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_active_mentor_student_course UNIQUE (student_id, course_id, status)
);

CREATE INDEX idx_mentor_assignments_student ON mentor_assignments(student_id);
CREATE INDEX idx_mentor_assignments_teacher ON mentor_assignments(teacher_id);
CREATE INDEX idx_mentor_assignments_status ON mentor_assignments(status);

-- 20. MENTORING SESSIONS
CREATE TYPE session_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

CREATE TABLE IF NOT EXISTS mentoring_sessions (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES mentor_assignments(id) ON DELETE CASCADE,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    agenda TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 45,
    meeting_link TEXT,
    status session_status DEFAULT 'SCHEDULED',
    outcome_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentoring_sessions_assignment ON mentoring_sessions(assignment_id);

-- 21. MENTORING NOTES
CREATE TABLE IF NOT EXISTS mentoring_notes (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES mentor_assignments(id) ON DELETE CASCADE,
    author_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_content TEXT NOT NULL,
    is_shared_with_student BOOLEAN DEFAULT TRUE,
    recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentoring_notes_assignment ON mentoring_notes(assignment_id);

-- 22. NOTIFICATIONS
CREATE TYPE notification_type AS ENUM ('ASSESSMENT_DUE', 'RESULT_PUBLISHED', 'MENTOR_ASSIGNED', 'SESSION_SCHEDULED', 'FEEDBACK_RECEIVED', 'ADMIN_ALERT');

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'ADMIN_ALERT',
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- 23. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) REFERENCES institutions(id) ON DELETE SET NULL,
    actor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(64),
    details JSONB,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
