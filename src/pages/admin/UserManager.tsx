/**
 * SmartAssess AI: User Management Hub (Admin) (Aesthetic Mild Light Theme)
 * Section 12 implementation:
 * - View students & teachers
 * - Create & edit user accounts
 * - Approve teacher registrations
 * - Activate or deactivate accounts
 * - Delete accounts with data-retention soft-delete
 * - Search and filter users
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { User, UserRole, AccountStatus } from '../../types/index.ts';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Power,
  Shield,
  GraduationCap,
  X,
  UserCheck,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(dbService.getAllUsersAdmin());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);

  // Create form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('Computer Science');
  const [maxMentees, setMaxMentees] = useState(5);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    dbService.createUser({
      name,
      email,
      role,
      department,
      maxMentees: role === 'TEACHER' ? Number(maxMentees) : 0,
      status: 'ACTIVE',
    }, currentUser.id);

    setUsers(dbService.getAllUsersAdmin());
    setShowCreateModal(false);
    setName('');
    setEmail('');
    setFeedbackMsg(`User ${name} created successfully.`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleToggleStatus = (user: User) => {
    const nextStatus: AccountStatus = user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    dbService.updateUser(user.id, { status: nextStatus }, currentUser.id);
    setUsers(dbService.getAllUsersAdmin());
    setFeedbackMsg(`User status updated to ${nextStatus}.`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleApproveTeacher = (user: User) => {
    dbService.updateUser(user.id, { status: 'ACTIVE' }, currentUser.id);
    setUsers(dbService.getAllUsersAdmin());
    setFeedbackMsg(`Faculty registration approved for ${user.name}.`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetUser) return;
    dbService.deleteUser(deleteTargetUser.id, currentUser.id);
    setUsers(dbService.getAllUsersAdmin());
    setFeedbackMsg(`Account for ${deleteTargetUser.name} deactivated and soft-deleted in accordance with institutional policy.`);
    setDeleteTargetUser(null);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">User Account Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Provision accounts, approve faculty registrations, manage RBAC roles, and apply retention policies.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New User</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">Role:</span>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Faculty (Teachers)</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Mentee Capacity</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block">{user.name}</span>
                        <span className="text-[10px] text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'STUDENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : user.role === 'TEACHER'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {user.department || '—'}
                  </td>

                  <td className="py-3.5 px-4">
                    {user.isDeleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                        DELETED
                      </span>
                    ) : user.status === 'PENDING_APPROVAL' ? (
                      <button
                        onClick={() => handleApproveTeacher(user)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer shadow-2xs"
                      >
                        Approve Registration
                      </button>
                    ) : (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {user.role === 'TEACHER' ? `${user.maxMentees || 5} slots` : 'N/A'}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      {!user.isDeleted && (
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title={user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {!user.isDeleted && (
                        <button
                          onClick={() => setDeleteTargetUser(user)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition cursor-pointer"
                          title="Soft Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog for Soft Delete */}
      <AnimatePresence>
        {deleteTargetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center space-x-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-slate-900">Confirm Account Deactivation</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete the account for <strong className="text-slate-900">{deleteTargetUser.name}</strong> ({deleteTargetUser.email})? In accordance with educational data retention policy, existing assessment records and institutional analytics will be preserved, but the account will be deactivated and marked deleted.
              </p>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setDeleteTargetUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition"
                >
                  Confirm Deletion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create User Modal */}
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

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Institutional Identity
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Register New Account</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya.lin@nite.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as UserRole)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher (Faculty)</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {role === 'TEACHER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Mentee Capacity</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={maxMentees}
                      onChange={e => setMaxMentees(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                )}

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
                    Create User
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
