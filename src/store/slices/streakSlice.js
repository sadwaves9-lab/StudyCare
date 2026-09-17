import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: 0,           // current streak days
  longest: 0,           // best streak
  lastDate: null,       // last check-in ISO date
  totalDays: 0,         // total active days
  calendar: [],         // last 30 days: [{date, active}]
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    hydrateStreak: (s, a) => ({ ...s, ...a.payload }),
    checkIn: (s) => {
      const today = new Date().toISOString().slice(0, 10);
      if (s.lastDate === today) return; // already checked in

      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      if (s.lastDate === yesterday) {
        s.current += 1;
      } else {
        s.current = 1;
      }

      if (s.current > s.longest) s.longest = s.current;
      s.lastDate = today;
      s.totalDays += 1;

      // Update calendar
      const day = { date: today, active: true };
      s.calendar = [day, ...s.calendar].slice(0, 30);
    },
    resetStreak: () => initialState,
  },
});

export const { hydrateStreak, checkIn, resetStreak } = streakSlice.actions;
export default streakSlice.reducer;
