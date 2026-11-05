/**
 * SmartAssess AI: Institutional Audit Logs (Admin) (Aesthetic Mild Light Theme)
 * Section 12 implementation:
 * - Immutable audit trail of administrative, grading, and mentor allocation actions
 * - Filtering by action, actor, and searchable timestamps
 * - Expandable structured JSON payload inspector
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { AuditLog } from '../../types/index.ts';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  Eye,
  X,
  FileCode,
  Calendar,
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>(dbService.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [inspectedLog, setInspectedLog] = useState<AuditLog | null>(null);

  if (!currentUser) return null;

  const actions = ['ALL', ...Array.from(new Set(logs.map(l => l.action)))];

  const filteredLogs = logs.filter(l => {
    const matchesSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.actorName && l.actorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'ALL' || l.action === selectedAction;
    return matchesSearch && matchesAction;
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
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Compliance & Audit Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System Audit Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Immutable records of critical user actions, automatic mentor allocations, assessment changes, and overrides.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, actor name, or entity type..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">Action:</span>
          <select
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {actions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Target ID</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 font-sans">
                    {l.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-sans font-semibold">
                    {l.actorName || l.actorId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-sans">
                    {l.entityType}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 truncate max-w-[120px]">
                    {l.entityId || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <button
                      onClick={() => setInspectedLog(l)}
                      className="inline-flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800 cursor-pointer font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      <AnimatePresence>
        {inspectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setInspectedLog(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Audit Event Inspector
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-2">{inspectedLog.action}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actor: {inspectedLog.actorName} ({inspectedLog.actorId}) • Timestamp: {inspectedLog.timestamp}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700">Structured Event Payload</label>
                <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72">
                  {JSON.stringify(inspectedLog.details || {}, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInspectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
