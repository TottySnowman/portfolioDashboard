import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem('token');

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  username:string | null
}

const initialState: AuthState = {
  token: tokenFromStorage ? tokenFromStorage : null,
  loading: false,
  error: null,
  isAuthenticated: false,
  username: null
};


export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    requestBody: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("http://localhost:6001/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.text();
        return rejectWithValue(error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.Username;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;
