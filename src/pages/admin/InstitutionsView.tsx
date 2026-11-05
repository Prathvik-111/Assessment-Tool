/**
 * SmartAssess AI: Institution Management (Admin) (Aesthetic Mild Light Theme)
 * Section 12 implementation:
 * - Register institutions
 * - Manage institution details & domains
 * - Associate students and teachers with institutions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Institution } from '../../types/index.ts';
import {
  Building2,
  Plus,
  CheckCircle,
  ExternalLink,
  Users,
  BookOpen,
  MapPin,
  Mail,
  X,
} from 'lucide-react';

export const InstitutionsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>(dbService.getInstitutions());
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    dbService.createInstitution({
      name,
      code,
      domain,
      address,
      contactEmail,
    }, currentUser.id);

    setInstitutions(dbService.getInstitutions());
    setShowCreateModal(false);
    setName('');
    setCode('');
    setDomain('');
    setAddress('');
    setContactEmail('');
    setFeedbackMsg(`Institution "${name}" registered successfully.`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Academic Institutions Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure multi-tenant university domains, institutional policy boundaries, and contact nodes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Institution</span>
        </button>
      </div>

      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2.5 shadow-xs"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </motion.div>
      )}

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {institutions.map((inst, idx) => {
          const affiliatedUsers = dbService.getUsers().filter(u => u.institutionId === inst.id);
          const studentCount = affiliatedUsers.filter(u => u.role === 'STUDENT').length;
          const teacherCount = affiliatedUsers.filter(u => u.role === 'TEACHER').length;

          return (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{inst.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-indigo-600 mt-1 font-semibold">
                      <span>Code: {inst.code}</span>
                      <span className="text-slate-300">•</span>
                      <span>Domain: {inst.domain || 'nite.edu'}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  Active
                </span>
              </div>

              {inst.address && (
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{inst.address}</span>
                </div>
              )}

              {inst.contactEmail && (
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{inst.contactEmail}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Enrolled Students</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{studentCount}</span>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Faculty Staff</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{teacherCount}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Institution Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Institutional Multi-Tenancy
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Register Academic Institution</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stanford Polytechnic Institute"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. STAN-TECH"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
                    <input
                      type="text"
                      placeholder="e.g. stantech.edu"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 Campus Drive, CA"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. contact@stantech.edu"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Save Institution
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
