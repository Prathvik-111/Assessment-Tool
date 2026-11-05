/**
 * SmartAssess AI: Student Assignments & Submissions (Aesthetic Mild Light Theme)
 * View assignments, deadlines, submit solutions, and review teacher feedback.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Assignment, Submission } from '../../types/index.ts';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Send,
  MessageSquare,
  Award,
  ChevronRight,
  X,
  FileCode,
} from 'lucide-react';

export const AssignmentsList: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);
  const enrolledCourseIds = enrollments.map(e => e.courseId);
  const assignments = dbService.getAssignments().filter(a => enrolledCourseIds.includes(a.courseId));
  const submissions = dbService.getStudentSubmissions(currentUser.id);

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionText.trim()) return;

    dbService.submitAssignmentSolution(
      currentUser.id,
      selectedAssignment.id,
      submissionText
    );

    setFeedbackMsg('Assignment submitted successfully! Your instructor has been notified.');
    setTimeout(() => {
      setFeedbackMsg(null);
      setSelectedAssignment(null);
      setSubmissionText('');
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Course Assignments</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Submit coding tasks, theoretical problem sets, and project writeups for faculty evaluation.
        </p>
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

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((asg, idx) => {
          const course = dbService.getCourseById(asg.courseId);
          const submission = submissions.find(s => s.assignmentId === asg.id);
          const isEvaluated = submission && submission.status === 'EVALUATED';
          const isSubmitted = !!submission;

          return (
            <motion.div
              key={asg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {course?.code}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{asg.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl pt-0.5">
                    {asg.instructions}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Weightage</span>
                    <span className="font-bold text-slate-900 text-xs">{asg.maxMarks} pts</span>
                  </div>

                  <div>
                    {isEvaluated ? (
                      <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Score: {submission.marksObtained}/{asg.maxMarks}</span>
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Submitted (Under Review)</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAssignment(asg);
                          setSubmissionText('');
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
                      >
                        Submit Solution
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Evaluation Feedback Section if graded */}
              {isEvaluated && submission.feedback && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Faculty Review & Feedback:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-5">"{submission.feedback}"</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Submit Assignment Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedAssignment(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Assignment Submission Portal
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{selectedAssignment.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Acceptable Formats: <span className="font-semibold text-slate-700">{selectedAssignment.allowedFormats}</span> or paste text code solution.
                  </p>
                </div>

                <form onSubmit={handleSubmitSolution} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Paste Code Solution / Written Response
                    </label>
                    <textarea
                      rows={6}
                      required
                      placeholder="# Enter your Python solution, algorithm, or theoretical write-up here..."
                      value={submissionText}
                      onChange={e => setSubmissionText(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                      <FileCode className="w-4 h-4 text-indigo-500" />
                      <span>Auto-tagged with student identifier</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm & Submit</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
