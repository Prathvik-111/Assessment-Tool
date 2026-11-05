/**
 * SmartAssess AI: Dynamic Role-Based Sidebar Navigation
 * Color Palette: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), and White (#FFFFFF)
 * Includes navigation links, Certificates tab for students, user profile badge, and quick edit trigger.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { EditProfileModal } from './EditProfileModal.tsx';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  FileCheck2,
  FileText,
  LineChart,
  BrainCircuit,
  HeartHandshake,
  Award,
  Bell,
  User as UserIcon,
  HelpCircle,
  Users,
  CalendarCheck,
  Building2,
  GitPullRequest,
  ShieldCheck,
  Settings,
  GraduationCap,
  Layers,
  Edit3,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, currentUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const studentItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore-courses', label: 'Explore Courses', icon: Compass },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
    { id: 'certificates', label: 'My Certificates', icon: Award, highlight: true },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'results', label: 'My Results', icon: LineChart },
    { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit, badge: 'ML' },
    { id: 'mentor', label: 'My Mentor', icon: HeartHandshake },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
  ];

  const teacherItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verify-credentials', label: 'Verify Credentials', icon: Award, highlight: true },
    { id: 'teacher-courses', label: 'My Courses', icon: BookOpen },
    { id: 'modules-lessons', label: 'Modules & Lessons', icon: Layers },
    { id: 'question-bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'teacher-assessments', label: 'Assessments', icon: FileCheck2 },
    { id: 'teacher-assignments', label: 'Assignments', icon: FileText },
    { id: 'student-reports', label: 'Student Reports', icon: LineChart },
    { id: 'mentees', label: 'My Mentees', icon: HeartHandshake },
    { id: 'mentoring-sessions', label: 'Mentoring Sessions', icon: CalendarCheck },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
  ];

  const adminItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'mentor-allocation', label: 'Mentor Allocation Engine', icon: GitPullRequest, highlight: true },
    { id: 'students-admin', label: 'Manage Students', icon: Users },
    { id: 'teachers-admin', label: 'Manage Faculty', icon: GraduationCap },
    { id: 'courses-admin', label: 'Manage Courses', icon: BookOpen },
    { id: 'institutions', label: 'Institutions', icon: Building2 },
    { id: 'audit-logs', label: 'Audit Trail', icon: ShieldCheck },
    { id: 'settings', label: 'AI Configuration', icon: Settings },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
  ];

  const items = role === 'STUDENT' ? studentItems : role === 'TEACHER' ? teacherItems : adminItems;

  return (
    <>
      <aside className="w-64 bg-[#f8f5ee] border-r border-[#eee5d3] hidden md:flex flex-col justify-between shrink-0 py-6 px-4 shadow-2xs">
        <div className="space-y-6">
          {/* User Card with Quick Edit Trigger */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#eee5d3] shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#0d9488]/30 shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#0b192c] truncate">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0d9488]">
                    {role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0d9488] hover:bg-[#f8f5ee] transition cursor-pointer"
                title="Edit Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0b192c] text-white shadow-xs'
                      : item.highlight
                      ? 'text-[#0d9488] bg-[#f0fdfa] hover:bg-[#ccfbf1]/60'
                      : 'text-slate-700 hover:bg-[#eee5d3]/70 hover:text-[#0b192c]'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#38bdf8]' : item.highlight ? 'text-[#0d9488]' : 'text-slate-500'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive ? 'bg-[#38bdf8] text-[#0b192c]' : 'bg-[#e0f2fe] text-[#0369a1]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Institution Badge Footer */}
        <div className="pt-4 border-t border-[#eee5d3] text-[11px] text-slate-500 space-y-1">
          <div className="font-bold text-[#0b192c] truncate">
            {currentUser?.institutionName || 'SmartAssess AI Campus'}
          </div>
          <div className="text-[10px] text-slate-400">
            Automated Academic Suite • v2.4
          </div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};
