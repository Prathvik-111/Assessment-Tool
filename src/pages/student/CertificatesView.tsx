/**
 * SmartAssess AI: Student Certificates & Course Completion Diplomas
 * Navy, Teal, Sky Blue, Beige, and White Palette
 * Displays earned Course Completion Diplomas and module certificates with direct PDF export and verification.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Certificate } from '../../types/index.ts';
import { CertificateModal } from '../../components/CertificateModal.tsx';
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Building2,
  FileCheck2,
  GraduationCap,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface CertificatesViewProps {
  setActiveTab?: (tab: string) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null | 'not_found'>(null);

  if (!currentUser) return null;

  const certificates = dbService.getStudentCertificates(currentUser.id);
  const enrollments = dbService.getStudentEnrollments(currentUser.id);

  const filteredCerts = certificates.filter(
    c =>
      c.assessmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    const found = dbService.getCertificateById(verifyCode.trim());
    setVerificationResult(found || 'not_found');
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0d9488]/10 text-[#0d9488] text-xs font-bold mb-1 border border-[#0d9488]/20">
            <Award className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Academic Credentials & Official Diplomas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] tracking-tight">
            Academic Certificates & Course Diplomas
          </h1>
          <p className="text-xs sm:text-sm text-[#0b192c]/70 mt-1">
            Official verifiable credentials generated upon full course completion and proctored exam achievements.
          </p>
        </div>

        {setActiveTab && (
          <button
            onClick={() => setActiveTab('assessments')}
            className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition cursor-pointer self-start sm:self-auto flex items-center space-x-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Take Module Assessments</span>
          </button>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#0b192c]/60">Total Credentials Earned</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0d9488]">
            {certificates.length}
          </div>
          <p className="text-[11px] text-[#0b192c]/50">
            {certificates.filter(c => c.isCourseCompletion).length} Course Diplomas • {certificates.filter(c => !c.isCourseCompletion).length} Module Badges
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#0b192c]/60">Highest Honors Achieved</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0b192c]">
            {certificates.some(c => c.percentage >= 90) ? 'Distinction (A+)' : 'First Class (A)'}
          </div>
          <p className="text-[11px] text-[#0b192c]/50">Academic excellence benchmark</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#0b192c]/60">Avg. Proctored Integrity</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0284c7] flex items-center space-x-1.5">
            <ShieldCheck className="w-6 h-6 text-[#0284c7]" />
            <span>
              {certificates.length > 0
                ? Math.round(
                    certificates.reduce((acc, c) => acc + (c.proctoredIntegrity || 98), 0) /
                      certificates.length
                  )
                : 100}
              %
            </span>
          </div>
          <p className="text-[11px] text-[#0b192c]/50">Audio/video hardware validated</p>
        </div>
      </div>

      {/* Course Completion Progress Tracker Section */}
      <div className="bg-white rounded-3xl border border-[#eee5d3] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-[#0d9488]" />
            <h2 className="text-sm sm:text-base font-extrabold text-[#0b192c]">
              Course Completion Diploma Pathway
            </h2>
          </div>
          <span className="text-xs text-slate-400">Complete 100% of modules to unlock diploma</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(enr => {
            const course = enr.course;
            const progress = dbService.getCourseProgress(currentUser.id, course.id);
            const hasDiploma = certificates.some(c => c.courseId === course.id && c.isCourseCompletion);

            return (
              <div
                key={course.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                  hasDiploma
                    ? 'bg-[#f0fdfa] border-[#0d9488]/40'
                    : 'bg-[#f8f5ee] border-[#eee5d3]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#0284c7] bg-white px-2 py-0.5 rounded border border-[#0284c7]/20">
                      {course.code}
                    </span>
                    {hasDiploma ? (
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Graduated</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500">
                        {progress.completedModules} / {progress.totalModules} Modules
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#0b192c] text-sm leading-snug">{course.title}</h3>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full transition-all duration-500 ${hasDiploma ? 'bg-[#0d9488]' : 'bg-[#0284c7]'}`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">{progress.percentage}% Completed</span>
                  {hasDiploma ? (
                    <button
                      onClick={() => {
                        const dipl = certificates.find(c => c.courseId === course.id && c.isCourseCompletion);
                        if (dipl) setSelectedCert(dipl);
                      }}
                      className="text-[#0d9488] hover:text-[#0f766e] font-extrabold cursor-pointer flex items-center space-x-1"
                    >
                      <span>View Diploma</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : setActiveTab ? (
                    <button
                      onClick={() => setActiveTab('assessments')}
                      className="text-[#0284c7] hover:text-[#0369a1] font-semibold cursor-pointer flex items-center space-x-1"
                    >
                      <span>Clear Modules</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Certificate Verification Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Certificate List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#0b192c]/40" />
              <input
                type="text"
                placeholder="Search certificates by title, course, or credential ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-[#0b192c]/40 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
              />
            </div>
          </div>

          {filteredCerts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#eee5d3] space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm">No Certificates Found</h3>
              <p className="text-xs text-[#0b192c]/60 max-w-sm mx-auto">
                Complete all course modules with passing scores to earn and unlock your official Diploma.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCerts.map(cert => (
                <div
                  key={cert.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    cert.isCourseCompletion
                      ? 'border-[#0d9488] bg-gradient-to-r from-white via-[#f0fdfa]/40 to-white'
                      : 'border-[#eee5d3] hover:border-[#0d9488]/40'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm ${
                      cert.isCourseCompletion
                        ? 'bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white'
                        : 'bg-gradient-to-br from-[#0b192c] to-[#1e3e62] text-white'
                    }`}>
                      <Award className="w-6 h-6 text-amber-300" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8f5ee] text-[#0b192c] font-bold border border-[#eee5d3]">
                          {cert.certificateNumber}
                        </span>
                        {cert.isCourseCompletion ? (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0d9488] text-white shadow-2xs">
                            Course Diploma
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase text-[#0b192c]/50">
                            {cert.courseCode}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#0b192c]">
                        {cert.assessmentTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#0b192c]/60 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-[#0b192c]/40" />
                          <span>{cert.institutionName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0b192c]/40" />
                          <span>{new Date(cert.issueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="font-bold text-[#0d9488]">
                          Score: {cert.percentage}% ({cert.grade})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="px-4 py-2.5 rounded-xl bg-[#0b192c] hover:bg-[#1e3e62] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>View & Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Verification Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#eee5d3] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#0b192c]">
            <div className="w-8 h-8 rounded-xl bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-[#0d9488]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Verify Credential</h3>
              <p className="text-[11px] text-[#0b192c]/60">Public authenticity validator</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#0b192c]/80 mb-1">
                Certificate Number
              </label>
              <input
                type="text"
                placeholder="e.g. SMART-2026-CS101-8941"
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)}
                className="w-full p-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs font-mono text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0b192c] hover:bg-[#1e3e62] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Verify Legitimacy</span>
            </button>
          </form>

          {verificationResult === 'not_found' && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <strong>Certificate Not Found:</strong> The provided credential ID could not be validated against the registrar database.
            </div>
          )}

          {verificationResult && verificationResult !== 'not_found' && (
            <div className="p-4 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] space-y-2 text-xs">
              <div className="flex items-center space-x-1 text-[#0d9488] font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Authentic</span>
              </div>
              <div className="font-bold text-[#0b192c]">{verificationResult.studentName}</div>
              <div className="text-[11px] text-slate-600">{verificationResult.courseTitle}</div>
              <div className="text-[11px] text-[#0d9488] font-semibold">
                Score: {verificationResult.percentage}% ({verificationResult.grade})
              </div>
              <button
                onClick={() => setSelectedCert(verificationResult)}
                className="text-xs text-[#0284c7] font-bold hover:underline pt-1 block cursor-pointer"
              >
                Open Full Credential →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
