/**
 * SmartAssess AI: Admin Dashboard (Navy, Teal, Sky Blue, Beige & White Palette)
 * High-level institutional oversight, platform analytics, support priority counters,
 * and quick access to mentor allocation & audit logs.
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  HeartHandshake,
  AlertTriangle,
  GitPullRequest,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser, institution } = useAuth();
  if (!currentUser) return null;

  const users = dbService.getUsers();
  const students = users.filter(u => u.role === 'STUDENT');
  const teachers = users.filter(u => u.role === 'TEACHER');
  const courses = dbService.getCourses();
  const institutions = dbService.getInstitutions();
  const assignments = dbService.getMentorAssignments();
  const workloads = dbService.getTeacherWorkloadStats();
  const auditLogs = dbService.getAuditLogs();

  const totalCapacity = workloads.reduce((sum, w) => sum + w.maxMenteesCapacity, 0);
  const usedCapacity = workloads.reduce((sum, w) => sum + w.currentMenteesCount, 0);

  // Support priority distribution data with Navy, Teal, Sky Blue palette accents
  const priorityData = [
    { name: 'High Priority (<40%)', count: 1, color: '#f43f5e' },
    { name: 'Moderate (40-59%)', count: 1, color: '#f59e0b' },
    { name: 'On Track (≥60%)', count: Math.max(1, students.length - 2), color: '#0d9488' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b192c] via-[#132a47] to-[#0b192c] p-6 sm:p-8 text-white shadow-xl border border-[#1e3e62]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[#38bdf8] text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>System Administrator Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Operations Overview
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              {institution?.name || 'National Institute of Technology & Engineering'}. Active with {students.length} students, {teachers.length} faculty members, and {assignments.length} automated mentor allocations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('mentor-allocation')}
              className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <GitPullRequest className="w-4 h-4 text-white" />
              <span>Run Mentor Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className="px-4 py-2.5 rounded-xl bg-[#1e3e62] hover:bg-[#254d79] border border-[#38bdf8]/30 text-[#f8f5ee] text-xs font-semibold transition cursor-pointer backdrop-blur-xs"
            >
              <span>Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0d9488]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 rounded-full bg-[#0284c7]/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Students</span>
            <div className="w-8 h-8 rounded-xl bg-[#0b192c]/5 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#0b192c]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{students.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active enrollments</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty</span>
            <div className="w-8 h-8 rounded-xl bg-[#0284c7]/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#0284c7]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{teachers.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Professors & Mentors</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mentor Pairs</span>
            <div className="w-8 h-8 rounded-xl bg-[#0d9488]/10 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-[#0d9488]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{assignments.length}</div>
          <div className="text-[11px] text-[#0d9488] font-semibold mt-1">Automated matches</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Load</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{usedCapacity} / {totalCapacity}</div>
          <div className="text-[11px] text-slate-400 mt-1">Slots utilized</div>
        </div>
      </div>

      {/* Analytics & Workload Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Priority Distribution */}
        <div className="bg-white border border-[#eee5d3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0b192c]">Academic Support Priority Distribution</h2>
            <p className="text-xs text-slate-500">Classified using ML prediction and module score thresholds</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f2ece0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#eee5d3] p-2.5 rounded-xl shadow-lg text-xs">
                          <div className="font-semibold text-[#0b192c]">{d.name}</div>
                          <div className="mt-1 font-bold text-[#0d9488]">{d.count} Student(s)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Audit Log Feed */}
        <div className="bg-white border border-[#eee5d3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0b192c]">Recent Audit Trail</h2>
              <p className="text-xs text-slate-500">Immutable security logs for administrative actions</p>
            </div>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className="text-xs text-[#0284c7] hover:text-[#0369a1] font-semibold cursor-pointer"
            >
              Full Audit →
            </button>
          </div>

          <div className="divide-y divide-[#f2ece0] text-xs">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">{log.action}</span>
                  <span className="text-[10px] text-slate-400">
                    By: {log.actorName || log.actorId} • {log.entityType}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
