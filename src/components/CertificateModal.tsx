/**
 * SmartAssess AI: Academic Certificate & Course Completion Diploma Modal
 * Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Gold Accents (#D97706), White (#FFFFFF)
 * Features:
 * - 100% Guaranteed Standard PDF Download using jsPDF vector engine (never plain text)
 * - Standard A4 Landscape Print formatting
 * - Credential verification ID & proctored integrity badge
 * - Course Completion Diploma distinction with module mastery count
 */

import React, { useState } from 'react';
import { Certificate } from '../types/index.ts';
import { generateStandardDiplomaPdf } from '../services/pdfGenerator.ts';
import {
  Award,
  Download,
  Printer,
  Share2,
  Check,
  X,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/verify/${certificate.certificateNumber}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadStandardPdf = () => {
    try {
      generateStandardDiplomaPdf(certificate);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07111e]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#eee5d3] overflow-hidden flex flex-col my-auto"
      >
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print bg-[#f8f5ee] border-b border-[#eee5d3] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0b192c] text-white flex items-center justify-center font-bold">
              <Award className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm text-[#0b192c]">
                  {certificate.isCourseCompletion ? 'Course Completion Diploma' : 'Academic Certificate'}
                </h3>
                {certificate.isCourseCompletion && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0d9488]/15 text-[#0d9488] border border-[#0d9488]/30">
                    Graduated
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {certificate.certificateNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Standard PDF Download Button */}
            <button
              onClick={handleDownloadStandardPdf}
              className="px-4 py-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-[#0d9488]/20"
              title="Download Standard PDF Diploma"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download PDF (Standard)</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f2ece0] border border-[#eee5d3] text-xs font-semibold text-[#0b192c] transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Share / Copy Credential */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f2ece0] border border-[#eee5d3] text-xs font-semibold text-[#0b192c] transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0d9488]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-4 sm:p-8 overflow-x-auto bg-[#f8f5ee] flex items-center justify-center">
          <div
            id="printable-certificate"
            className="w-full max-w-3xl bg-white text-[#0b192c] border-12 border-double border-[#0b192c] p-6 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden select-text"
          >
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-[#0b192c] font-serif text-xl select-none">❖</div>
            <div className="absolute top-2 right-2 text-[#0b192c] font-serif text-xl select-none">❖</div>
            <div className="absolute bottom-2 left-2 text-[#0b192c] font-serif text-xl select-none">❖</div>
            <div className="absolute bottom-2 right-2 text-[#0b192c] font-serif text-xl select-none">❖</div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 pb-6 border-b border-[#eee5d3]">
              <div className="flex items-center justify-center space-x-2 text-[#0d9488]">
                <GraduationCap className="w-7 h-7 text-[#0d9488]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0b192c]">
                  {certificate.institutionName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-[#0b192c] uppercase pt-1">
                {certificate.isCourseCompletion ? 'Course Completion Diploma' : 'Certificate of Achievement'}
              </h1>
              <p className="text-xs sm:text-sm font-serif italic text-slate-600">
                This academic credential formally certifies that
              </p>
            </div>

            {/* Recipient Name */}
            <div className="text-center py-6 sm:py-8 space-y-2">
              <div className="text-2xl sm:text-4xl font-serif font-black text-[#0b192c] border-b-2 border-[#0d9488] inline-block px-6 pb-2">
                {certificate.studentName}
              </div>
              <p className="text-xs sm:text-sm font-serif text-slate-600 max-w-xl mx-auto pt-2">
                {certificate.isCourseCompletion
                  ? `has successfully fulfilled all rigorous curriculum requirements, laboratory assignments, and proctored examinations to graduate from`
                  : `has successfully completed the proctored examination and demonstrated academic mastery in`}
              </p>
              <div className="text-lg sm:text-xl font-bold text-[#0d9488] pt-1">
                {certificate.assessmentTitle}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {certificate.courseTitle} ({certificate.courseCode})
              </div>
            </div>

            {/* Performance Metrics Pill Row */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-4 text-center">
              <div className="bg-[#f0fdfa] p-2.5 rounded-xl border border-[#ccfbf1]">
                <span className="text-[10px] uppercase font-bold text-[#0d9488] block">
                  {certificate.isCourseCompletion ? 'Cumulative Score' : 'Exam Score'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#0b192c]">
                  {certificate.percentage}%
                </span>
              </div>
              <div className="bg-[#f0fdfa] p-2.5 rounded-xl border border-[#ccfbf1]">
                <span className="text-[10px] uppercase font-bold text-[#0d9488] block">Honors Grade</span>
                <span className="text-xs sm:text-sm font-bold text-[#0b192c]">
                  {certificate.grade}
                </span>
              </div>
              <div className="bg-[#f0fdfa] p-2.5 rounded-xl border border-[#ccfbf1]">
                <span className="text-[10px] uppercase font-bold text-[#0d9488] block">Proctoring Seal</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>{certificate.proctoredIntegrity}% Verified</span>
                </span>
              </div>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="pt-8 mt-6 border-t border-[#eee5d3] grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-center">
              {/* Left Signature */}
              <div className="space-y-1">
                <div className="font-serif italic text-lg text-slate-800 border-b border-slate-300 pb-1">
                  {certificate.instructorName || 'Dr. Sarah Jenkins'}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Course Faculty Lead
                </div>
              </div>

              {/* Center Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0b192c] to-[#132a47] text-amber-300 flex flex-col items-center justify-center shadow-lg border-2 border-amber-300 select-none">
                  <Award className="w-7 h-7 text-amber-300" />
                  <span className="text-[7px] font-black uppercase tracking-wider text-[#38bdf8]">
                    {certificate.isCourseCompletion ? 'DIPLOMA' : 'VERIFIED'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  ID: {certificate.verificationCode}
                </span>
              </div>

              {/* Right Signature */}
              <div className="space-y-1">
                <div className="font-serif italic text-lg text-slate-800 border-b border-slate-300 pb-1">
                  Dr. Elena Rostova
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Academic Registrar & Dean
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="mt-8 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Issued: {new Date(certificate.issueDate).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>Credential Identifier: {certificate.certificateNumber}</span>
            </div>
          </div>
        </div>

        {/* Print-specific CSS */}
        <style>{`
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          @media print {
            html, body {
              background: #ffffff !important;
            }
            body * {
              visibility: hidden;
            }
            #printable-certificate, #printable-certificate * {
              visibility: visible;
            }
            #printable-certificate {
              position: fixed;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              margin: 0 !important;
              padding: 15mm !important;
              border: 6px double #0b192c !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
};
