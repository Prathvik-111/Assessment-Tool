/**
 * SmartAssess AI: Comprehensive Data Models & Types
 * Reflecting the 23-table PostgreSQL Relational Schema
 */

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type AccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'DEACTIVATED' | 'SUSPENDED';

export interface Institution {
  id: string;
  name: string;
  code: string;
  domain?: string;
  address?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  institutionId?: string;
  institutionName?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  phone?: string;
  department?: string;
  bio?: string;
  title?: string;
  studentIdNumber?: string;
  graduationYear?: string;
  maxMentees: number; // for teachers
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherExpertise {
  id: string;
  teacherId: string;
  subject: string;
  topic: string;
  proficiencyLevel: number; // 1 to 5
  yearsExperience: number;
  createdAt: string;
}

export interface Course {
  id: string;
  institutionId: string;
  code: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  price?: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherCourse {
  id: string;
  teacherId: string;
  courseId: string;
  isPrimaryInstructor: boolean;
  assignedAt: string;
}

export type EnrollmentStatus = 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressPercentage: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  weightPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export type MaterialType = 'ARTICLE' | 'VIDEO' | 'PDF' | 'DOCUMENT' | 'PRACTICE';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  materialType: MaterialType;
  mediaUrl?: string;
  durationMinutes: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: string;
  moduleId?: string;
  teacherId?: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation?: string;
  points: number;
  createdAt: string;
}

export type AssessmentType = 'MODULE_QUIZ' | 'MIDTERM' | 'FINAL_EXAM' | 'PRACTICE_TEST';

export interface Assessment {
  id: string;
  courseId: string;
  moduleId?: string;
  createdBy?: string;
  title: string;
  description: string;
  type: AssessmentType;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  isAutoGraded: boolean;
  isPublished: boolean;
  questionIds?: string[];
  createdAt: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionId: string;
  orderIndex: number;
  allocatedMarks: number;
}

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'ABANDONED';

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  attemptNumber: number;
  status: AttemptStatus;
  scoreObtained: number;
  percentage: number;
  startedAt: string;
  submittedAt: string;
}

export interface AssessmentAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  feedback?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  moduleId?: string;
  teacherId?: string;
  title: string;
  instructions: string;
  maxMarks: number;
  dueDate: string;
  allowedFormats: string;
  createdAt: string;
}

export type SubmissionStatus = 'SUBMITTED' | 'LATE' | 'EVALUATED' | 'RETURNED';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl?: string;
  textContent?: string;
  status: SubmissionStatus;
  marksObtained?: number;
  feedback?: string;
  evaluatedBy?: string;
  submittedAt: string;
  evaluatedAt?: string;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  assessmentId: string;
  courseId: string;
  moduleId?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  recordedAt: string;
}

export interface StudentPerformance {
  id: string;
  studentId: string;
  courseId: string;
  overallAverage: number;
  quizzesAttempted: number;
  assignmentsCompleted: number;
  moduleScores: Record<string, number>; // moduleId -> percentage
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  lastEvaluatedAt: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type SupportPriority = 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';

export interface AiPrediction {
  id: string;
  studentId: string;
  courseId: string;
  modelVersion: string;
  predictedFutureScore: number;
  riskLevel: RiskLevel;
  weakTopics: string[];
  strongTopics: string[];
  recommendations: string[];
  requiresMentor: boolean;
  supportPriority: SupportPriority;
  confidenceScore: number;
  createdAt: string;
}

export type MentorStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REASSIGNED' | 'CANCELLED';
export type AllocationMethod = 'AUTOMATIC' | 'ADMIN_MANUAL' | 'ADMIN_APPROVED';

export interface MentorAssignment {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  targetModuleId?: string;
  status: MentorStatus;
  allocationMethod: AllocationMethod;
  suitabilityScore: number;
  reason: string;
  studentScoreAtAllocation?: number;
  assignedAt: string;
  resolvedAt?: string;
  reviewDate?: string;
}

export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface MentoringSession {
  id: string;
  assignmentId: string;
  teacherId: string;
  studentId: string;
  title: string;
  agenda?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  status: SessionStatus;
  outcomeSummary?: string;
  createdAt: string;
}

export interface MentoringNote {
  id: string;
  assignmentId: string;
  authorId: string;
  noteContent: string;
  isSharedWithStudent: boolean;
  recommendedAction?: string;
  createdAt: string;
}

export type NotificationType = 
  | 'ASSESSMENT_DUE'
  | 'RESULT_PUBLISHED'
  | 'MENTOR_ASSIGNED'
  | 'SESSION_SCHEDULED'
  | 'FEEDBACK_RECEIVED'
  | 'ADMIN_ALERT'
  | 'CERTIFICATE_ISSUED'
  | 'ACADEMIC_ALERT';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  institutionId?: string;
  actorId?: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface TeacherWorkloadStats {
  teacher: User;
  currentMenteesCount: number;
  maxMenteesCapacity: number;
  capacityRemaining: number;
  expertise: TeacherExpertise[];
  activeCourses: Course[];
}

export interface MentorCandidateEvaluation {
  teacherId: string;
  teacherName: string;
  suitabilityScore: number;
  isEligible: boolean;
  remainingCapacity: number;
  reasons: string[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseId?: string;
  courseTitle: string;
  courseCode: string;
  assessmentId?: string;
  assessmentTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  issueDate: string;
  institutionName: string;
  institutionCode?: string;
  instructorName?: string;
  verificationCode: string;
  proctoredIntegrity: number;
  isCourseCompletion?: boolean;
  modulesCompleted?: number;
  totalModules?: number;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  amount: number;
  currency: string;
  orderId: string;
  paymentId: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
  status: 'SUCCESS' | 'FAILED';
  paidAt: string;
}


