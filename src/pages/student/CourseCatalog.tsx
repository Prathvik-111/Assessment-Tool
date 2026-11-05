/**
 * SmartAssess AI: Course Catalog & Razorpay Test Mode Enrollment
 * Aesthetic Navy, Teal, Sky Blue, Beige, and White Palette.
 * Search, filter, inspect syllabus, and purchase/enroll using Razorpay test mode.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Course } from '../../types/index.ts';
import { RazorpayModal } from '../../components/RazorpayModal.tsx';
import {
  Search,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CourseCatalog: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  const courses = dbService.getCourses();
  const enrollments = currentUser ? dbService.getStudentEnrollments(currentUser.id) : [];
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const categories = ['ALL', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenRazorpay = (course: Course) => {
    if (!currentUser) return;
    setCheckoutCourse(course);
  };

  const handlePaymentSuccess = () => {
    setFeedbackMsg({
      type: 'success',
      text: 'Payment verified & course enrolled! You can now start modular quizzes and earn your completion certificate.',
    });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0d9488]/10 text-[#0d9488] text-xs font-bold mb-1 border border-[#0d9488]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Razorpay Payment Gateway Integrated (Test Mode)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b192c] tracking-tight">
            Explore Accredited Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse course syllabi, verify modular learning pathways, and enroll via instant Razorpay test checkout.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
            feedbackMsg.type === 'success'
              ? 'bg-[#0d9488]/10 border-[#0d9488]/30 text-[#0d9488]'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#0d9488] shrink-0" />
            <span className="text-slate-800">{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setActiveTab('assessments')}
            className="text-[#0284c7] hover:underline font-bold cursor-pointer"
          >
            Go to Assessments →
          </button>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#eee5d3] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course title, code (e.g. CS-101), or topic..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f5ee] border border-[#eee5d3] rounded-xl text-xs text-[#0b192c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex space-x-1.5 overflow-x-auto py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0b192c] text-white shadow-xs'
                    : 'bg-[#f8f5ee] text-slate-600 hover:text-[#0b192c] hover:bg-[#eee5d3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const modules = dbService.getModulesByCourse(course.id);
          const price = course.price || 1499;

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#eee5d3] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#0284c7]/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#0b192c] backdrop-blur shadow-xs">
                      {course.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-slate-700 backdrop-blur">
                      {course.difficultyLevel}
                    </span>
                  </div>

                  {/* Price Tag in Top Right */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-tight bg-[#0b192c] text-amber-300 shadow-md">
                      ₹{price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      One-time lifetime access
                    </span>
                  </div>

                  <h3 className="font-bold text-[#0b192c] text-base leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-3 flex items-center space-x-4 text-xs text-slate-500 border-t border-[#f8f5ee]">
                    <div className="flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>{modules.length} Modules</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Verified Diploma</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                {isEnrolled ? (
                  <button
                    onClick={() => setActiveTab('assessments')}
                    className="w-full py-2.5 rounded-xl bg-[#0d9488]/10 border border-[#0d9488]/30 text-[#0d9488] text-xs font-bold hover:bg-[#0d9488]/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#0d9488]" />
                    <span>Enrolled (Open Modular Assessments)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenRazorpay(course)}
                    className="w-full py-2.5 rounded-xl bg-[#0b192c] hover:bg-[#132a47] text-white text-xs font-bold shadow-md shadow-[#0b192c]/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Buy Course (₹{price.toLocaleString()} via Razorpay)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Razorpay Test Modal */}
      {checkoutCourse && currentUser && (
        <RazorpayModal
          course={checkoutCourse}
          student={currentUser}
          onClose={() => setCheckoutCourse(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
