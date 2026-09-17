export const VIDEO_LESSONS = [
  { id: 'v1', class: '11', subject: 'physics', chapter: 'Laws of Motion',
    title: 'Newton Laws of Motion', channel: 'Khan Academy',
    ytId: 'kKKM8Y-u7ds', duration: '12:30' },
  { id: 'v2', class: '11', subject: 'physics', chapter: 'Motion in a Straight Line',
    title: 'Kinematics explained', channel: 'Physics Wallah',
    ytId: 'ZM8ECpBuQYE', duration: '45:00' },
  { id: 'v3', class: '12', subject: 'physics', chapter: 'Electrostatics',
    title: 'Coulomb Law', channel: 'Khan Academy',
    ytId: 'kE3Q4L5-Q1Y', duration: '8:42' },
  { id: 'v4', class: '12', subject: 'physics', chapter: 'Current Electricity',
    title: 'Ohm Law basics', channel: 'Vedantu',
    ytId: 'HsLLq6Rm5tU', duration: '15:20' },
  { id: 'v5', class: '11', subject: 'chemistry', chapter: 'Structure of Atom',
    title: 'Atomic structure', channel: 'Khan Academy',
    ytId: 'kE3Q4L5-Q1Y', duration: '18:40' },
  { id: 'v6', class: '12', subject: 'chemistry', chapter: 'Solutions',
    title: 'Molarity & Molality', channel: 'Physics Wallah',
    ytId: 'd8xgFIrCdfM', duration: '22:10' },
  { id: 'v7', class: '10', subject: 'math', chapter: 'Quadratic Equations',
    title: 'Quadratic formula', channel: 'Khan Academy',
    ytId: 'IlNAJl36-10', duration: '16:12' },
  { id: 'v8', class: '12', subject: 'math', chapter: 'Integrals',
    title: 'Integration basics', channel: 'Vedantu',
    ytId: 'rfG8ce4nNh0', duration: '25:00' },
  { id: 'v9', class: '10', subject: 'science', chapter: 'Light',
    title: 'Reflection & Refraction', channel: 'Khan Academy',
    ytId: 'Yf9TVIgWDsM', duration: '14:20' },
  { id: 'v10', class: '5', subject: 'math', chapter: 'Multiplication',
    title: 'Tables 1-10', channel: 'Kids Academy',
    ytId: 'qXK4YYWEK9c', duration: '8:00' },
];

export function getVideosFor(classId, subject, chapter) {
  return VIDEO_LESSONS.filter((v) => {
    if (classId && String(v.class) !== String(classId)) return false;
    if (subject && String(v.subject).toLowerCase() !== String(subject).toLowerCase()) return false;
    if (chapter && String(v.chapter).toLowerCase() !== String(chapter).toLowerCase()) return false;
    return true;
  });
}

export function getYouTubeThumbnail(ytId) {
  return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
}

export function getYouTubeUrl(ytId) {
  return `https://www.youtube.com/watch?v=${ytId}`;
}
