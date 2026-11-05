/**
 * SmartAssess AI: Dedicated Login Page
 * Color Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), and White (#FFFFFF)
 * Standalone sign-in screen separate from the main landing page.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onGoToSignup: () => void;
  onGoToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onGoToSignup,
  onGoToLanding,
}) => {
  const { login, switchDemoUser, requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('aarav.sharma@student.edu');
  const [password, setPassword] = useState('student123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const ok = await login(email);
      if (!ok) {
        setErrorMessage('Invalid institutional credentials or inactive account. Try one of the 1-click demo personas below.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await requestPasswordReset(forgotEmail);
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
    }, 2500);
  };

  const demoAccounts = [
    {
      id: 'usr-stud-01',
      name: 'Aarav Sharma',
      role: 'STUDENT',
      email: 'aarav.sharma@student.edu',
      desc: 'Student (35% in Loops, Needs Mentor)',
      badge: 'bg-[#f0fdfa] text-[#0f766e] border-[#ccfbf1]',
    },
    {
      id: 'usr-stud-02',
      name: 'Sophia Martinez',
      role: 'STUDENT',
      email: 'sophia.martinez@student.edu',
      desc: 'Top Student (91% Avg, 2 Certificates)',
      badge: 'bg-[#f0fdfa] text-[#0f766e] border-[#ccfbf1]',
    },
    {
      id: 'usr-teach-01',
      name: 'Dr. Sarah Jenkins',
      role: 'TEACHER',
      email: 'sarah.jenkins@nite.edu',
      desc: 'CS Faculty (Loops Specialist)',
      badge: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    },
    {
      id: 'usr-admin-01',
      name: 'Dr. Elena Rostova',
      role: 'ADMIN',
      email: 'admin@smartassess.ai',
      desc: 'Institutional Dean & Operations Admin',
      badge: 'bg-[#faf8f5] text-[#0b192c] border-[#eee5d3]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#0b192c] flex flex-col font-sans selection:bg-[#0d9488] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-[#eee5d3] bg-white sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onGoToLanding}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0b192c] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-xl bg-[#0b192c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <GraduationCap className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <span className="font-extrabold text-sm text-[#0b192c]">
              SmartAssess <span className="text-[#0d9488]">AI</span>
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Need an account?{' '}
            <button
              onClick={onGoToSignup}
              className="font-bold text-[#0d9488] hover:text-[#0f766e] cursor-pointer ml-1"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0b192c] text-[#38bdf8] shadow-md shadow-[#0b192c]/20">
              <Lock className="w-7 h-7 text-[#14b8a6]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-500">
              Access your proctored assessments, certificates, and mentoring hub.
            </p>
          </div>

          {/* Login Form Box */}
          <div className="bg-white rounded-3xl border border-[#eee5d3] p-6 sm:p-8 shadow-md space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0b192c]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-[#0d9488] hover:text-[#0f766e] font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
              Don't have an account?{' '}
              <button
                onClick={onGoToSignup}
                className="font-bold text-[#0d9488] hover:text-[#0f766e] cursor-pointer"
              >
                Create an Account
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Personas */}
          <div className="bg-white rounded-3xl border border-[#eee5d3] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0b192c] uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Demo Personas</span>
              </span>
              <span className="text-[10px] text-slate-400">Instant Access</span>
            </div>

            <div className="space-y-2">
              {demoAccounts.map(demo => (
                <button
                  key={demo.id}
                  onClick={() => switchDemoUser(demo.id)}
                  className="w-full p-2.5 rounded-2xl bg-[#f8f5ee] hover:bg-[#f2ece0] border border-[#eee5d3] transition flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-[#0b192c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {demo.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0b192c] group-hover:text-[#0d9488] transition truncate">
                        {demo.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate leading-tight">
                        {demo.desc}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0 ${demo.badge}`}>
                    {demo.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-[#eee5d3] shadow-xl">
            <h3 className="font-bold text-[#0b192c] text-sm">Reset Institutional Password</h3>
            <p className="text-xs text-slate-500">
              Enter your email and a password reset link will be sent to your institutional address.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset token dispatched successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#0d9488] text-white text-xs font-bold shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
