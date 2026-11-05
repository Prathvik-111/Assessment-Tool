/**
 * SmartAssess AI: Teacher Assessment Authoring & Quiz Builder (Aesthetic Mild Light Theme)
 * Section 6 implementation:
 * - Create module quizzes and examinations
 * - Set duration, total marks, passing marks
 * - Select questions from the question bank
 * - Configure automatic grading
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Assessment, AssessmentType, Question } from '../../types/index.ts';
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle,
  Award,
  Layers,
  HelpCircle,
  X,
  Play,
  ShieldCheck,
} from 'lucide-react';

export const TeacherAssessments: React.FC = () => {
  const { currentUser } = useAuth();
  const courses = currentUser ? dbService.getTeacherCourses(currentUser.id) : [];
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AssessmentType>('MODULE_QUIZ');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [passingMarks, setPassingMarks] = useState(40);
  const [totalMarks, setTotalMarks] = useState(100);
  const [isAutoGraded, setIsAutoGraded] = useState(true);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [targetModuleId, setTargetModuleId] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const assessments = currentCourse ? dbService.getAssessments(currentCourse.id) : [];
  const modules = currentCourse ? dbService.getModulesByCourse(currentCourse.id) : [];
  const bankQuestions = dbService.getQuestions();

  const handleToggleQuestion = (qId: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse || !title.trim()) return;

    dbService.createAssessment({
      courseId: currentCourse.id,
      moduleId: targetModuleId || undefined,
      title,
      description,
      type,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      isAutoGraded,
      isPublished: true,
      questionIds: selectedQuestionIds,
    }, currentUser.id);

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setSelectedQuestionIds([]);
    setFeedbackMsg(`Assessment "${title}" published successfully!`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Assessment Authoring & Quizzes</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure automated quizzes, midterms, and final exams with AI randomized questions and camera/voice proctoring.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {courses.length > 1 && (
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setSelectedQuestionIds(bankQuestions.slice(0, 2).map(q => q.id));
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2.5 shadow-xs"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </motion.div>
      )}

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((asm, idx) => {
          const mod = modules.find(m => m.id === asm.moduleId);
          const qCount = asm.questionIds?.length || 2;

          return (
            <motion.div
              key={asm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.08 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {asm.type.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {asm.isAutoGraded ? 'Auto-Graded' : 'Manual'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">{asm.title}</h3>
                {mod && (
                  <p className="text-xs text-indigo-600 font-medium">Linked to: {mod.title.split(':')[0]}</p>
                )}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{asm.description}</p>
              </div>

              <div className="pt-3 grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-100">
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Duration</span>
                  <span className="font-bold text-slate-800">{asm.durationMinutes}m</span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Items</span>
                  <span className="font-bold text-slate-800">{qCount} Qs</span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Passing</span>
                  <span className="font-bold text-slate-800">{asm.passingMarks}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Assessment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateAssessment} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Evaluation Designer
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Create Assessment</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Module 7 Comprehensive Mastery Quiz"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Summarize rules, permitted materials, and pass criteria..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as AssessmentType)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="MODULE_QUIZ">Module Quiz</option>
                      <option value="MIDTERM">Midterm Exam</option>
                      <option value="FINAL_EXAM">Final Exam</option>
                      <option value="PRACTICE_TEST">Practice Diagnostic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                {modules.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Module</label>
                    <select
                      value={targetModuleId}
                      onChange={e => setTargetModuleId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="">General / Cumulative</option>
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Select Questions from Bank */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Items from Question Bank ({selectedQuestionIds.length} chosen)
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    {bankQuestions.map(q => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => handleToggleQuestion(q.id)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2">{q.questionText}</span>
                          <span className="text-[10px] font-bold text-indigo-600 shrink-0">{q.points} pts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="autoGradeToggle"
                    checked={isAutoGraded}
                    onChange={e => setIsAutoGraded(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="autoGradeToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Enable automated grading with instant answer feedback
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Publish Assessment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
