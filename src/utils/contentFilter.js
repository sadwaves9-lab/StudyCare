// ============================================================
//  contentFilter.js — STRICT filter
//  Question sirf us class+subject+set me dikhega jisme add hui
// ============================================================

/**
 * Strict match: item.class MUST equal user.classId
 */
function matchClass(item, classId) {
  if (!item.class) return true; // purana content bina class
  return String(item.class) === String(classId);
}

function matchSet(item, set) {
  if (!item.set) return true;
  if (!set) return true;
  return String(item.set) === String(set);
}

function matchSubject(item, userSubjects) {
  if (!item.subject) return true;
  if (!userSubjects || userSubjects.length === 0) return true;
  const sub = String(item.subject).toLowerCase().trim();
  return userSubjects.some((s) => String(s).toLowerCase().trim() === sub);
}

export function filterQuestions(questions = [], prefs = {}) {
  const { classId, subjects = [], set } = prefs;
  return questions.filter((q) =>
    matchClass(q, classId) && matchSet(q, set) && matchSubject(q, subjects)
  );
}

export function filterNotes(notes = [], prefs = {}) {
  const { classId, subjects = [], set } = prefs;
  return notes.filter((n) =>
    matchClass(n, classId) && matchSet(n, set) && matchSubject(n, subjects)
  );
}

export function filterTests(tests = [], prefs = {}) {
  const { classId, subjects = [], set } = prefs;
  return tests.filter((t) =>
    matchClass(t, classId) && matchSet(t, set) && matchSubject(t, subjects)
  );
}

export function getContentCounts(allContent = {}, prefs = {}) {
  return {
    questions: filterQuestions(allContent.questions, prefs).length,
    notes: filterNotes(allContent.notes, prefs).length,
    tests: filterTests(allContent.tests, prefs).length,
  };
}

export default { filterQuestions, filterNotes, filterTests, getContentCounts };
