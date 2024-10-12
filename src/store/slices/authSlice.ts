import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null, // JWT token
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to save the token in the state
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
