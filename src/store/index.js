import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import contentReducer from './slices/contentSlice';

export const store = configureStore({
  reducer: { auth: authReducer, settings: settingsReducer, content: contentReducer },
  middleware: (gdm) => gdm({ serializableCheck: false }),
});

export default store;
