import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logout } from "./authSlice";

interface logoState {
  filePath: string;
  loading: boolean;
  error: string | null;
}

const initialState: logoState = {
  filePath: "",
  loading: false,
  error: null,
};

export const PostLogo = createAsyncThunk(
  "logo/postLogo",
  async (fileForm: FormData, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/logo", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: fileForm,
      });

      if (response.status === 401) {
        dispatch(logout());
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error);
    }
  },
);

const logoSlice = createSlice({
  name: "logo",
  initialState,
  reducers: {
    // Action to save the token in the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(PostLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.filePath = action.payload.filePath;
      })
      .addCase(PostLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default logoSlice.reducer;
