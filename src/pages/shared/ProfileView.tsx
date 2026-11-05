/**
 * SmartAssess AI: User Profile & Security Settings
 * Navy, Teal, Sky Blue, Beige, and White Palette
 * View active role details, institutional credentials, bio, and launch the Edit Profile modal.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { EditProfileModal } from '../../components/EditProfileModal.tsx';
import {
  Mail,
  Building2,
  KeyRound,
  CheckCircle,
  Phone,
  Edit3,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, role, institution, requestPasswordReset } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!currentUser) return null;

  const handlePasswordReset = async () => {
    await requestPasswordReset(currentUser.email);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const institutionDisplayName =
    currentUser.institutionName || institution?.name || 'National Institute of Technology & Engineering';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b192c] tracking-tight">
            Account & Academic Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#0b192c]/70 mt-0.5">
            Manage your institutional identity, academic department, bio, and credentials.
          </p>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-[#0d9488]/20 transition cursor-pointer self-start sm:self-auto flex items-center space-x-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {resetSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2.5 shadow-xs"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>A secure password reset authorization token has been dispatched to {currentUser.email}.</span>
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-[#eee5d3] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#0d9488]/20 shadow-xs shrink-0"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-[#0b192c]">{currentUser.name}</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  role === 'STUDENT'
                    ? 'bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30'
                    : role === 'TEACHER'
                    ? 'bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/30'
                    : 'bg-[#0b192c]/10 text-[#0b192c] border border-[#0b192c]/20'
                }`}
              >
                {role}
              </span>
            </div>

            <p className="text-xs text-[#0b192c]/70 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0b192c]/40 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </p>

            <p className="text-xs text-[#0b192c]/70 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
              <span className="font-semibold text-[#0b192c] truncate">{institutionDisplayName}</span>
            </p>

            {currentUser.phone && (
              <p className="text-xs text-[#0b192c]/70 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0b192c]/40 shrink-0" />
                <span>{currentUser.phone}</span>
              </p>
            )}
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="sm:hidden w-full py-2 rounded-xl border border-[#eee5d3] text-[#0d9488] text-xs font-bold hover:bg-[#f8f5ee]"
          >
            Edit Profile
          </button>
        </div>

        {/* Bio Section */}
        {currentUser.bio && (
          <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3] text-xs text-[#0b192c]/80 space-y-1">
            <span className="font-bold text-[#0b192c] text-[11px] uppercase tracking-wider block">
              About & Academic Focus
            </span>
            <p className="leading-relaxed">{currentUser.bio}</p>
          </div>
        )}

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#eee5d3] text-xs">
          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] space-y-1">
            <span className="text-[#0b192c]/60 font-medium">Department / Academic Unit</span>
            <div className="text-[#0b192c] font-bold text-sm">{currentUser.department || 'Computer Science'}</div>
          </div>

          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] space-y-1">
            <span className="text-[#0b192c]/60 font-medium">Account Status</span>
            <div className="text-[#0d9488] font-bold text-sm flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{currentUser.status}</span>
            </div>
          </div>

          {currentUser.role === 'STUDENT' && (
            <>
              <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] space-y-1">
                <span className="text-[#0b192c]/60 font-medium">Student Registration Number</span>
                <div className="font-mono text-[#0b192c] font-bold text-sm">{currentUser.studentIdNumber || 'STU-2026-904'}</div>
              </div>
              <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] space-y-1">
                <span className="text-[#0b192c]/60 font-medium">Expected Graduation Year</span>
                <div className="text-[#0b192c] font-bold text-sm">{currentUser.graduationYear || '2027'}</div>
              </div>
            </>
          )}

          {currentUser.role === 'TEACHER' && (
            <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] space-y-1">
              <span className="text-[#0b192c]/60 font-medium">Active Mentee Capacity</span>
              <div className="text-[#0d9488] font-bold text-sm">{currentUser.maxMentees || 4} Students Maximum</div>
            </div>
          )}

          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#eee5d3] space-y-1">
            <span className="text-[#0b192c]/60 font-medium">Unique Identity (UUID)</span>
            <div className="font-mono text-[#0b192c]/70 text-xs truncate">{currentUser.id}</div>
          </div>
        </div>

        {/* Security / Password Reset */}
        <div className="pt-4 border-t border-[#eee5d3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-[#0b192c] flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-[#0d9488]" />
              <span>Password & Cryptographic Credentials</span>
            </h3>
            <p className="text-[11px] text-[#0b192c]/60">
              Institutional tokens and passkeys are secured with salted SHA-256 standards.
            </p>
          </div>

          <button
            onClick={handlePasswordReset}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#eee5d3] hover:bg-[#f8f5ee] text-[#0b192c] text-xs font-semibold cursor-pointer transition shadow-2xs"
          >
            Request Password Reset
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
        />
      )}
    </motion.div>
  );
};
