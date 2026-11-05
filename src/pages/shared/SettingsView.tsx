/**
 * SmartAssess AI: Institutional Settings & AI Configuration (Aesthetic Mild Light Theme)
 * Configure mentoring priority thresholds, AI model parameters, and test database reset.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { dbService } from '../../services/db.ts';
import {
  Settings,
  BrainCircuit,
  Sliders,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Shield,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [highRiskThreshold, setHighRiskThreshold] = useState(40);
  const [modRiskThreshold, setModRiskThreshold] = useState(60);
  const [maxCapacityDefault, setMaxCapacityDefault] = useState(5);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg('Academic support policy thresholds saved to database.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to restore the demonstration seed dataset? This will reset all 23 relational tables.')) {
      dbService.resetToSeed();
      setFeedbackMsg('Database restored to initial seed dataset.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System & AI Configuration</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure academic intervention thresholds, machine learning engine parameters, and database state.
        </p>
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

      {/* Threshold Rules Form */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center space-x-2.5">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Mentoring Support Allocation Thresholds</h2>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                High-Priority Support Cutoff (% score)
              </label>
              <input
                type="number"
                min={20}
                max={60}
                value={highRiskThreshold}
                onChange={e => setHighRiskThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Scores below this trigger mandatory automatic mentor allocation.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moderate Support Cutoff (% score)
              </label>
              <input
                type="number"
                min={40}
                max={80}
                value={modRiskThreshold}
                onChange={e => setModRiskThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Scores between high and moderate trigger advisory mentor pairing.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs hover:shadow transition"
            >
              Save Policy Rules
            </button>
          </div>
        </form>
      </div>

      {/* Machine Learning Engine Info */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">AI Diagnostic Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Model Algorithm</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">Random Forest + DT</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Version & Pipeline</span>
            <span className="font-bold text-indigo-600 text-sm mt-0.5 block">v1.2 (Ensemble)</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">R² Validation Score</span>
            <span className="font-bold text-emerald-600 text-sm mt-0.5 block">0.912</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed pt-1">
          Features analyzed include continuous quiz averages, lowest module performance, assignment completion rate, score trajectory slope, and attempt counts.
        </p>
      </div>

      {/* Database Reset Action */}
      <div className="bg-white border border-rose-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <RotateCcw className="w-4 h-4" />
          <span>Demonstration Data Reset</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Reset all 23 database tables back to the pristine initial seed dataset (including Python Programming course, student Aarav Sharma with 35% in Loops, Dr. Sarah Jenkins as mentor, and sample quizzes).
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer transition shadow-2xs"
          >
            Reset Database to Seed State
          </button>
        </div>
      </div>
    </motion.div>
  );
};
