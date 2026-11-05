/**
 * SmartAssess AI: Edit Profile Modal for Every User Role
 * Navy, Teal, Sky Blue, Beige, and White Palette
 * Allows updating name, email, phone, institution, department, bio, avatar, and role-specific parameters.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { User } from '../types/index.ts';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  BookOpen,
  X,
  Check,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface EditProfileModalProps {
  onClose: () => void;
  onSaved?: (updatedUser: User) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
];

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
  'Other / Custom Institution...',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  onSaved,
}) => {
  const { currentUser, updateUserProfile, institution } = useAuth();

  if (!currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || PRESET_AVATARS[0]);

  // Institution logic
  const currentInstName = currentUser.institutionName || institution?.name || PRESET_INSTITUTIONS[0];
  const isCustomInstInitial = !PRESET_INSTITUTIONS.includes(currentInstName);
  const [selectedInstitution, setSelectedInstitution] = useState(
    isCustomInstInitial ? 'Other / Custom Institution...' : currentInstName
  );
  const [customInstitution, setCustomInstitution] = useState(
    isCustomInstInitial ? currentInstName : ''
  );

  // Student specific
  const [studentIdNumber, setStudentIdNumber] = useState(currentUser.studentIdNumber || 'STU-2026-904');
  const [graduationYear, setGraduationYear] = useState(currentUser.graduationYear || '2027');

  // Teacher specific
  const [maxMentees, setMaxMentees] = useState(currentUser.maxMentees || 4);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    const institutionFinal = selectedInstitution === 'Other / Custom Institution...'
      ? customInstitution.trim() || 'Custom University'
      : selectedInstitution;

    setIsSubmitting(true);

    try {
      const updated = await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department: department.trim(),
        institutionName: institutionFinal,
        bio: bio.trim(),
        avatarUrl,
        studentIdNumber: currentUser.role === 'STUDENT' ? studentIdNumber.trim() : undefined,
        graduationYear: currentUser.role === 'STUDENT' ? graduationYear.trim() : undefined,
        maxMentees: currentUser.role === 'TEACHER' ? Number(maxMentees) : currentUser.maxMentees,
      });

      setSuccessMessage(true);
      if (onSaved) onSaved(updated);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07111e]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#eee5d3] overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eee5d3] flex items-center justify-between bg-[#f8f5ee]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-white flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0b192c]">
                Edit Profile Information
              </h2>
              <p className="text-[11px] text-[#0b192c]/60">
                Role: <strong className="font-bold text-[#0d9488]">{currentUser.role}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#0b192c]/40 hover:text-[#0b192c] hover:bg-[#eee5d3]/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0b192c] mb-2">
              Profile Picture / Avatar
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl}
                alt="Selected Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-3 ring-[#0d9488]/30 shadow-xs shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                        avatarUrl === url ? 'border-[#0d9488] ring-2 ring-[#0d9488]/30' : 'border-[#eee5d3] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or paste custom image URL..."
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
                />
              </div>
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-[#0b192c]/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#0b192c]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>
            </div>
          </div>

          {/* Institution Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#0b192c] mb-1">
              Academic Institution
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-[#0b192c]/40" />
              <select
                value={selectedInstitution}
                onChange={e => setSelectedInstitution(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
              >
                {PRESET_INSTITUTIONS.map(inst => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            {selectedInstitution === 'Other / Custom Institution...' && (
              <div className="mt-2">
                <input
                  type="text"
                  required
                  placeholder="Enter your institution name..."
                  value={customInstitution}
                  onChange={e => setCustomInstitution(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f5ee] border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>
            )}
          </div>

          {/* Department & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                Department / Academic Area
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3.5 top-3 text-[#0b192c]/40" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-[#0b192c]/40" />
                <input
                  type="tel"
                  placeholder="+1 (555) 0192"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>
            </div>
          </div>

          {/* Student Specific Fields */}
          {currentUser.role === 'STUDENT' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3]">
              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                  Student Registration ID
                </label>
                <input
                  type="text"
                  value={studentIdNumber}
                  onChange={e => setStudentIdNumber(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b192c] mb-1">
                  Expected Graduation Year
                </label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={e => setGraduationYear(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#eee5d3] rounded-xl text-xs text-[#0b192c]"
                />
              </div>
            </div>
          )}

          {/* Teacher Specific Fields */}
          {currentUser.role === 'TEACHER' && (
            <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3] space-y-2">
              <label className="block text-xs font-semibold text-[#0b192c]">
                Max Mentee Capacity (Workload Limit)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={maxMentees}
                  onChange={e => setMaxMentees(Number(e.target.value))}
                  className="flex-1 accent-[#0d9488]"
                />
                <span className="w-12 text-center text-xs font-bold text-[#0d9488] bg-white border border-[#eee5d3] py-1 rounded-lg">
                  {maxMentees} Slots
                </span>
              </div>
              <p className="text-[11px] text-[#0b192c]/60">
                Determines how many students the automated allocation engine can assign to you.
              </p>
            </div>
          )}

          {/* Bio Field */}
          <div>
            <label className="block text-xs font-semibold text-[#0b192c] mb-1">
              Academic Bio / Professional Summary
            </label>
            <textarea
              rows={3}
              placeholder="Share your academic background, research interests, or learning goals..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-3 bg-white border border-[#eee5d3] rounded-2xl text-xs text-[#0b192c] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[#eee5d3] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#eee5d3] text-[#0b192c]/70 hover:bg-[#f8f5ee] text-xs font-semibold cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition cursor-pointer flex items-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
