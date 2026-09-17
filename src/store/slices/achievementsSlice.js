import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unlocked: [],   // array of achievement ids
  progress: {},   // { achId: currentValue }
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    hydrateAchievements: (s, a) => ({ ...s, ...a.payload }),
    updateProgress: (s, a) => {
      const { id, value } = a.payload;
      s.progress[id] = Math.max(s.progress[id] || 0, value);
    },
    unlock: (s, a) => {
      if (!s.unlocked.includes(a.payload)) s.unlocked.push(a.payload);
    },
    resetAchievements: () => initialState,
  },
});

export const { hydrateAchievements, updateProgress, unlock, resetAchievements } =
  achievementsSlice.actions;
export default achievementsSlice.reducer;
