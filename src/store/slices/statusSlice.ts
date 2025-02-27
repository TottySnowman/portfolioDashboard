import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logout } from "./authSlice";

export interface status {
  StatusID: number;
  Status: string;
}

interface statusState {
  status: status[];
  loading: boolean;
  error: string | null;
}

const initialState: statusState = {
  status: [],
  loading: false,
  error: null,
};

export const getStatus = createAsyncThunk(
  "status/fetchStatus",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch(`${import.meta.env.VITE_API_URL}status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.status === 401) {
        dispatch(logout());
        return;
      }

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

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    // Action to save the token in the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(getStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statusSlice.reducer;

