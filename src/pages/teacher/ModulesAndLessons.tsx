/**
 * SmartAssess AI: Teacher Modules & Lessons Management (Aesthetic Mild Light Theme)
 * Section 5 implementation:
 * - Create and organize modules
 * - Add lessons with materials (Article, Video, PDF, Document, Practice)
 * - Configure module weights and learning sequences
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Course, Module, Lesson, MaterialType } from '../../types/index.ts';
import {
  Layers,
  Plus,
  PlayCircle,
  FileText,
  Clock,
  CheckCircle,
  X,
  BookOpen,
} from 'lucide-react';

export const ModulesAndLessons: React.FC = () => {
  const { currentUser } = useAuth();
  const courses = currentUser ? dbService.getTeacherCourses(currentUser.id) : [];
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string>('');

  // Module form state
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleWeight, setModuleWeight] = useState(15);

  // Lesson form state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>('ARTICLE');
  const [durationMinutes, setDurationMinutes] = useState(20);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const modules = currentCourse ? dbService.getModulesByCourse(currentCourse.id) : [];

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse || !moduleTitle.trim()) return;

    dbService.createModule({
      courseId: currentCourse.id,
      title: moduleTitle,
      description: moduleDescription,
      weightPercentage: Number(moduleWeight),
    }, currentUser.id);

    setShowAddModuleModal(false);
    setModuleTitle('');
    setModuleDescription('');
    setFeedbackMsg('Module created successfully.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModuleId || !lessonTitle.trim()) return;

    dbService.createLesson({
      moduleId: targetModuleId,
      title: lessonTitle,
      content: lessonContent,
      materialType,
      durationMinutes: Number(durationMinutes),
    }, currentUser.id);

    setShowAddLessonModal(false);
    setLessonTitle('');
    setLessonContent('');
    setFeedbackMsg('Lesson added to module successfully.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Modules & Lessons Architecture</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Structure course syllabi into modular units with embedded readings, video lectures, and practice drills.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {courses.length > 1 && (
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowAddModuleModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </div>
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

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((mod, idx) => {
          const lessons = dbService.getLessonsByModule(mod.id);

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition"
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-200/60">
                <div className="flex items-start space-x-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{mod.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 font-medium shadow-2xs">
                    Weight: {mod.weightPercentage}%
                  </span>

                  <button
                    onClick={() => {
                      setTargetModuleId(mod.id);
                      setShowAddLessonModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 text-indigo-700 text-xs font-semibold cursor-pointer transition shadow-2xs"
                  >
                    + Add Lesson
                  </button>
                </div>
              </div>

              {/* Lessons within this module */}
              <div className="p-4 sm:p-5 space-y-2 bg-white">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Curriculum Lessons ({lessons.length})
                </div>

                {lessons.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-2">
                    No lessons created yet. Click "+ Add Lesson" to upload reading material or videos.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {lesson.materialType === 'VIDEO' ? (
                            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                              <PlayCircle className="w-4 h-4 text-rose-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-indigo-600" />
                            </div>
                          )}
                          <div className="truncate font-semibold text-slate-800">{lesson.title}</div>
                        </div>

                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium shrink-0 ml-2">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.durationMinutes}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Module Modal */}
      <AnimatePresence>
        {showAddModuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddModuleModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateModule} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Curriculum Module
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Add Course Module</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Module Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Module 7: Network Socket Programming"
                    value={moduleTitle}
                    onChange={e => setModuleTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Summarize key learning objectives for this module..."
                    value={moduleDescription}
                    onChange={e => setModuleDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Weight (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={moduleWeight}
                    onChange={e => setModuleWeight(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModuleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Save Module
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Lesson Modal */}
      <AnimatePresence>
        {showAddLessonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddLessonModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Lesson Builder
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Add Lesson to Module</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7.1 TCP Handshake & Sockets in Python"
                    value={lessonTitle}
                    onChange={e => setLessonTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Material Type</label>
                    <select
                      value={materialType}
                      onChange={e => setMaterialType(e.target.value as MaterialType)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="ARTICLE">Article / Interactive Text</option>
                      <option value="VIDEO">Video Lecture</option>
                      <option value="PDF">PDF Slide Deck</option>
                      <option value="DOCUMENT">Code Walkthrough / Doc</option>
                      <option value="PRACTICE">Hands-on Practice Drill</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Learning Content / Explanatory Text</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter full technical lesson content, code explanations, or reading material..."
                    value={lessonContent}
                    onChange={e => setLessonContent(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLessonModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Save Lesson
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
