/**
 * SmartAssess AI: AI-Based Student Performance Analysis & Insights (Aesthetic Light Theme)
 * Section 7 implementation with mild aesthetic styling, risk telemetry, and recommendations.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { AiMlEngine } from '../../services/aiMlEngine.ts';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Award,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AiInsightsView: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const enrollments = dbService.getStudentEnrollments(currentUser.id);
  const primaryCourse = enrollments[0]?.course || dbService.getCourses()[0];
  if (!primaryCourse) return null;

  const prediction = AiMlEngine.analyzeStudent(currentUser.id, primaryCourse.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>Machine Learning Diagnostic Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">AI Academic Performance Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Powered by {prediction.modelVersion}. Evaluates continuous quiz patterns to detect failure risk and prescribe learning interventions.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs text-indigo-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Model Confidence: {Math.round(prediction.confidenceScore * 100)}%</span>
        </div>
      </div>

      {/* Main Prediction KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Risk Level Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between ${
            prediction.riskLevel === 'HIGH'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : prediction.riskLevel === 'MODERATE'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider opacity-75">
                Future Academic Risk
              </span>
              <AlertTriangle className={`w-5 h-5 ${
                prediction.riskLevel === 'HIGH' ? 'text-rose-600' : prediction.riskLevel === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'
              }`} />
            </div>
            <div className="text-3xl font-extrabold tracking-tight">
              {prediction.riskLevel} RISK
            </div>
            <p className="text-xs mt-2 leading-relaxed opacity-85">
              {prediction.riskLevel === 'HIGH'
                ? 'High risk of failure on future final exams without immediate targeted faculty remediation.'
                : prediction.riskLevel === 'MODERATE'
                ? 'Moderate performance instability. Specific modules require practice questions.'
                : 'Performance trajectory is stable with low risk of academic difficulty.'}
            </p>
          </div>

          <div className="pt-4 border-t border-current/15 mt-4 flex items-center justify-between text-xs font-semibold">
            <span>Support Priority:</span>
            <span className="uppercase font-bold">{prediction.supportPriority}</span>
          </div>
        </motion.div>

        {/* Predicted Future Assessment Score */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Predicted Exam Score
              </span>
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {prediction.predictedFutureScore}%
              </span>
              <span className="text-xs text-slate-400 font-medium">estimated outcome</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Calculated via multi-factor feature regression (Quiz average, lowest module score, submission rate, and historical trajectory).
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-400 italic">
            * Directional estimate to focus faculty remediation and study allocation.
          </div>
        </motion.div>

        {/* Mentoring Requirement */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Mentoring Requirement
              </span>
              <HeartHandshake className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {prediction.requiresMentor ? 'Mentor Assigned' : 'Self-Paced Learning'}
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {prediction.requiresMentor
                ? 'Automatic mentor allocation triggered by score below institution support threshold.'
                : 'Current performance meets independent study criteria.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setActiveTab('mentor')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <span>View Mentor Profile & Sessions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Weak Topics vs Strong Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Weak Topics */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Identified Weak Topics (Requires Intervention)</h2>
              <p className="text-xs text-slate-500">Topics where assessment scores fell below 60%</p>
            </div>
          </div>

          {prediction.weakTopics.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 text-center">
              No critical weak topics identified. All tested modules are passing.
            </div>
          ) : (
            <div className="space-y-2.5">
              {prediction.weakTopics.map((topic, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-bold text-rose-900">{topic}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-800">
                    Remediation Target
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-indigo-700 block mb-0.5">Faculty Matching Rule:</span>
            Faculty members specializing in these weak modules are assigned high priority in the automatic mentor allocation engine.
          </div>
        </div>

        {/* Identified Strong Topics */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Identified Strong Topics (Mastery Areas)</h2>
              <p className="text-xs text-slate-500">Topics where assessment scores exceeded 75%</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {prediction.strongTopics.map((topic, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-emerald-900">{topic}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-800">
                  Proficient (≥75%)
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-emerald-700 block mb-0.5">Academic Strength:</span>
            Conceptual foundation in these topics can be leveraged as analogies during mentoring.
          </div>
        </div>
      </div>

      {/* Actionable Learning Recommendations */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900">Targeted Remediation & Practice Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 text-xs"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-slate-700 leading-relaxed pt-0.5 font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
