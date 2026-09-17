import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classId: null,          // '9' | '10' | '11' | '12'
  stream: null,           // 'science' | 'commerce' | 'arts'
  scienceGroup: null,     // 'pcm' | 'pcb' | 'pcmb'
  subjects: [],           // selected subject ids like ['physics','chemistry']
  languages: ['english'], // language ids
  set: 'A',               // 'A' | 'B' | 'C' | 'D'
};

const userPrefsSlice = createSlice({
  name: 'userPrefs',
  initialState,
  reducers: {
    setClass: (s, a) => { s.classId = a.payload; },
    setStream: (s, a) => { s.stream = a.payload; },
    setScienceGroup: (s, a) => { s.scienceGroup = a.payload; },
    setSubjects: (s, a) => { s.subjects = a.payload; },
    toggleSubject: (s, a) => {
      const i = s.subjects.indexOf(a.payload);
      if (i >= 0) s.subjects.splice(i, 1);
      else s.subjects.push(a.payload);
    },
    setLanguages: (s, a) => { s.languages = a.payload; },
    toggleLanguage: (s, a) => {
      const i = s.languages.indexOf(a.payload);
      if (i >= 0) s.languages.splice(i, 1);
      else s.languages.push(a.payload);
    },
    setSet: (s, a) => { s.set = a.payload; },
    resetPrefs: () => initialState,
    hydratePrefs: (s, a) => ({ ...s, ...a.payload }),
  },
});

export const {
  setClass, setStream, setScienceGroup,
  setSubjects, toggleSubject,
  setLanguages, toggleLanguage,
  setSet, resetPrefs, hydratePrefs,
} = userPrefsSlice.actions;

export default userPrefsSlice.reducer;
