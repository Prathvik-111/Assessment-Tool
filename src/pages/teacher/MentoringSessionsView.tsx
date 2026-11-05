/**
 * SmartAssess AI: Faculty Mentoring Sessions View (Aesthetic Mild Light Theme)
 * Schedule, monitor, and conduct 1-on-1 counseling sessions with assigned mentees.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import {
  CalendarCheck,
  Clock,
  Video,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react';

export const MentoringSessionsView: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const mentees = dbService.getTeacherMentees(currentUser.id);
  const allSessions = mentees.flatMap(m => {
    return m.sessions.map(s => ({
      ...s,
      studentName: m.student.name,
      studentAvatar: m.student.avatarUrl,
      courseTitle: m.course.title,
      weakTopic: m.targetModule?.title || 'Core Fundamentals',
    }));
  });

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Mentoring Sessions Calendar</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Upcoming and past 1-on-1 diagnostic meetings with assigned student mentees.
          </p>
        </div>
      </div>

      {allSessions.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
          <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Sessions Scheduled</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Open the "My Mentees" page to propose a targeted remediation session with any assigned student.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allSessions.map((sess, idx) => (
            <motion.div
              key={sess.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={sess.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt={sess.studentName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{sess.studentName}</span>
                    <span className="text-[11px] text-slate-500">{sess.courseTitle}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {sess.status}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{sess.title}</h3>
                {sess.agenda && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sess.agenda}</p>
                )}
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center space-x-1.5 text-[11px] font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {new Date(sess.scheduledAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>({sess.durationMinutes}m)</span>
                </div>

                {sess.meetingLink && (
                  <a
                    href={sess.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
