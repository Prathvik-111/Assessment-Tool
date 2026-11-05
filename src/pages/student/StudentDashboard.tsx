/**
 * SmartAssess AI: Student Dashboard
 * Navy, Teal, Sky Blue, Beige, and White Palette
 * Real-time academic metrics, module performance charts, AI recommendations,
 * assigned mentor overview, and certificate quick access.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { AiMlEngine } from '../../services/aiMlEngine.ts';
import {
  BookOpen,
  FileCheck2,
  FileText,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  Camera,
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
import { motion } from 'motion/react';

export const StudentDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);
  const enrolledCourses = enrollments.map(e => e.course);
  const inProgressCount = enrollments.filter(e => e.status === 'IN_PROGRESS').length;

  const primaryCourse = enrolledCourses[0] || dbService.getCourses()[0];
  const results = dbService.getStudentResults(currentUser.id);
  const certificates = dbService.getStudentCertificates(currentUser.id);

  const assignments = primaryCourse ? dbService.getAssignments(primaryCourse.id) : [];
  const submissions = dbService.getStudentSubmissions(currentUser.id);
  const pendingAssignmentsCount = assignments.filter(
    a => !submissions.some(s => s.assignmentId === a.id)
  ).length;

  const assessments = primaryCourse ? dbService.getAssessments(primaryCourse.id) : [];
  const completedAssessmentIds = results.map(r => r.assessmentId);
  const upcomingAssessments = assessments.filter(a => !completedAssessmentIds.includes(a.id));

  // Overall average
  const overallAvg = results.length > 0
    ? Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / results.length) * 10) / 10
    : 0;

  // AI Prediction for primary course
  const aiPrediction = primaryCourse
    ? AiMlEngine.analyzeStudent(currentUser.id, primaryCourse.id)
    : null;

  // Assigned mentor
  const mentorData = dbService.getStudentMentor(currentUser.id, primaryCourse?.id);

  // Module scores chart data
  const modules = primaryCourse ? dbService.getModulesByCourse(primaryCourse.id) : [];
  const chartData = modules.map(m => {
    const res = results.find(r => r.moduleId === m.id);
    return {
      name: m.title.replace('Module ', 'M').split(':')[0],
      fullName: m.title,
      score: res ? res.percentage : 0,
      hasTaken: !!res,
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner: Navy to Teal Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b192c] via-[#132a47] to-[#1e3e62] p-6 sm:p-8 text-white shadow-xl border border-[#1e3e62]"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#38bdf8] text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Academic Intelligence & Continuous Proctoring Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Curriculum progress in <span className="font-bold text-white underline decoration-[#38bdf8]">{primaryCourse?.title || 'Active Track'}</span>. Take proctored exams, earn academic certificates, and receive automated faculty mentorship.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('assessments')}
              className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>Take Proctored Exam</span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition flex items-center space-x-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>My Certificates ({certificates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('mentor')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition flex items-center space-x-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#38bdf8]" />
              <span>My Mentor</span>
            </button>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#0d9488]/20 blur-3xl pointer-events-none" />
      </motion.div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-[#eee5d3] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#0b192c]/60 mb-2">
            <span className="text-xs font-medium">Courses</span>
            <div className="w-7 h-7 rounded-lg bg-[#0d9488]/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#0d9488]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0b192c]">{enrollments.length}</div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Active tracks</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#0b192c]/60 mb-2">
            <span className="text-xs font-medium">In Progress</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0b192c]">{inProgressCount}</div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Modules underway</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#0b192c]/60 mb-2">
            <span className="text-xs font-medium">Certificates</span>
            <div className="w-7 h-7 rounded-lg bg-[#0d9488]/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-[#0d9488]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0d9488]">{certificates.length}</div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Verified Diplomas</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#0b192c]/60 mb-2">
            <span className="text-xs font-medium">Assignments</span>
            <div className="w-7 h-7 rounded-lg bg-[#0284c7]/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#0284c7]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0b192c]">{pendingAssignmentsCount}</div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Pending submission</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#0b192c]/60 mb-2">
            <span className="text-xs font-medium">Available Quizzes</span>
            <div className="w-7 h-7 rounded-lg bg-[#0d9488]/10 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 text-[#0d9488]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0b192c]">{upcomingAssessments.length}</div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Proctored & AI tests</div>
        </div>

        <div className="bg-white border border-[#eee5d3] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#0b192c]/60 mb-2">
            <span className="text-xs font-medium">Overall Average</span>
            <div className="w-7 h-7 rounded-lg bg-[#0284c7]/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-[#0284c7]" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold ${overallAvg < 50 ? 'text-rose-600' : overallAvg < 70 ? 'text-amber-600' : 'text-[#0d9488]'}`}>
            {overallAvg}%
          </div>
          <div className="text-[11px] text-[#0b192c]/50 mt-1">Across all exams</div>
        </div>
      </div>

      {/* AI Alert Banner if High Risk detected */}
      {aiPrediction && aiPrediction.riskLevel === 'HIGH' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-rose-950">
                  Academic Support Alert: High Risk in {aiPrediction.weakTopics.join(', ') || 'Loops & Functions'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900">
                  Risk: HIGH
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Module score is below institutional standard. An automatic mentor pairing has been established with Dr. Sarah Jenkins to help remediate and prepare for retakes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('mentor')}
            className="px-4 py-2 rounded-xl bg-[#0b192c] hover:bg-[#1e3e62] text-white text-xs font-bold shrink-0 transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>Open Mentorship Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Main Grid: Module Performance Chart & Assigned Mentor Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Module-Wise Performance Chart */}
        <div className="lg:col-span-2 bg-white border border-[#eee5d3] rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0b192c]">Module-Wise Performance Analysis</h2>
              <p className="text-xs text-[#0b192c]/60">
                Score breakdown across curriculum modules of {primaryCourse?.title}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('results')}
              className="text-xs text-[#0d9488] hover:text-[#0f766e] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee5d3" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#eee5d3] p-3 rounded-xl shadow-lg text-xs">
                          <div className="font-bold text-[#0b192c]">{data.fullName}</div>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-[#0b192c]/60">Score:</span>
                            <span className={`font-bold ${data.score < 40 ? 'text-rose-600' : data.score < 60 ? 'text-amber-600' : 'text-[#0d9488]'}`}>
                              {data.score}%
                            </span>
                          </div>
                          {data.score < 50 && (
                            <div className="text-[10px] text-rose-600 mt-1 font-semibold">
                              * Priority remediation recommended
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score < 40 ? '#ef4444' : entry.score < 60 ? '#f59e0b' : '#0d9488'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#eee5d3] flex flex-wrap items-center justify-between text-xs text-[#0b192c]/60 gap-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
                <span>Proficient (≥60%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Moderate (40-59%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>High Risk (&lt;40%)</span>
              </div>
            </div>
            <span className="text-[11px] text-[#0b192c]/50">Institutional threshold: 40%</span>
          </div>
        </div>

        {/* Right Col: Mentor Card */}
        <div className="bg-white border border-[#eee5d3] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#0b192c]/60 uppercase tracking-wider">
                Assigned Mentor
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20">
                Auto-Matched
              </span>
            </div>

            {mentorData ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={mentorData.teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={mentorData.teacher.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#0d9488]/30"
                  />
                  <div>
                    <h3 className="font-bold text-[#0b192c] text-sm">{mentorData.teacher.name}</h3>
                    <p className="text-xs text-[#0b192c]/60">{mentorData.teacher.department}</p>
                    <p className="text-[11px] text-[#0d9488] font-semibold mt-0.5">
                      Course: {mentorData.course.title.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <div className="bg-[#f8f5ee] rounded-2xl p-3.5 text-xs space-y-1.5 border border-[#eee5d3]">
                  <div className="text-[11px] font-bold text-[#0b192c]">Target Weakness:</div>
                  <div className="text-[#0d9488] font-bold">
                    {mentorData.targetModule?.title || 'Loops & Functions'}
                  </div>
                  <p className="text-[11px] text-[#0b192c]/70 leading-relaxed pt-1">
                    "{mentorData.reason}"
                  </p>
                </div>

                {mentorData.sessions && mentorData.sessions.length > 0 && (
                  <div className="bg-[#0284c7]/10 border border-[#0284c7]/20 rounded-2xl p-3">
                    <div className="flex items-center space-x-1.5 text-[#0b192c] text-xs font-bold mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>Next Mentoring Session</span>
                    </div>
                    <div className="text-xs text-[#0b192c] font-semibold">
                      {mentorData.sessions[0].title}
                    </div>
                    <div className="text-[11px] text-[#0b192c]/60 mt-0.5">
                      {new Date(mentorData.sessions[0].scheduledAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p>No active mentor assigned.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#eee5d3] mt-4">
            <button
              onClick={() => setActiveTab('mentor')}
              className="w-full py-2.5 rounded-xl bg-[#0b192c] hover:bg-[#1e3e62] text-white text-xs font-bold transition text-center cursor-pointer shadow-xs"
            >
              Open Mentorship Portal
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations & Recent Assessment Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <div className="bg-white border border-[#eee5d3] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#0d9488]" />
            <h2 className="text-sm font-bold text-[#0b192c]">AI-Generated Learning Roadmap</h2>
          </div>

          <div className="space-y-2.5">
            {aiPrediction?.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-2xl bg-[#f8f5ee] border border-[#eee5d3] text-xs"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0d9488]/10 text-[#0d9488] font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[#0b192c]/80 leading-relaxed font-medium">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results List */}
        <div className="bg-white border border-[#eee5d3] rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b192c]">Recent Assessment Results</h2>
            <button
              onClick={() => setActiveTab('results')}
              className="text-xs text-[#0d9488] hover:text-[#0f766e] font-bold cursor-pointer"
            >
              View All ({results.length})
            </button>
          </div>

          <div className="divide-y divide-[#eee5d3]">
            {results.slice(0, 5).map(res => {
              const mod = dbService.getModulesByCourse(res.courseId).find(m => m.id === res.moduleId);
              const asm = dbService.getAssessmentById(res.assessmentId);

              return (
                <div key={res.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0b192c]">
                      {asm?.title || mod?.title || 'Module Assessment'}
                    </div>
                    <div className="text-[11px] text-[#0b192c]/50">
                      {new Date(res.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                        res.percentage < 40
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : res.percentage < 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30'
                      }`}
                    >
                      {res.percentage}%
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        res.passed ? 'text-[#0d9488]' : 'text-rose-700'
                      }`}
                    >
                      {res.passed ? 'Passed' : 'Retake'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
