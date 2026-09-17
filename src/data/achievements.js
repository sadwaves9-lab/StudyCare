export const ACHIEVEMENTS = [
  // Streak
  { id: 'streak_3',   category: 'streak', icon: 'flame', color: '#FD79A8',
    title: 'On Fire',        desc: '3 din ka streak',    target: 3,   reward: 50 },
  { id: 'streak_7',   category: 'streak', icon: 'flame', color: '#FD79A8',
    title: 'Week Warrior',   desc: '7 din ka streak',    target: 7,   reward: 150 },
  { id: 'streak_30',  category: 'streak', icon: 'flame', color: '#FDCB6E',
    title: 'Monthly Master', desc: '30 din ka streak',   target: 30,  reward: 500 },

  // Questions
  { id: 'q_10',  category: 'questions', icon: 'help-circle', color: '#6C5CE7',
    title: 'Curious Mind',   desc: '10 questions solve',  target: 10,  reward: 30 },
  { id: 'q_50',  category: 'questions', icon: 'help-circle', color: '#6C5CE7',
    title: 'Question Hunter', desc: '50 questions solve', target: 50,  reward: 100 },
  { id: 'q_200', category: 'questions', icon: 'help-circle', color: '#A29BFE',
    title: 'Knowledge Seeker', desc: '200 questions',    target: 200, reward: 500 },

  // Tests
  { id: 'test_1',   category: 'tests', icon: 'clipboard', color: '#00B894',
    title: 'First Test',    desc: 'Pehla test complete', target: 1,   reward: 20 },
  { id: 'test_10',  category: 'tests', icon: 'clipboard', color: '#00B894',
    title: 'Test Taker',    desc: '10 tests complete',   target: 10,  reward: 100 },
  { id: 'perfect',  category: 'tests', icon: 'trophy', color: '#FDCB6E',
    title: 'Perfect Score', desc: 'Test me 100%',        target: 1,   reward: 200 },

  // Notes
  { id: 'note_5',  category: 'notes', icon: 'book', color: '#0984E3',
    title: 'Reader',        desc: '5 notes padhe',       target: 5,   reward: 30 },
  { id: 'note_25', category: 'notes', icon: 'book', color: '#0984E3',
    title: 'Bookworm',      desc: '25 notes padhe',      target: 25,  reward: 150 },

  // Study Timer
  { id: 'focus_1', category: 'focus', icon: 'time', color: '#00D2D3',
    title: 'Focus Starter', desc: '1 pomodoro complete', target: 1,   reward: 20 },
  { id: 'focus_10', category: 'focus', icon: 'time', color: '#00D2D3',
    title: 'Deep Focus',    desc: '10 pomodoro',         target: 10,  reward: 100 },
  { id: 'focus_50', category: 'focus', icon: 'timer', color: '#6C5CE7',
    title: 'Focus Master',  desc: '50 pomodoro',         target: 50,  reward: 500 },
];

export const CATEGORIES = [
  { id: 'streak',    label: 'Streak',     icon: 'flame', color: '#FD79A8' },
  { id: 'questions', label: 'Questions',  icon: 'help-circle', color: '#6C5CE7' },
  { id: 'tests',     label: 'Tests',      icon: 'clipboard', color: '#00B894' },
  { id: 'notes',     label: 'Notes',      icon: 'book', color: '#0984E3' },
  { id: 'focus',     label: 'Focus',      icon: 'time', color: '#00D2D3' },
];

export function getAchievement(id) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
