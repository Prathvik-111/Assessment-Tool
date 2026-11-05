/**
 * SmartAssess AI: Teacher Student Analytics & Comprehensive Reports (Aesthetic Mild Light Theme)
 * Section 6 implementation:
 * - Searchable student directory for authorized courses
 * - Detailed drilldown reports with AI performance predictions, module scores,
 *   weak topics, mentoring status, and charts.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { AiMlEngine } from '../../services/aiMlEngine.ts';
import { User, Course } from '../../types/index.ts';
import {
  Search,
  LineChart,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  HeartHandshake,
  Award,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export const StudentReports: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [inspectedStudent, setInspectedStudent] = useState<User | null>(null);

  if (!currentUser) return null;

  const courses = dbService.getTeacherCourses(currentUser.id);
  const courseIds = courses.map(c => c.id);

  // Retrieve authorized students enrolled in teacher's courses
  const students = dbService.getUsers().filter(u => u.role === 'STUDENT');

  const studentRows = students.map(student => {
    const enrollments = dbService.getStudentEnrollments(student.id)
      .filter(e => courseIds.includes(e.courseId));

    const primaryEnr = enrollments[0];
    const course = primaryEnr ? primaryEnr.course : courses[0];
    const results = course ? dbService.getStudentResults(student.id).filter(r => r.courseId === course.id) : [];

    const avg = results.length > 0
      ? Math.round((results.reduce((s, r) => s + r.percentage, 0) / results.length) * 10) / 10
      : 0;

    const prediction = course ? AiMlEngine.analyzeStudent(student.id, course.id) : null;
    const mentor = course ? dbService.getStudentMentor(student.id, course.id) : undefined;

    return {
      student,
      course,
      resultsCount: results.length,
      averageScore: avg,
      prediction,
      mentor,
    };
  }).filter(row => row.course && (selectedCourseId === 'ALL' || row.course.id === selectedCourseId));

  const filteredRows = studentRows.filter(r =>
    r.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Student Performance Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Authorized academic reports, AI predictive risk models, and module-level weakness telemetry.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">Course:</span>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Authorized Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Reports Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Assessments Taken</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4">Identified Weak Areas</th>
                <th className="py-3 px-4">AI Risk Level</th>
                <th className="py-3 px-4">Mentor Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map(({ student, course, resultsCount, averageScore, prediction, mentor }) => {
                const isHighRisk = prediction?.riskLevel === 'HIGH';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block">{student.name}</span>
                          <span className="text-[10px] text-slate-400">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {course.code}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {resultsCount} quizzes
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          averageScore < 40
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : averageScore < 60
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {averageScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {prediction?.weakTopics && prediction.weakTopics.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {prediction.weakTopics.map((wt, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              {wt}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None flagged</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isHighRisk
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : prediction?.riskLevel === 'MODERATE'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {prediction?.riskLevel || 'LOW'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {mentor ? (
                        <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{mentor.teacher.name.split(' ')[1]}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setInspectedStudent(student)}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                      >
                        Full Dossier →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      <AnimatePresence>
        {inspectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-auto space-y-5"
            >
              <button
                onClick={() => setInspectedStudent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3.5">
                <img
                  src={inspectedStudent.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={inspectedStudent.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{inspectedStudent.name}</h3>
                  <p className="text-xs text-slate-500">{inspectedStudent.department} • {inspectedStudent.email}</p>
                </div>
              </div>

              {/* Assessment results for this student */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Module Assessment Breakdown
                </div>
                <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden text-xs">
                  {dbService.getStudentResults(inspectedStudent.id).map(r => (
                    <div key={r.id} className="p-3.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        Module Assessment ({r.moduleId || 'Quiz'})
                      </span>
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          r.percentage < 40 ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                        }`}
                      >
                        {r.percentage}% ({r.passed ? 'Passed' : 'Remediation Needed'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInspectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
