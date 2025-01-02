import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logout } from "./authSlice";

interface cvState {
  loading: boolean;
  error: string | null;
}

export interface cvUploadModel {
  language: string;
  fileForm: FormData;
}

const initialState: cvState = {
  loading: false,
  error: null,
};

export const CheckExistingCv = createAsyncThunk(
  "cv/checkExisting",
  async (language: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:6001/cv/${language}/cv.pdf`,
        {
          method: "HEAD",
        },
      );

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

export const PostCv = createAsyncThunk(
  "cv/postCv",
  async (
    uploadProps: cvUploadModel,
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/cv", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Accept-Language": uploadProps.language,
        },
        body: uploadProps.fileForm,
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
      .addCase(CheckExistingCv.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(CheckExistingCv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(PostCv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostCv.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(PostCv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cvSlice.reducer;
