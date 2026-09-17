import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [], // array of {id, testName, subject, date, correct, total, timeTaken, when}
};

const testHistorySlice = createSlice({
  name: 'testHistory',
  initialState,
  reducers: {
    addResult: (s, a) => {
      s.results.unshift(a.payload);
      if (s.results.length > 100) s.results.pop();
    },
    hydrateHistory: (s, a) => ({ ...s, ...a.payload }),
    clearHistory: () => initialState,
  },
});

export const { addResult, hydrateHistory, clearHistory } = testHistorySlice.actions;
export default testHistorySlice.reducer;
