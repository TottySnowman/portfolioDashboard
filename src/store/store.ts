import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Assuming authSlice is in the same folder

const store = configureStore({
  reducer: {
    auth: authReducer, // Add more slices here if needed
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
