/**
 * SmartAssess AI: Teacher "My Mentees" Dedicated Portal (Aesthetic Mild Light Theme)
 * Section 10 implementation:
 * - Display all students currently assigned to the logged-in teacher
 * - Show support priority, weak modules, assessment averages, and trends
 * - Interactive student drilldown:
 *   - View assessment history and AI learning recommendations
 *   - Add mentoring notes with sharing controls
 *   - Schedule mentoring sessions
 *   - Update mentoring status & review
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import {
  HeartHandshake,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  X,
  Award,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Send,
  Video,
} from 'lucide-react';

export const MyMentees: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form states
  const [noteContent, setNoteContent] = useState('');
  const [isShared, setIsShared] = useState(true);
  const [actionItem, setActionItem] = useState('');

  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionAgenda, setSessionAgenda] = useState('');
  const [sessionDate, setSessionDate] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const mentees = dbService.getTeacherMentees(currentUser.id);
  const selectedMentee = mentees.find(m => m.studentId === selectedMenteeId) || mentees[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee || !noteContent.trim()) return;

    dbService.addMentoringNote(
      selectedMentee.id,
      currentUser.id,
      noteContent,
      isShared,
      actionItem || undefined
    );

    setFeedbackMsg('Mentoring note saved and synchronized with student file.');
    setTimeout(() => {
      setFeedbackMsg(null);
      setShowAddNoteModal(false);
      setNoteContent('');
      setActionItem('');
    }, 2000);
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee || !sessionTitle.trim() || !sessionDate) return;

    dbService.scheduleMentoringSession(
      selectedMentee.id,
      sessionTitle,
      sessionAgenda,
      sessionDate,
      45,
      `https://meet.jit.si/smartassess-${selectedMentee.id.substring(0, 6)}`,
      currentUser.id
    );

    setFeedbackMsg('Mentoring session scheduled! Calendar invitation sent to mentee.');
    setTimeout(() => {
      setFeedbackMsg(null);
      setShowScheduleModal(false);
      setSessionTitle('');
      setSessionAgenda('');
      setSessionDate('');
    }, 2000);
  };

  const handleUpdateStatus = (newStatus: any) => {
    if (!selectedMentee) return;
    dbService.updateMentoringStatus(selectedMentee.id, newStatus, currentUser.id);
    setFeedbackMsg(`Mentoring status updated to ${newStatus}.`);
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
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Faculty Mentorship Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">My Assigned Mentees</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor struggling students, review AI diagnostic indicators, record counseling notes, and track progress.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          <span className="font-bold text-slate-900">{mentees.length}</span> of{' '}
          <span className="font-bold text-slate-900">{currentUser.maxMentees || 5}</span> capacity slots utilized
        </div>
      </div>

      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </motion.div>
      )}

      {mentees.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3 shadow-xs">
          <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">No Active Mentees</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You currently have no students assigned to your mentoring roster. When student performance flags support thresholds, the allocation engine will match eligible students to your expertise.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Mentees List Cards */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Assigned Students ({mentees.length})
            </div>

            {mentees.map(m => {
              const isSelected = selectedMentee?.studentId === m.studentId;
              const isHighRisk = m.studentScoreAtAllocation && m.studentScoreAtAllocation < 40;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMenteeId(m.studentId)}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-xs space-y-2.5 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm ring-1 ring-indigo-400/40'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={m.student.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                        alt={m.student.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{m.student.name}</div>
                        <div className="text-[11px] text-slate-400">{m.student.id}</div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isHighRisk
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isHighRisk ? 'HIGH PRIORITY' : 'MODERATE'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                    <span>Weak Area: <strong className="text-rose-600">{m.targetModule?.title.split(':')[1] || 'Loops'}</strong></span>
                    <span>Baseline: <strong className="text-slate-800">{m.studentScoreAtAllocation}%</strong></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 text-slate-400">
                    <span>Status: <strong className="text-indigo-600">{m.status}</strong></span>
                    <span>{m.sessions.length} Session(s)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 2 Columns: Detailed Mentee Dossier & Actions */}
          {selectedMentee && (
            <div className="lg:col-span-2 space-y-6">
              {/* Dossier Header */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={selectedMentee.student.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                      alt={selectedMentee.student.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-bold text-slate-900">{selectedMentee.student.name}</h2>
                        <span className="text-xs text-slate-500">({selectedMentee.student.email})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {selectedMentee.student.department} • Course: <strong className="text-indigo-600">{selectedMentee.course.title}</strong>
                      </p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Allocated: {new Date(selectedMentee.assignedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Session</span>
                    </button>
                    <button
                      onClick={() => setShowAddNoteModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Mentoring Status:</span>
                    <span className="font-bold text-indigo-700 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
                      {selectedMentee.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-[11px] font-medium">Update Status:</span>
                    <button
                      onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold cursor-pointer shadow-2xs"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('RESOLVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold cursor-pointer border border-emerald-200 shadow-2xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Recommendations & Academic History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Recommendations */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>AI Model Recommendations</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {selectedMentee.prediction?.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700 leading-relaxed"
                      >
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rationale & Allocation Baseline */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Allocation Rationale</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-1.5 leading-relaxed">
                    <div className="font-bold text-rose-900">
                      Weak Area: {selectedMentee.targetModule?.title || 'Loops & Functions'}
                    </div>
                    <p className="text-rose-800/90">{selectedMentee.reason}</p>
                  </div>
                </div>
              </div>

              {/* Mentoring Sessions & Guidance Notes */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">Mentoring Notes & Interventions ({selectedMentee.notes.length})</h3>
                  </div>
                  <button
                    onClick={() => setShowAddNoteModal(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                  >
                    + Log New Note
                  </button>
                </div>

                {selectedMentee.notes.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center italic">
                    No notes recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedMentee.notes.map(note => (
                      <div
                        key={note.id}
                        className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(note.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              note.isSharedWithStudent
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {note.isSharedWithStudent ? 'Shared with Student' : 'Private Faculty Note'}
                          </span>
                        </div>

                        <p className="text-slate-800 leading-relaxed font-medium">
                          "{note.noteContent}"
                        </p>

                        {note.recommendedAction && (
                          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900">
                            <strong className="text-indigo-700">Action Required: </strong>
                            {note.recommendedAction}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Mentoring Note Modal */}
      <AnimatePresence>
        {showAddNoteModal && selectedMentee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Mentoring Documentation
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Record Mentee Feedback</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Student: {selectedMentee.student.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnostic Observations / Guidance</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detail the conceptual roadblocks observed and advice given..."
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recommended Follow-up Action / Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Redo Lesson 4.2 practice exercises and submit by Friday"
                    value={actionItem}
                    onChange={e => setActionItem(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="sharedCheckbox"
                    checked={isShared}
                    onChange={e => setIsShared(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="sharedCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Share this note with student on their "My Mentor" portal
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddNoteModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Session Modal */}
      <AnimatePresence>
        {showScheduleModal && selectedMentee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowScheduleModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleScheduleSession} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    1-on-1 Consultation
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Schedule Mentoring Session</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Student: {selectedMentee.student.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diagnostic Code Walkthrough: Function Scopes"
                    value={sessionTitle}
                    onChange={e => setSessionTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={sessionDate}
                    onChange={e => setSessionDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Agenda & Required Preparation</label>
                  <textarea
                    rows={3}
                    placeholder="Items the mentee should review before connecting..."
                    value={sessionAgenda}
                    onChange={e => setSessionAgenda(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Confirm & Schedule
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
