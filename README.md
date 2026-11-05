# SmartAssess AI
**Intelligent Assessment Portal with AI-Based Student Performance Prediction and Automatic Mentor Allocation**

SmartAssess AI is a modern full-stack web application designed for educational institutions to manage courses, modular curriculum, practice questions, assignments, assessments, continuous student performance telemetry, and automated faculty mentoring.

---

## 1. Key System Capabilities

### 🎓 1. Student Portal
- **Interactive Dashboard**: Real-time academic metrics, overall assessment average, enrolled course tracks, assignments due, and upcoming quizzes.
- **Course & Module Explorer**: Detailed syllabus breakdown with lessons (Articles, Video lectures, PDF documents, and Code walkthroughs).
- **Interactive Assessment Runner**: Timed examination interface with Multiple Choice, True/False, and Short Answer questions, automatic grading, and instant feedback.
- **Assignment Submissions**: Submission of code/reports, deadline tracking, and faculty evaluations.
- **AI Performance Insights**: Machine learning diagnosis displaying risk level (**HIGH**, **MODERATE**, **LOW**), predicted exam scores, identified weak vs strong modules, and tailored study roadmaps.
- **"My Mentor" Dedicated Hub**: Direct access to assigned faculty specialist, allocation reason, session scheduling, mentor guidance notes, and progress comparison (baseline score vs post-mentoring score).

### 👨‍🏫 2. Faculty / Teacher Portal
- **Course & Module Authoring**: Create courses, publish/unpublish, add module sequences, and embed learning materials.
- **Question Bank**: Centralized repository of Multiple Choice, True/False, and Short Answer questions tagged by module and difficulty (Easy, Medium, Hard).
- **Assessment Builder**: Design module quizzes with customized timers, passing cutoffs, and question bank selection.
- **Assignment Evaluation**: Grade student submissions with marks and formative written feedback.
- **"My Mentees" Portal**: Caseload dashboard showing support priority tags, weak modules, diagnostic baselines, private/shared counseling notes, and session scheduling.
- **Student Analytics Reports**: Searchable gradebook with AI predictive indicators and itemized module results.

### 🏛️ 3. Administrator Console
- **Institutional Oversight**: Multi-tenant institution registration and department management.
- **User Account Lifecycle**: Student and faculty management, teacher registration approvals, account deactivations, and soft-delete retention policies.
- **Automatic Mentor Allocation Engine**:
  - One-click transactional execution.
  - Workload and capacity constraints (`current_mentees < max_mentees`).
  - Weighted suitability scoring: Weak-Topic Alignment (35%) + Subject Proficiency (25%) + Workload Availability (25%) + Course Instructor Status (15%).
  - Manual override and reassignment modal with capacity checks.
- **Audit Logs**: Immutable cryptographic audit trail tracking all administrative overrides, logins, grading events, and allocation runs.

---

## 2. Pre-Configured Demo Personas

Use the **Demo Persona Switcher** in the top navigation bar to test each role instantly:

| Persona | Role | Context / Demonstration Scenario |
| :--- | :--- | :--- |
| **Aarav Sharma** | `STUDENT` | Scored **35% in Module 4 (Loops & Functions)**. Flagged as **HIGH RISK** by the AI engine. Auto-allocated to Dr. Sarah Jenkins. |
| **Sophia Martinez** | `STUDENT` | High-performing student (**91.5% average**). Low academic risk. |
| **Dr. Sarah Jenkins** | `TEACHER` | Computer Science faculty with **5/5 proficiency in Loops & Functions**. Primary mentor for Aarav Sharma (1/4 slots used). |
| **Prof. Michael Chen** | `TEACHER` | Software Engineering & Database Systems specialist. Active instructor for Data Structures. |
| **Dr. Elena Rostova** | `ADMIN` | Institutional Dean / Administrator. Runs the automatic allocation engine and reviews audit logs. |

---

## 3. Technology Stack & Directory Structure

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts analytics, Motion.
- **Persistence**: Relational transactional database engine with 23 tables matching the PostgreSQL production schema (`/database/schema.sql`).
- **AI / ML Service**:
  - Python FastAPI microservice (`/ai-service/main.py`)
  - Scikit-learn Random Forest and Decision Tree models (`/ai-service/train_model.py`)
  - Feature extraction: quiz average, assignment completion rate, minimum module score, attempt frequency, and score trajectory slope.

```
smartassess-ai/
├── ai-service/             # Python FastAPI service & ML training pipeline
│   ├── main.py             # FastAPI REST endpoints
│   ├── train_model.py      # Scikit-learn Random Forest / Decision Tree trainer
│   └── requirements.txt    # Python dependencies
├── database/               # Relational PostgreSQL artifacts
│   ├── schema.sql          # 23-table DDL schema with constraints & indexes
│   └── seed.sql            # Realistic academic demonstration seed data
├── docs/                   # API documentation
│   └── api_documentation.md
├── src/                    # React 19 / TypeScript application
│   ├── components/         # Top Navbar & dynamic role-based Sidebar
│   ├── context/            # Multi-role AuthContext with persona switcher
│   ├── pages/
│   │   ├── student/        # Dashboard, Course Catalog, Quiz Runner, My Mentor
│   │   ├── teacher/        # Teaching Console, Question Bank, My Mentees, Grading
│   │   ├── admin/          # Mentor Allocation Engine, User Manager, Audit Logs
│   │   └── shared/         # Profile & Institutional Threshold Settings
│   ├── services/
│   │   ├── db.ts           # Relational persistence & transactional allocation
│   │   └── aiMlEngine.ts   # Scikit-learn inference & weakness analyzer
│   └── types/              # Comprehensive TypeScript interfaces for all 23 entities
├── index.html
├── metadata.json
└── package.json
```

---

## 4. Local Installation & Startup

### Step 1: Frontend & Fullstack App
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 2: (Optional) Python FastAPI AI Microservice
```bash
cd ai-service

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Train the Random Forest & Decision Tree models
python train_model.py

# Start the FastAPI service on port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: PostgreSQL Relational Database (Optional Production Setup)
```bash
# Execute schema and seed data on your PostgreSQL instance
psql -U postgres -d smartassess -f database/schema.sql
psql -U postgres -d smartassess -f database/seed.sql
```

---

## 5. End-to-End Academic Workflow Demonstration

1. **Student Assessment**: Student Aarav Sharma completes Module 4 Quiz ("Loops and Functions") and scores 35%.
2. **AI Analysis**: The Machine Learning engine detects a score under the 40% high-priority support threshold, marks the student as **HIGH RISK**, and flags "Loops and Functions" as a critical weakness.
3. **Automatic Mentor Allocation**: The allocation engine runs, filters teachers for Loops & Functions expertise, identifies Dr. Sarah Jenkins (5/5 mastery, 2 available capacity slots), calculates a **96.5% suitability score**, and transactionally creates the mentor pairing.
4. **Instant Notifications**: Both student and teacher receive immediate alerts in their portal.
5. **Mentoring Intervention**: Dr. Sarah Jenkins opens her "My Mentees" roster, reviews the AI recommendations, schedules a 1-on-1 diagnostic review session, and logs feedback notes.
6. **Progress Monitoring**: Aarav reviews the feedback in "My Mentor", attends the session, retakes diagnostic exercises, and tracks progress before and after mentoring.
