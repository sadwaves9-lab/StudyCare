import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadAllContent } from '../../services/contentService';

export const fetchContent = createAsyncThunk('content/fetch',
  async ({ force = false } = {}) => loadAllContent({ force }));

const initialState = {
  questions: [], notes: [], tests: [],
  loading: false, refreshing: false, fromCache: false, error: null,
};

const contentSlice = createSlice({
  name: 'content', initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchContent.pending, (s, a) => {
      if (a.meta.arg?.force) s.refreshing = true; else s.loading = true;
      s.error = null;
    })
    .addCase(fetchContent.fulfilled, (s, a) => {
      s.loading = false; s.refreshing = false;
      s.questions = a.payload.questions || [];
      s.notes = a.payload.notes || [];
      s.tests = a.payload.tests || [];
      s.fromCache = !!a.payload.fromCache;
      s.error = a.payload.error || null;
    })
    .addCase(fetchContent.rejected, (s, a) => {
      s.loading = false; s.refreshing = false;
      s.error = a.error.message;
    });
  },
});

export default contentSlice.reducer;
