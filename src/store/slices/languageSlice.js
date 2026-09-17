import { createSlice } from '@reduxjs/toolkit';
import { setLanguage } from '../../i18n';

const languageSlice = createSlice({
  name: 'language',
  initialState: { code: 'en' },
  reducers: {
    changeLanguage: (s, a) => {
      s.code = a.payload;
      setLanguage(a.payload);
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
