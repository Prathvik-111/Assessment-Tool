/**
 * SmartAssess AI: Dynamic AI Question Generator
 * Generates randomized, unique assessment items on-the-fly for each quiz attempt.
 * Features customizable difficulty, algorithmic code puzzles, and conceptual diagnostics.
 */

import { Question, QuestionType, DifficultyLevel } from '../types/index.ts';

interface QuestionTemplate {
  topic: string;
  generate: () => {
    questionText: string;
    questionType: QuestionType;
    difficulty: DifficultyLevel;
    options: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
  };
}

const GENERATOR_TEMPLATES: Record<string, QuestionTemplate[]> = {
  'mod-py-04': [
    {
      topic: 'Loops and Functions',
      generate: () => {
        const step = Math.floor(Math.random() * 3) + 2;
        const limit = step * (Math.floor(Math.random() * 4) + 3);
        const correctCount = Math.floor(limit / step);
        return {
          questionText: `What is the total number of iterations performed by the loop: for i in range(0, ${limit}, ${step}): pass?`,
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'MEDIUM',
          options: [`${correctCount}`, `${correctCount - 1}`, `${correctCount + 1}`, `${limit}`].sort(() => Math.random() - 0.5),
          correctAnswer: `${correctCount}`,
          explanation: `The range starts at 0 up to strictly less than ${limit} stepping by ${step}, resulting in exactly ${correctCount} iterations.`,
          points: 15,
        };
      },
    },
    {
      topic: 'Recursion Base Cases',
      generate: () => {
        const n = Math.floor(Math.random() * 3) + 3;
        const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1);
        const ans = factorial(n);
        return {
          questionText: `Consider def fact(n): return 1 if n <= 1 else n * fact(n - 1). What is fact(${n})?`,
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'HARD',
          options: [`${ans}`, `${ans * 2}`, `${ans - 2}`, `${ans + 4}`].sort(() => Math.random() - 0.5),
          correctAnswer: `${ans}`,
          explanation: `Recursive descent evaluates ${n}! which expands to ${ans}.`,
          points: 20,
        };
      },
    },
    {
      topic: 'Default Mutable Arguments',
      generate: () => {
        const val1 = Math.floor(Math.random() * 5) + 1;
        const val2 = Math.floor(Math.random() * 5) + 6;
        return {
          questionText: `In Python, if def append_item(x, l=[]): l.append(x); return l is called as append_item(${val1}) then append_item(${val2}), what does the second call return?`,
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'HARD',
          options: [`[${val1}, ${val2}]`, `[${val2}]`, `[${val1}]`, `TypeError`].sort(() => Math.random() - 0.5),
          correctAnswer: `[${val1}, ${val2}]`,
          explanation: 'Default argument lists in Python are bound once at function definition time; state mutates across subsequent invocations.',
          points: 25,
        };
      },
    },
    {
      topic: 'Loop Invariants',
      generate: () => {
        const threshold = Math.floor(Math.random() * 5) + 5;
        return {
          questionText: `In the while-loop "x = 0; while x < ${threshold}: x += 2", what will be the final value of x after termination?`,
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          options: [
            `${threshold % 2 === 0 ? threshold : threshold + 1}`,
            `${threshold - 1}`,
            `${threshold * 2}`,
            `Infinite Loop`
          ].sort(() => Math.random() - 0.5),
          correctAnswer: `${threshold % 2 === 0 ? threshold : threshold + 1}`,
          explanation: `The variable increments by 2 each iteration until reaching or exceeding ${threshold}.`,
          points: 15,
        };
      },
    },
  ],
  'default': [
    {
      topic: 'General Algorithmic Logic',
      generate: () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 5) + 2;
        const result = a % b;
        return {
          questionText: `What is the value of expression (${a} % ${b}) in standard programming syntax?`,
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          options: [`${result}`, `${Math.floor(a / b)}`, `${a * b}`, `${result + 1}`].sort(() => Math.random() - 0.5),
          correctAnswer: `${result}`,
          explanation: `The modulus operator calculates the integer remainder: ${a} divided by ${b} yields remainder ${result}.`,
          points: 10,
        };
      },
    },
    {
      topic: 'Time Complexity',
      generate: () => {
        const options = ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'];
        return {
          questionText: 'What is the average case search time complexity for looking up a hash key in a balanced dictionary?',
          questionType: 'MULTIPLE_CHOICE',
          difficulty: 'MEDIUM',
          options,
          correctAnswer: 'O(1)',
          explanation: 'Hash tables offer amortized constant time O(1) key lookups with negligible collision frequency.',
          points: 20,
        };
      },
    },
  ],
};

export class AiQuestionGenerator {
  /**
   * Generates a randomized set of AI questions for an assessment attempt.
   */
  public static generateRandomizedQuestions(moduleId?: string, count = 4): Question[] {
    const templates = (moduleId && GENERATOR_TEMPLATES[moduleId]) 
      ? [...GENERATOR_TEMPLATES[moduleId], ...GENERATOR_TEMPLATES['default']]
      : GENERATOR_TEMPLATES['default'];

    const questions: Question[] = [];
    const usedTitles = new Set<string>();

    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const item = template.generate();

      // Avoid identical questions in single attempt
      if (usedTitles.has(item.questionText) && templates.length > 2) {
        continue;
      }
      usedTitles.add(item.questionText);

      questions.push({
        id: `ai-q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        moduleId,
        questionText: `[AI Dynamic] ${item.questionText}`,
        questionType: item.questionType,
        difficulty: item.difficulty,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        points: item.points,
        createdAt: new Date().toISOString(),
      });
    }

    return questions;
  }
}
