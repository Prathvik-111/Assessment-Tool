/**
 * SmartAssess AI: Teacher Question Bank (Aesthetic Mild Light Theme)
 * Section 6 implementation:
 * - Create Multiple Choice, True/False, and Short Answer questions
 * - Module tagging, difficulty levels (EASY, MEDIUM, HARD), marks allocation, and answer explanations
 * - Searchable and filterable question repository
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext.tsx';
import { dbService } from '../../services/db.ts';
import { Question, QuestionType, DifficultyLevel } from '../../types/index.ts';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Tag,
  Award,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';

export const QuestionBank: React.FC = () => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(dbService.getQuestions());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Form State
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [points, setPoints] = useState(10);
  const [optionsStr, setOptionsStr] = useState('Option A, Option B, Option C, Option D');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');

  const courses = currentUser ? dbService.getTeacherCourses(currentUser.id) : [];
  const allModules = courses.flatMap(c => dbService.getModulesByCourse(c.id));

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !questionText.trim() || !correctAnswer.trim()) return;

    let parsedOptions: string[] | undefined = undefined;
    if (questionType === 'MULTIPLE_CHOICE') {
      parsedOptions = optionsStr.split(',').map(s => s.trim()).filter(Boolean);
    } else if (questionType === 'TRUE_FALSE') {
      parsedOptions = ['True', 'False'];
    }

    const newQ = dbService.createQuestion({
      moduleId: selectedModuleId || undefined,
      questionText,
      questionType,
      difficulty,
      options: parsedOptions,
      correctAnswer,
      explanation,
      points: Number(points),
    }, currentUser.id);

    setQuestions([...dbService.getQuestions()]);
    setShowCreateModal(false);

    // Reset Form
    setQuestionText('');
    setCorrectAnswer('');
    setExplanation('');
    setPoints(10);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.correctAnswer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'ALL' || q.questionType === selectedType;
    return matchesSearch && matchesDiff && matchesType;
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Institutional Question Bank</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, categorize, and maintain curriculum items for automated quizzes and midterm assessments.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by keyword or topic..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Types</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3.5">
        {filteredQuestions.map((q, idx) => {
          const mod = allModules.find(m => m.id === q.moduleId);

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-indigo-600 text-xs">#{idx + 1}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {q.questionType.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        q.difficulty === 'EASY'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : q.difficulty === 'MEDIUM'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    {mod && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        {mod.title.split(':')[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm leading-relaxed pt-1">
                    {q.questionText}
                  </h3>
                </div>

                <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Weight</span>
                  <span className="font-bold text-slate-900 text-xs">{q.points} pts</span>
                </div>
              </div>

              {/* Options display */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-600'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explanation */}
              {q.explanation && (
                <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 leading-relaxed">
                  <span className="font-bold text-slate-700">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Create Question Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Item Bank Builder
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">Create Assessment Question</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter the question text or problem formulation..."
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Question Type</label>
                    <select
                      value={questionType}
                      onChange={e => setQuestionType(e.target.value as QuestionType)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Points / Marks</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={points}
                      onChange={e => setPoints(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                {allModules.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Module</label>
                    <select
                      value={selectedModuleId}
                      onChange={e => setSelectedModuleId(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="">General / None</option>
                      {allModules.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {questionType === 'MULTIPLE_CHOICE' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Options (Comma separated)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Option A, Option B, Option C, Option D"
                      value={optionsStr}
                      onChange={e => setOptionsStr(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correct Answer (Exact match)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tuple, .py, or True"
                    value={correctAnswer}
                    onChange={e => setCorrectAnswer(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Explanation / Solution Walkthrough</label>
                  <textarea
                    rows={2}
                    placeholder="Explain why this answer is correct for student review..."
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow cursor-pointer transition"
                  >
                    Save Question
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
