/**
 * SmartAssess AI: Teacher Assignments & Grading Hub (Aesthetic Mild Light Theme)
 * Create assignments, view student submissions, evaluate solutions with marks & feedback.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Assignment, Submission } from '../../types/index.ts';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  MessageSquare,
  Award,
  Send,
  X,
  UserCheck,
} from 'lucide-react';

export const TeacherAssignments: React.FC = () => {
  const { currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [evaluatingSub, setEvaluatingSub] = useState<(Submission & { studentName?: string; assignmentTitle?: string; maxMarks?: number }) | null>(null);

  // Creation form state
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [dueDate, setDueDate] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Evaluation form state
  const [marksGiven, setMarksGiven] = useState(85);
  const [feedbackText, setFeedbackText] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const courses = dbService.getTeacherCourses(currentUser.id);
  const courseIds = courses.map(c => c.id);
  const assignments = dbService.getAssignments().filter(a => courseIds.includes(a.courseId));

  const allSubmissions = assignments.flatMap(a => {
    return dbService.getSubmissionsByAssignment(a.id).map(s => ({
      ...s,
      studentName: s.student?.name || 'Student',
      assignmentTitle: a.title,
      maxMarks: a.maxMarks,
    }));
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !title.trim()) return;

    dbService.createAssignment({
      courseId: selectedCourseId,
      title,
      instructions,
      maxMarks: Number(maxMarks),
      dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
    }, currentUser.id);

    setFeedbackMsg('Assignment published to students successfully!');
    setShowCreateModal(false);
    setTitle('');
    setInstructions('');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleEvaluateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingSub) return;

    dbService.evaluateSubmission(
      evaluatingSub.id,
      Number(marksGiven),
      feedbackText,
      currentUser.id
    );

    setFeedbackMsg(`Submission graded: ${marksGiven} marks recorded.`);
    setEvaluatingSub(null);
    setFeedbackText('');
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Assignment Management & Grading</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish coding projects, review student solutions, and provide formative academic feedback.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCourseId(courses[0]?.id || '');
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
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

      {/* Two Column Grid: Assignments and Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Published Assignments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Active Assignments ({assignments.length})</h2>
            <span className="text-xs text-slate-500 font-medium">Curriculum Coursework</span>
          </div>

          <div className="space-y-3">
            {assignments.map(asg => {
              const course = dbService.getCourseById(asg.courseId);
              const subs = dbService.getSubmissionsByAssignment(asg.id);

              return (
                <div
                  key={asg.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {course?.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Due: {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{asg.title}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{asg.instructions}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 font-medium">
                    <span>Max: {asg.maxMarks} pts</span>
                    <span className="text-indigo-600 font-bold">{subs.length} Submission(s)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Submissions to Grade */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Student Submissions ({allSubmissions.length})</h2>
            <span className="text-xs text-slate-500 font-medium">Ready for Review</span>
          </div>

          <div className="space-y-3">
            {allSubmissions.map(sub => (
              <div
                key={sub.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs">{sub.studentName}</div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'EVALUATED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {sub.status === 'EVALUATED' ? `Graded: ${sub.marksObtained}/${sub.maxMarks}` : 'Needs Evaluation'}
                  </span>
                </div>

                <div className="text-slate-700 font-medium text-[11px]">
                  Assignment: {sub.assignmentTitle}
                </div>

                {sub.textContent && (
                  <pre className="p-3 rounded-xl bg-slate-100 font-mono text-[10px] text-slate-800 overflow-x-auto max-h-24 border border-slate-200">
                    {sub.textContent}
                  </pre>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    Submitted: {new Date(sub.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>

                  <button
                    onClick={() => {
                      setEvaluatingSub(sub);
                      setMarksGiven(sub.marksObtained || 85);
                      setFeedbackText(sub.feedback || '');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer shadow-2xs transition"
                  >
                    {sub.status === 'EVALUATED' ? 'Edit Evaluation' : 'Evaluate Submission'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluate Submission Modal */}
      <AnimatePresence>
        {evaluatingSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setEvaluatingSub(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleEvaluateSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Submission Assessment
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Evaluate {evaluatingSub.studentName}'s Solution</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{evaluatingSub.assignmentTitle}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Marks Awarded (Max: {evaluatingSub.maxMarks} points)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={evaluatingSub.maxMarks || 100}
                    required
                    value={marksGiven}
                    onChange={e => setMarksGiven(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Written Feedback & Recommendations
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide constructive feedback highlighting areas of strength and necessary code revisions..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEvaluatingSub(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Submit Grade & Feedback
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Coursework Authoring
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Create New Assignment</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course</label>
                  <select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab 4: Recursive Tree Traversal"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions & Problem Specification</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detail expected inputs, algorithmic constraints, and test scenarios..."
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={maxMarks}
                      onChange={e => setMaxMarks(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
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
                    Publish Assignment
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
