import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'dark',
  notifications: {
    master: true,
    tests: { enabled: true, reminderBefore: 60, sound: true, vibrate: true },
    notes: { enabled: true, dailyDigest: false, digestTime: '20:00' },
    social: { enabled: true, discussions: true, doubts: true, announcements: false },
    marketing: false,
  },
  study: {
    dailyGoalMinutes: 120,
    autoPlayNext: true,
    showHints: true,
    fontScale: 'medium',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleNotification(s, a) {
      const path = a.payload;
      let ref = s.notifications;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = !ref[path[path.length - 1]];
    },
    updateNotification(s, a) {
      const { path, value } = a.payload;
      let ref = s.notifications;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
    },
    updateStudy(s, a) { s.study = { ...s.study, ...a.payload }; },
  },
});

export const { toggleNotification, updateNotification, updateStudy } = settingsSlice.actions;
export default settingsSlice.reducer;
