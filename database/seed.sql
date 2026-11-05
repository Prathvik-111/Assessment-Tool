-- ============================================================================
-- SmartAssess AI: Seed Dataset
-- Populates 23 relational tables for realistic demonstration
-- ============================================================================

-- 1. INSTITUTIONS
INSERT INTO institutions (id, name, code, domain, address, contact_email, is_active) VALUES
('inst-01', 'National Institute of Technology & Engineering', 'NITE-MAIN', 'nite.edu', '100 University Boulevard, Tech Campus', 'academic@nite.edu', true),
('inst-02', 'Metropolitan Institute of Technology', 'MIT-CAMPUS', 'metrotech.edu', '45 Innovation Way, Metro City', 'support@metrotech.edu', true)
ON CONFLICT (id) DO NOTHING;

-- 2. USERS (Admin, Teachers, Students)
-- Passwords are representative hashes
INSERT INTO users (id, institution_id, name, email, password_hash, role, status, avatar_url, phone, department, max_mentees) VALUES
-- Admin
('usr-admin-01', 'inst-01', 'Dr. Elena Rostova', 'admin@smartassess.ai', 'pbkdf2:sha256:admin123', 'ADMIN', 'ACTIVE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', '+1-555-0100', 'Institutional Oversight', 0),

-- Teachers
('usr-teach-01', 'inst-01', 'Dr. Sarah Jenkins', 'sarah.jenkins@nite.edu', 'pbkdf2:sha256:teacher123', 'TEACHER', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1-555-0101', 'Computer Science', 4),
('usr-teach-02', 'inst-01', 'Prof. Michael Chen', 'michael.chen@nite.edu', 'pbkdf2:sha256:teacher123', 'TEACHER', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+1-555-0102', 'Software Engineering', 5),
('usr-teach-03', 'inst-01', 'Dr. Priya Ramesh', 'priya.ramesh@nite.edu', 'pbkdf2:sha256:teacher123', 'TEACHER', 'ACTIVE', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '+1-555-0103', 'Data Science & AI', 3),

-- Students
('usr-stud-01', 'inst-01', 'Aarav Sharma', 'aarav.sharma@student.edu', 'pbkdf2:sha256:student123', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '+1-555-0201', 'Computer Science Year 2', 0),
('usr-stud-02', 'inst-01', 'Sophia Martinez', 'sophia.m@student.edu', 'pbkdf2:sha256:student123', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+1-555-0202', 'Information Technology Year 2', 0),
('usr-stud-03', 'inst-01', 'Marcus Vance', 'marcus.v@student.edu', 'pbkdf2:sha256:student123', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+1-555-0203', 'Data Science Year 1', 0),
('usr-stud-04', 'inst-01', 'Zara Al-Mansoor', 'zara.a@student.edu', 'pbkdf2:sha256:student123', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+1-555-0204', 'Computer Science Year 3', 0)
ON CONFLICT (id) DO NOTHING;

-- 3. TEACHER EXPERTISE
INSERT INTO teacher_expertise (id, teacher_id, subject, topic, proficiency_level, years_experience) VALUES
('exp-01', 'usr-teach-01', 'Python Programming', 'Loops and Functions', 5, 8.5),
('exp-02', 'usr-teach-01', 'Python Programming', 'Lists and Dictionaries', 5, 8.5),
('exp-03', 'usr-teach-01', 'Data Structures', 'Trees and Graphs', 4, 6.0),
('exp-04', 'usr-teach-02', 'Python Programming', 'File Handling', 5, 10.0),
('exp-05', 'usr-teach-02', 'Software Engineering', 'Object-Oriented Design', 5, 11.5),
('exp-06', 'usr-teach-02', 'Database Systems', 'SQL and Normalization', 4, 7.0),
('exp-07', 'usr-teach-03', 'Machine Learning', 'Classification Algorithms', 5, 9.0),
('exp-08', 'usr-teach-03', 'Python Programming', 'Conditional Statements', 4, 5.0)
ON CONFLICT (id) DO NOTHING;

-- 4. COURSES
INSERT INTO courses (id, institution_id, code, title, description, category, thumbnail_url, difficulty_level, is_published) VALUES
('crs-py101', 'inst-01', 'CS-101', 'Python Programming Masterclass', 'Comprehensive fundamentals to advanced Python programming, control flow, functions, modular architecture, and file I/O.', 'Computer Science', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500', 'Beginner to Intermediate', true),
('crs-ds201', 'inst-01', 'CS-201', 'Data Structures & Algorithms in Depth', 'Essential computational structures: stacks, queues, trees, balanced binary search trees, and dynamic programming.', 'Computer Science', 'https://images.unsplash.com/photo-1516116211227-bbc042971d60?w=500', 'Intermediate', true),
('crs-db301', 'inst-01', 'CS-301', 'Relational Database Engineering & PostgreSQL', 'Relational database schema modeling, ACID transactions, complex queries, indexing techniques, and ORM pipelines.', 'Software Engineering', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500', 'Intermediate', true)
ON CONFLICT (id) DO NOTHING;

-- 5. TEACHER COURSES
INSERT INTO teacher_courses (id, teacher_id, course_id, is_primary_instructor) VALUES
('tc-01', 'usr-teach-01', 'crs-py101', true),
('tc-02', 'usr-teach-02', 'crs-py101', false),
('tc-03', 'usr-teach-02', 'crs-ds201', true),
('tc-04', 'usr-teach-03', 'crs-db301', true)
ON CONFLICT (id) DO NOTHING;

-- 6. COURSE ENROLLMENTS
INSERT INTO course_enrollments (id, student_id, course_id, status, progress_percentage) VALUES
('enr-01', 'usr-stud-01', 'crs-py101', 'IN_PROGRESS', 68.0),
('enr-02', 'usr-stud-01', 'crs-ds201', 'IN_PROGRESS', 42.0),
('enr-03', 'usr-stud-02', 'crs-py101', 'IN_PROGRESS', 85.0),
('enr-04', 'usr-stud-03', 'crs-py101', 'IN_PROGRESS', 34.0),
('enr-05', 'usr-stud-04', 'crs-py101', 'COMPLETED', 100.0)
ON CONFLICT (id) DO NOTHING;

-- 7. MODULES (Python Programming Course as specified in brief)
INSERT INTO modules (id, course_id, title, description, order_index, weight_percentage) VALUES
('mod-py-01', 'crs-py101', 'Module 1: Introduction to Python', 'Syntax, interpreter runtime, variables, arithmetic expressions and basic terminal interaction.', 1, 10.0),
('mod-py-02', 'crs-py101', 'Module 2: Variables and Data Types', 'Primitive types, immutability, strings, type conversion, memory model.', 2, 15.0),
('mod-py-03', 'crs-py101', 'Module 3: Conditional Statements', 'Boolean algebra, if-elif-else constructs, nested logic, pattern matching.', 3, 15.0),
('mod-py-04', 'crs-py101', 'Module 4: Loops and Functions', 'While loops, for-in iterables, recursion, scopes, keyword parameters, lambda expressions.', 4, 25.0),
('mod-py-05', 'crs-py101', 'Module 5: Lists and Dictionaries', 'Sequence manipulation, hash maps, comprehension syntax, unpacking, sorting algorithms.', 5, 20.0),
('mod-py-06', 'crs-py101', 'Module 6: File Handling & Final Assessment', 'File streams, context managers, exception safety, JSON/CSV parsing, comprehensive exam.', 6, 15.0)
ON CONFLICT (id) DO NOTHING;

-- 8. LESSONS
INSERT INTO lessons (id, module_id, title, content, material_type, duration_minutes, order_index) VALUES
('les-01', 'mod-py-01', '1.1 Python Architecture & Environment', 'Python is an interpreted, high-level, general-purpose language emphasizing code readability with significant indentation.', 'ARTICLE', 20, 1),
('les-02', 'mod-py-02', '2.1 Dynamic Typing & Memory References', 'Variables in Python are references to objects stored in the heap. Understand immutable vs mutable types.', 'ARTICLE', 25, 1),
('les-03', 'mod-py-03', '3.1 Boolean Flow & Conditional Logic', 'Mastering short-circuit evaluation in logical AND/OR operations and multi-branch decision trees.', 'ARTICLE', 30, 1),
('les-04', 'mod-py-04', '4.1 Iteration Patterns & Nested Loops', 'Common pitfalls with loop termination, off-by-one errors, and memory-efficient iterators.', 'VIDEO', 35, 1),
('les-05', 'mod-py-04', '4.2 Functional Decomposition & Closures', 'Writing pure functions, return statements, default mutable parameter dangers, and decorators.', 'DOCUMENT', 40, 2),
('les-06', 'mod-py-05', '5.1 Dictionary Internals & Hash Maps', 'Key hashing, collision resolution, O(1) average lookup complexity, and dictionary views.', 'PDF', 30, 1),
('les-07', 'mod-py-06', '6.1 File Streams & Context Managers', 'Safely opening and closing file descriptors using "with open(...) as f:" constructs and buffer flushing.', 'ARTICLE', 35, 1)
ON CONFLICT (id) DO NOTHING;

-- 9. QUESTIONS
INSERT INTO questions (id, module_id, teacher_id, question_text, question_type, difficulty, options, correct_answer, explanation, points) VALUES
('q-01', 'mod-py-01', 'usr-teach-01', 'What is the file extension for standard Python source files?', 'MULTIPLE_CHOICE', 'EASY', '["py", "pyc", "pyd", "python"]'::jsonb, 'py', 'Python scripts use the .py file extension.', 1.0),
('q-02', 'mod-py-02', 'usr-teach-01', 'Which of the following data types in Python is immutable?', 'MULTIPLE_CHOICE', 'MEDIUM', '["tuple", "list", "dict", "set"]'::jsonb, 'tuple', 'Tuples once created cannot have their items modified.', 2.0),
('q-03', 'mod-py-03', 'usr-teach-01', 'What will "bool(0)" evaluate to in Python?', 'MULTIPLE_CHOICE', 'EASY', '["False", "True", "None", "0"]'::jsonb, 'False', 'Numerical zero evaluates to boolean False.', 1.0),
('q-04', 'mod-py-04', 'usr-teach-01', 'What is the output of: def f(x=[]): x.append(1); return x; followed by f(); f()?', 'MULTIPLE_CHOICE', 'HARD', '["[1, 1]", "[1]", "TypeError", "None"]'::jsonb, '[1, 1]', 'Default list arguments in Python are instantiated once at function definition time, leading to state persistence across invocations.', 3.0),
('q-05', 'mod-py-04', 'usr-teach-01', 'A "while True" loop requires an explicit break or return statement to avoid an infinite loop.', 'TRUE_FALSE', 'EASY', '["True", "False"]'::jsonb, 'True', 'Without a terminating branch or exception, it continues indefinitely.', 1.0),
('q-06', 'mod-py-05', 'usr-teach-01', 'What is the average time complexity for key lookup in a Python dictionary?', 'MULTIPLE_CHOICE', 'MEDIUM', '["O(1)", "O(n)", "O(log n)", "O(n^2)"]'::jsonb, 'O(1)', 'Python dictionaries use hash tables which provide O(1) expected time lookup.', 2.0)
ON CONFLICT (id) DO NOTHING;

-- 10. ASSESSMENTS
INSERT INTO assessments (id, course_id, module_id, created_by, title, description, type, duration_minutes, total_marks, passing_marks, is_auto_graded, is_published) VALUES
('asm-q1', 'crs-py101', 'mod-py-01', 'usr-teach-01', 'Module 1 Quiz: Python Basics', 'Assessment on syntax, variables, and expressions.', 'MODULE_QUIZ', 20, 100.0, 40.0, true, true),
('asm-q2', 'crs-py101', 'mod-py-02', 'usr-teach-01', 'Module 2 Quiz: Variables & Types', 'Testing data structures, strings, and numeric types.', 'MODULE_QUIZ', 25, 100.0, 40.0, true, true),
('asm-q3', 'crs-py101', 'mod-py-03', 'usr-teach-01', 'Module 3 Quiz: Conditionals', 'Testing boolean expressions and branched execution.', 'MODULE_QUIZ', 25, 100.0, 40.0, true, true),
('asm-q4', 'crs-py101', 'mod-py-04', 'usr-teach-01', 'Module 4 Quiz: Loops & Functions', 'Comprehensive evaluation of loops, recursion, and function scope.', 'MODULE_QUIZ', 30, 100.0, 40.0, true, true),
('asm-q5', 'crs-py101', 'mod-py-05', 'usr-teach-01', 'Module 5 Quiz: Lists & Dictionaries', 'Collections, iteration methods, and key-value mapping.', 'MODULE_QUIZ', 30, 100.0, 40.0, true, true),
('asm-q6', 'crs-py101', 'mod-py-06', 'usr-teach-01', 'Module 6 Quiz: File Handling', 'IO streams, buffer management, serialization.', 'MODULE_QUIZ', 30, 100.0, 40.0, true, true)
ON CONFLICT (id) DO NOTHING;

-- 16. ASSESSMENT RESULTS (Student Aarav Sharma matching the exact project brief: 85%, 70%, 35% in loops, 50%, 80%)
INSERT INTO assessment_results (id, student_id, assessment_id, course_id, module_id, score, total_marks, percentage, passed) VALUES
('res-01', 'usr-stud-01', 'asm-q1', 'crs-py101', 'mod-py-01', 85.0, 100.0, 85.0, true),
('res-02', 'usr-stud-01', 'asm-q2', 'crs-py101', 'mod-py-02', 88.0, 100.0, 88.0, true),
('res-03', 'usr-stud-01', 'asm-q3', 'crs-py101', 'mod-py-03', 70.0, 100.0, 70.0, true),
('res-04', 'usr-stud-01', 'asm-q4', 'crs-py101', 'mod-py-04', 35.0, 100.0, 35.0, false), -- Loops & Functions weak area
('res-05', 'usr-stud-01', 'asm-q5', 'crs-py101', 'mod-py-05', 50.0, 100.0, 50.0, true),
('res-06', 'usr-stud-01', 'asm-q6', 'crs-py101', 'mod-py-06', 80.0, 100.0, 80.0, true)
ON CONFLICT (id) DO NOTHING;

-- 17. STUDENT PERFORMANCE
INSERT INTO student_performance (id, student_id, course_id, overall_average, quizzes_attempted, assignments_completed, module_scores, trend) VALUES
('perf-01', 'usr-stud-01', 'crs-py101', 68.0, 6, 3, '{"mod-py-01": 85.0, "mod-py-02": 88.0, "mod-py-03": 70.0, "mod-py-04": 35.0, "mod-py-05": 50.0, "mod-py-06": 80.0}'::jsonb, 'DECLINING')
ON CONFLICT (id) DO NOTHING;

-- 18. AI PREDICTIONS
INSERT INTO ai_predictions (id, student_id, course_id, model_version, predicted_future_score, risk_level, weak_topics, strong_topics, recommendations, requires_mentor, support_priority, confidence_score) VALUES
('pred-01', 'usr-stud-01', 'crs-py101', 'RandomForest-v1.2', 54.5, 'HIGH',
 '["Loops and Functions", "Nested Iteration Scope", "Recursion Base Cases"]'::jsonb,
 '["Python Basics", "Variables and Data Types", "File Handling"]'::jsonb,
 '["Review Lesson 4.1 on Iteration Patterns & Nested Loops", "Complete 5 targeted practice exercises on recursion and lambda functions", "Schedule an 1-on-1 mentor code walk-through"]'::jsonb,
 true, 'HIGH', 0.92)
ON CONFLICT (id) DO NOTHING;

-- 19. MENTOR ASSIGNMENTS (Auto-allocated Dr. Sarah Jenkins due to expertise in Loops & Functions + available capacity)
INSERT INTO mentor_assignments (id, student_id, teacher_id, course_id, target_module_id, status, allocation_method, suitability_score, reason, student_score_at_allocation, assigned_at) VALUES
('mnt-01', 'usr-stud-01', 'usr-teach-01', 'crs-py101', 'mod-py-04', 'IN_PROGRESS', 'AUTOMATIC', 96.5,
 'Student scored 35.0% in Module 4 (Loops and Functions), requiring High Priority intervention. Dr. Sarah Jenkins has a 5/5 expertise in Loops and Functions and is primary course instructor with 2 available mentee slots.',
 35.0, CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- 20. MENTORING SESSIONS
INSERT INTO mentoring_sessions (id, assignment_id, teacher_id, student_id, title, agenda, scheduled_at, duration_minutes, meeting_link, status, outcome_summary) VALUES
('sess-01', 'mnt-01', 'usr-teach-01', 'usr-stud-01', 'Diagnostic Code Review: Function Scopes & Loops', 'Analyze previous quiz mistakes in Module 4, debug nested while/for conditions, and practice parameter passing.', CURRENT_TIMESTAMP + INTERVAL '1 day', 45, 'https://meet.jit.si/smartassess-sess-01', 'SCHEDULED', NULL)
ON CONFLICT (id) DO NOTHING;

-- 21. MENTORING NOTES
INSERT INTO mentoring_notes (id, assignment_id, author_id, note_content, is_shared_with_student, recommended_action) VALUES
('note-01', 'mnt-01', 'usr-teach-01', 'Aarav has strong fundamentals in file handling and syntax, but struggles with the mutable default argument trap and termination conditions in nested while loops. We will focus on tracing variable state on paper before coding.', true, 'Complete Lesson 4.2 practice exercises and submit revision before Friday.')
ON CONFLICT (id) DO NOTHING;

-- 22. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, link_url, is_read) VALUES
('notif-01', 'usr-stud-01', 'Mentor Allocated', 'Dr. Sarah Jenkins has been assigned as your academic mentor for Module 4 (Loops and Functions).', 'MENTOR_ASSIGNED', '/mentor', false),
('notif-02', 'usr-teach-01', 'New Mentee Assigned', 'Aarav Sharma has been assigned to your mentoring roster for Python Programming (Support Priority: HIGH).', 'MENTOR_ASSIGNED', '/mentees', false),
('notif-03', 'usr-admin-01', 'Automatic Mentor Allocation Executed', 'System successfully matched 1 student with high-priority academic support needs to Dr. Sarah Jenkins.', 'ADMIN_ALERT', '/admin/mentor-allocation', false)
ON CONFLICT (id) DO NOTHING;

-- 23. AUDIT LOGS
INSERT INTO audit_logs (id, institution_id, actor_id, action, entity_type, entity_id, details) VALUES
('aud-01', 'inst-01', 'usr-admin-01', 'RUN_MENTOR_ALLOCATION', 'mentor_assignments', 'mnt-01', '{"method": "AUTOMATIC", "matched_student": "usr-stud-01", "assigned_teacher": "usr-teach-01", "suitability_score": 96.5}'::jsonb),
('aud-02', 'inst-01', 'usr-teach-01', 'PUBLISH_ASSESSMENT', 'assessments', 'asm-q4', '{"title": "Module 4 Quiz: Loops & Functions", "course": "crs-py101"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
