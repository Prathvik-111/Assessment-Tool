/**
 * SmartAssess AI: Student Results & Progress Analytics
 * Navy, Teal, Sky Blue, Beige, and White Palette
 * Comprehensive module breakdown, score trend visualization with Recharts,
 * itemized records, and direct Certificate viewing.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { CertificateModal } from '../../components/CertificateModal.tsx';
import { Certificate, AssessmentResult } from '../../types/index.ts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export const StudentResults: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);
  const primaryCourse = enrollments[0]?.course || dbService.getCourses()[0];
  const [selectedCourseId, setSelectedCourseId] = useState<string>(primaryCourse?.id || '');

  const results = dbService.getStudentResults(currentUser.id)
    .filter(r => (selectedCourseId ? r.courseId === selectedCourseId : true));

  const modules = dbService.getModulesByCourse(selectedCourseId);

  // Overall metrics
  const totalAttempted = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const avgScore = totalAttempted > 0
    ? Math.round((results.reduce((s, r) => s + r.percentage, 0) / totalAttempted) * 10) / 10
    : 0;

  // Chart data: Module scores
  const moduleChartData = modules.map(m => {
    const res = results.find(r => r.moduleId === m.id);
    return {
      name: m.title.replace('Module ', 'M').split(':')[0],
      fullName: m.title,
      score: res ? res.percentage : 0,
      attempted: !!res,
    };
  });

  // Trend data
  const trendData = results
    .slice()
    .reverse()
    .map((r, i) => ({
      attempt: `Quiz #${i + 1}`,
      score: r.percentage,
      date: new Date(r.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    }));

  const handleOpenCertificate = (r: AssessmentResult) => {
    // Check if certificate already exists
    const certs = dbService.getStudentCertificates(currentUser.id);
    const existing = certs.find(c => c.assessmentId === r.assessmentId);
    if (existing) {
      setSelectedCert(existing);
    } else {
      // Issue new certificate
      const course = dbService.getCourseById(r.courseId);
      const asm = dbService.getAssessmentById(r.assessmentId);
      const newCert = dbService.issueCertificate({
        studentId: currentUser.id,
        studentName: currentUser.name,
        assessmentId: r.assessmentId,
        assessmentTitle: asm?.title || 'Academic Assessment',
        courseTitle: course?.title || 'Course Examination',
        courseCode: course?.code || 'CS-101',
        score: r.score,
        totalMarks: r.totalMarks,
        percentage: r.percentage,
        institutionName: currentUser.institutionName || 'National Institute of Technology & Engineering',
        proctoredIntegrity: 98,
      });
      setSelectedCert(newCert);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header & Course Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b192c] tracking-tight">
            Academic Results & Performance Records
          </h1>
          <p className="text-xs sm:text-sm text-[#0b192c]/70 mt-0.5">
            Audit logs of all completed quizzes, score trajectories, and earned certificates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('certificates')}
            className="px-3.5 py-2 rounded-xl bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] border border-[#0d9488]/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Award className="w-4 h-4 text-[#0d9488]" />
            <span>My Certificates</span>
          </button>

          {enrollments.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#0b192c]/60 font-medium">Course:</span>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="bg-white border border-[#eee5d3] text-xs rounded-xl px-3 py-2 text-[#0b192c] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
              >
                {enrollments.map(enr => (
                  <option key={enr.course.id} value={enr.course.id}>
                    {enr.course.code} - {enr.course.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="text-[#0b192c]/60 text-xs font-semibold uppercase tracking-wider mb-1">
            Average Score
          </div>
          <div className={`text-2xl font-bold ${avgScore < 50 ? 'text-rose-600' : avgScore < 70 ? 'text-amber-600' : 'text-[#0d9488]'}`}>
            {avgScore}%
          </div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Passing requirement: 40%</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="text-[#0b192c]/60 text-xs font-semibold uppercase tracking-wider mb-1">
            Assessments Passed
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">
            {passedCount} <span className="text-sm font-normal text-[#0b192c]/50">/ {totalAttempted} Attempts</span>
          </div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">
            Success rate: {totalAttempted > 0 ? Math.round((passedCount / totalAttempted) * 100) : 0}%
          </div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="text-[#0b192c]/60 text-xs font-semibold uppercase tracking-wider mb-1">
            Certificates Issued
          </div>
          <div className="text-2xl font-bold text-[#0d9488] flex items-center space-x-1.5">
            <Award className="w-6 h-6 text-[#0d9488]" />
            <span>{passedCount} Diplomas</span>
          </div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Official verified credentials</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Performance Bar Chart */}
        <div className="bg-white border border-[#eee5d3] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b192c] flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#0d9488]" />
              <span>Module Performance Breakdown</span>
            </h2>
            <span className="text-xs text-[#0b192c]/60 font-medium">Scores %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee5d3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#eee5d3] p-2.5 rounded-xl shadow-lg text-xs">
                          <p className="font-bold text-[#0b192c]">{data.fullName}</p>
                          <p className="text-[#0d9488] font-bold mt-1">
                            {data.attempted ? `Score: ${data.score}%` : 'Not Attempted'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {moduleChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={!entry.attempted ? '#cbd5e1' : entry.score < 40 ? '#ef4444' : entry.score < 70 ? '#f59e0b' : '#0d9488'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Trajectory Line Chart */}
        <div className="bg-white border border-[#eee5d3] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b192c] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#0284c7]" />
              <span>Assessment Score Trajectory</span>
            </h2>
            <span className="text-xs text-[#0b192c]/60 font-medium">Historical Path</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee5d3" />
                <XAxis dataKey="attempt" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#eee5d3] p-2.5 rounded-xl shadow-lg text-xs">
                          <p className="font-bold text-[#0b192c]">{data.attempt}</p>
                          <p className="text-[#0d9488] font-bold mt-0.5">Score: {data.score}%</p>
                          <p className="text-slate-400 text-[10px]">{data.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0d9488' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#eee5d3] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0b192c]">Itemized Assessment Records</h2>
          <span className="text-xs text-[#0b192c]/60 font-medium">{results.length} total assessments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eee5d3] bg-[#f8f5ee] text-[#0b192c]/70 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Assessment / Module</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Credential</th>
                <th className="py-3 px-4">Completed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee5d3]">
              {results.map(r => {
                const mod = modules.find(m => m.id === r.moduleId);
                const asm = dbService.getAssessmentById(r.assessmentId);

                return (
                  <tr key={r.id} className="hover:bg-[#f8f5ee]/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-[#0b192c]">
                      {asm?.title || mod?.title || 'Course Quiz'}
                    </td>
                    <td className="py-3.5 px-4 text-[#0b192c] font-semibold">{r.score}</td>
                    <td className="py-3.5 px-4 text-[#0b192c]/60">{r.totalMarks}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          r.percentage < 40
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : r.percentage < 60
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30'
                        }`}
                      >
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {r.passed ? (
                        <span className="inline-flex items-center space-x-1.5 text-[#0d9488] font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488]" />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 text-rose-700 font-semibold text-xs">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Remediation Required</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.passed ? (
                        <button
                          onClick={() => handleOpenCertificate(r)}
                          className="px-2.5 py-1 rounded-lg bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] border border-[#0d9488]/30 font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition"
                        >
                          <Award className="w-3 h-3 text-[#0d9488]" />
                          <span>Certificate</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#0b192c]/60">
                      {new Date(r.recordedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal Instance */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </motion.div>
  );
};
