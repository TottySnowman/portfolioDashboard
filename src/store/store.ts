import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Assuming authSlice is in the same folder
import projectReducer from './slices/projectSlice'
import tagReducer from './slices/tagSlice'

const store = configureStore({
  reducer: {
    auth: authReducer, // Add more slices here if needed
    project: projectReducer,
    tag: tagReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
