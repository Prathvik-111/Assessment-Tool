/**
 * SmartAssess AI: Informational Main Landing Page
 * Theme: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), and White (#FFFFFF)
 * Clear separation: Header buttons direct users to separate Login & Create Account pages.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  GraduationCap,
  Sparkles,
  Camera,
  HeartHandshake,
  BrainCircuit,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building2,
  Users,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToSignup,
}) => {
  const { switchDemoUser } = useAuth();

  const demoAccounts = [
    {
      id: 'usr-stud-01',
      name: 'Aarav Sharma',
      role: 'STUDENT',
      desc: 'Student (35% in Loops, Needs Mentor)',
      badge: 'bg-[#f0fdfa] text-[#0f766e] border-[#ccfbf1]',
    },
    {
      id: 'usr-stud-02',
      name: 'Sophia Martinez',
      role: 'STUDENT',
      desc: 'High Achiever (91% Avg, 2 Certificates)',
      badge: 'bg-[#f0fdfa] text-[#0f766e] border-[#ccfbf1]',
    },
    {
      id: 'usr-teach-01',
      name: 'Dr. Sarah Jenkins',
      role: 'TEACHER',
      desc: 'CS Faculty (Loops & Functions Specialist)',
      badge: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    },
    {
      id: 'usr-admin-01',
      name: 'Dr. Elena Rostova',
      role: 'ADMIN',
      desc: 'Institutional Dean & Operations Admin',
      badge: 'bg-[#faf8f5] text-[#0b192c] border-[#eee5d3]',
    },
  ];

  const institutionsList = [
    'National Institute of Technology & Engineering',
    'Stanford University',
    'Massachusetts Institute of Technology (MIT)',
    'Harvard University',
    'UC Berkeley',
    'Indian Institute of Technology (IIT Madras)',
    'University of Cambridge',
  ];

  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#0b192c] flex flex-col font-sans selection:bg-[#0d9488] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#eee5d3] bg-white sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-2xl bg-[#0b192c] text-white flex items-center justify-center shadow-md shadow-[#0b192c]/20">
              <GraduationCap className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#0b192c] tracking-tight">
                SmartAssess <span className="text-[#0d9488]">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1]">
                Institutional Portal
              </span>
            </div>
          </div>

          {/* Quick Header Nav & Direct Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#0b192c] hover:bg-[#f2ece0] rounded-xl transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGoToSignup}
              className="px-4.5 py-2.5 text-xs font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl shadow-md shadow-[#0d9488]/20 transition cursor-pointer flex items-center space-x-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-20 border-b border-[#eee5d3] bg-gradient-to-b from-white via-[#f8f5ee] to-[#f2ece0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d9488] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#0d9488]" />
                <span>Next-Gen Academic Assessment & Faculty Mentorship</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b192c] tracking-tight leading-tight">
                Intelligent Assessment & <span className="text-[#0d9488]">Automated Mentor</span> Allocation
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                SmartAssess AI evaluates student mastery through fullscreen camera & voice proctored quizzes, predicts academic risk with machine learning models, issues certified credentials upon completion, and automatically allocates specialized faculty mentors before students fall behind.
              </p>

              {/* Main CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGoToSignup}
                  className="px-6 py-3.5 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0d9488]/25 transition cursor-pointer flex items-center space-x-2 group"
                >
                  <span>Create Student / Teacher Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={onGoToLogin}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f8f5ee] border border-[#eee5d3] text-[#0b192c] text-xs sm:text-sm font-bold transition cursor-pointer flex items-center space-x-2 shadow-xs"
                >
                  <Lock className="w-4 h-4 text-[#0d9488]" />
                  <span>Sign In to Your Account</span>
                </button>
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg text-xs">
                <div className="p-3 rounded-2xl bg-white border border-[#eee5d3] shadow-2xs">
                  <span className="font-extrabold text-[#0b192c] text-lg sm:text-xl block">100%</span>
                  <span className="text-slate-500 text-[11px]">Proctored Integrity</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#eee5d3] shadow-2xs">
                  <span className="font-extrabold text-[#0d9488] text-lg sm:text-xl block">96.5%</span>
                  <span className="text-slate-500 text-[11px]">Mentor Suitability</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#eee5d3] shadow-2xs">
                  <span className="font-extrabold text-[#0284c7] text-lg sm:text-xl block">Instant</span>
                  <span className="text-slate-500 text-[11px]">Certificates Issued</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content: 1-Click Persona Quick Access (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-5 bg-white rounded-3xl border border-[#eee5d3] p-6 sm:p-7 shadow-lg shadow-[#0b192c]/5 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#eee5d3] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0b192c] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Instant Evaluation Personas</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Explore each user role with one click</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1]">
                  Demo Roles
                </span>
              </div>

              <div className="space-y-2.5">
                {demoAccounts.map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => switchDemoUser(demo.id)}
                    className="w-full p-3.5 rounded-2xl bg-[#f8f5ee] hover:bg-[#f2ece0] border border-[#eee5d3] transition flex items-center justify-between text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {demo.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0b192c] group-hover:text-[#0d9488] transition truncate">
                          {demo.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate leading-snug">
                          {demo.desc}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0 ml-2 ${demo.badge}`}>
                      {demo.role}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                Or navigate to the dedicated{' '}
                <button
                  onClick={onGoToLogin}
                  className="font-bold text-[#0d9488] hover:underline cursor-pointer"
                >
                  Sign In Page
                </button>{' '}
                or{' '}
                <button
                  onClick={onGoToSignup}
                  className="font-bold text-[#0d9488] hover:underline cursor-pointer"
                >
                  Create Account Page
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0d9488] bg-[#f0fdfa] px-3 py-1 rounded-full border border-[#ccfbf1]">
              Complete Educational Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] tracking-tight">
              Built for Modern Colleges & Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              An end-to-end framework combining rigorous AI-proctored testing with algorithmic academic remediation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. AI Proctoring */}
            <div className="p-6 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-3 hover:border-[#38bdf8] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#0b192c] text-[#38bdf8] flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm sm:text-base">Fullscreen AI Proctoring</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enforced fullscreen lockdown, live webcam face landmark tracking, and real-time audio decibel disturbance monitoring.
              </p>
            </div>

            {/* 2. Predictive ML */}
            <div className="p-6 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-3 hover:border-[#0d9488] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] text-[#0d9488] flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm sm:text-base">Predictive Risk Models</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scikit-learn Random Forest regression isolates specific weak concepts and categorizes failure risks ahead of final exams.
              </p>
            </div>

            {/* 3. Automatic Mentor Matching */}
            <div className="p-6 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-3 hover:border-[#0284c7] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm sm:text-base">Atomic Mentor Allocation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Matches at-risk students with top-fit faculty members based on weak-topic mastery, faculty capacity, and instructor status.
              </p>
            </div>

            {/* 4. Academic Certificates */}
            <div className="p-6 rounded-3xl bg-white border border-[#eee5d3] shadow-xs space-y-3 hover:border-[#0d9488] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#fdfbf7] text-[#0d9488] border border-[#eee5d3] flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm sm:text-base">Verified Certificates</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant generation of tamper-proof, printable Academic Certificates of Achievement with cryptographic verification codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Remediation Workflow */}
      <section className="py-16 bg-[#f8f5ee] border-t border-[#eee5d3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0d9488]">The Student Journey</span>
            <h2 className="text-2xl font-extrabold text-[#0b192c]">How Academic Remediation Operates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#eee5d3] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-[#0b192c] text-white font-extrabold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm">Proctored Assessment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The student undertakes randomized AI-generated module quizzes with full audio/video proctoring and receives immediate grading.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee5d3] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-[#0d9488] text-white font-extrabold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm">AI Risk Detection & Certificates</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                High scores grant verified Certificates of Achievement. Scores below 40% immediately flag the student as High Risk and isolate weak concepts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee5d3] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-[#0284c7] text-white font-extrabold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-[#0b192c] text-sm">Automatic Faculty Intervention</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The allocation engine pairs the student with a subject specialist faculty member for 1-on-1 counseling, remedial assignments, and progress monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognized Institutions Grid */}
      <section className="py-14 bg-white border-t border-[#eee5d3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Trusted by Departments & Institutions Worldwide
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {institutionsList.map((inst, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-full bg-[#f8f5ee] border border-[#eee5d3] text-slate-700 text-xs font-medium"
              >
                {inst}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eee5d3] bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#0b192c] text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-[#0b192c]">SmartAssess AI</span>
            <span>• Academic Intelligence & Mentorship Platform</span>
          </div>
          <div>All data stored securely with institutional compliance standards.</div>
        </div>
      </footer>
    </div>
  );
};
