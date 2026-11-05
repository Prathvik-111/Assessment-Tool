/**
 * SmartAssess AI: Master Application Router & State Container
 * Restored Theme: Navy (#0B192C), Teal (#0D9488), Sky Blue (#0284C7 / #38BDF8), Beige (#F8F5EE), and White (#FFFFFF)
 * Includes role-based navigation, dedicated certificates view, and separate landing/auth flow.
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { AuthPage } from './pages/auth/AuthPage.tsx';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';
import { CourseCatalog } from './pages/student/CourseCatalog.tsx';
import { MyCourses } from './pages/student/MyCourses.tsx';
import { AssessmentsList } from './pages/student/AssessmentsList.tsx';
import { AssignmentsList } from './pages/student/AssignmentsList.tsx';
import { StudentResults } from './pages/student/StudentResults.tsx';
import { AiInsightsView } from './pages/student/AiInsightsView.tsx';
import { MyMentorView } from './pages/student/MyMentorView.tsx';
import { CertificatesView } from './pages/student/CertificatesView.tsx';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard.tsx';
import { TeacherCourses } from './pages/teacher/TeacherCourses.tsx';
import { ModulesAndLessons } from './pages/teacher/ModulesAndLessons.tsx';
import { QuestionBank } from './pages/teacher/QuestionBank.tsx';
import { TeacherAssessments } from './pages/teacher/TeacherAssessments.tsx';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments.tsx';
import { StudentReports } from './pages/teacher/StudentReports.tsx';
import { MyMentees } from './pages/teacher/MyMentees.tsx';
import { MentoringSessionsView } from './pages/teacher/MentoringSessionsView.tsx';
import { CertificateVerificationView } from './pages/teacher/CertificateVerificationView.tsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { MentorAllocationAdmin } from './pages/admin/MentorAllocationAdmin.tsx';
import { UserManager } from './pages/admin/UserManager.tsx';
import { AuditLogsView } from './pages/admin/AuditLogsView.tsx';
import { InstitutionsView } from './pages/admin/InstitutionsView.tsx';

// Shared Pages
import { ProfileView } from './pages/shared/ProfileView.tsx';
import { SettingsView } from './pages/shared/SettingsView.tsx';
import { motion, AnimatePresence } from 'motion/react';

const MainAppContent: React.FC = () => {
  const { role, currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center text-slate-600">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Initializing SmartAssess AI...
          </span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the separate Landing/Auth flow
  if (!currentUser) {
    return <AuthPage />;
  }

  // Render role-specific content
  const renderActiveTabContent = () => {
    // Shared tabs
    if (activeTab === 'profile') return <ProfileView />;
    if (activeTab === 'settings') return <SettingsView />;

    // Student Role
    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard setActiveTab={setActiveTab} />;
        case 'explore-courses':
          return <CourseCatalog setActiveTab={setActiveTab} />;
        case 'my-courses':
          return <MyCourses setActiveTab={setActiveTab} />;
        case 'assessments':
          return <AssessmentsList setActiveTab={setActiveTab} />;
        case 'certificates':
          return <CertificatesView setActiveTab={setActiveTab} />;
        case 'assignments':
          return <AssignmentsList setActiveTab={setActiveTab} />;
        case 'results':
          return <StudentResults setActiveTab={setActiveTab} />;
        case 'ai-insights':
          return <AiInsightsView setActiveTab={setActiveTab} />;
        case 'mentor':
          return <MyMentorView setActiveTab={setActiveTab} />;
        case 'notifications':
          return <StudentDashboard setActiveTab={setActiveTab} />;
        default:
          return <StudentDashboard setActiveTab={setActiveTab} />;
      }
    }

    // Teacher Role
    if (role === 'TEACHER') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard setActiveTab={setActiveTab} />;
        case 'verify-credentials':
          return <CertificateVerificationView setActiveTab={setActiveTab} />;
        case 'teacher-courses':
          return <TeacherCourses setActiveTab={setActiveTab} />;
        case 'modules-lessons':
          return <ModulesAndLessons />;
        case 'question-bank':
          return <QuestionBank />;
        case 'teacher-assessments':
          return <TeacherAssessments />;
        case 'teacher-assignments':
          return <TeacherAssignments />;
        case 'student-reports':
          return <StudentReports />;
        case 'mentees':
          return <MyMentees />;
        case 'mentoring-sessions':
          return <MentoringSessionsView />;
        default:
          return <TeacherDashboard setActiveTab={setActiveTab} />;
      }
    }

    // Admin Role
    if (role === 'ADMIN') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard setActiveTab={setActiveTab} />;
        case 'institutions':
          return <InstitutionsView />;
        case 'students-admin':
        case 'teachers-admin':
          return <UserManager />;
        case 'courses-admin':
          return <TeacherCourses setActiveTab={setActiveTab} />;
        case 'mentor-allocation':
          return <MentorAllocationAdmin />;
        case 'admin-analytics':
          return <StudentReports />;
        case 'audit-logs':
          return <AuditLogsView />;
        default:
          return <AdminDashboard setActiveTab={setActiveTab} />;
      }
    }

    return <StudentDashboard setActiveTab={setActiveTab} />;
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#0b192c] flex flex-col font-sans selection:bg-[#0d9488] selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Dynamic Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (currentUser?.id || '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
