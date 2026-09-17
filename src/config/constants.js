export const APP_NAME = 'StudyCare';
export const APP_VERSION = '2.0.0';

// Class 9-12
export const CLASSES = [
  { id: '9',  label: 'Class 9',  color: '#00B894' },
  { id: '10', label: 'Class 10', color: '#0984E3' },
  { id: '11', label: 'Class 11', color: '#6C5CE7' },
  { id: '12', label: 'Class 12', color: '#FD79A8' },
];

// Stream (11-12 ke liye)
export const STREAMS = [
  { id: 'science', label: 'Science', icon: 'flask' },
  { id: 'commerce', label: 'Commerce', icon: 'briefcase' },
  { id: 'arts', label: 'Arts', icon: 'color-palette' },
];

// Subjects (class ke hisaab se)
export const SUBJECTS_BY_CLASS = {
  '9':  ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '10': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '11': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
  '12': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
};

// Sets (batch)
export const SETS = ['A', 'B', 'C', 'D'];

export const STORAGE_KEYS = {
  auth: '@sc_auth',
  user: '@sc_user',
  settings: '@sc_settings',
  contentQuestions: '@sc_content_questions',
  contentNotes: '@sc_content_notes',
  contentTests: '@sc_content_tests',
  contentMeta: '@sc_content_meta',
  bookmarks: '@sc_bookmarks',
  testHistory: '@sc_test_history',
  userPrefs: '@sc_user_prefs',
};

export const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/sadwaves9-lab/StudyCare/main/content';

export const CACHE_TTL_MS = 5 * 60 * 1000;
