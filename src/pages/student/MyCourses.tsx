/**
 * SmartAssess AI: My Courses & Module Lesson Viewer (Aesthetic Mild Light Theme)
 * View enrolled courses, track progress percentage, and explore modules and lessons.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Course, Module, Lesson } from '../../types/index.ts';
import {
  BookOpen,
  Layers,
  PlayCircle,
  FileText,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

export const MyCourses: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);

  // If a course is selected, show the Module & Lesson view
  if (selectedCourseId) {
    const course = dbService.getCourseById(selectedCourseId);
    const modules = dbService.getModulesByCourse(selectedCourseId);
    const results = dbService.getStudentResults(currentUser.id).filter(r => r.courseId === selectedCourseId);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedCourseId(null)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{course?.code}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{course?.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{course?.title}</h1>
          </div>
        </div>

        {/* Modules Accordion / List */}
        <div className="space-y-4">
          {modules.map((mod, idx) => {
            const lessons = dbService.getLessonsByModule(mod.id);
            const modResult = results.find(r => r.moduleId === mod.id);

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition"
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-200/60">
                  <div className="flex items-start space-x-3.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{mod.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{mod.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {modResult ? (
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Quiz Score</div>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                            modResult.percentage < 40
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : modResult.percentage < 60
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {modResult.percentage}%
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveTab('assessments')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer flex items-center space-x-1.5"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Take AI Quiz</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lessons within this module */}
                <div className="p-4 sm:p-5 space-y-2 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Curriculum Lessons & Materials ({lessons.length})
                  </div>

                  {lessons.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      Supplementary materials being curated by course instructor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            {lesson.materialType === 'VIDEO' ? (
                              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                <PlayCircle className="w-4 h-4 text-rose-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-indigo-600" />
                              </div>
                            )}
                            <div className="truncate text-xs font-semibold text-slate-800 group-hover:text-indigo-900">
                              {lesson.title}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium shrink-0 ml-2">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.durationMinutes}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lesson Reading Modal */}
        <AnimatePresence>
          {activeLesson && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {activeLesson.materialType}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base truncate">{activeLesson.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-800 flex items-center space-x-2.5 text-xs font-medium">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Estimated read & comprehension time: {activeLesson.durationMinutes} minutes</span>
                  </div>

                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                    <p>{activeLesson.content}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <div className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Key Takeaway & Conceptual Practice</span>
                    </div>
                    <p className="text-xs text-amber-800/90 leading-relaxed">
                      Trace through invariants and test edge cases. Review the assessment quiz questions for this module to test your retention and reinforce your learning path.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    Close Lesson
                  </button>
                  <button
                    onClick={() => {
                      setActiveLesson(null);
                      setActiveTab('assessments');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    Attempt Practice Quiz
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">My Enrolled Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Access your course curriculum, video lessons, reference notes, and assessments.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('explore-courses')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer self-start sm:self-auto"
        >
          Explore More Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enr, idx) => {
          const course = enr.course;
          const modules = dbService.getModulesByCourse(course.id);
          const results = dbService.getStudentResults(currentUser.id).filter(r => r.courseId === course.id);

          return (
            <motion.div
              key={enr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.08 }}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-indigo-700 shadow-xs border border-white/60">
                      {course.code}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/60 text-white backdrop-blur-xs">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Syllabus Progress</span>
                      <span className="text-indigo-600 font-bold">{enr.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${enr.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{modules.length} Modules</span>
                    </div>
                    <span className="font-medium text-slate-600">{results.length} Quizzes Graded</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedCourseId(course.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 text-indigo-700 text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Open Modules & Lessons</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
