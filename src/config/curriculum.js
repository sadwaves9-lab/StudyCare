// ============================================================
//  StudyCare Curriculum — Class 1 to 12 + Graduation
//  NCERT / CBSE / University
// ============================================================

export const CLASSES = [
  { id: '1',    label: 'Class 1',    color: '#FF6B6B', group: 'primary' },
  { id: '2',    label: 'Class 2',    color: '#FDCB6E', group: 'primary' },
  { id: '3',    label: 'Class 3',    color: '#00B894', group: 'primary' },
  { id: '4',    label: 'Class 4',    color: '#00CEC9', group: 'primary' },
  { id: '5',    label: 'Class 5',    color: '#0984E3', group: 'primary' },
  { id: '6',    label: 'Class 6',    color: '#6C5CE7', group: 'middle' },
  { id: '7',    label: 'Class 7',    color: '#A29BFE', group: 'middle' },
  { id: '8',    label: 'Class 8',    color: '#FD79A8', group: 'middle' },
  { id: '9',    label: 'Class 9',    color: '#00B894', group: 'secondary' },
  { id: '10',   label: 'Class 10',   color: '#0984E3', group: 'secondary' },
  { id: '11',   label: 'Class 11',   color: '#6C5CE7', group: 'senior' },
  { id: '12',   label: 'Class 12',   color: '#FD79A8', group: 'senior' },
  { id: 'bsc',  label: 'B.Sc.',      color: '#00B894', group: 'grad' },
  { id: 'bcom', label: 'B.Com.',     color: '#FDCB6E', group: 'grad' },
  { id: 'ba',   label: 'B.A.',       color: '#E17055', group: 'grad' },
];

export const STREAMS = [
  { id: 'science',  label: 'Science',  icon: 'flask-outline',         color: '#00B894' },
  { id: 'commerce', label: 'Commerce', icon: 'briefcase-outline',     color: '#FDCB6E' },
  { id: 'arts',     label: 'Arts',     icon: 'color-palette-outline', color: '#FD79A8' },
];

export const SCIENCE_GROUPS = [
  { id: 'pcm',  label: 'PCM',   desc: 'Physics + Chemistry + Math',    forCareer: 'Engineering' },
  { id: 'pcb',  label: 'PCB',   desc: 'Physics + Chemistry + Biology', forCareer: 'Medical' },
  { id: 'pcmb', label: 'PCMB',  desc: 'All four subjects',             forCareer: 'Both' },
];

export const GRAD_STREAMS = {
  bsc: [
    { id: 'physics',   name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'math',      name: 'Mathematics' },
    { id: 'botany',    name: 'Botany' },
    { id: 'zoology',   name: 'Zoology' },
    { id: 'cs',        name: 'Computer Science' },
  ],
  bcom: [
    { id: 'accounting',  name: 'Financial Accounting' },
    { id: 'economics',   name: 'Economics' },
    { id: 'bst',         name: 'Business Studies' },
    { id: 'statistics',  name: 'Business Statistics' },
    { id: 'taxation',    name: 'Taxation' },
    { id: 'law',         name: 'Business Law' },
  ],
  ba: [
    { id: 'history',    name: 'History' },
    { id: 'polsci',     name: 'Political Science' },
    { id: 'economics',  name: 'Economics' },
    { id: 'sociology',  name: 'Sociology' },
    { id: 'psychology', name: 'Psychology' },
    { id: 'english',    name: 'English Literature' },
    { id: 'hindi',      name: 'Hindi Literature' },
  ],
};

// ---- Primary (1-5) common subjects ----
const SUBJECTS_PRIMARY = [
  { id: 'english', name: 'English' },
  { id: 'hindi',   name: 'Hindi' },
  { id: 'math',    name: 'Mathematics' },
  { id: 'evs',     name: 'EVS' },
  { id: 'gk',      name: 'General Knowledge' },
];

// ---- Middle (6-8) ----
const SUBJECTS_MIDDLE = [
  { id: 'english', name: 'English' },
  { id: 'hindi',   name: 'Hindi' },
  { id: 'math',    name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'sst',     name: 'Social Science' },
  { id: 'sanskrit',name: 'Sanskrit' },
];

// ---- 9-10 ----
const SUBJECTS_9_10 = [
  { id: 'math',    name: 'Mathematics',     theory: 80, practical: 20 },
  { id: 'science', name: 'Science',         theory: 80, practical: 20 },
  { id: 'sst',     name: 'Social Science',  theory: 80, practical: 20 },
  { id: 'english', name: 'English',         theory: 80, practical: 20 },
  { id: 'hindi',   name: 'Hindi',           theory: 80, practical: 20 },
  { id: 'it',      name: 'Computer / IT',   theory: 50, practical: 50 },
];

// ---- 11-12 Science ----
const SUBJECTS_SCIENCE = [
  { id: 'physics',   name: 'Physics',           theory: 70, practical: 30 },
  { id: 'chemistry', name: 'Chemistry',         theory: 70, practical: 30 },
  { id: 'math',      name: 'Mathematics',       theory: 80, practical: 20 },
  { id: 'biology',   name: 'Biology',           theory: 70, practical: 30 },
  { id: 'cs',        name: 'Computer Science',  theory: 70, practical: 30 },
  { id: 'pe',        name: 'Physical Education',theory: 70, practical: 30 },
];

const SUBJECTS_COMMERCE = [
  { id: 'accountancy', name: 'Accountancy',      theory: 80, practical: 20 },
  { id: 'bst',         name: 'Business Studies', theory: 80, practical: 20 },
  { id: 'economics',   name: 'Economics',        theory: 80, practical: 20 },
  { id: 'math',        name: 'Mathematics',      theory: 80, practical: 20 },
  { id: 'ip',          name: 'Informatics Prac', theory: 70, practical: 30 },
  { id: 'entre',       name: 'Entrepreneurship', theory: 70, practical: 30 },
];

const SUBJECTS_ARTS = [
  { id: 'history',    name: 'History',            theory: 80, practical: 20 },
  { id: 'polsci',     name: 'Political Science',  theory: 80, practical: 20 },
  { id: 'geography',  name: 'Geography',          theory: 70, practical: 30 },
  { id: 'economics',  name: 'Economics',          theory: 80, practical: 20 },
  { id: 'psychology', name: 'Psychology',         theory: 80, practical: 20 },
  { id: 'sociology',  name: 'Sociology',          theory: 80, practical: 20 },
  { id: 'pe',         name: 'Physical Education', theory: 70, practical: 30 },
];

export const LANGUAGES = [
  { id: 'english',  name: 'English',  optional: false },
  { id: 'hindi',    name: 'Hindi',    optional: true  },
  { id: 'urdu',     name: 'Urdu',     optional: true  },
  { id: 'sanskrit', name: 'Sanskrit', optional: true  },
];

export const SETS = ['A', 'B', 'C', 'D'];

// ============================================================
//  MAIN SUBJECT LOOKUP
// ============================================================
export function getSubjectsFor(classId, stream, scienceGroup) {
  const c = String(classId || '');

  if (['1', '2', '3', '4', '5'].includes(c)) return [...SUBJECTS_PRIMARY];
  if (['6', '7', '8'].includes(c))            return [...SUBJECTS_MIDDLE];
  if (['9', '10'].includes(c))                return [...SUBJECTS_9_10];

  if (c === '11' || c === '12') {
    if (stream === 'science') {
      let list = [...SUBJECTS_SCIENCE];
      if (scienceGroup === 'pcm')  list = list.filter((s) => ['physics', 'chemistry', 'math', 'cs', 'pe'].includes(s.id));
      if (scienceGroup === 'pcb')  list = list.filter((s) => ['physics', 'chemistry', 'biology', 'pe'].includes(s.id));
      return list;
    }
    if (stream === 'commerce') return [...SUBJECTS_COMMERCE];
    if (stream === 'arts')     return [...SUBJECTS_ARTS];
    return [];
  }

  if (['bsc', 'bcom', 'ba'].includes(c)) return GRAD_STREAMS[c] || [];

  return [];
}

export function needsStream(classId) {
  const c = String(classId);
  return c === '11' || c === '12';
}

export function needsScienceGroup(stream) {
  return stream === 'science';
}

export function needsSet(classId) {
  const c = String(classId);
  return ['1', '2', '3', '4', '5'].includes(c) ? false : true;
}

export function getClassLabel(classId) {
  return CLASSES.find((c) => String(c.id) === String(classId))?.label || `Class ${classId}`;
}

export default {
  CLASSES, STREAMS, SCIENCE_GROUPS, GRAD_STREAMS, LANGUAGES, SETS,
  getSubjectsFor, needsStream, needsScienceGroup, needsSet, getClassLabel,
};
