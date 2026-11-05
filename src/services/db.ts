/**
 * SmartAssess AI: In-Memory / Local Relational Persistence Engine
 * Complete relational tables, foreign key integrity, transactional rollbacks,
 * audit logging, and initial seed data matching the 23 PostgreSQL tables.
 */

import {
  Institution,
  User,
  TeacherExpertise,
  Course,
  TeacherCourse,
  CourseEnrollment,
  Module,
  Lesson,
  Question,
  Assessment,
  AssessmentQuestion,
  AssessmentAttempt,
  AssessmentAnswer,
  Assignment,
  Submission,
  AssessmentResult,
  StudentPerformance,
  AiPrediction,
  MentorAssignment,
  MentoringSession,
  MentoringNote,
  Notification,
  AuditLog,
  TeacherWorkloadStats,
  MentorCandidateEvaluation,
  Certificate,
  PaymentRecord,
} from '../types/index.ts';

const STORAGE_KEY = 'smartassess_database_v1';

export interface DatabaseState {
  institutions: Institution[];
  users: User[];
  teacher_expertise: TeacherExpertise[];
  courses: Course[];
  teacher_courses: TeacherCourse[];
  course_enrollments: CourseEnrollment[];
  modules: Module[];
  lessons: Lesson[];
  questions: Question[];
  assessments: Assessment[];
  assessment_questions: AssessmentQuestion[];
  assessment_attempts: AssessmentAttempt[];
  assessment_answers: AssessmentAnswer[];
  assignments: Assignment[];
  submissions: Submission[];
  assessment_results: AssessmentResult[];
  student_performance: StudentPerformance[];
  ai_predictions: AiPrediction[];
  mentor_assignments: MentorAssignment[];
  mentoring_sessions: MentoringSession[];
  mentoring_notes: MentoringNote[];
  notifications: Notification[];
  audit_logs: AuditLog[];
  certificates: Certificate[];
  payments: PaymentRecord[];
}

function getInitialSeedData(): DatabaseState {
  const now = new Date().toISOString();
  const pastDay = new Date(Date.now() - 86400000 * 2).toISOString();
  const pastThreeDays = new Date(Date.now() - 86400000 * 3).toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString();

  return {
    institutions: [
      {
        id: 'inst-01',
        name: 'National Institute of Technology & Engineering',
        code: 'NITE-MAIN',
        domain: 'nite.edu',
        address: '100 University Boulevard, Tech Campus',
        contactEmail: 'academic@nite.edu',
        isActive: true,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'inst-02',
        name: 'Metropolitan Institute of Technology',
        code: 'MIT-CAMPUS',
        domain: 'metrotech.edu',
        address: '45 Innovation Way, Metro City',
        contactEmail: 'support@metrotech.edu',
        isActive: true,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
    ],
    users: [
      {
        id: 'usr-admin-01',
        institutionId: 'inst-01',
        name: 'Dr. Elena Rostova',
        email: 'admin@smartassess.ai',
        role: 'ADMIN',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        phone: '+1-555-0100',
        department: 'Institutional Oversight',
        maxMentees: 0,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-teach-01',
        institutionId: 'inst-01',
        name: 'Dr. Sarah Jenkins',
        email: 'sarah.jenkins@nite.edu',
        role: 'TEACHER',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        phone: '+1-555-0101',
        department: 'Computer Science',
        maxMentees: 4,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-teach-02',
        institutionId: 'inst-01',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@nite.edu',
        role: 'TEACHER',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        phone: '+1-555-0102',
        department: 'Software Engineering',
        maxMentees: 5,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-teach-03',
        institutionId: 'inst-01',
        name: 'Dr. Priya Ramesh',
        email: 'priya.ramesh@nite.edu',
        role: 'TEACHER',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        phone: '+1-555-0103',
        department: 'Data Science & AI',
        maxMentees: 3,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-stud-01',
        institutionId: 'inst-01',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@student.edu',
        role: 'STUDENT',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        phone: '+1-555-0201',
        department: 'Computer Science Year 2',
        maxMentees: 0,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-stud-02',
        institutionId: 'inst-01',
        name: 'Sophia Martinez',
        email: 'sophia.m@student.edu',
        role: 'STUDENT',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        phone: '+1-555-0202',
        department: 'Information Technology Year 2',
        maxMentees: 0,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-stud-03',
        institutionId: 'inst-01',
        name: 'Marcus Vance',
        email: 'marcus.v@student.edu',
        role: 'STUDENT',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        phone: '+1-555-0203',
        department: 'Data Science Year 1',
        maxMentees: 0,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'usr-stud-04',
        institutionId: 'inst-01',
        name: 'Zara Al-Mansoor',
        email: 'zara.a@student.edu',
        role: 'STUDENT',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
        phone: '+1-555-0204',
        department: 'Computer Science Year 3',
        maxMentees: 0,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
    ],
    teacher_expertise: [
      {
        id: 'exp-01',
        teacherId: 'usr-teach-01',
        subject: 'Python Programming',
        topic: 'Loops and Functions',
        proficiencyLevel: 5,
        yearsExperience: 8.5,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-02',
        teacherId: 'usr-teach-01',
        subject: 'Python Programming',
        topic: 'Lists and Dictionaries',
        proficiencyLevel: 5,
        yearsExperience: 8.5,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-03',
        teacherId: 'usr-teach-01',
        subject: 'Data Structures',
        topic: 'Trees and Graphs',
        proficiencyLevel: 4,
        yearsExperience: 6.0,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-04',
        teacherId: 'usr-teach-02',
        subject: 'Python Programming',
        topic: 'File Handling',
        proficiencyLevel: 5,
        yearsExperience: 10.0,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-05',
        teacherId: 'usr-teach-02',
        subject: 'Software Engineering',
        topic: 'Object-Oriented Design',
        proficiencyLevel: 5,
        yearsExperience: 11.5,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-06',
        teacherId: 'usr-teach-02',
        subject: 'Database Systems',
        topic: 'SQL and Normalization',
        proficiencyLevel: 4,
        yearsExperience: 7.0,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-07',
        teacherId: 'usr-teach-03',
        subject: 'Machine Learning',
        topic: 'Classification Algorithms',
        proficiencyLevel: 5,
        yearsExperience: 9.0,
        createdAt: pastThreeDays,
      },
      {
        id: 'exp-08',
        teacherId: 'usr-teach-03',
        subject: 'Python Programming',
        topic: 'Conditional Statements',
        proficiencyLevel: 4,
        yearsExperience: 5.0,
        createdAt: pastThreeDays,
      },
    ],
    courses: [
      {
        id: 'crs-py101',
        institutionId: 'inst-01',
        code: 'CS-101',
        title: 'Python Programming Masterclass',
        description: 'Comprehensive fundamentals to advanced Python programming, control flow, functions, modular architecture, and file I/O.',
        category: 'Computer Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
        difficultyLevel: 'Beginner',
        price: 1499,
        isPublished: true,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'crs-ds201',
        institutionId: 'inst-01',
        code: 'CS-201',
        title: 'Data Structures & Algorithms in Depth',
        description: 'Essential computational structures: stacks, queues, trees, balanced binary search trees, and dynamic programming.',
        category: 'Computer Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc042971d60?w=500',
        difficultyLevel: 'Intermediate',
        price: 1999,
        isPublished: true,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
      {
        id: 'crs-db301',
        institutionId: 'inst-01',
        code: 'CS-301',
        title: 'Relational Database Engineering & PostgreSQL',
        description: 'Relational database schema modeling, ACID transactions, complex queries, indexing techniques, and ORM pipelines.',
        category: 'Software Engineering',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500',
        difficultyLevel: 'Intermediate',
        price: 2499,
        isPublished: true,
        isDeleted: false,
        createdAt: pastThreeDays,
        updatedAt: pastThreeDays,
      },
    ],
    teacher_courses: [
      { id: 'tc-01', teacherId: 'usr-teach-01', courseId: 'crs-py101', isPrimaryInstructor: true, assignedAt: pastThreeDays },
      { id: 'tc-02', teacherId: 'usr-teach-02', courseId: 'crs-py101', isPrimaryInstructor: false, assignedAt: pastThreeDays },
      { id: 'tc-03', teacherId: 'usr-teach-02', courseId: 'crs-ds201', isPrimaryInstructor: true, assignedAt: pastThreeDays },
      { id: 'tc-04', teacherId: 'usr-teach-03', courseId: 'crs-db301', isPrimaryInstructor: true, assignedAt: pastThreeDays },
    ],
    course_enrollments: [
      { id: 'enr-01', studentId: 'usr-stud-01', courseId: 'crs-py101', status: 'IN_PROGRESS', progressPercentage: 68.0, enrolledAt: pastThreeDays },
      { id: 'enr-02', studentId: 'usr-stud-01', courseId: 'crs-ds201', status: 'IN_PROGRESS', progressPercentage: 42.0, enrolledAt: pastThreeDays },
      { id: 'enr-03', studentId: 'usr-stud-02', courseId: 'crs-py101', status: 'IN_PROGRESS', progressPercentage: 85.0, enrolledAt: pastThreeDays },
      { id: 'enr-04', studentId: 'usr-stud-03', courseId: 'crs-py101', status: 'IN_PROGRESS', progressPercentage: 34.0, enrolledAt: pastThreeDays },
      { id: 'enr-05', studentId: 'usr-stud-04', courseId: 'crs-py101', status: 'COMPLETED', progressPercentage: 100.0, enrolledAt: pastThreeDays, completedAt: pastDay },
    ],
    modules: [
      { id: 'mod-py-01', courseId: 'crs-py101', title: 'Module 1: Introduction to Python', description: 'Syntax, interpreter runtime, variables, arithmetic expressions and basic terminal interaction.', orderIndex: 1, weightPercentage: 10.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-py-02', courseId: 'crs-py101', title: 'Module 2: Variables and Data Types', description: 'Primitive types, immutability, strings, type conversion, memory model.', orderIndex: 2, weightPercentage: 15.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-py-03', courseId: 'crs-py101', title: 'Module 3: Conditional Statements', description: 'Boolean algebra, if-elif-else constructs, nested logic, pattern matching.', orderIndex: 3, weightPercentage: 15.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-py-04', courseId: 'crs-py101', title: 'Module 4: Loops and Functions', description: 'While loops, for-in iterables, recursion, scopes, keyword parameters, lambda expressions.', orderIndex: 4, weightPercentage: 25.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-py-05', courseId: 'crs-py101', title: 'Module 5: Lists and Dictionaries', description: 'Sequence manipulation, hash maps, comprehension syntax, unpacking, sorting algorithms.', orderIndex: 5, weightPercentage: 20.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-py-06', courseId: 'crs-py101', title: 'Module 6: File Handling', description: 'File streams, context managers, exception safety, JSON/CSV parsing, comprehensive exam.', orderIndex: 6, weightPercentage: 15.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      
      // Data Structures & Algorithms modules (CS-201)
      { id: 'mod-ds-01', courseId: 'crs-ds201', title: 'Module 1: Linear Structures (Stacks, Queues & Linked Lists)', description: 'Abstract Data Types, pointer traversal, circular buffers, amortized array resizing, and LIFO/FIFO mechanics.', orderIndex: 1, weightPercentage: 25.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-ds-02', courseId: 'crs-ds201', title: 'Module 2: Trees & Balanced Binary Search Trees (AVL)', description: 'Binary trees, BST invariants, tree balancing, rotations, height bounds, and heap priority queues.', orderIndex: 2, weightPercentage: 25.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-ds-03', courseId: 'crs-ds201', title: 'Module 3: Graph Representations & Traversals (BFS & DFS)', description: 'Adjacency list versus matrix, cycle detection, topological sorting, Dijkstra single-source shortest path.', orderIndex: 3, weightPercentage: 25.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-ds-04', courseId: 'crs-ds201', title: 'Module 4: Dynamic Programming & Optimal Substructure', description: 'Memoization, tabulation, coin change, longest common subsequence, and knapsack problem modeling.', orderIndex: 4, weightPercentage: 25.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },

      // Database Engineering modules (CS-301)
      { id: 'mod-db-01', courseId: 'crs-db301', title: 'Module 1: Relational Modeling & Normal Forms (1NF-BCNF)', description: 'Entity-relationship diagrams, functional dependencies, lossless decomposition, and normalization.', orderIndex: 1, weightPercentage: 30.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-db-02', courseId: 'crs-db301', title: 'Module 2: Advanced SQL, Window Functions & CTEs', description: 'Multi-table inner/outer joins, aggregation, partition by windows, recursive CTEs, and query planner analysis.', orderIndex: 2, weightPercentage: 35.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'mod-db-03', courseId: 'crs-db301', title: 'Module 3: Indexing, B-Trees & ACID Transactions', description: 'B-Tree vs Hash index scan, MVCC concurrency, isolation levels (Read Committed, Serializable), write-ahead logging.', orderIndex: 3, weightPercentage: 35.0, createdAt: pastThreeDays, updatedAt: pastThreeDays },
    ],
    lessons: [
      { id: 'les-01', moduleId: 'mod-py-01', title: '1.1 Python Architecture & Environment', content: 'Python is an interpreted, high-level, general-purpose language designed for rapid application prototyping and high readability. It utilizes dynamic typing and reference counting garbage collection.', materialType: 'ARTICLE', durationMinutes: 20, orderIndex: 1, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'les-02', moduleId: 'mod-py-02', title: '2.1 Dynamic Typing & Memory References', content: 'Variables in Python do not store values directly; they are pointers or references to objects in memory. Primitive numbers, strings, and tuples are strictly immutable.', materialType: 'ARTICLE', durationMinutes: 25, orderIndex: 1, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'les-03', moduleId: 'mod-py-03', title: '3.1 Boolean Flow & Conditional Logic', content: 'Explore relational and logical operators in Python. Understand short-circuit evaluation in and/or conditions and proper use of elif blocks.', materialType: 'ARTICLE', durationMinutes: 30, orderIndex: 1, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'les-04', moduleId: 'mod-py-04', title: '4.1 Iteration Patterns & Nested Loops', content: 'Loops in Python are powerful with the iterator protocol. Avoid common pitfalls including modifying lists while iterating over them, and watch for off-by-one errors in range() limits.', materialType: 'VIDEO', durationMinutes: 35, orderIndex: 1, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'les-05', moduleId: 'mod-py-04', title: '4.2 Functional Decomposition & Closures', content: 'Writing pure functions, return values, variable scope rules (LEGB: Local, Enclosing, Global, Built-in), and avoiding default mutable parameters in def f(x=[]).', materialType: 'DOCUMENT', durationMinutes: 40, orderIndex: 2, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'les-06', moduleId: 'mod-py-05', title: '5.1 Dictionary Internals & Hash Maps', content: 'Python dictionaries utilize optimized hash tables. Keys must be hashable and immutable. Amortized lookup, insertion, and deletion are O(1).', materialType: 'PDF', durationMinutes: 30, orderIndex: 1, createdAt: pastThreeDays, updatedAt: pastThreeDays },
      { id: 'les-07', moduleId: 'mod-py-06', title: '6.1 File Streams & Context Managers', content: 'Always access file descriptors using the "with open(...) as f:" context manager to guarantee automatic descriptor closing even during exceptions.', materialType: 'ARTICLE', durationMinutes: 35, orderIndex: 1, createdAt: pastThreeDays, updatedAt: pastThreeDays },
    ],
    questions: [
      {
        id: 'q-01',
        moduleId: 'mod-py-01',
        teacherId: 'usr-teach-01',
        questionText: 'What is the file extension for standard Python source files?',
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        options: ['.py', '.pyc', '.pyd', '.python'],
        correctAnswer: '.py',
        explanation: 'Python scripts use the .py file extension.',
        points: 10,
        createdAt: pastThreeDays,
      },
      {
        id: 'q-02',
        moduleId: 'mod-py-02',
        teacherId: 'usr-teach-01',
        questionText: 'Which of the following data structures in Python is immutable?',
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        options: ['tuple', 'list', 'dict', 'set'],
        correctAnswer: 'tuple',
        explanation: 'Tuples once created cannot have their items modified.',
        points: 20,
        createdAt: pastThreeDays,
      },
      {
        id: 'q-03',
        moduleId: 'mod-py-03',
        teacherId: 'usr-teach-01',
        questionText: 'What does "bool(0)" evaluate to in Python?',
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        options: ['False', 'True', 'None', 'Error'],
        correctAnswer: 'False',
        explanation: 'Zero is falsy in Python boolean evaluation.',
        points: 15,
        createdAt: pastThreeDays,
      },
      {
        id: 'q-04',
        moduleId: 'mod-py-04',
        teacherId: 'usr-teach-01',
        questionText: 'What is the output of: def f(x=[]): x.append(1); return x; followed by f(); print(f())?',
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        options: ['[1, 1]', '[1]', 'TypeError', 'None'],
        correctAnswer: '[1, 1]',
        explanation: 'Default mutable arguments in Python are evaluated once at function definition time, retaining mutations across calls.',
        points: 25,
        createdAt: pastThreeDays,
      },
      {
        id: 'q-05',
        moduleId: 'mod-py-04',
        teacherId: 'usr-teach-01',
        questionText: 'A "while True" loop requires a break statement or raised exception to terminate.',
        questionType: 'TRUE_FALSE',
        difficulty: 'EASY',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Without a break condition or exception, while True will loop indefinitely.',
        points: 10,
        createdAt: pastThreeDays,
      },
      {
        id: 'q-06',
        moduleId: 'mod-py-05',
        teacherId: 'usr-teach-01',
        questionText: 'What is the average time complexity for key lookup in a Python dictionary?',
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctAnswer: 'O(1)',
        explanation: 'Python dictionaries utilize hash tables with amortized O(1) key access.',
        points: 20,
        createdAt: pastThreeDays,
      },
    ],
    assessments: [
      {
        id: 'asm-q1',
        courseId: 'crs-py101',
        moduleId: 'mod-py-01',
        createdBy: 'usr-teach-01',
        title: 'Module 1 Quiz: Python Basics',
        description: 'Assessment on syntax, variables, and expressions.',
        type: 'MODULE_QUIZ',
        durationMinutes: 20,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-01'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-q2',
        courseId: 'crs-py101',
        moduleId: 'mod-py-02',
        createdBy: 'usr-teach-01',
        title: 'Module 2 Quiz: Variables & Types',
        description: 'Testing data structures, strings, and numeric types.',
        type: 'MODULE_QUIZ',
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-02'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-q3',
        courseId: 'crs-py101',
        moduleId: 'mod-py-03',
        createdBy: 'usr-teach-01',
        title: 'Module 3 Quiz: Conditional Statements',
        description: 'Testing boolean logic and branched control flow.',
        type: 'MODULE_QUIZ',
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-03'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-q4',
        courseId: 'crs-py101',
        moduleId: 'mod-py-04',
        createdBy: 'usr-teach-01',
        title: 'Module 4 Quiz: Loops & Functions',
        description: 'Rigorous assessment of iterative logic, recursion, scope rules, and lambda functions.',
        type: 'MODULE_QUIZ',
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-04', 'q-05'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-q5',
        courseId: 'crs-py101',
        moduleId: 'mod-py-05',
        createdBy: 'usr-teach-01',
        title: 'Module 5 Quiz: Lists & Dictionaries',
        description: 'Collections manipulation, indexing, and dictionary comprehension.',
        type: 'MODULE_QUIZ',
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-06'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-q6',
        courseId: 'crs-py101',
        moduleId: 'mod-py-06',
        createdBy: 'usr-teach-01',
        title: 'Module 6 Quiz: File Handling & Final Assessment',
        description: 'Stream operations, exception boundaries, and serialization.',
        type: 'FINAL_EXAM',
        durationMinutes: 45,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-01', 'q-04'],
        createdAt: pastThreeDays,
      },
      // Data Structures assessments
      {
        id: 'asm-ds-q1',
        courseId: 'crs-ds201',
        moduleId: 'mod-ds-01',
        createdBy: 'usr-teach-02',
        title: 'Module 1 Quiz: Linear Data Structures',
        description: 'Stacks, Queues, Linked Lists, amortized memory complexity.',
        type: 'MODULE_QUIZ',
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-02'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-ds-q2',
        courseId: 'crs-ds201',
        moduleId: 'mod-ds-02',
        createdBy: 'usr-teach-02',
        title: 'Module 2 Quiz: Trees & Balanced BSTs',
        description: 'Binary search tree rotations, height bounds, and traversal algorithms.',
        type: 'MODULE_QUIZ',
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-06'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-ds-q3',
        courseId: 'crs-ds201',
        moduleId: 'mod-ds-03',
        createdBy: 'usr-teach-02',
        title: 'Module 3 Quiz: Graph Traversals & Shortest Paths',
        description: 'BFS, DFS, Dijkstra, cycle detection, and topological sorting.',
        type: 'MODULE_QUIZ',
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-04'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-ds-q4',
        courseId: 'crs-ds201',
        moduleId: 'mod-ds-04',
        createdBy: 'usr-teach-02',
        title: 'Module 4 Quiz: Dynamic Programming (Final Exam)',
        description: 'Comprehensive dynamic programming and optimal substructures examination.',
        type: 'FINAL_EXAM',
        durationMinutes: 45,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-04', 'q-06'],
        createdAt: pastThreeDays,
      },
      // Database assessments
      {
        id: 'asm-db-q1',
        courseId: 'crs-db301',
        moduleId: 'mod-db-01',
        createdBy: 'usr-teach-03',
        title: 'Module 1 Quiz: Relational Modeling & Normalization',
        description: '1NF, 2NF, 3NF, BCNF, functional dependencies and integrity constraints.',
        type: 'MODULE_QUIZ',
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-03'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-db-q2',
        courseId: 'crs-db301',
        moduleId: 'mod-db-02',
        createdBy: 'usr-teach-03',
        title: 'Module 2 Quiz: Advanced SQL & Window Functions',
        description: 'Complex joins, aggregations, recursive CTEs, and window analytics.',
        type: 'MODULE_QUIZ',
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-01'],
        createdAt: pastThreeDays,
      },
      {
        id: 'asm-db-q3',
        courseId: 'crs-db301',
        moduleId: 'mod-db-03',
        createdBy: 'usr-teach-03',
        title: 'Module 3 Quiz: Indexing & ACID Transactions (Final Exam)',
        description: 'B-Tree scans, MVCC concurrency, isolation levels, and write-ahead logging.',
        type: 'FINAL_EXAM',
        durationMinutes: 45,
        totalMarks: 100,
        passingMarks: 40,
        isAutoGraded: true,
        isPublished: true,
        questionIds: ['q-02', 'q-06'],
        createdAt: pastThreeDays,
      },
    ],
    assessment_questions: [
      { id: 'aq-1', assessmentId: 'asm-q1', questionId: 'q-01', orderIndex: 1, allocatedMarks: 100 },
      { id: 'aq-2', assessmentId: 'asm-q2', questionId: 'q-02', orderIndex: 1, allocatedMarks: 100 },
      { id: 'aq-3', assessmentId: 'asm-q3', questionId: 'q-03', orderIndex: 1, allocatedMarks: 100 },
      { id: 'aq-4', assessmentId: 'asm-q4', questionId: 'q-04', orderIndex: 1, allocatedMarks: 60 },
      { id: 'aq-5', assessmentId: 'asm-q4', questionId: 'q-05', orderIndex: 2, allocatedMarks: 40 },
      { id: 'aq-6', assessmentId: 'asm-q5', questionId: 'q-06', orderIndex: 1, allocatedMarks: 100 },
    ],
    assessment_attempts: [
      { id: 'att-01', assessmentId: 'asm-q4', studentId: 'usr-stud-01', attemptNumber: 1, status: 'GRADED', scoreObtained: 35, percentage: 35.0, startedAt: pastThreeDays, submittedAt: pastThreeDays },
    ],
    assessment_answers: [
      { id: 'ans-01', attemptId: 'att-01', questionId: 'q-04', submittedAnswer: '[1]', isCorrect: false, marksAwarded: 0, feedback: 'Incorrect: Default mutable arguments maintain memory state across calls.', createdAt: pastThreeDays },
      { id: 'ans-02', attemptId: 'att-01', questionId: 'q-05', submittedAnswer: 'True', isCorrect: true, marksAwarded: 35, feedback: 'Correct answer.', createdAt: pastThreeDays },
    ],
    assignments: [
      {
        id: 'asg-01',
        courseId: 'crs-py101',
        moduleId: 'mod-py-04',
        teacherId: 'usr-teach-01',
        title: 'Project: Recursive Pattern Generator & Prime Sieve',
        instructions: 'Implement a pure function for generating prime numbers using the Sieve of Eratosthenes, and build a fractal tree generator with recursive depth limits.',
        maxMarks: 100,
        dueDate: tomorrow,
        allowedFormats: 'PDF, PY, ZIP',
        createdAt: pastThreeDays,
      },
      {
        id: 'asg-02',
        courseId: 'crs-py101',
        moduleId: 'mod-py-05',
        teacherId: 'usr-teach-01',
        title: 'Project: Custom Inventory Manager using Dictionaries',
        instructions: 'Build a command-line inventory system tracking SKU codes, prices, and stock updates with nested dictionaries.',
        maxMarks: 100,
        dueDate: tomorrow,
        allowedFormats: 'PY, ZIP',
        createdAt: pastThreeDays,
      },
    ],
    submissions: [
      {
        id: 'sub-01',
        assignmentId: 'asg-01',
        studentId: 'usr-stud-01',
        fileUrl: 'https://smartassess.ai/uploads/aarav_sieve.py',
        textContent: '# Prime Sieve Implementation\ndef sieve(n):\n    primes = [True] * (n + 1)\n    p = 2\n    while (p * p <= n):\n        if primes[p]:\n            for i in range(p * p, n + 1, p):\n                primes[i] = False\n        p += 1\n    return [p for p in range(2, n) if primes[p]]',
        status: 'EVALUATED',
        marksObtained: 72,
        feedback: 'Good implementation of the sieve algorithm, but recursive fractal functions were missing proper edge condition limits.',
        evaluatedBy: 'usr-teach-01',
        submittedAt: pastDay,
        evaluatedAt: now,
      },
      {
        id: 'sub-02',
        assignmentId: 'asg-01',
        studentId: 'usr-stud-02',
        fileUrl: 'https://smartassess.ai/uploads/sophia_project.py',
        textContent: 'Full project with docstrings and unit tests.',
        status: 'EVALUATED',
        marksObtained: 95,
        feedback: 'Outstanding modular architecture and clean algorithmic complexity.',
        evaluatedBy: 'usr-teach-01',
        submittedAt: pastDay,
        evaluatedAt: now,
      },
      {
        id: 'sub-03',
        assignmentId: 'asg-01',
        studentId: 'usr-stud-03',
        fileUrl: 'https://smartassess.ai/uploads/marcus_asg.zip',
        textContent: 'Partial draft code.',
        status: 'SUBMITTED',
        marksObtained: undefined,
        feedback: undefined,
        evaluatedBy: undefined,
        submittedAt: pastDay,
      },
    ],
    assessment_results: [
      { id: 'res-01', studentId: 'usr-stud-01', assessmentId: 'asm-q1', courseId: 'crs-py101', moduleId: 'mod-py-01', score: 85, totalMarks: 100, percentage: 85.0, passed: true, recordedAt: pastThreeDays },
      { id: 'res-02', studentId: 'usr-stud-01', assessmentId: 'asm-q2', courseId: 'crs-py101', moduleId: 'mod-py-02', score: 88, totalMarks: 100, percentage: 88.0, passed: true, recordedAt: pastThreeDays },
      { id: 'res-03', studentId: 'usr-stud-01', assessmentId: 'asm-q3', courseId: 'crs-py101', moduleId: 'mod-py-03', score: 70, totalMarks: 100, percentage: 70.0, passed: true, recordedAt: pastThreeDays },
      { id: 'res-04', studentId: 'usr-stud-01', assessmentId: 'asm-q4', courseId: 'crs-py101', moduleId: 'mod-py-04', score: 35, totalMarks: 100, percentage: 35.0, passed: false, recordedAt: pastThreeDays }, // Exact requirement: 35% in Loops
      { id: 'res-05', studentId: 'usr-stud-01', assessmentId: 'asm-q5', courseId: 'crs-py101', moduleId: 'mod-py-05', score: 50, totalMarks: 100, percentage: 50.0, passed: true, recordedAt: pastDay },
      { id: 'res-06', studentId: 'usr-stud-01', assessmentId: 'asm-q6', courseId: 'crs-py101', moduleId: 'mod-py-06', score: 80, totalMarks: 100, percentage: 80.0, passed: true, recordedAt: now },
      
      // Sophia (high performer)
      { id: 'res-07', studentId: 'usr-stud-02', assessmentId: 'asm-q4', courseId: 'crs-py101', moduleId: 'mod-py-04', score: 92, totalMarks: 100, percentage: 92.0, passed: true, recordedAt: pastDay },
      
      // Marcus (moderate risk)
      { id: 'res-08', studentId: 'usr-stud-03', assessmentId: 'asm-q4', courseId: 'crs-py101', moduleId: 'mod-py-04', score: 48, totalMarks: 100, percentage: 48.0, passed: true, recordedAt: pastDay },
    ],
    student_performance: [
      {
        id: 'perf-01',
        studentId: 'usr-stud-01',
        courseId: 'crs-py101',
        overallAverage: 68.0,
        quizzesAttempted: 6,
        assignmentsCompleted: 2,
        moduleScores: {
          'mod-py-01': 85.0,
          'mod-py-02': 88.0,
          'mod-py-03': 70.0,
          'mod-py-04': 35.0,
          'mod-py-05': 50.0,
          'mod-py-06': 80.0,
        },
        trend: 'DECLINING',
        lastEvaluatedAt: now,
      },
      {
        id: 'perf-02',
        studentId: 'usr-stud-02',
        courseId: 'crs-py101',
        overallAverage: 91.5,
        quizzesAttempted: 6,
        assignmentsCompleted: 3,
        moduleScores: {
          'mod-py-01': 95.0,
          'mod-py-02': 90.0,
          'mod-py-03': 94.0,
          'mod-py-04': 92.0,
          'mod-py-05': 88.0,
          'mod-py-06': 90.0,
        },
        trend: 'IMPROVING',
        lastEvaluatedAt: now,
      },
      {
        id: 'perf-03',
        studentId: 'usr-stud-03',
        courseId: 'crs-py101',
        overallAverage: 52.0,
        quizzesAttempted: 4,
        assignmentsCompleted: 1,
        moduleScores: {
          'mod-py-01': 60.0,
          'mod-py-02': 55.0,
          'mod-py-03': 45.0,
          'mod-py-04': 48.0,
        },
        trend: 'DECLINING',
        lastEvaluatedAt: now,
      },
    ],
    ai_predictions: [
      {
        id: 'pred-01',
        studentId: 'usr-stud-01',
        courseId: 'crs-py101',
        modelVersion: 'RandomForest-v1.2',
        predictedFutureScore: 54.5,
        riskLevel: 'HIGH',
        weakTopics: ['Loops and Functions', 'Recursive Base Cases', 'Default Mutable Parameters'],
        strongTopics: ['Introduction to Python', 'Variables and Data Types', 'File Handling'],
        recommendations: [
          'Review Lesson 4.1 on Iteration Patterns & Nested Loops',
          'Complete 5 targeted practice exercises on recursion and lambda functions',
          'Schedule a 1-on-1 code walkthrough with allocated mentor Dr. Sarah Jenkins',
        ],
        requiresMentor: true,
        supportPriority: 'HIGH',
        confidenceScore: 0.94,
        createdAt: pastThreeDays,
      },
      {
        id: 'pred-02',
        studentId: 'usr-stud-02',
        courseId: 'crs-py101',
        modelVersion: 'RandomForest-v1.2',
        predictedFutureScore: 92.0,
        riskLevel: 'LOW',
        weakTopics: [],
        strongTopics: ['Loops and Functions', 'Data Structures', 'Python Basics'],
        recommendations: [
          'Explore advanced Python metaprogramming and decorator design patterns',
          'Consider acting as peer tutor in open study forums',
        ],
        requiresMentor: false,
        supportPriority: 'NONE',
        confidenceScore: 0.96,
        createdAt: pastDay,
      },
      {
        id: 'pred-03',
        studentId: 'usr-stud-03',
        courseId: 'crs-py101',
        modelVersion: 'RandomForest-v1.2',
        predictedFutureScore: 51.0,
        riskLevel: 'MODERATE',
        weakTopics: ['Conditional Statements', 'Loops and Functions'],
        strongTopics: ['Introduction to Python'],
        recommendations: [
          'Submit pending assignments to boost practical coding comprehension',
          'Attend supplemental lab hours on boolean control flow',
        ],
        requiresMentor: true,
        supportPriority: 'MODERATE',
        confidenceScore: 0.89,
        createdAt: pastDay,
      },
    ],
    mentor_assignments: [
      {
        id: 'mnt-01',
        studentId: 'usr-stud-01',
        teacherId: 'usr-teach-01',
        courseId: 'crs-py101',
        targetModuleId: 'mod-py-04',
        status: 'IN_PROGRESS',
        allocationMethod: 'AUTOMATIC',
        suitabilityScore: 96.5,
        reason: 'Student scored 35.0% in Module 4 (Loops and Functions), requiring High Priority intervention. Dr. Sarah Jenkins has 5/5 expertise in Loops and Functions and is primary course instructor with 2 available mentee slots.',
        studentScoreAtAllocation: 35.0,
        assignedAt: pastThreeDays,
        reviewDate: tomorrow,
      },
    ],
    mentoring_sessions: [
      {
        id: 'sess-01',
        assignmentId: 'mnt-01',
        teacherId: 'usr-teach-01',
        studentId: 'usr-stud-01',
        title: 'Diagnostic Code Review: Function Scopes & Loops',
        agenda: 'Review quiz question mistakes on default mutable argument traps, debug while loop infinite termination, and write recursive helper functions.',
        scheduledAt: tomorrow,
        durationMinutes: 45,
        meetingLink: 'https://meet.jit.si/smartassess-sess-01',
        status: 'SCHEDULED',
        createdAt: pastDay,
      },
    ],
    mentoring_notes: [
      {
        id: 'note-01',
        assignmentId: 'mnt-01',
        authorId: 'usr-teach-01',
        noteContent: 'Aarav exhibits good theoretical understanding of basic variables and file operations, but gets tripped up on nested iteration state changes and scope boundaries. Recommending hands-on tracing before writing code.',
        isSharedWithStudent: true,
        recommendedAction: 'Complete the Lesson 4.2 practice exercises and submit code comments explaining every loop boundary condition.',
        createdAt: pastDay,
      },
    ],
    notifications: [
      {
        id: 'notif-01',
        userId: 'usr-stud-01',
        title: 'Academic Mentor Assigned',
        message: 'Dr. Sarah Jenkins has been assigned as your academic mentor for Module 4 (Loops and Functions).',
        type: 'MENTOR_ASSIGNED',
        linkUrl: '/mentor',
        isRead: false,
        createdAt: pastThreeDays,
      },
      {
        id: 'notif-02',
        userId: 'usr-stud-01',
        title: 'Mentoring Session Scheduled',
        message: 'Dr. Sarah Jenkins scheduled "Diagnostic Code Review: Function Scopes & Loops" for tomorrow.',
        type: 'SESSION_SCHEDULED',
        linkUrl: '/mentor',
        isRead: false,
        createdAt: pastDay,
      },
      {
        id: 'notif-03',
        userId: 'usr-teach-01',
        title: 'New Mentee Assigned (High Priority)',
        message: 'Aarav Sharma has been assigned to your mentoring roster for Python Programming due to weak performance in Loops and Functions.',
        type: 'MENTOR_ASSIGNED',
        linkUrl: '/mentees',
        isRead: false,
        createdAt: pastThreeDays,
      },
      {
        id: 'notif-04',
        userId: 'usr-admin-01',
        title: 'Automatic Mentor Allocation Executed',
        message: 'Intelligent allocation engine matched 1 student with high-priority support needs to Dr. Sarah Jenkins (Suitability: 96.5%).',
        type: 'ADMIN_ALERT',
        linkUrl: '/admin/mentor-allocation',
        isRead: false,
        createdAt: pastThreeDays,
      },
    ],
    audit_logs: [
      {
        id: 'aud-01',
        institutionId: 'inst-01',
        actorId: 'usr-admin-01',
        actorName: 'Dr. Elena Rostova',
        action: 'RUN_AUTOMATIC_MENTOR_ALLOCATION',
        entityType: 'mentor_assignments',
        entityId: 'mnt-01',
        details: {
          method: 'AUTOMATIC',
          studentId: 'usr-stud-01',
          teacherId: 'usr-teach-01',
          course: 'CS-101',
          suitabilityScore: 96.5,
          reason: 'Score 35% in Loops and Functions',
        },
        ipAddress: '192.168.1.10',
        timestamp: pastThreeDays,
      },
      {
        id: 'aud-02',
        institutionId: 'inst-01',
        actorId: 'usr-teach-01',
        actorName: 'Dr. Sarah Jenkins',
        action: 'PUBLISH_ASSESSMENT',
        entityType: 'assessments',
        entityId: 'asm-q4',
        details: { title: 'Module 4 Quiz: Loops & Functions', totalMarks: 100 },
        ipAddress: '192.168.1.15',
        timestamp: pastThreeDays,
      },
      {
        id: 'aud-03',
        institutionId: 'inst-01',
        actorId: 'usr-teach-01',
        actorName: 'Dr. Sarah Jenkins',
        action: 'SCHEDULE_MENTORING_SESSION',
        entityType: 'mentoring_sessions',
        entityId: 'sess-01',
        details: { studentId: 'usr-stud-01', title: 'Diagnostic Code Review' },
        ipAddress: '192.168.1.15',
        timestamp: pastDay,
      },
    ],
    certificates: [
      {
        id: 'cert-01',
        certificateNumber: 'SMART-2026-CS101-8941',
        studentId: 'usr-stud-02',
        studentName: 'Sophia Martinez',
        assessmentId: 'asm-q1',
        assessmentTitle: 'Python Foundations & Data Types Mastery',
        courseTitle: 'Python Programming Masterclass',
        courseCode: 'CS-101',
        score: 95,
        totalMarks: 100,
        percentage: 95.0,
        grade: 'Distinction (A+)',
        issueDate: pastThreeDays,
        institutionName: 'National Institute of Technology & Engineering',
        institutionCode: 'NITE-MAIN',
        instructorName: 'Dr. Sarah Jenkins',
        verificationCode: 'VRF-9821-4820-SM',
        proctoredIntegrity: 99,
      },
      {
        id: 'cert-02',
        certificateNumber: 'SMART-2026-CS201-3142',
        studentId: 'usr-stud-01',
        studentName: 'Aarav Sharma',
        assessmentId: 'asm-q1',
        assessmentTitle: 'Python Variables & Expressions Mastery',
        courseTitle: 'Python Programming Masterclass',
        courseCode: 'CS-101',
        score: 80,
        totalMarks: 100,
        percentage: 80.0,
        grade: 'First Class (A)',
        issueDate: pastDay,
        institutionName: 'National Institute of Technology & Engineering',
        institutionCode: 'NITE-MAIN',
        instructorName: 'Dr. Sarah Jenkins',
        verificationCode: 'VRF-3914-8172-AS',
        proctoredIntegrity: 96,
      },
    ],
    payments: [
      {
        id: 'pay-seed-01',
        studentId: 'usr-stud-01',
        studentName: 'Aarav Sharma',
        courseId: 'crs-py101',
        courseTitle: 'Python Programming Masterclass',
        courseCode: 'CS-101',
        amount: 1499,
        currency: 'INR',
        orderId: 'order_seed_01092841',
        paymentId: 'pay_test_01092841',
        paymentMethod: 'UPI',
        status: 'SUCCESS',
        paidAt: pastThreeDays,
      },
    ],
  };
}

class RelationalDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify key tables exist
        if (parsed.users && parsed.courses && parsed.mentor_assignments) {
          if (!parsed.certificates) parsed.certificates = [];
          if (!parsed.payments) parsed.payments = [];
          
          // Backfill prices
          parsed.courses.forEach((c: Course) => {
            if (!c.price) {
              if (c.code === 'CS-101') c.price = 1499;
              else if (c.code === 'CS-201') c.price = 1999;
              else if (c.code === 'CS-301') c.price = 2499;
              else c.price = 1499;
            }
          });

          // Ensure DS and DB modules exist
          const hasDsModules = parsed.modules && parsed.modules.some((m: Module) => m.courseId === 'crs-ds201');
          if (!hasDsModules) {
            const seed = getInitialSeedData();
            parsed.modules = seed.modules;
            parsed.assessments = seed.assessments;
          }

          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    const initial = getInitialSeedData();
    this.saveState(initial);
    return initial;
  }

  private saveState(newState?: DatabaseState): void {
    if (newState) {
      this.state = newState;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public resetToSeed(): DatabaseState {
    const initial = getInitialSeedData();
    this.saveState(initial);
    return initial;
  }

  // --- Transactional Audit Logger ---
  public logAudit(
    actorId: string | undefined,
    action: string,
    entityType: string,
    entityId: string,
    details?: Record<string, any>
  ): void {
    const actor = this.state.users.find(u => u.id === actorId);
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      institutionId: actor?.institutionId || 'inst-01',
      actorId: actorId || 'system',
      actorName: actor?.name || 'Automated Engine',
      action,
      entityType,
      entityId,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    this.state.audit_logs.unshift(log);
    this.saveState();
  }

  // --- User Management ---
  public getUsers(): User[] {
    return this.state.users.filter(u => !u.isDeleted);
  }

  public getAllUsersAdmin(): User[] {
    return this.state.users;
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id && !u.isDeleted);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && !u.isDeleted);
  }

  public createUser(userData: Partial<User>, actorId?: string): User {
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      institutionId: userData.institutionId || 'inst-01',
      institutionName: userData.institutionName || '',
      name: userData.name || 'New User',
      email: userData.email || `user${Date.now()}@smartassess.ai`,
      role: userData.role || 'STUDENT',
      status: userData.status || 'ACTIVE',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone: userData.phone || '',
      department: userData.department || 'Computer Science',
      bio: userData.bio || '',
      title: userData.title || '',
      studentIdNumber: userData.studentIdNumber || '',
      graduationYear: userData.graduationYear || '2027',
      maxMentees: userData.maxMentees || (userData.role === 'TEACHER' ? 5 : 0),
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.logAudit(actorId, 'CREATE_USER', 'users', newUser.id, { role: newUser.role, email: newUser.email });
    this.saveState();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>, actorId?: string): User {
    const index = this.state.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error(`User ${id} not found`);

    this.state.users[index] = {
      ...this.state.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAudit(actorId, 'UPDATE_USER', 'users', id, updates);
    this.saveState();
    return this.state.users[index];
  }

  public deleteUser(id: string, actorId?: string): boolean {
    const index = this.state.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    // Soft deletion according to data-retention policy
    this.state.users[index].isDeleted = true;
    this.state.users[index].deletedAt = new Date().toISOString();
    this.state.users[index].status = 'DEACTIVATED';
    this.logAudit(actorId, 'SOFT_DELETE_USER', 'users', id);
    this.saveState();
    return true;
  }

  // --- Institutions ---
  public getInstitutions(): Institution[] {
    return this.state.institutions.filter(i => i.isActive);
  }

  public createInstitution(inst: Partial<Institution>, actorId?: string): Institution {
    const newInst: Institution = {
      id: `inst-${Date.now().toString(36)}`,
      name: inst.name || 'New Institute',
      code: inst.code || `INST-${Date.now().toString(36).toUpperCase()}`,
      domain: inst.domain || '',
      address: inst.address || '',
      contactEmail: inst.contactEmail || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.institutions.push(newInst);
    this.logAudit(actorId, 'CREATE_INSTITUTION', 'institutions', newInst.id, { name: newInst.name });
    this.saveState();
    return newInst;
  }

  // --- Courses & Enrollments ---
  public getCourses(): Course[] {
    return this.state.courses.filter(c => !c.isDeleted);
  }

  public getCourseById(id: string): Course | undefined {
    return this.state.courses.find(c => c.id === id && !c.isDeleted);
  }

  public createCourse(data: Partial<Course>, teacherId?: string): Course {
    const newCourse: Course = {
      id: `crs-${Date.now().toString(36)}`,
      institutionId: data.institutionId || 'inst-01',
      code: data.code || 'CS-NEW',
      title: data.title || 'Untitled Course',
      description: data.description || '',
      category: data.category || 'Computer Science',
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
      difficultyLevel: data.difficultyLevel || 'Intermediate',
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.courses.push(newCourse);

    if (teacherId) {
      this.state.teacher_courses.push({
        id: `tc-${Date.now().toString(36)}`,
        teacherId,
        courseId: newCourse.id,
        isPrimaryInstructor: true,
        assignedAt: new Date().toISOString(),
      });
    }

    this.logAudit(teacherId, 'CREATE_COURSE', 'courses', newCourse.id, { title: newCourse.title });
    this.saveState();
    return newCourse;
  }

  public getTeacherCourses(teacherId: string): Course[] {
    const assignedIds = this.state.teacher_courses
      .filter(tc => tc.teacherId === teacherId)
      .map(tc => tc.courseId);
    return this.state.courses.filter(c => assignedIds.includes(c.id) && !c.isDeleted);
  }

  public getStudentEnrollments(studentId: string): (CourseEnrollment & { course: Course })[] {
    return this.state.course_enrollments
      .filter(e => e.studentId === studentId)
      .map(e => ({
        ...e,
        course: this.state.courses.find(c => c.id === e.courseId)!,
      }))
      .filter(e => e.course && !e.course.isDeleted);
  }

  public enrollStudent(studentId: string, courseId: string): CourseEnrollment {
    // Prevent duplicate enrollment
    const existing = this.state.course_enrollments.find(
      e => e.studentId === studentId && e.courseId === courseId
    );
    if (existing) {
      throw new Error('Student is already enrolled in this course.');
    }

    const enrollment: CourseEnrollment = {
      id: `enr-${Date.now().toString(36)}`,
      studentId,
      courseId,
      status: 'ENROLLED',
      progressPercentage: 0.0,
      enrolledAt: new Date().toISOString(),
    };
    this.state.course_enrollments.push(enrollment);
    this.logAudit(studentId, 'ENROLL_COURSE', 'course_enrollments', enrollment.id, { courseId });
    this.saveState();
    return enrollment;
  }

  // --- Modules & Lessons ---
  public getModulesByCourse(courseId: string): Module[] {
    return this.state.modules
      .filter(m => m.courseId === courseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public createModule(data: Partial<Module>, teacherId?: string): Module {
    const newModule: Module = {
      id: `mod-${Date.now().toString(36)}`,
      courseId: data.courseId!,
      title: data.title || 'New Module',
      description: data.description || '',
      orderIndex: data.orderIndex || (this.getModulesByCourse(data.courseId!).length + 1),
      weightPercentage: data.weightPercentage || 15.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.modules.push(newModule);
    this.logAudit(teacherId, 'CREATE_MODULE', 'modules', newModule.id, { title: newModule.title });
    this.saveState();
    return newModule;
  }

  public getLessonsByModule(moduleId: string): Lesson[] {
    return this.state.lessons
      .filter(l => l.moduleId === moduleId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public createLesson(data: Partial<Lesson>, teacherId?: string): Lesson {
    const newLesson: Lesson = {
      id: `les-${Date.now().toString(36)}`,
      moduleId: data.moduleId!,
      title: data.title || 'New Lesson',
      content: data.content || '',
      materialType: data.materialType || 'ARTICLE',
      mediaUrl: data.mediaUrl,
      durationMinutes: data.durationMinutes || 20,
      orderIndex: data.orderIndex || (this.getLessonsByModule(data.moduleId!).length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.lessons.push(newLesson);
    this.logAudit(teacherId, 'CREATE_LESSON', 'lessons', newLesson.id, { title: newLesson.title });
    this.saveState();
    return newLesson;
  }

  // --- Question Bank & Assessments ---
  public getQuestions(): Question[] {
    return this.state.questions;
  }

  public createQuestion(q: Partial<Question>, teacherId?: string): Question {
    const newQ: Question = {
      id: `q-${Date.now().toString(36)}`,
      moduleId: q.moduleId,
      teacherId,
      questionText: q.questionText || 'Question text',
      questionType: q.questionType || 'MULTIPLE_CHOICE',
      difficulty: q.difficulty || 'MEDIUM',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      points: q.points || 10,
      createdAt: new Date().toISOString(),
    };
    this.state.questions.push(newQ);
    this.logAudit(teacherId, 'CREATE_QUESTION', 'questions', newQ.id, { text: newQ.questionText.substring(0, 30) });
    this.saveState();
    return newQ;
  }

  public getAssessments(courseId?: string): Assessment[] {
    if (courseId) {
      return this.state.assessments.filter(a => a.courseId === courseId && a.isPublished);
    }
    return this.state.assessments;
  }

  public getAssessmentById(id: string): (Assessment & { questions: Question[] }) | undefined {
    const asm = this.state.assessments.find(a => a.id === id);
    if (!asm) return undefined;

    let questions: Question[] = [];
    if (asm.questionIds && asm.questionIds.length > 0) {
      questions = this.state.questions.filter(q => asm.questionIds!.includes(q.id));
    } else {
      const qIds = this.state.assessment_questions
        .filter(aq => aq.assessmentId === id)
        .map(aq => aq.questionId);
      questions = this.state.questions.filter(q => qIds.includes(q.id));
    }

    return { ...asm, questions };
  }

  public createAssessment(data: Partial<Assessment>, teacherId?: string): Assessment {
    const newAsm: Assessment = {
      id: `asm-${Date.now().toString(36)}`,
      courseId: data.courseId!,
      moduleId: data.moduleId,
      createdBy: teacherId,
      title: data.title || 'New Assessment',
      description: data.description || '',
      type: data.type || 'MODULE_QUIZ',
      durationMinutes: data.durationMinutes || 30,
      totalMarks: data.totalMarks || 100,
      passingMarks: data.passingMarks || 40,
      isAutoGraded: data.isAutoGraded !== undefined ? data.isAutoGraded : true,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      questionIds: data.questionIds || [],
      createdAt: new Date().toISOString(),
    };
    this.state.assessments.push(newAsm);
    this.logAudit(teacherId, 'CREATE_ASSESSMENT', 'assessments', newAsm.id, { title: newAsm.title });
    this.saveState();
    return newAsm;
  }

  // --- Assessment Submission & Auto-Grading Workflow ---
  public submitAssessmentAttempt(
    studentId: string,
    assessmentId: string,
    answers: Record<string, string> // questionId => answer
  ): { attempt: AssessmentAttempt; result: AssessmentResult; answers: AssessmentAnswer[] } {
    const assessment = this.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    let totalPoints = 0;
    let earnedPoints = 0;
    const recordedAnswers: AssessmentAnswer[] = [];
    const attemptId = `att-${Date.now().toString(36)}`;

    assessment.questions.forEach(q => {
      const submitted = (answers[q.id] || '').trim();
      const isCorrect = submitted.toLowerCase() === (q.correctAnswer || '').trim().toLowerCase();
      const points = q.points || 10;
      totalPoints += points;
      const awarded = isCorrect ? points : 0;
      earnedPoints += awarded;

      recordedAnswers.push({
        id: `ans-${Date.now().toString(36)}-${q.id}`,
        attemptId,
        questionId: q.id,
        submittedAnswer: submitted,
        isCorrect,
        marksAwarded: awarded,
        feedback: isCorrect ? 'Correct!' : `Incorrect. Correct answer: ${q.correctAnswer}. ${q.explanation || ''}`,
        createdAt: new Date().toISOString(),
      });
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 1000) / 10 : 0;
    const passed = percentage >= assessment.passingMarks;

    const attempt: AssessmentAttempt = {
      id: attemptId,
      assessmentId,
      studentId,
      attemptNumber: (this.state.assessment_attempts.filter(a => a.studentId === studentId && a.assessmentId === assessmentId).length + 1),
      status: 'GRADED',
      scoreObtained: earnedPoints,
      percentage,
      startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      submittedAt: new Date().toISOString(),
    };

    const result: AssessmentResult = {
      id: `res-${Date.now().toString(36)}`,
      studentId,
      assessmentId,
      courseId: assessment.courseId,
      moduleId: assessment.moduleId,
      score: earnedPoints,
      totalMarks: totalPoints,
      percentage,
      passed,
      recordedAt: new Date().toISOString(),
    };

    this.state.assessment_attempts.push(attempt);
    this.state.assessment_answers.push(...recordedAnswers);
    this.state.assessment_results.push(result);

    // Update aggregated student performance
    this.recomputeStudentPerformance(studentId, assessment.courseId);

    // Create Notification
    this.state.notifications.unshift({
      id: `notif-${Date.now().toString(36)}`,
      userId: studentId,
      title: `Assessment Graded: ${assessment.title}`,
      message: `You scored ${percentage}% (${earnedPoints}/${totalPoints}). ${passed ? 'Congratulations, you passed!' : 'Score is below passing threshold. Review recommended.'}`,
      type: 'RESULT_PUBLISHED',
      linkUrl: '/results',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.logAudit(studentId, 'SUBMIT_ASSESSMENT', 'assessment_attempts', attempt.id, {
      assessment: assessment.title,
      score: percentage,
      passed,
    });

    this.saveState();
    return { attempt, result, answers: recordedAnswers };
  }

  // --- Assignments & Submissions ---
  public getAssignments(courseId?: string): Assignment[] {
    if (courseId) return this.state.assignments.filter(a => a.courseId === courseId);
    return this.state.assignments;
  }

  public createAssignment(data: Partial<Assignment>, teacherId?: string): Assignment {
    const newAsg: Assignment = {
      id: `asg-${Date.now().toString(36)}`,
      courseId: data.courseId!,
      moduleId: data.moduleId,
      teacherId,
      title: data.title || 'New Assignment',
      instructions: data.instructions || '',
      maxMarks: data.maxMarks || 100,
      dueDate: data.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      allowedFormats: data.allowedFormats || 'PDF, DOCX, PY, ZIP',
      createdAt: new Date().toISOString(),
    };
    this.state.assignments.push(newAsg);
    this.logAudit(teacherId, 'CREATE_ASSIGNMENT', 'assignments', newAsg.id, { title: newAsg.title });
    this.saveState();
    return newAsg;
  }

  public getSubmissionsByAssignment(assignmentId: string): (Submission & { student: User })[] {
    return this.state.submissions
      .filter(s => s.assignmentId === assignmentId)
      .map(s => ({
        ...s,
        student: this.state.users.find(u => u.id === s.studentId)!,
      }));
  }

  public getStudentSubmissions(studentId: string): Submission[] {
    return this.state.submissions.filter(s => s.studentId === studentId);
  }

  public submitAssignmentSolution(
    studentId: string,
    assignmentId: string,
    textContent: string,
    fileUrl?: string
  ): Submission {
    const existingIndex = this.state.submissions.findIndex(
      s => s.studentId === studentId && s.assignmentId === assignmentId
    );

    const submission: Submission = {
      id: existingIndex >= 0 ? this.state.submissions[existingIndex].id : `sub-${Date.now().toString(36)}`,
      assignmentId,
      studentId,
      textContent,
      fileUrl: fileUrl || `https://smartassess.ai/uploads/sub_${studentId}_${Date.now()}.py`,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.state.submissions[existingIndex] = submission;
    } else {
      this.state.submissions.push(submission);
    }

    this.logAudit(studentId, 'SUBMIT_ASSIGNMENT', 'submissions', submission.id, { assignmentId });
    this.saveState();
    return submission;
  }

  public evaluateSubmission(
    submissionId: string,
    marks: number,
    feedback: string,
    evaluatorId: string
  ): Submission {
    const index = this.state.submissions.findIndex(s => s.id === submissionId);
    if (index === -1) throw new Error('Submission not found');

    const sub = this.state.submissions[index];
    sub.marksObtained = marks;
    sub.feedback = feedback;
    sub.evaluatedBy = evaluatorId;
    sub.status = 'EVALUATED';
    sub.evaluatedAt = new Date().toISOString();

    // Notify student
    this.state.notifications.unshift({
      id: `notif-${Date.now().toString(36)}`,
      userId: sub.studentId,
      title: 'Assignment Evaluated',
      message: `Your assignment has been graded: ${marks} marks awarded. Feedback: "${feedback}"`,
      type: 'FEEDBACK_RECEIVED',
      linkUrl: '/assignments',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.logAudit(evaluatorId, 'EVALUATE_SUBMISSION', 'submissions', submissionId, { marks, studentId: sub.studentId });
    this.saveState();
    return sub;
  }

  // --- Student Results & Analytics ---
  public getStudentResults(studentId: string): AssessmentResult[] {
    return this.state.assessment_results.filter(r => r.studentId === studentId);
  }

  public getStudentPerformance(studentId: string, courseId: string): StudentPerformance | undefined {
    return this.state.student_performance.find(
      sp => sp.studentId === studentId && sp.courseId === courseId
    );
  }

  public recomputeStudentPerformance(studentId: string, courseId: string): StudentPerformance {
    const results = this.state.assessment_results.filter(
      r => r.studentId === studentId && r.courseId === courseId
    );

    const submissions = this.state.submissions.filter(
      s => s.studentId === studentId && s.status === 'EVALUATED'
    );

    const moduleScores: Record<string, number> = {};
    let sumScores = 0;
    results.forEach(r => {
      sumScores += r.percentage;
      if (r.moduleId) {
        moduleScores[r.moduleId] = r.percentage;
      }
    });

    const average = results.length > 0 ? Math.round((sumScores / results.length) * 10) / 10 : 0;

    let trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
    if (results.length >= 3) {
      const recent = results.slice(-2);
      const earlier = results.slice(0, 2);
      const recentAvg = (recent[0].percentage + (recent[1]?.percentage || recent[0].percentage)) / 2;
      const earlierAvg = (earlier[0].percentage + (earlier[1]?.percentage || earlier[0].percentage)) / 2;
      if (recentAvg > earlierAvg + 5) trend = 'IMPROVING';
      else if (recentAvg < earlierAvg - 5) trend = 'DECLINING';
    }

    const existingIndex = this.state.student_performance.findIndex(
      sp => sp.studentId === studentId && sp.courseId === courseId
    );

    const perf: StudentPerformance = {
      id: existingIndex >= 0 ? this.state.student_performance[existingIndex].id : `perf-${Date.now().toString(36)}`,
      studentId,
      courseId,
      overallAverage: average,
      quizzesAttempted: results.length,
      assignmentsCompleted: submissions.length,
      moduleScores,
      trend,
      lastEvaluatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.state.student_performance[existingIndex] = perf;
    } else {
      this.state.student_performance.push(perf);
    }

    this.saveState();
    return perf;
  }

  // --- AI Predictions ---
  public getAiPrediction(studentId: string, courseId: string): AiPrediction | undefined {
    return this.state.ai_predictions.find(
      p => p.studentId === studentId && p.courseId === courseId
    );
  }

  public saveAiPrediction(prediction: AiPrediction): void {
    const existingIndex = this.state.ai_predictions.findIndex(
      p => p.studentId === prediction.studentId && p.courseId === prediction.courseId
    );
    if (existingIndex >= 0) {
      this.state.ai_predictions[existingIndex] = prediction;
    } else {
      this.state.ai_predictions.push(prediction);
    }
    this.saveState();
  }

  // --- Automatic Mentor Allocation System ---
  public getTeacherWorkloadStats(): TeacherWorkloadStats[] {
    const teachers = this.state.users.filter(u => u.role === 'TEACHER' && !u.isDeleted && u.status === 'ACTIVE');
    return teachers.map(teacher => {
      const activeAssignments = this.state.mentor_assignments.filter(
        ma => ma.teacherId === teacher.id && (ma.status === 'ASSIGNED' || ma.status === 'IN_PROGRESS')
      );
      const expertise = this.state.teacher_expertise.filter(te => te.teacherId === teacher.id);
      const courses = this.getTeacherCourses(teacher.id);

      return {
        teacher,
        currentMenteesCount: activeAssignments.length,
        maxMenteesCapacity: teacher.maxMentees || 5,
        capacityRemaining: Math.max(0, (teacher.maxMentees || 5) - activeAssignments.length),
        expertise,
        activeCourses: courses,
      };
    });
  }

  public getMentorAssignments(): (MentorAssignment & {
    student: User;
    teacher: User;
    course: Course;
    targetModule?: Module;
  })[] {
    return this.state.mentor_assignments.map(ma => ({
      ...ma,
      student: this.state.users.find(u => u.id === ma.studentId)!,
      teacher: this.state.users.find(u => u.id === ma.teacherId)!,
      course: this.state.courses.find(c => c.id === ma.courseId)!,
      targetModule: ma.targetModuleId ? this.state.modules.find(m => m.id === ma.targetModuleId) : undefined,
    })).filter(ma => ma.student && ma.teacher && ma.course);
  }

  public getStudentMentor(studentId: string, courseId?: string): (MentorAssignment & {
    teacher: User;
    course: Course;
    targetModule?: Module;
    expertise: TeacherExpertise[];
    sessions: MentoringSession[];
    notes: MentoringNote[];
  }) | undefined {
    const assignment = this.state.mentor_assignments.find(
      ma => ma.studentId === studentId &&
        (courseId ? ma.courseId === courseId : true) &&
        (ma.status === 'ASSIGNED' || ma.status === 'IN_PROGRESS')
    );
    if (!assignment) return undefined;

    const teacher = this.state.users.find(u => u.id === assignment.teacherId)!;
    const course = this.state.courses.find(c => c.id === assignment.courseId)!;
    const targetModule = assignment.targetModuleId
      ? this.state.modules.find(m => m.id === assignment.targetModuleId)
      : undefined;
    const expertise = this.state.teacher_expertise.filter(te => te.teacherId === assignment.teacherId);
    const sessions = this.state.mentoring_sessions.filter(s => s.assignmentId === assignment.id);
    const notes = this.state.mentoring_notes.filter(n => n.assignmentId === assignment.id);

    return {
      ...assignment,
      teacher,
      course,
      targetModule,
      expertise,
      sessions,
      notes,
    };
  }

  public getTeacherMentees(teacherId: string): (MentorAssignment & {
    student: User;
    course: Course;
    targetModule?: Module;
    performance?: StudentPerformance;
    prediction?: AiPrediction;
    sessions: MentoringSession[];
    notes: MentoringNote[];
  })[] {
    const assignments = this.state.mentor_assignments.filter(
      ma => ma.teacherId === teacherId && (ma.status === 'ASSIGNED' || ma.status === 'IN_PROGRESS')
    );

    return assignments.map(a => {
      const student = this.state.users.find(u => u.id === a.studentId)!;
      const course = this.state.courses.find(c => c.id === a.courseId)!;
      const targetModule = a.targetModuleId ? this.state.modules.find(m => m.id === a.targetModuleId) : undefined;
      const performance = this.getStudentPerformance(a.studentId, a.courseId);
      const prediction = this.getAiPrediction(a.studentId, a.courseId);
      const sessions = this.state.mentoring_sessions.filter(s => s.assignmentId === a.id);
      const notes = this.state.mentoring_notes.filter(n => n.assignmentId === a.id);

      return {
        ...a,
        student,
        course,
        targetModule,
        performance,
        prediction,
        sessions,
        notes,
      };
    }).filter(a => a.student && a.course);
  }

  /**
   * Evaluates teacher candidates for a given student and weak topic.
   */
  public evaluateCandidatesForStudent(
    studentId: string,
    courseId: string,
    weakTopicName: string
  ): MentorCandidateEvaluation[] {
    const workloads = this.getTeacherWorkloadStats();
    const course = this.getCourseById(courseId);

    const evaluations: MentorCandidateEvaluation[] = [];

    workloads.forEach(w => {
      const remaining = w.capacityRemaining;
      const isEligible = remaining > 0;

      // Subject proficiency
      const matchingSubject = w.expertise.find(e =>
        course && e.subject.toLowerCase().includes(course.title.toLowerCase().substring(0, 6))
      );
      const subjectProficiency = matchingSubject ? matchingSubject.proficiencyLevel : 3;

      // Weak topic proficiency
      const matchingTopic = w.expertise.find(e =>
        weakTopicName.toLowerCase().includes(e.topic.toLowerCase()) ||
        e.topic.toLowerCase().includes(weakTopicName.toLowerCase())
      );
      const topicProficiency = matchingTopic ? matchingTopic.proficiencyLevel : 3.0;

      // Course instructor bonus
      const isCourseInstructor = w.activeCourses.some(c => c.id === courseId);

      // Weighted score calculation
      let score = 0;
      if (isEligible) {
        const topicWeight = (topicProficiency / 5.0) * 35; // 35%
        const subjectWeight = (subjectProficiency / 5.0) * 25; // 25%
        const capacityRatio = remaining / w.maxMenteesCapacity;
        const capacityWeight = capacityRatio * 25; // 25%
        const instructorWeight = isCourseInstructor ? 15 : 7.5; // 15%

        score = Math.round((topicWeight + subjectWeight + capacityWeight + instructorWeight) * 10) / 10;
      }

      const reasons: string[] = [];
      if (matchingTopic) {
        reasons.push(`Direct expertise in ${matchingTopic.topic} (${matchingTopic.proficiencyLevel}/5)`);
      }
      if (isCourseInstructor) {
        reasons.push(`Primary or active course instructor`);
      }
      if (remaining > 0) {
        reasons.push(`${remaining} / ${w.maxMenteesCapacity} mentee slots open`);
      } else {
        reasons.push(`At full capacity (${w.maxMenteesCapacity} mentees)`);
      }

      evaluations.push({
        teacherId: w.teacher.id,
        teacherName: w.teacher.name,
        suitabilityScore: score,
        isEligible,
        remainingCapacity: remaining,
        reasons,
      });
    });

    return evaluations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }

  /**
   * Run Automatic Mentor Allocation in a single ACID-like transaction.
   * Matches all unassigned students who have low scores or high support priority.
   */
  public runAutomaticMentorAllocation(actorId?: string): {
    matchedCount: number;
    unmatchedCount: number;
    assignments: MentorAssignment[];
    details: string[];
  } {
    const students = this.state.users.filter(u => u.role === 'STUDENT' && !u.isDeleted && u.status === 'ACTIVE');
    const newAssignments: MentorAssignment[] = [];
    const executionDetails: string[] = [];
    let unmatchedCount = 0;

    // Track dynamic capacity during allocation batch
    const teacherSlotUsage: Record<string, number> = {};
    const workloads = this.getTeacherWorkloadStats();
    workloads.forEach(w => {
      teacherSlotUsage[w.teacher.id] = w.currentMenteesCount;
    });

    for (const student of students) {
      // Find all enrollments
      const enrollments = this.state.course_enrollments.filter(e => e.studentId === student.id);

      for (const enr of enrollments) {
        // Check if student already has active mentor for this course
        const activeAssignment = this.state.mentor_assignments.find(
          ma => ma.studentId === student.id &&
            ma.courseId === enr.courseId &&
            (ma.status === 'ASSIGNED' || ma.status === 'IN_PROGRESS')
        );
        if (activeAssignment) continue;

        // Check student's performance & weak modules
        const results = this.state.assessment_results.filter(
          r => r.studentId === student.id && r.courseId === enr.courseId
        );
        if (results.length === 0) continue;

        // Find lowest scoring module
        const lowestResult = [...results].sort((a, b) => a.percentage - b.percentage)[0];
        const overallAvg = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;

        // Allocation threshold rules:
        // Below 40%: High Priority
        // 40 - 59%: Moderate Priority
        // If overall < 60% or lowestResult < 50%, trigger mentor allocation!
        const needsMentoring = overallAvg < 60 || (lowestResult && lowestResult.percentage < 55);

        if (!needsMentoring) continue;

        const targetModule = lowestResult?.moduleId
          ? this.state.modules.find(m => m.id === lowestResult.moduleId)
          : undefined;
        const weakTopicName = targetModule?.title || 'Core Fundamentals';

        // Evaluate eligible teachers with available capacity
        const candidates = this.evaluateCandidatesForStudent(student.id, enr.courseId, weakTopicName);
        const availableCandidate = candidates.find(c => {
          const teacher = this.state.users.find(u => u.id === c.teacherId);
          const maxCapacity = teacher?.maxMentees || 5;
          const currentUsed = teacherSlotUsage[c.teacherId] || 0;
          return currentUsed < maxCapacity;
        });

        if (availableCandidate) {
          const assignmentId = `mnt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
          const reason = `Student scored ${lowestResult.percentage}% in ${weakTopicName} (Overall average: ${overallAvg.toFixed(1)}%). Matched with ${availableCandidate.teacherName} (Suitability score: ${availableCandidate.suitabilityScore}%) based on weak-topic alignment and workload capacity.`;

          const assignment: MentorAssignment = {
            id: assignmentId,
            studentId: student.id,
            teacherId: availableCandidate.teacherId,
            courseId: enr.courseId,
            targetModuleId: targetModule?.id,
            status: 'ASSIGNED',
            allocationMethod: 'AUTOMATIC',
            suitabilityScore: availableCandidate.suitabilityScore,
            reason,
            studentScoreAtAllocation: lowestResult.percentage,
            assignedAt: new Date().toISOString(),
            reviewDate: new Date(Date.now() + 86400000 * 14).toISOString(),
          };

          // Increment allocated slot
          teacherSlotUsage[availableCandidate.teacherId] = (teacherSlotUsage[availableCandidate.teacherId] || 0) + 1;
          this.state.mentor_assignments.push(assignment);
          newAssignments.push(assignment);

          // Notifications
          this.state.notifications.unshift({
            id: `notif-${Date.now().toString(36)}-s`,
            userId: student.id,
            title: 'Academic Mentor Assigned',
            message: `${availableCandidate.teacherName} has been assigned to support you in ${weakTopicName}.`,
            type: 'MENTOR_ASSIGNED',
            linkUrl: '/mentor',
            isRead: false,
            createdAt: new Date().toISOString(),
          });

          this.state.notifications.unshift({
            id: `notif-${Date.now().toString(36)}-t`,
            userId: availableCandidate.teacherId,
            title: 'New Mentee Allocated',
            message: `${student.name} has been assigned to your mentoring caseload for ${weakTopicName}.`,
            type: 'MENTOR_ASSIGNED',
            linkUrl: '/mentees',
            isRead: false,
            createdAt: new Date().toISOString(),
          });

          executionDetails.push(`Matched ${student.name} with ${availableCandidate.teacherName} (Score: ${availableCandidate.suitabilityScore}%) for ${weakTopicName}`);
        } else {
          unmatchedCount++;
          executionDetails.push(`Could not allocate mentor for ${student.name}: No available teacher with remaining capacity.`);
        }
      }
    }

    this.logAudit(actorId, 'RUN_AUTOMATIC_MENTOR_ALLOCATION', 'mentor_assignments', 'batch', {
      matchedCount: newAssignments.length,
      unmatchedCount,
      executionDetails,
    });

    this.saveState();
    return {
      matchedCount: newAssignments.length,
      unmatchedCount,
      assignments: newAssignments,
      details: executionDetails,
    };
  }

  /**
   * Manual administrator assignment or reassignment
   */
  public assignOrReassignMentor(
    studentId: string,
    teacherId: string,
    courseId: string,
    reason: string,
    targetModuleId?: string,
    actorId?: string
  ): MentorAssignment {
    const teacher = this.state.users.find(u => u.id === teacherId);
    if (!teacher) throw new Error('Teacher not found');

    const activeForTeacher = this.state.mentor_assignments.filter(
      ma => ma.teacherId === teacherId && (ma.status === 'ASSIGNED' || ma.status === 'IN_PROGRESS')
    );

    if (activeForTeacher.length >= (teacher.maxMentees || 5)) {
      throw new Error(`Teacher has reached their maximum mentee capacity (${teacher.maxMentees || 5}).`);
    }

    // Cancel / archive existing active assignment if reassigning
    const existing = this.state.mentor_assignments.find(
      ma => ma.studentId === studentId && ma.courseId === courseId && (ma.status === 'ASSIGNED' || ma.status === 'IN_PROGRESS')
    );
    if (existing) {
      existing.status = 'REASSIGNED';
      existing.resolvedAt = new Date().toISOString();
    }

    const assignment: MentorAssignment = {
      id: `mnt-${Date.now().toString(36)}`,
      studentId,
      teacherId,
      courseId,
      targetModuleId,
      status: 'ASSIGNED',
      allocationMethod: 'ADMIN_MANUAL',
      suitabilityScore: 92.0,
      reason: reason || 'Manual administrator assignment.',
      assignedAt: new Date().toISOString(),
      reviewDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    };

    this.state.mentor_assignments.push(assignment);

    // Notifications
    const student = this.state.users.find(u => u.id === studentId);
    this.state.notifications.unshift({
      id: `notif-${Date.now().toString(36)}-m`,
      userId: studentId,
      title: 'Mentor Assigned by Administrator',
      message: `${teacher.name} has been assigned as your academic mentor.`,
      type: 'MENTOR_ASSIGNED',
      linkUrl: '/mentor',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.state.notifications.unshift({
      id: `notif-${Date.now().toString(36)}-t2`,
      userId: teacherId,
      title: 'New Mentee Assigned (Admin Override)',
      message: `${student?.name || 'A student'} was assigned to your mentoring roster.`,
      type: 'MENTOR_ASSIGNED',
      linkUrl: '/mentees',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.logAudit(actorId, 'ASSIGN_MENTOR_MANUAL', 'mentor_assignments', assignment.id, {
      studentId,
      teacherId,
      reason,
    });

    this.saveState();
    return assignment;
  }

  // --- Mentoring Sessions & Notes ---
  public scheduleMentoringSession(
    assignmentId: string,
    title: string,
    agenda: string,
    scheduledAt: string,
    durationMinutes: number,
    meetingLink?: string,
    actorId?: string
  ): MentoringSession {
    const assignment = this.state.mentor_assignments.find(ma => ma.id === assignmentId);
    if (!assignment) throw new Error('Mentor assignment not found');

    const session: MentoringSession = {
      id: `sess-${Date.now().toString(36)}`,
      assignmentId,
      teacherId: assignment.teacherId,
      studentId: assignment.studentId,
      title,
      agenda,
      scheduledAt,
      durationMinutes,
      meetingLink: meetingLink || `https://meet.jit.si/smartassess-${assignmentId.substring(0, 8)}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    this.state.mentoring_sessions.push(session);

    // Notify student
    this.state.notifications.unshift({
      id: `notif-${Date.now().toString(36)}-sess`,
      userId: assignment.studentId,
      title: 'Mentoring Session Scheduled',
      message: `"${title}" has been scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
      type: 'SESSION_SCHEDULED',
      linkUrl: '/mentor',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.logAudit(actorId, 'SCHEDULE_MENTORING_SESSION', 'mentoring_sessions', session.id, { title, scheduledAt });
    this.saveState();
    return session;
  }

  public addMentoringNote(
    assignmentId: string,
    authorId: string,
    noteContent: string,
    isSharedWithStudent: boolean,
    recommendedAction?: string
  ): MentoringNote {
    const assignment = this.state.mentor_assignments.find(ma => ma.id === assignmentId);
    if (!assignment) throw new Error('Mentor assignment not found');

    const note: MentoringNote = {
      id: `note-${Date.now().toString(36)}`,
      assignmentId,
      authorId,
      noteContent,
      isSharedWithStudent,
      recommendedAction,
      createdAt: new Date().toISOString(),
    };

    this.state.mentoring_notes.push(note);

    if (isSharedWithStudent) {
      this.state.notifications.unshift({
        id: `notif-${Date.now().toString(36)}-note`,
        userId: assignment.studentId,
        title: 'New Mentor Feedback Note',
        message: `Your mentor added new guidance: "${noteContent.substring(0, 80)}..."`,
        type: 'FEEDBACK_RECEIVED',
        linkUrl: '/mentor',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    this.logAudit(authorId, 'ADD_MENTORING_NOTE', 'mentoring_notes', note.id, { isSharedWithStudent });
    this.saveState();
    return note;
  }

  public updateMentoringStatus(assignmentId: string, newStatus: any, actorId?: string): void {
    const assignment = this.state.mentor_assignments.find(ma => ma.id === assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    assignment.status = newStatus;
    if (newStatus === 'RESOLVED') {
      assignment.resolvedAt = new Date().toISOString();
    }
    this.logAudit(actorId, 'UPDATE_MENTORING_STATUS', 'mentor_assignments', assignmentId, { newStatus });
    this.saveState();
  }

  // --- Notifications ---
  public getNotifications(userId: string): Notification[] {
    return this.state.notifications.filter(n => n.userId === userId);
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.state.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.saveState();
  }

  public createNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
    const newNotif: Notification = {
      id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      userId: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      linkUrl: notif.linkUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.unshift(newNotif);
    this.saveState();
    return newNotif;
  }

  // --- Certificates ---
  public getAllCertificates(): Certificate[] {
    if (!this.state.certificates) this.state.certificates = [];
    return this.state.certificates;
  }

  public getStudentCertificates(studentId: string): Certificate[] {
    if (!this.state.certificates) this.state.certificates = [];
    return this.state.certificates.filter(c => c.studentId === studentId);
  }

  public getCertificateById(id: string): Certificate | undefined {
    if (!this.state.certificates) this.state.certificates = [];
    const query = id.trim().toLowerCase();
    return this.state.certificates.find(
      c => c.id.toLowerCase() === query ||
           c.certificateNumber.toLowerCase() === query ||
           c.verificationCode.toLowerCase() === query
    );
  }

  public issueCertificate(data: {
    studentId: string;
    studentName: string;
    assessmentId: string;
    assessmentTitle: string;
    courseTitle: string;
    courseCode: string;
    score: number;
    totalMarks: number;
    percentage: number;
    grade?: string;
    institutionName?: string;
    institutionCode?: string;
    instructorName?: string;
    proctoredIntegrity?: number;
    courseId?: string;
    isCourseCompletion?: boolean;
    modulesCompleted?: number;
    totalModules?: number;
  }): Certificate {
    if (!this.state.certificates) this.state.certificates = [];

    // Calculate Grade if not provided
    let grade = data.grade;
    if (!grade) {
      if (data.percentage >= 90) grade = 'Distinction (A+)';
      else if (data.percentage >= 80) grade = 'First Class (A)';
      else if (data.percentage >= 70) grade = 'Upper Second Class (B+)';
      else if (data.percentage >= 60) grade = 'Second Class (B)';
      else grade = 'Pass (C)';
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanCourse = (data.courseCode || 'CS101').replace(/[^A-Za-z0-9]/g, '');
    const prefix = data.isCourseCompletion ? 'DIPLOMA' : 'CERT';
    const certNum = `SMART-${new Date().getFullYear()}-${cleanCourse}-${prefix}-${randomSuffix}`;
    const vrfCode = `VRF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newCert: Certificate = {
      id: `cert-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      certificateNumber: certNum,
      studentId: data.studentId,
      studentName: data.studentName,
      assessmentId: data.assessmentId,
      assessmentTitle: data.assessmentTitle,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      courseCode: data.courseCode,
      score: data.score,
      totalMarks: data.totalMarks,
      percentage: data.percentage,
      grade,
      issueDate: new Date().toISOString(),
      institutionName: data.institutionName || 'National Institute of Technology & Engineering',
      institutionCode: data.institutionCode || 'NITE-MAIN',
      instructorName: data.instructorName || 'Dr. Sarah Jenkins',
      verificationCode: vrfCode,
      proctoredIntegrity: data.proctoredIntegrity || 98,
      isCourseCompletion: data.isCourseCompletion,
      modulesCompleted: data.modulesCompleted,
      totalModules: data.totalModules,
    };

    this.state.certificates.unshift(newCert);

    // Create notification for student
    this.createNotification({
      userId: data.studentId,
      title: data.isCourseCompletion ? '🎓 Full Course Completion Diploma Issued!' : '🎓 Academic Certificate Issued!',
      message: `Congratulations! Your official Certificate for "${data.assessmentTitle}" has been generated. Grade: ${grade}.`,
      type: 'CERTIFICATE_ISSUED',
      linkUrl: '/certificates',
    });

    this.logAudit(data.studentId, 'ISSUE_CERTIFICATE', 'certificates', newCert.id, {
      certificateNumber: certNum,
      assessmentTitle: data.assessmentTitle,
      percentage: data.percentage,
    });

    this.saveState();
    return newCert;
  }

  // --- Course Modular Progress & Completion Certificate ---
  public getCourseProgress(studentId: string, courseId: string): {
    totalModules: number;
    completedModules: number;
    percentage: number;
    isCompleted: boolean;
    modulesStatus: { moduleId: string; title: string; orderIndex: number; isPassed: boolean; latestScore?: number }[];
    averageScore: number;
  } {
    const modules = this.getModulesByCourse(courseId);
    const assessments = this.getAssessments(courseId);
    const results = this.getStudentResults(studentId).filter(r => r.courseId === courseId);

    let completedCount = 0;
    let totalScore = 0;
    let scoreCount = 0;

    const modulesStatus = modules.map(m => {
      // Find assessments for this module
      const moduleAssessments = assessments.filter(a => a.moduleId === m.id);
      const moduleAssessmentIds = moduleAssessments.map(a => a.id);
      // Results for this module
      const moduleResults = results.filter(
        r => (r.moduleId === m.id) || (r.assessmentId && moduleAssessmentIds.includes(r.assessmentId))
      );
      const passedResult = moduleResults.find(r => r.passed);
      const latestResult = moduleResults[moduleResults.length - 1];

      const isPassed = Boolean(passedResult || (latestResult && latestResult.percentage >= 40));
      if (isPassed) {
        completedCount++;
      }
      if (latestResult) {
        totalScore += latestResult.percentage;
        scoreCount++;
      }

      return {
        moduleId: m.id,
        title: m.title,
        orderIndex: m.orderIndex,
        isPassed,
        latestScore: latestResult?.percentage,
      };
    });

    const totalModules = modules.length;
    const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
    const isCompleted = totalModules > 0 && completedCount >= totalModules;
    const averageScore = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0;

    return {
      totalModules,
      completedModules: completedCount,
      percentage,
      isCompleted,
      modulesStatus,
      averageScore,
    };
  }

  public checkAndIssueCourseCompletionCertificate(
    studentId: string,
    courseId: string,
    proctoredIntegrity: number = 98
  ): Certificate | null {
    if (!this.state.certificates) this.state.certificates = [];

    const progress = this.getCourseProgress(studentId, courseId);
    if (!progress.isCompleted) {
      return null;
    }

    // Check if completion certificate already exists
    const existing = this.state.certificates.find(
      c => c.studentId === studentId && c.courseId === courseId && c.isCourseCompletion
    );
    if (existing) {
      return existing;
    }

    const student = this.getUserById(studentId);
    const course = this.getCourseById(courseId);
    if (!course) return null;

    // Determine honors grade based on average score
    let grade = 'Pass (C)';
    if (progress.averageScore >= 90) grade = 'Distinction (A+)';
    else if (progress.averageScore >= 80) grade = 'First Class (A)';
    else if (progress.averageScore >= 70) grade = 'Upper Second Class (B+)';
    else if (progress.averageScore >= 60) grade = 'Second Class (B)';

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanCourse = (course.code || 'CS').replace(/[^A-Za-z0-9]/g, '');
    const certNum = `SMART-${new Date().getFullYear()}-${cleanCourse}-DIPLOMA-${randomSuffix}`;
    const vrfCode = `VRF-COMPL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Mark enrollment as COMPLETED
    const enrollment = this.state.course_enrollments.find(
      e => e.studentId === studentId && e.courseId === courseId
    );
    if (enrollment) {
      enrollment.status = 'COMPLETED';
      enrollment.progressPercentage = 100.0;
      enrollment.completedAt = new Date().toISOString();
    }

    const completionCert: Certificate = {
      id: `cert-compl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      certificateNumber: certNum,
      studentId,
      studentName: student?.name || 'Student Graduate',
      courseId,
      courseTitle: course.title,
      courseCode: course.code,
      assessmentTitle: `Full Course Completion & Academic Diploma (${course.title})`,
      score: Math.round(progress.averageScore),
      totalMarks: 100,
      percentage: progress.averageScore,
      grade,
      issueDate: new Date().toISOString(),
      institutionName: student?.institutionName || 'National Institute of Technology & Engineering',
      institutionCode: 'NITE-MAIN',
      instructorName: 'Dr. Sarah Jenkins',
      verificationCode: vrfCode,
      proctoredIntegrity,
      isCourseCompletion: true,
      modulesCompleted: progress.totalModules,
      totalModules: progress.totalModules,
    };

    this.state.certificates.unshift(completionCert);

    // Academic Notification
    this.createNotification({
      userId: studentId,
      title: '🎓 Full Course Completion Diploma Issued!',
      message: `Congratulations! You have completed all ${progress.totalModules} modules of "${course.title}". Your official Academic Diploma Certificate is now available.`,
      type: 'CERTIFICATE_ISSUED',
      linkUrl: '/certificates',
    });

    this.logAudit(studentId, 'ISSUE_COURSE_COMPLETION_CERTIFICATE', 'certificates', completionCert.id, {
      courseId,
      certificateNumber: certNum,
      averageScore: progress.averageScore,
    });

    this.saveState();
    return completionCert;
  }

  // --- Payments (Razorpay Test Mode) ---
  public getPayments(): PaymentRecord[] {
    if (!this.state.payments) this.state.payments = [];
    return this.state.payments;
  }

  public getStudentPayments(studentId: string): PaymentRecord[] {
    if (!this.state.payments) this.state.payments = [];
    return this.state.payments.filter(p => p.studentId === studentId);
  }

  public recordPayment(data: {
    studentId: string;
    studentName: string;
    courseId: string;
    courseTitle: string;
    courseCode: string;
    amount: number;
    currency?: string;
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
    orderId?: string;
    paymentId?: string;
  }): PaymentRecord {
    if (!this.state.payments) this.state.payments = [];

    const orderId = data.orderId || `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const paymentId = data.paymentId || `pay_rzp_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now().toString(36)}`,
      studentId: data.studentId,
      studentName: data.studentName,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      courseCode: data.courseCode,
      amount: data.amount,
      currency: data.currency || 'INR',
      orderId,
      paymentId,
      paymentMethod: data.paymentMethod,
      status: 'SUCCESS',
      paidAt: new Date().toISOString(),
    };

    this.state.payments.unshift(newPayment);

    // Auto-enroll student into the course if not enrolled
    const isEnrolled = this.state.course_enrollments.some(
      e => e.studentId === data.studentId && e.courseId === data.courseId
    );
    if (!isEnrolled) {
      this.enrollStudent(data.studentId, data.courseId);
    }

    // Create Notification
    this.createNotification({
      userId: data.studentId,
      title: '💳 Payment Successful via Razorpay (Test Mode)',
      message: `Payment of ₹${data.amount.toLocaleString()} for ${data.courseTitle} was successful! Ref: ${paymentId}. You are now enrolled.`,
      type: 'RESULT_PUBLISHED',
      linkUrl: '/my-courses',
    });

    this.logAudit(data.studentId, 'PAYMENT_SUCCESS', 'payments', newPayment.id, {
      courseId: data.courseId,
      amount: data.amount,
      paymentId,
      orderId,
    });

    this.saveState();
    return newPayment;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.state.audit_logs;
  }
}

export const dbService = new RelationalDatabase();
