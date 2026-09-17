import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthed: false, loading: false },
  reducers: {
    setUser(s, a) { s.user = a.payload; s.isAuthed = !!a.payload; },
    clearUser(s) { s.user = null; s.isAuthed = false; },
    setLoading(s, a) { s.loading = a.payload; },
  },
});
export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
