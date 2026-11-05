/**
 * SmartAssess AI: Student Assessments & Modular Course Examination Suite
 * Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE / #EEE5D3), White (#FFFFFF)
 * Features:
 * - Course Filter: Filter by enrolled courses or inspect all courses
 * - Modular Breakdown: Clicking a course reveals all distinct modules with pass/fail tracking
 * - Full-Screen Mode with Camera & Microphone Monitoring
 * - AI Dynamic Question Randomization on each attempt
 * - Course Completion Diploma tracking (passes all modules to unlock official credential)
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Assessment, Question, AssessmentResult, Course } from '../../types/index.ts';
import { ProctoredExamModal } from '../../components/ProctoredExamModal.tsx';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  Play,
  Sparkles,
  Camera,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Mic,
  Maximize2,
  Layers,
  BookOpen,
  Filter,
  Check,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AssessmentsList: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [proctoredAssessment, setProctoredAssessment] = useState<(Assessment & { questions: Question[] }) | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  // Selected course filter state (default to first enrolled course or 'ALL')
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    enrolledCourseIds.length > 0 ? enrolledCourseIds[0] : 'ALL'
  );

  // All published assessments for student's enrolled courses
  const allAssessments = dbService.getAssessments().filter(a => enrolledCourseIds.includes(a.courseId));
  const results = dbService.getStudentResults(currentUser.id);

  // Filtered assessments and modules
  const selectedCourse = selectedCourseId !== 'ALL' ? dbService.getCourseById(selectedCourseId) : null;
  const courseModules = selectedCourse ? dbService.getModulesByCourse(selectedCourse.id) : [];
  const courseProgress = selectedCourse ? dbService.getCourseProgress(currentUser.id, selectedCourse.id) : null;

  const handleStartExam = (assessmentId: string) => {
    const fullAssessment = dbService.getAssessmentById(assessmentId);
    if (!fullAssessment) return;
    setProctoredAssessment(fullAssessment);
  };

  const handleExamCompleted = (result: AssessmentResult) => {
    // Check if course completion was reached
    const updatedProgress = dbService.getCourseProgress(currentUser.id, result.courseId);
    if (updatedProgress.isCompleted) {
      setFeedbackSuccess(
        `🎉 CONGRATULATIONS! You have passed all ${updatedProgress.totalModules} modules of this course! Your official Course Completion Diploma Certificate has been awarded.`
      );
    } else {
      setFeedbackSuccess(
        `Assessment graded! Score: ${result.percentage}% (${result.passed ? 'PASSED' : 'RETAKE RECOMMENDED'}). Progress: ${updatedProgress.completedModules}/${updatedProgress.totalModules} modules completed towards your diploma.`
      );
    }
    setTimeout(() => setFeedbackSuccess(null), 8000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#0d9488] text-xs font-bold uppercase tracking-wider mb-1">
            <Camera className="w-4 h-4 animate-pulse" />
            <span>AI Multi-Modal Proctoring Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b192c] tracking-tight">
            Assessments & Examination Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Select an enrolled course below to inspect individual modules, take proctored quizzes, and complete all modules to earn your diploma.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#f8f5ee] border border-[#eee5d3] text-[#0b192c] px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
          <span>AI Randomized Items Enabled</span>
        </div>
      </div>

      {/* Proctoring Protocol Banner */}
      <div className="bg-gradient-to-r from-[#0b192c] via-[#132a47] to-[#0b192c] rounded-2xl p-4 text-white text-xs border border-[#1e3e62] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0d9488]/20 border border-[#0d9488]/40 flex items-center justify-center text-[#14b8a6] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Security & Integrity Requirements</div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Exams require Fullscreen authorization. Exiting fullscreen, switching tabs, or secondary voices deduct integrity points.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-[#38bdf8] font-medium shrink-0 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Fullscreen</span>
          <span className="text-slate-400">•</span>
          <Camera className="w-3.5 h-3.5" />
          <span>Webcam</span>
          <span className="text-slate-400">•</span>
          <Mic className="w-3.5 h-3.5" />
          <span>Microphone</span>
        </div>
      </div>

      {feedbackSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-[#0d9488]/10 border border-[#0d9488]/30 text-[#0d9488] text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
        >
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#0d9488] shrink-0" />
            <span className="text-slate-800 font-semibold">{feedbackSuccess}</span>
          </div>
          <button
            onClick={() => setActiveTab('certificates')}
            className="text-[#0284c7] hover:text-[#0369a1] underline font-bold cursor-pointer shrink-0"
          >
            View Certificates →
          </button>
        </motion.div>
      )}

      {/* Course Filter Tabs */}
      <div className="bg-white border border-[#eee5d3] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0b192c]">
            <Filter className="w-4 h-4 text-[#0d9488]" />
            <span>Filter by Course:</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {enrollments.length} Course{enrollments.length !== 1 ? 's' : ''} Enrolled
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCourseId('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center space-x-2 ${
              selectedCourseId === 'ALL'
                ? 'bg-[#0b192c] text-white shadow-xs'
                : 'bg-[#f8f5ee] text-slate-600 hover:text-[#0b192c] hover:bg-[#eee5d3]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>All Enrolled Courses</span>
          </button>

          {enrollments.map(enr => {
            const course = enr.course;
            const progress = dbService.getCourseProgress(currentUser.id, course.id);
            const isSelected = selectedCourseId === course.id;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center space-x-2.5 ${
                  isSelected
                    ? 'bg-[#0d9488] text-white shadow-md shadow-[#0d9488]/20'
                    : 'bg-[#f8f5ee] text-slate-700 hover:text-[#0b192c] hover:bg-[#eee5d3]'
                }`}
              >
                <span>{course.code}: {course.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : progress.isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#eee5d3] text-slate-700'
                  }`}
                >
                  {progress.completedModules}/{progress.totalModules} Modules
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Course Modular Breakdown View */}
      {selectedCourse && courseProgress && (
        <div className="space-y-6">
          {/* Course Overview & Diploma Unlock Banner */}
          <div className="bg-white border border-[#eee5d3] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-[#0284c7] bg-[#0284c7]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-[#0284c7]/20">
                    {selectedCourse.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedCourse.category} • {selectedCourse.difficultyLevel}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b192c]">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Course Completion / Certificate Status Badge */}
              <div className="bg-[#f8f5ee] border border-[#eee5d3] p-4 rounded-2xl shrink-0 min-w-[240px] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0b192c] flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-[#0d9488]" />
                    <span>Diploma Eligibility</span>
                  </span>
                  <span className="font-black text-[#0d9488]">{courseProgress.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#eee5d3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0d9488] h-full transition-all duration-500"
                    style={{ width: `${courseProgress.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{courseProgress.completedModules} of {courseProgress.totalModules} modules cleared</span>
                  {courseProgress.isCompleted ? (
                    <span className="text-[#0d9488] font-bold flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Certified!</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">In Progress</span>
                  )}
                </div>
              </div>
            </div>

            {/* Diploma Certificate Banner Notice */}
            {courseProgress.isCompleted ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#f0fdfa] border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-900 block">
                      Course 100% Completed! Official Academic Diploma Issued
                    </span>
                    <span className="text-emerald-700 text-[11px]">
                      Your verified certificate is ready with cryptographic credential ID.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0b192c] text-white font-bold text-xs hover:bg-[#1e3e62] transition cursor-pointer shrink-0"
                >
                  View & Print Diploma →
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3] flex items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#0d9488] shrink-0" />
                  <span>
                    <strong>Certificate Policy:</strong> The official Course Completion Certificate is issued when all {courseProgress.totalModules} modules are passed. Complete each module's quiz below to graduate.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* List of Modules for this Course */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0b192c] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0284c7]" />
                <span>Curriculum Modules & Assessment Gates ({courseModules.length})</span>
              </h3>
              <span className="text-xs text-slate-400">All tests enforce AI camera & voice monitoring</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {courseModules.map((module, idx) => {
                // Find assessments for this module
                const moduleAssessments = allAssessments.filter(a => a.moduleId === module.id);
                const modQuiz = moduleAssessments[0]; // Primary quiz for this module

                // Results for this module
                const moduleResult = results.filter(
                  r => r.moduleId === module.id || (modQuiz && r.assessmentId === modQuiz.id)
                ).pop();

                const isPassed = Boolean(moduleResult && moduleResult.passed);

                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                      isPassed
                        ? 'border-[#0d9488]/40 hover:border-[#0d9488]'
                        : 'border-[#eee5d3] hover:border-[#0284c7]/40'
                    }`}
                  >
                    {/* Left: Module Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#0b192c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {module.orderIndex}
                        </span>
                        <h4 className="font-extrabold text-[#0b192c] text-base">
                          {module.title}
                        </h4>

                        {isPassed && moduleResult ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0d9488]/15 text-[#0d9488] border border-[#0d9488]/30 flex items-center space-x-1 shrink-0">
                            <CheckCircle className="w-3 h-3" />
                            <span>PASSED ({moduleResult.percentage}%)</span>
                          </span>
                        ) : moduleResult ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1 shrink-0">
                            <AlertCircle className="w-3 h-3" />
                            <span>ATTEMPTED ({moduleResult.percentage}%) - RETAKE NEEDED</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            PENDING EXAM
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed max-w-2xl pl-8.5">
                        {module.description}
                      </p>

                      <div className="pl-8.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>Weight: {module.weightPercentage}%</span>
                        <span>•</span>
                        <span>Passing Cutoff: 40%</span>
                        {modQuiz && (
                          <>
                            <span>•</span>
                            <span>Duration: {modQuiz.durationMinutes} mins</span>
                            <span>•</span>
                            <span>Marks: {modQuiz.totalMarks} pts</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
                      {modQuiz ? (
                        <button
                          onClick={() => handleStartExam(modQuiz.id)}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${
                            isPassed
                              ? 'bg-[#f8f5ee] border border-[#eee5d3] text-[#0b192c] hover:bg-[#eee5d3]'
                              : 'bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-[#0d9488]/20'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>{isPassed ? 'Retake Module Quiz (AI Proctored)' : 'Start Module Exam'}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Assessment in preparation</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Aggregated All Courses View */}
      {selectedCourseId === 'ALL' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAssessments.map(asm => {
              const course = dbService.getCourseById(asm.courseId);
              const mod = asm.moduleId ? dbService.getModulesByCourse(asm.courseId).find(m => m.id === asm.moduleId) : undefined;
              const prevResult = results.filter(r => r.assessmentId === asm.id).pop();

              return (
                <motion.div
                  key={asm.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-[#eee5d3] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0284c7]/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => setSelectedCourseId(asm.courseId)}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] bg-[#0284c7]/10 px-2.5 py-0.5 rounded-md border border-[#0284c7]/20 hover:bg-[#0284c7]/20 cursor-pointer"
                        title="Click to view all modules of this course"
                      >
                        {course?.code}
                      </button>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f8f5ee] text-[#0b192c] border border-[#eee5d3]">
                        {asm.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#0b192c] text-base leading-snug">{asm.title}</h3>
                    {mod && (
                      <p className="text-xs text-slate-500 mt-1">Topic: {mod.title.split(':')[1] || mod.title}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{asm.description}</p>

                    {/* Specs */}
                    <div className="mt-4 pt-3 border-t border-[#f2ece0] grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-[#f8f5ee] border border-[#eee5d3] p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Duration</span>
                        <span className="font-bold text-[#0b192c]">{asm.durationMinutes}m</span>
                      </div>
                      <div className="bg-[#f8f5ee] border border-[#eee5d3] p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Weight</span>
                        <span className="font-bold text-[#0b192c]">{asm.totalMarks} pts</span>
                      </div>
                      <div className="bg-[#f8f5ee] border border-[#eee5d3] p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Pass Cutoff</span>
                        <span className="font-bold text-[#0b192c]">{asm.passingMarks}%</span>
                      </div>
                    </div>

                    {/* Previous Result Pill */}
                    {prevResult && (
                      <div className="mt-3 p-2.5 rounded-xl bg-[#f8f5ee] border border-[#eee5d3] flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">Previous Attempt:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                            prevResult.percentage < 40
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : prevResult.percentage < 60
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30'
                          }`}
                        >
                          {prevResult.percentage}% ({prevResult.passed ? 'PASSED' : 'RETAKE RECOMMENDED'})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 space-y-2">
                    <button
                      onClick={() => handleStartExam(asm.id)}
                      className="w-full py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>{prevResult ? 'Retake Exam (Fullscreen & AI Proctored)' : 'Launch Proctored Exam'}</span>
                    </button>
                    <div className="text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-[#0d9488]" />
                      <span>Fullscreen lock, live camera & voice detector</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Proctored Exam Modal */}
      {proctoredAssessment && (
        <ProctoredExamModal
          assessment={proctoredAssessment}
          studentId={currentUser.id}
          onClose={() => setProctoredAssessment(null)}
          onCompleted={handleExamCompleted}
        />
      )}
    </div>
  );
};
