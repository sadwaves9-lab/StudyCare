import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import contentReducer from './slices/contentSlice';
import userPrefsReducer from './slices/userPrefsSlice';
import bookmarksReducer from './slices/bookmarksSlice';
import testHistoryReducer from './slices/testHistorySlice';
import languageReducer from './slices/languageSlice';
import streakReducer from './slices/streakSlice';
import achievementsReducer from './slices/achievementsSlice';
import rewardsReducer from './slices/rewardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    content: contentReducer,
    userPrefs: userPrefsReducer,
    bookmarks: bookmarksReducer,
    testHistory: testHistoryReducer,
    language: languageReducer,
    streak: streakReducer,
    achievements: achievementsReducer,
    rewards: rewardsReducer,
  },
  middleware: (gdm) => gdm({ serializableCheck: false }),
});

export default store;
