import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './features/Email/EmailSlice';

export const store = configureStore({
  reducer: {
    emails: emailReducer,
  },
});
