/**
 * SmartAssess AI: Header Navigation Bar
 * Color Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), and White (#FFFFFF)
 * Includes brand identity, demo persona switcher, notification drawer, edit profile modal, and sign out.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { dbService } from '../services/db.ts';
import { EditProfileModal } from './EditProfileModal.tsx';
import {
  Bell,
  GraduationCap,
  ChevronDown,
  Sparkles,
  LogOut,
  User as UserIcon,
  Edit3,
} from 'lucide-react';

export const Navbar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => {
  const { currentUser, role, institution, switchDemoUser, logout } = useAuth();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const notifications = currentUser ? dbService.getNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      desc: 'Top Performing Student (91% Avg)',
      badge: 'bg-[#f0fdfa] text-[#0f766e] border-[#ccfbf1]',
    },
    {
      id: 'usr-teach-01',
      name: 'Dr. Sarah Jenkins',
      role: 'TEACHER',
      desc: 'CS Faculty (Loops Specialist & Mentor)',
      badge: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    },
    {
      id: 'usr-teach-02',
      name: 'Prof. Michael Chen',
      role: 'TEACHER',
      desc: 'Software Engineering & Databases',
      badge: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    },
    {
      id: 'usr-admin-01',
      name: 'Dr. Elena Rostova',
      role: 'ADMIN',
      desc: 'University Institutional Administrator',
      badge: 'bg-[#faf8f5] text-[#0b192c] border-[#eee5d3]',
    },
  ];

  const handleNotificationClick = (id: string, linkUrl?: string) => {
    dbService.markNotificationAsRead(id);
    if (linkUrl) {
      const tabName = linkUrl.replace('/', '');
      setActiveTab(tabName);
    }
    setShowNotifMenu(false);
  };

  const handleMarkAllRead = () => {
    if (currentUser) {
      dbService.markAllNotificationsAsRead(currentUser.id);
      setShowNotifMenu(false);
    }
  };

  const institutionName =
    currentUser?.institutionName || institution?.name || 'National Institute of Technology & Engineering';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#eee5d3] text-[#0b192c] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title (Navy + Teal) */}
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-2xl bg-[#0b192c] flex items-center justify-center shadow-md shadow-[#0b192c]/20 text-white">
            <GraduationCap className="w-5 h-5 text-[#38bdf8]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-[#0b192c]">
                SmartAssess <span className="text-[#0d9488]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1]">
                Live Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[180px] sm:max-w-xs">
              {institutionName}
            </p>
          </div>
        </div>

        {/* Right side controls (Persona switcher, notifications, edit profile, sign-out) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Demo Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-[#f8f5ee] hover:bg-[#f2ece0] border border-[#eee5d3] px-3 py-1.5 rounded-xl text-xs transition duration-150 cursor-pointer text-[#0b192c]"
              title="Switch demo persona"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
              <span className="text-slate-500 hidden md:inline">Persona:</span>
              <span className="font-bold text-[#0b192c] max-w-[100px] sm:max-w-[130px] truncate">
                {currentUser?.name || 'Select'}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  role === 'STUDENT'
                    ? 'bg-[#f0fdfa] text-[#0f766e]'
                    : role === 'TEACHER'
                    ? 'bg-[#f0f9ff] text-[#0284c7]'
                    : 'bg-[#0b192c] text-white'
                }`}
              >
                {role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#eee5d3] rounded-2xl shadow-xl py-2 z-50">
                <div className="px-3.5 py-2 border-b border-[#eee5d3] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Instant Demo Persona Switcher
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#f8f5ee]">
                  {demoAccounts.map(demo => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        switchDemoUser(demo.id);
                        setShowRoleMenu(false);
                        setActiveTab('dashboard');
                      }}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-[#f8f5ee] transition flex items-start space-x-2.5 cursor-pointer ${
                        currentUser?.id === demo.id ? 'bg-[#f0fdfa]' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 bg-[#0d9488] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0b192c]">{demo.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${demo.badge}`}>
                            {demo.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{demo.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 rounded-xl bg-[#f8f5ee] hover:bg-[#f2ece0] border border-[#eee5d3] text-slate-700 hover:text-[#0b192c] transition cursor-pointer flex items-center space-x-1.5 text-xs font-medium"
            title="Edit My Profile"
          >
            <Edit3 className="w-4 h-4 text-[#0d9488]" />
            <span className="hidden lg:inline">Edit Profile</span>
          </button>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl bg-[#f8f5ee] hover:bg-[#f2ece0] border border-[#eee5d3] text-[#0b192c] transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#0b192c]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0d9488] text-[9px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#eee5d3] rounded-2xl shadow-xl py-3 z-50">
                <div className="px-4 py-2 border-b border-[#eee5d3] flex items-center justify-between">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#0b192c]">
                    Notifications ({notifications.length})
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-[#0d9488] hover:text-[#0f766e] font-semibold cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#f8f5ee]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id, n.linkUrl)}
                        className={`p-3.5 hover:bg-[#f8f5ee] transition cursor-pointer flex items-start space-x-3 ${
                          !n.isRead ? 'bg-[#f0fdfa]/40' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {!n.isRead ? (
                            <span className="w-2 h-2 rounded-full bg-[#0d9488] block" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300 block" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0b192c] leading-tight">{n.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Sign Out */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-xl bg-[#f8f5ee] hover:bg-[#f2ece0] border border-[#eee5d3] text-slate-600 hover:text-[#0b192c] transition cursor-pointer flex items-center space-x-1.5 text-xs font-medium"
            title="Log out"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal instance */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
        />
      )}
    </header>
  );
};
