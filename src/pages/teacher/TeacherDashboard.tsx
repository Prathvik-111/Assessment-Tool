/**
 * SmartAssess AI: Teacher Dashboard (Navy, Teal, Sky Blue, Beige & White Palette)
 * Comprehensive teacher dashboard with course overviews, student performance metrics,
 * pending submissions, assigned mentoring caseload, and Certificate Credential Verification.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Certificate } from '../../types/index.ts';
import { CertificateModal } from '../../components/CertificateModal.tsx';
import {
  BookOpen,
  Users,
  FileCheck2,
  FileText,
  HeartHandshake,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Layers,
  Sparkles,
  Award,
  Search,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

export const TeacherDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [certQuery, setCertQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null | 'NOT_FOUND'>(null);
  const [selectedModalCert, setSelectedModalCert] = useState<Certificate | null>(null);

  if (!currentUser) return null;

  const courses = dbService.getTeacherCourses(currentUser.id);
  const courseIds = courses.map(c => c.id);

  // Mentees
  const mentees = dbService.getTeacherMentees(currentUser.id);
  const remainingCapacity = Math.max(0, (currentUser.maxMentees || 5) - mentees.length);

  // Submissions needing grading
  const assignments = dbService.getAssignments().filter(a => courseIds.includes(a.courseId));
  const submissions = assignments
    .flatMap(a => dbService.getSubmissionsByAssignment(a.id))
    .filter(s => s.status === 'SUBMITTED');

  // Institutional certificates
  const allCertificates = dbService.getAllCertificates();

  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;
    const found = dbService.getCertificateById(certQuery.trim());
    setVerificationResult(found || 'NOT_FOUND');
  };

  const handleQuickVerify = (cert: Certificate) => {
    setCertQuery(cert.certificateNumber);
    setVerificationResult(cert);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b192c] via-[#132a47] to-[#0b192c] p-6 sm:p-8 text-white shadow-xl border border-[#1e3e62]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[#38bdf8] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>Faculty Academic Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Department of {currentUser.department || 'Computer Science'}. You have <span className="text-[#38bdf8] font-bold">{mentees.length} assigned mentees</span> and {submissions.length} student submissions pending evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('verify-credentials')}
              className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Verify Credentials</span>
            </button>
            <button
              onClick={() => setActiveTab('mentees')}
              className="px-4 py-2.5 rounded-xl bg-[#1e3e62] hover:bg-[#254d79] border border-[#38bdf8]/30 text-[#f8f5ee] text-xs font-semibold transition flex items-center space-x-2 cursor-pointer backdrop-blur-xs"
            >
              <HeartHandshake className="w-4 h-4 text-white" />
              <span>Manage Mentees ({mentees.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('question-bank')}
              className="px-4 py-2.5 rounded-xl bg-[#1e3e62] hover:bg-[#254d79] border border-[#38bdf8]/30 text-[#f8f5ee] text-xs font-semibold transition flex items-center space-x-2 cursor-pointer backdrop-blur-xs"
            >
              <Plus className="w-4 h-4 text-[#38bdf8]" />
              <span>Question Bank</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0d9488]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 rounded-full bg-[#0284c7]/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Courses</span>
            <div className="w-8 h-8 rounded-xl bg-[#0b192c]/5 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#0b192c]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{courses.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Authorized curriculum</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Mentees</span>
            <div className="w-8 h-8 rounded-xl bg-[#0d9488]/10 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-[#0d9488]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{mentees.length} / {currentUser.maxMentees || 5}</div>
          <div className="text-[11px] text-[#0d9488] font-semibold mt-1">{remainingCapacity} slot(s) open</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">To Evaluate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{submissions.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pending marks & feedback</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Issued Credentials</span>
            <div className="w-8 h-8 rounded-xl bg-[#0284c7]/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-[#0284c7]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0b192c]">{allCertificates.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Diplomas & Certificates</div>
        </div>
      </div>

      {/* High-Priority Mentee Alert Banner */}
      {mentees.some(m => m.studentScoreAtAllocation && m.studentScoreAtAllocation < 40) && (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-amber-950">
                  Priority Academic Support: Aarav Sharma (35% in Loops & Functions)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  URGENT REMEDIATION
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                Allocated to you by AI engine due to your 5/5 mastery rating in Python Loops & Functions. Diagnostic remediation session scheduled.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('mentees')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition cursor-pointer shadow-xs"
          >
            Open Mentee File
          </button>
        </div>
      )}

      {/* Certificate Credential Verification & Audit Section (Faculty Tool) */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eee5d3]">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#0d9488] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#0d9488]" />
              <span>Institutional Registrar Console</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0b192c]">
              Verify Student Certificate Credentials
            </h2>
            <p className="text-xs text-slate-500">
              Audit and authenticate official academic diplomas, proctored exam scores, and anti-cheat verification codes.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 bg-[#f8f5ee] px-3.5 py-2 rounded-xl border border-[#eee5d3]">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{allCertificates.length} Valid Credentials on Record</span>
          </div>
        </div>

        {/* Verification Search Form */}
        <form onSubmit={handleVerifyCert} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate Number (e.g. SMART-2026-CS101-8941) or Verification Code (VRF-...)..."
                value={certQuery}
                onChange={e => setCertQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs font-mono text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#0b192c] hover:bg-[#132a47] text-white text-xs font-extrabold shadow-md shadow-[#0b192c]/20 transition cursor-pointer shrink-0 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
              <span>Verify Credential</span>
            </button>
          </div>

          {/* Quick-test Chips from DB */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 overflow-x-auto pt-1">
            <span className="font-semibold shrink-0">Quick Check:</span>
            {allCertificates.slice(0, 3).map(cert => (
              <button
                key={cert.id}
                type="button"
                onClick={() => handleQuickVerify(cert)}
                className="px-2.5 py-1 rounded-lg bg-[#f8f5ee] border border-[#eee5d3] hover:border-[#0d9488] hover:text-[#0d9488] text-[10px] font-mono shrink-0 transition cursor-pointer"
              >
                {cert.certificateNumber} ({cert.studentName})
              </button>
            ))}
          </div>
        </form>

        {/* Verification Result Display */}
        {verificationResult === 'NOT_FOUND' && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold block">No Credential Found for "{certQuery}"</span>
                <span className="text-[11px] text-rose-700">Please double check the credential ID or verification hash string.</span>
              </div>
            </div>
            <button
              onClick={() => setVerificationResult(null)}
              className="text-rose-600 hover:text-rose-900 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {verificationResult && verificationResult !== 'NOT_FOUND' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-[#f0fdfa] border-2 border-[#0d9488]/40 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0d9488]/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d9488] text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase text-[#0d9488] tracking-wider">
                      OFFICIALLY VERIFIED & AUTHENTIC
                    </span>
                    {verificationResult.isCourseCompletion && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        Full Course Diploma
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b192c]">
                    {verificationResult.studentName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedModalCert(verificationResult)}
                  className="px-4 py-2 rounded-xl bg-[#0b192c] hover:bg-[#132a47] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Inspect & Print Diploma</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationResult(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Credential Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Course</span>
                <span className="font-bold text-[#0b192c] block truncate">{verificationResult.courseTitle}</span>
                <span className="text-[10px] text-[#0284c7] font-mono">{verificationResult.courseCode}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Honors Grade</span>
                <span className="font-bold text-[#0d9488] block">{verificationResult.grade}</span>
                <span className="text-[10px] text-slate-500">Score: {verificationResult.percentage}%</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Proctored Integrity</span>
                <span className="font-bold text-emerald-700 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{verificationResult.proctoredIntegrity}% Verified</span>
                </span>
                <span className="text-[10px] text-slate-400">Camera & Audio Audited</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Credential ID</span>
                <span className="font-mono font-bold text-[#0b192c] text-[11px] block truncate">
                  {verificationResult.certificateNumber}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(verificationResult.issueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Institutional Certificates Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0b192c] uppercase tracking-wider">
              Recently Issued Institutional Credentials ({allCertificates.length})
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#eee5d3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f5ee] border-b border-[#eee5d3] text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Credential ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course / Award</th>
                  <th className="py-3 px-4">Score & Grade</th>
                  <th className="py-3 px-4">Proctoring</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee5d3] bg-white">
                {allCertificates.slice(0, 5).map(cert => (
                  <tr key={cert.id} className="hover:bg-[#f8f5ee] transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#0b192c] font-bold">
                      {cert.certificateNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0b192c]">
                      {cert.studentName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#0b192c] block">{cert.courseCode}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{cert.assessmentTitle}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#0d9488]">{cert.percentage}%</span>
                      <span className="text-[10px] text-slate-500 block">{cert.grade}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cert.proctoredIntegrity}%</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedModalCert(cert)}
                        className="px-3 py-1.5 rounded-lg bg-[#f8f5ee] hover:bg-[#eee5d3] text-[#0b192c] text-xs font-semibold transition cursor-pointer border border-[#eee5d3]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Courses & Assigned Mentees Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Courses */}
        <div className="bg-white border border-[#eee5d3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b192c]">My Authorized Courses</h2>
            <button
              onClick={() => setActiveTab('teacher-courses')}
              className="text-xs text-[#0284c7] hover:text-[#0369a1] font-semibold cursor-pointer"
            >
              Manage Courses →
            </button>
          </div>

          <div className="space-y-3">
            {courses.map(c => {
              const modules = dbService.getModulesByCourse(c.id);
              const assessments = dbService.getAssessments(c.id);

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#f8f5ee] border border-[#eee5d3] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#0284c7] bg-[#0284c7]/10 px-2 py-0.5 rounded uppercase tracking-wider border border-[#0284c7]/20">
                      {c.code}
                    </span>
                    <h3 className="font-bold text-[#0b192c] text-sm mt-1">{c.title}</h3>
                    <div className="flex items-center space-x-3 text-slate-500 text-[11px] pt-1">
                      <span>{modules.length} Modules</span>
                      <span>•</span>
                      <span>{assessments.length} Quizzes</span>
                      <span>•</span>
                      <span className="text-[#0d9488] font-semibold">{c.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('modules-lessons')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#eee5d3] hover:bg-[#f2ece0] text-[#0b192c] text-xs font-semibold cursor-pointer shrink-0 shadow-2xs transition"
                  >
                    Curriculum
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Mentees Quick Panel */}
        <div className="bg-white border border-[#eee5d3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b192c]">Mentoring Caseload ({mentees.length})</h2>
            <button
              onClick={() => setActiveTab('mentees')}
              className="text-xs text-[#0284c7] hover:text-[#0369a1] font-semibold cursor-pointer"
            >
              Full Roster →
            </button>
          </div>

          <div className="space-y-3">
            {mentees.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-[#f8f5ee] border border-[#eee5d3] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={m.student.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                      alt={m.student.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0d9488]/30"
                    />
                    <div>
                      <div className="font-bold text-[#0b192c] text-xs">{m.student.name}</div>
                      <div className="text-[11px] text-slate-500">{m.course.title}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Baseline: {m.studentScoreAtAllocation}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 italic pt-1">
                  Focus: {m.targetModule?.title || 'Loops & Functions'}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#eee5d3] text-[11px]">
                  <span className="text-slate-500 font-medium">{m.sessions.length} session(s) logged</span>
                  <button
                    onClick={() => setActiveTab('mentees')}
                    className="text-[#0284c7] hover:text-[#0369a1] font-semibold cursor-pointer"
                  >
                    Open Student Card →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedModalCert && (
        <CertificateModal
          certificate={selectedModalCert}
          onClose={() => setSelectedModalCert(null)}
        />
      )}
    </motion.div>
  );
};
