/**
 * SmartAssess AI: Dedicated Faculty Certificate & Credential Verification Suite
 * Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), White (#FFFFFF)
 * Features:
 * - Real-time cryptographic validation of certificate credential numbers & verification codes
 * - Comprehensive student performance and multi-modal proctoring integrity report
 * - 1-Click view, print, and standard PDF download
 * - Registrar audit trail of all issued institutional diplomas
 */

import React, { useState } from 'react';
import { dbService } from '../../services/db.ts';
import { Certificate } from '../../types/index.ts';
import { CertificateModal } from '../../components/CertificateModal.tsx';
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  Download,
  Building2,
  Calendar,
  Check,
  GraduationCap,
  Sparkles,
  FileCheck2,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CertificateVerificationView: React.FC<{ setActiveTab?: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const [certQuery, setCertQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null | 'NOT_FOUND'>(null);
  const [selectedModalCert, setSelectedModalCert] = useState<Certificate | null>(null);
  const [tableFilter, setTableFilter] = useState('');

  const allCertificates = dbService.getAllCertificates();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;
    const found = dbService.getCertificateById(certQuery.trim());
    setVerificationResult(found || 'NOT_FOUND');
  };

  const handleQuickVerify = (cert: Certificate) => {
    setCertQuery(cert.certificateNumber);
    setVerificationResult(cert);
  };

  const filteredList = allCertificates.filter(c =>
    c.certificateNumber.toLowerCase().includes(tableFilter.toLowerCase()) ||
    c.studentName.toLowerCase().includes(tableFilter.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(tableFilter.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(tableFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b192c] via-[#132a47] to-[#0b192c] p-6 sm:p-8 text-white shadow-xl border border-[#1e3e62]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#38bdf8] text-xs font-semibold border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>Official Institutional Registrar Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Verify Certificate Credentials
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Authenticate student diplomas, verify AI-proctored examination integrity, and audit tamper-proof academic credentials.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Valid Records</span>
              <span className="text-xl font-black text-amber-300">{allCertificates.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Full Diplomas</span>
              <span className="text-xl font-black text-[#38bdf8]">
                {allCertificates.filter(c => c.isCourseCompletion).length}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0d9488]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Main Verification Card */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#0b192c]">Credential Authenticity Search</h2>
          <p className="text-xs text-slate-500">
            Enter a Certificate Number (e.g. SMART-2026-CS101-8941) or Verification Hash code:
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={certQuery}
                onChange={e => setCertQuery(e.target.value)}
                placeholder="e.g. SMART-2026-CS101-8941 or VRF-9821-4820-SM..."
                className="w-full pl-10 pr-4 py-3 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs font-mono text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#0b192c] hover:bg-[#132a47] text-white text-xs font-extrabold shadow-md shadow-[#0b192c]/20 transition cursor-pointer flex items-center justify-center space-x-2 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
              <span>Verify Credential Now</span>
            </button>
          </div>

          {/* Quick-test Chips */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 overflow-x-auto pt-1">
            <span className="font-semibold shrink-0">Sample Records:</span>
            {allCertificates.slice(0, 4).map(cert => (
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

        {/* Not Found Alert */}
        {verificationResult === 'NOT_FOUND' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold block">No Credential Found for "{certQuery}"</span>
                <span className="text-[11px] text-rose-700">The identifier is either invalid or has not been accredited by this institution.</span>
              </div>
            </div>
            <button
              onClick={() => setVerificationResult(null)}
              className="p-1 rounded text-rose-600 hover:text-rose-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Authenticated Credential Card */}
        {verificationResult && verificationResult !== 'NOT_FOUND' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-[#f0fdfa] border-2 border-[#0d9488]/40 space-y-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0d9488]/20">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#0d9488] text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase text-[#0d9488] tracking-wider">
                      OFFICIALLY VERIFIED & AUTHENTIC
                    </span>
                    {verificationResult.isCourseCompletion ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950">
                        Full Course Completion Diploma
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        Module Assessment Certificate
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0b192c] mt-0.5">
                    {verificationResult.studentName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedModalCert(verificationResult)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b192c] hover:bg-[#132a47] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-[#0b192c]/20"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Inspect & Print Official Diploma</span>
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

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Course Program</span>
                <span className="font-bold text-[#0b192c] block truncate text-sm">{verificationResult.courseTitle}</span>
                <span className="text-[11px] text-[#0284c7] font-mono font-semibold">{verificationResult.courseCode}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Grade & Mastery</span>
                <span className="font-extrabold text-[#0d9488] block text-sm">{verificationResult.grade}</span>
                <span className="text-[11px] text-slate-500 font-medium">Evaluation: {verificationResult.percentage}%</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Proctoring Telemetry</span>
                <span className="font-bold text-emerald-700 flex items-center space-x-1 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{verificationResult.proctoredIntegrity}% Verified</span>
                </span>
                <span className="text-[10px] text-slate-400">Camera + Microphone Locked</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#0d9488]/20">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Audit Metadata</span>
                <span className="font-mono font-bold text-[#0b192c] text-[11px] block truncate">
                  {verificationResult.certificateNumber}
                </span>
                <span className="text-[10px] text-slate-400">
                  Issued: {new Date(verificationResult.issueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Institutional Credentials Registry Table */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#0b192c]">
              All Institutional Credentials ({allCertificates.length})
            </h3>
            <p className="text-xs text-slate-500">
              Complete registry of awarded diplomas and certificates across all student cohorts.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by student or ID..."
              value={tableFilter}
              onChange={e => setTableFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#eee5d3]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f5ee] border-b border-[#eee5d3] text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Credential ID</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Course / Award</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Score & Grade</th>
                <th className="py-3.5 px-4">Proctoring</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee5d3] bg-white">
              {filteredList.map(cert => (
                <tr key={cert.id} className="hover:bg-[#f8f5ee] transition">
                  <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-[#0b192c]">
                    {cert.certificateNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0b192c]">
                    {cert.studentName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b192c] block">{cert.courseCode}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{cert.assessmentTitle}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {cert.isCourseCompletion ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0d9488]/15 text-[#0d9488] border border-[#0d9488]/30">
                        Course Diploma
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        Module Quiz
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0d9488]">{cert.percentage}%</span>
                    <span className="text-[10px] text-slate-500 block">{cert.grade}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{cert.proctoredIntegrity}%</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedModalCert(cert)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0b192c] hover:bg-[#132a47] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      Inspect & Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedModalCert && (
        <CertificateModal
          certificate={selectedModalCert}
          onClose={() => setSelectedModalCert(null)}
        />
      )}
    </div>
  );
};
