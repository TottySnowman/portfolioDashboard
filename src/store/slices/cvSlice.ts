import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface cvState {
  loading: boolean;
  error: string | null;
}

const initialState: cvState = {
  loading: false,
  error: null,
};

export const CheckExistingCv = createAsyncThunk(
  "cv/checkExisting",
  async (language: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:6001/cv/${language}/cv.pdf`, {
        method: "HEAD",
      });

      if (!response.ok) {
        return rejectWithValue("");
      }

      return `http://localhost:6001/cv/${language}/cv.pdf`;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CheckExistingCv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckExistingCv.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action);
      })
      .addCase(CheckExistingCv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cvSlice.reducer;
