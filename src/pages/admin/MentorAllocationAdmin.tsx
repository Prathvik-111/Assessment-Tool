/**
 * SmartAssess AI: Automatic Student–Mentor Allocation System (Admin Hub) (Aesthetic Mild Light Theme)
 * Section 8 & Section 12 implementation:
 * - Teacher workload & maximum capacity monitoring
 * - Configurable academic support threshold rules (<40% High, 40-59% Moderate)
 * - One-click Automatic Allocation Engine execution with atomic transactional assignment
 * - Candidate suitability score breakdown (Weak topic 35%, Subject 25%, Capacity 25%, Instructor 15%)
 * - Manual Assignment & Reassignment modal with capacity checks
 * - Active Assignments roster with audit tracking
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import {
  GitPullRequest,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Play,
  Settings2,
  HeartHandshake,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  RotateCcw,
  Clock,
  Layers,
  X,
} from 'lucide-react';

export const MentorAllocationAdmin: React.FC = () => {
  const { currentUser } = useAuth();
  const [allocationLog, setAllocationLog] = useState<{
    matchedCount: number;
    unmatchedCount: number;
    details: string[];
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual assign form state
  const [manualStudentId, setManualStudentId] = useState('');
  const [manualTeacherId, setManualTeacherId] = useState('');
  const [manualCourseId, setManualCourseId] = useState('');
  const [manualReason, setManualReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const workloads = dbService.getTeacherWorkloadStats();
  const assignments = dbService.getMentorAssignments();
  const students = dbService.getUsers().filter(u => u.role === 'STUDENT');
  const teachers = dbService.getUsers().filter(u => u.role === 'TEACHER');
  const courses = dbService.getCourses();

  // Find students who currently have no active mentor
  const unassignedStudents = students.filter(s => {
    return !assignments.some(
      a => a.studentId === s.id && (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS')
    );
  });

  const handleRunAutomaticAllocation = () => {
    setIsRunning(true);
    setErrorMsg(null);

    setTimeout(() => {
      try {
        const result = dbService.runAutomaticMentorAllocation(currentUser.id);
        setAllocationLog(result);
        setSuccessMsg(
          `Allocation successfully executed! Matched ${result.matchedCount} student(s) to eligible faculty mentors.`
        );
      } catch (err: any) {
        setErrorMsg(err.message || 'Allocation failed.');
      } finally {
        setIsRunning(false);
      }
    }, 600);
  };

  const handleManualAssign = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      dbService.assignOrReassignMentor(
        manualStudentId,
        manualTeacherId,
        manualCourseId,
        manualReason,
        undefined,
        currentUser.id
      );

      setSuccessMsg('Mentor successfully assigned via administrative override.');
      setShowManualModal(false);
      setManualReason('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Manual assignment failed.');
    }
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
            <GitPullRequest className="w-4 h-4" />
            <span>Intelligent Faculty Matching Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Automatic Mentor Allocation</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synthesizes student weak-topic telemetry with teacher expertise proficiencies and strict capacity bounds.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setManualStudentId(students[0]?.id || '');
              setManualTeacherId(teachers[0]?.id || '');
              setManualCourseId(courses[0]?.id || '');
              setShowManualModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            Manual Assign / Reassign
          </button>

          <button
            onClick={handleRunAutomaticAllocation}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Engine...' : 'Run Auto Allocation'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2.5 shadow-xs"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Allocation Execution Summary if recently run */}
      <AnimatePresence>
        {allocationLog && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Engine Execution Summary</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono font-medium">
                Matched: {allocationLog.matchedCount} | Unmatched: {allocationLog.unmatchedCount}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {allocationLog.details.map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200/60">
                  &gt; {log}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Threshold Rules Config Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <Settings2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900">Active Institutional Mentoring Thresholds:</span>
            <p className="text-slate-500 mt-0.5">
              &lt;40% Score: <strong className="text-rose-600">High-Priority Support</strong> • 40-59%: <strong className="text-amber-600">Moderate Support</strong> • Module Weakness Trigger: &lt;55%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
          <span>Weighted Matching: Topic (35%) + Subject (25%) + Capacity (25%) + Instructor (15%)</span>
        </div>
      </div>

      {/* Teacher Capacity & Workload Matrix */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Faculty Mentoring Capacity & Caseload Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Guarantees faculty never exceed maximum mentee allocations during automated matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workloads.map(w => {
            const usagePct = (w.currentMenteesCount / w.maxMenteesCapacity) * 100;
            const isFull = w.capacityRemaining === 0;

            return (
              <div
                key={w.teacher.id}
                className={`p-4 rounded-2xl border text-xs space-y-3 ${
                  isFull ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50/70 border-slate-200/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={w.teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={w.teacher.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{w.teacher.name}</div>
                      <div className="text-[10px] text-slate-500">{w.teacher.department}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isFull
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isFull ? 'AT CAPACITY' : `${w.capacityRemaining} SLOTS OPEN`}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Mentee Allocation</span>
                    <span className="font-bold text-slate-900">
                      {w.currentMenteesCount} / {w.maxMenteesCapacity}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      style={{ width: `${Math.min(100, usagePct)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Specialist Competencies:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {w.expertise.map(exp => (
                      <span
                        key={exp.id}
                        className="px-2 py-0.5 rounded-full bg-white text-[10px] text-slate-700 border border-slate-200 font-medium"
                      >
                        {exp.topic} (★{exp.proficiencyLevel})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Mentor Assignments Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Active Mentor Allocations ({assignments.length})</h2>
          <span className="text-xs text-slate-500 font-medium">{unassignedStudents.length} Students Unassigned</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assigned Mentor</th>
                <th className="py-3 px-4">Course & Target Weakness</th>
                <th className="py-3 px-4">Suitability Score</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {a.student.name}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-700 font-semibold">
                    {a.teacher.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-medium block">{a.course.code}</span>
                    <span className="text-[10px] text-rose-600 font-semibold">
                      {a.targetModule?.title || 'Loops & Functions'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {a.suitabilityScore}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {a.allocationMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(a.assignedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Assignment Modal */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowManualModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleManualAssign} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Administrative Override
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Assign / Reassign Faculty Mentor</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
                  <select
                    value={manualStudentId}
                    onChange={e => setManualStudentId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.department || s.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Teacher</label>
                  <select
                    value={manualTeacherId}
                    onChange={e => setManualTeacherId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    {workloads.map(w => (
                      <option key={w.teacher.id} value={w.teacher.id}>
                        {w.teacher.name} ({w.currentMenteesCount}/{w.maxMenteesCapacity} active mentees)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={manualCourseId}
                    onChange={e => setManualCourseId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Institutional Note</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="State the administrative rationale for this assignment..."
                    value={manualReason}
                    onChange={e => setManualReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Commit Assignment
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
