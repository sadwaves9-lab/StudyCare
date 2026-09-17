/**
 * Content Schema 2.0 — Enhanced structure
 * Supports:
 * - Questions: class, set, subject, chapter, difficulty, tags, videoId
 * - Notes: same + keyTerms, videoId, attachments
 * - Tests: same + totalQuestions, videoIds
 */

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export function validateQuestion(q) {
  const errors = [];
  if (!q.question) errors.push('question required');
  if (!q.options || q.options.length !== 4) errors.push('4 options required');
  if (!['A', 'B', 'C', 'D'].includes(q.answer)) errors.push('answer must be A/B/C/D');
  return { valid: errors.length === 0, errors };
}

export function validateNote(n) {
  const errors = [];
  if (!n.title) errors.push('title required');
  if (!n.body) errors.push('body required');
  return { valid: errors.length === 0, errors };
}

export function normalizeQuestion(q) {
  return {
    id: q.id || `q_${Date.now()}`,
    class: String(q.class || ''),
    set: q.set || 'A',
    subject: (q.subject || '').toLowerCase(),
    chapter: q.chapter || '',
    question: q.question || '',
    options: q.options || ['', '', '', ''],
    answer: q.answer || 'A',
    explanation: q.explanation || '',
    difficulty: q.difficulty || DIFFICULTY.MEDIUM,
    tags: q.tags || [],
    videoId: q.videoId || null,
    createdAt: q.createdAt || new Date().toISOString(),
  };
}

export function normalizeNote(n) {
  return {
    id: n.id || `n_${Date.now()}`,
    class: String(n.class || ''),
    set: n.set || 'A',
    subject: (n.subject || '').toLowerCase(),
    chapter: n.chapter || '',
    title: n.title || '',
    body: n.body || '',
    keyTerms: n.keyTerms || [],
    videoId: n.videoId || null,
    attachments: n.attachments || [],
    createdAt: n.createdAt || new Date().toISOString(),
  };
}

export default {
  DIFFICULTY,
  validateQuestion, validateNote,
  normalizeQuestion, normalizeNote,
};
