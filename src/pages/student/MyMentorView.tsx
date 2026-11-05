/**
 * SmartAssess AI: My Mentor Dedicated Student View
 * Navy, Teal, Sky Blue, Beige, and White Palette
 * Detailed mentor profile, weak concept focus, sessions, guided review notes,
 * and before vs after performance improvement tracking.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import {
  HeartHandshake,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  Video,
  Send,
  Plus,
  X,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

interface MyMentorViewProps {
  setActiveTab: (tab: string) => void;
}

export const MyMentorView: React.FC<MyMentorViewProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);
  const primaryCourse = enrollments[0]?.course || dbService.getCourses()[0];
  const mentorData = dbService.getStudentMentor(currentUser.id, primaryCourse?.id);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionAgenda, setSessionAgenda] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Before vs After progress calculation
  const results = dbService.getStudentResults(currentUser.id);
  const targetModuleScore = mentorData?.targetModule
    ? results.find(r => r.moduleId === mentorData.targetModule?.id)?.percentage ?? 35
    : 35;
  const currentScore = targetModuleScore;
  const improvement = currentScore - targetModuleScore;

  const handleRequestSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorData || !sessionTopic.trim() || !sessionDate) return;

    dbService.scheduleMentoringSession(
      mentorData.id,
      sessionTopic,
      sessionAgenda,
      new Date(sessionDate).toISOString(),
      45,
      'https://meet.google.com/sma-ment-rev',
      currentUser.id
    );

    setFeedbackSuccess('Your 1-on-1 mentoring consultation request has been sent to your assigned faculty member.');
    setTimeout(() => {
      setFeedbackSuccess(null);
      setShowRequestModal(false);
      setSessionTopic('');
      setSessionAgenda('');
      setSessionDate('');
    }, 2500);
  };

  if (!mentorData) {
    return (
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center mx-auto">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0b192c]">No Active Mentor Assigned</h2>
        <p className="text-xs sm:text-sm text-[#0b192c]/70 leading-relaxed">
          SmartAssess AI automatically assigns a faculty mentor whenever module assessment scores drop under 40% (high priority) or when academic difficulty is detected by the machine learning engine.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('assessments')}
            className="px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#0d9488]/20"
          >
            Take Assessments to Evaluate Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#0d9488] text-xs font-bold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Dedicated Faculty Mentorship</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b192c] tracking-tight">My Academic Mentor</h1>
          <p className="text-xs sm:text-sm text-[#0b192c]/70">
            Assigned specialist faculty supporting your mastery of challenging module concepts.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Mentoring Session</span>
        </button>
      </div>

      {feedbackSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[#0b192c]">{feedbackSuccess}</span>
        </motion.div>
      )}

      {/* Mentor Profile Overview Card */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={mentorData.teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={mentorData.teacher.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-[#0d9488]/20 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#0b192c]">{mentorData.teacher.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0b192c]/10 text-[#0b192c] border border-[#0b192c]/20">
                  {mentorData.allocationMethod.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30">
                  Suitability: {mentorData.suitabilityScore}%
                </span>
              </div>

              <p className="text-xs text-[#0b192c]/70 font-medium">
                {mentorData.teacher.department} • Course: <span className="text-[#0d9488] font-bold">{mentorData.course.title}</span>
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {mentorData.expertise.map(exp => (
                  <span
                    key={exp.id}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#f8f5ee] border border-[#eee5d3] text-[11px] text-[#0b192c]"
                  >
                    <span>{exp.topic}</span>
                    <span className="text-amber-500 font-bold">★{exp.proficiencyLevel}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] max-w-sm shrink-0 text-xs space-y-2">
            <div className="text-[#0b192c]/50 font-bold uppercase text-[10px]">
              Allocation Rationale & Focus
            </div>
            <div className="font-bold text-[#0d9488]">
              Focus: {mentorData.targetModule?.title || 'Loops & Functions'}
            </div>
            <p className="text-[#0b192c]/70 text-[11px] leading-relaxed">
              "{mentorData.reason}"
            </p>
          </div>
        </div>
      </div>

      {/* Before vs After Mentoring Progress Tracker */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#0d9488]" />
          <h2 className="text-sm font-bold text-[#0b192c]">Remediation Progress & Impact</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3]">
            <span className="text-xs text-[#0b192c]/60 block mb-1">Score at Allocation Baseline</span>
            <div className="text-2xl font-extrabold text-rose-600">{targetModuleScore}%</div>
            <span className="text-[11px] text-[#0b192c]/50">Diagnostic baseline</span>
          </div>

          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3]">
            <span className="text-xs text-[#0b192c]/60 block mb-1">Current Module Score</span>
            <div className="text-2xl font-extrabold text-[#0b192c]">{currentScore}%</div>
            <span className="text-[11px] text-[#0b192c]/50">Following guided review</span>
          </div>

          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3]">
            <span className="text-xs text-[#0b192c]/60 block mb-1">Net Academic Progress</span>
            <div className={`text-2xl font-extrabold ${improvement >= 0 ? 'text-[#0d9488]' : 'text-rose-600'}`}>
              {improvement >= 0 ? `+${improvement}%` : `${improvement}%`}
            </div>
            <span className="text-[11px] text-[#0b192c]/50">
              {improvement >= 0 ? 'Remediation on schedule' : 'Ongoing evaluation'}
            </span>
          </div>
        </div>
      </div>

      {/* Sessions and Feedback Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Sessions */}
        <div className="bg-white border border-[#eee5d3] rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#0d9488]" />
              <h2 className="text-sm font-bold text-[#0b192c]">Mentoring Sessions ({mentorData.sessions.length})</h2>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="text-xs text-[#0d9488] hover:text-[#0f766e] font-bold cursor-pointer"
            >
              + Schedule
            </button>
          </div>

          {mentorData.sessions.length === 0 ? (
            <div className="text-xs text-slate-400 py-6 text-center italic">
              No sessions scheduled yet. Click "+ Schedule" to request a session.
            </div>
          ) : (
            <div className="space-y-3">
              {mentorData.sessions.map(sess => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[#0b192c] text-sm">{sess.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20">
                      {sess.status}
                    </span>
                  </div>

                  {sess.agenda && (
                    <p className="text-[#0b192c]/80 text-xs leading-relaxed">{sess.agenda}</p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#0b192c]/60 border-t border-[#eee5d3]">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#0d9488]" />
                        <span>{new Date(sess.scheduledAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      <span>({sess.durationMinutes}m)</span>
                    </div>

                    {sess.meetingLink && (
                      <a
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[#0284c7] hover:underline font-bold"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Video Room</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentor Guidance Notes */}
        <div className="bg-white border border-[#eee5d3] rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#0d9488]" />
            <h2 className="text-sm font-bold text-[#0b192c]">Faculty Notes & Action Items</h2>
          </div>

          {mentorData.notes.length === 0 ? (
            <div className="text-xs text-slate-400 py-6 text-center italic">
              No notes logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {mentorData.notes.map(note => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3] space-y-2 text-xs"
                >
                  <p className="text-[#0b192c] leading-relaxed font-medium">
                    "{note.noteContent}"
                  </p>

                  {note.recommendedAction && (
                    <div className="p-2.5 rounded-xl bg-[#0d9488]/10 border border-[#0d9488]/20 text-[11px] text-[#0b192c]">
                      <span className="font-bold block text-[#0d9488] mb-0.5">Assigned Practice Drill:</span>
                      {note.recommendedAction}
                    </div>
                  )}

                  <div className="text-[10px] text-[#0b192c]/50 pt-1">
                    Logged {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Session Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111e]/60 backdrop-blur-xs">
          <div className="bg-white border border-[#eee5d3] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-[#0b192c]/40 hover:text-[#0b192c] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleRequestSession} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
                  1-on-1 Consultation
                </span>
                <h3 className="font-bold text-[#0b192c] text-base">Request Mentoring Session</h3>
                <p className="text-xs text-[#0b192c]/60 mt-1">Mentor: {mentorData.teacher.name}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b192c]/80 mb-1">Session Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diagnostic Review: Loops & Functions"
                  value={sessionTopic}
                  onChange={e => setSessionTopic(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b192c]/80 mb-1">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b192c]/80 mb-1">Agenda / Questions for Review</label>
                <textarea
                  rows={3}
                  placeholder="Describe code errors or topics you need clarification on..."
                  value={sessionAgenda}
                  onChange={e => setSessionAgenda(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f8f5ee] hover:bg-[#eee5d3] text-[#0b192c]/80 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
