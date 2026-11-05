/**
 * SmartAssess AI: Dedicated Create Account / Registration Page
 * Color Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), and White (#FFFFFF)
 * Standalone registration screen with multi-institution selection & custom institution entry.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import {
  GraduationCap,
  User as UserIcon,
  Mail,
  Lock,
  Building2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CreateAccountPageProps {
  onGoToLogin: () => void;
  onGoToLanding: () => void;
}

const PRESET_INSTITUTIONS = [
  'National Institute of Technology & Engineering',
  'Massachusetts Institute of Technology (MIT)',
  'Stanford University',
  'Harvard University',
  'University of California, Berkeley',
  'University of Oxford',
  'University of Cambridge',
  'Indian Institute of Technology (IIT Madras)',
  'National University of Singapore (NUS)',
  'Princeton University',
  'Columbia University',
  'ETH Zurich',
  'Other / Custom Institution...',
];

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({
  onGoToLogin,
  onGoToLanding,
}) => {
  const { registerUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('Computer Science');
  const [selectedInstitution, setSelectedInstitution] = useState('National Institute of Technology & Engineering');
  const [customInstitution, setCustomInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please fill in your name and institutional email.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const institutionFinal = selectedInstitution === 'Other / Custom Institution...'
      ? customInstitution.trim() || 'Custom University'
      : selectedInstitution;

    setIsSubmitting(true);

    try {
      await registerUser(
        name.trim(),
        email.trim(),
        role,
        department.trim(),
        institutionFinal,
        phone.trim(),
        bio.trim()
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

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
            Already have an account?{' '}
            <button
              onClick={onGoToLogin}
              className="font-bold text-[#0d9488] hover:text-[#0f766e] cursor-pointer ml-1"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0b192c] text-[#38bdf8] shadow-md shadow-[#0b192c]/20">
              <GraduationCap className="w-7 h-7 text-[#14b8a6]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] tracking-tight">
              Create Your Academic Account
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Join SmartAssess AI to take proctored assessments, earn verified certificates, and receive automated faculty mentorship.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-[#eee5d3] p-6 sm:p-8 shadow-md space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#0b192c] mb-1.5">
                  Select Your Academic Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STUDENT', 'TEACHER', 'ADMIN'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center space-y-1 ${
                        role === r
                          ? 'border-[#0d9488] bg-[#f0fdfa] text-[#0f766e] ring-2 ring-[#0d9488]/20'
                          : 'border-[#eee5d3] bg-[#f8f5ee] text-slate-600 hover:bg-[#f2ece0]'
                      }`}
                    >
                      <span className="capitalize">{r === 'STUDENT' ? 'Student' : r === 'TEACHER' ? 'Faculty Teacher' : 'Admin'}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {r === 'STUDENT' ? 'Take Exams' : r === 'TEACHER' ? 'Teach & Mentor' : 'Institute Governance'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                  />
                </div>
              </div>

              {/* Institutional Email */}
              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya.chen@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                  />
                </div>
              </div>

              {/* Institution Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                  Academic Institution / University
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <select
                    value={selectedInstitution}
                    onChange={e => setSelectedInstitution(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition appearance-none cursor-pointer"
                  >
                    {PRESET_INSTITUTIONS.map(inst => (
                      <option key={inst} value={inst}>
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* If custom institution selected */}
                {selectedInstitution === 'Other / Custom Institution...' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Type your University or College name..."
                      value={customInstitution}
                      onChange={e => setCustomInstitution(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#0d9488] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 transition"
                    />
                  </div>
                )}
              </div>

              {/* Department & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                    Department / Major
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                    Contact Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 0192"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Bio */}
              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                  Academic Focus / Bio (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Undergraduate researcher focusing on algorithms and system architecture."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-3 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration & Access Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
              Already have an account?{' '}
              <button
                onClick={onGoToLogin}
                className="font-bold text-[#0d9488] hover:text-[#0f766e] cursor-pointer"
              >
                Sign In Instead
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
