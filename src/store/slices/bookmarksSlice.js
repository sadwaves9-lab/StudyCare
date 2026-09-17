import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],       // array of note ids
  questions: [],   // array of question ids
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmarkNote: (s, a) => {
      const i = s.notes.indexOf(a.payload);
      if (i >= 0) s.notes.splice(i, 1);
      else s.notes.push(a.payload);
    },
    toggleBookmarkQuestion: (s, a) => {
      const i = s.questions.indexOf(a.payload);
      if (i >= 0) s.questions.splice(i, 1);
      else s.questions.push(a.payload);
    },
    hydrateBookmarks: (s, a) => ({ ...s, ...a.payload }),
    clearBookmarks: () => initialState,
  },
});

export const {
  toggleBookmarkNote, toggleBookmarkQuestion,
  hydrateBookmarks, clearBookmarks,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
