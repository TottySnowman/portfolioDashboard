import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logout } from "./authSlice";

export interface Tag {
  TagId: number;
  Tag: string;
  Icon: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

export const getTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/tag", {
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

export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (id: number, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/tag/" + id, {
        method: "DELETE",
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

      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tag: Omit<Tag, "TagId">, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(tag),
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

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    // Action to save the token in the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter((tag) => tag.TagId !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action);
        state.tags = [...state.tags, action.payload];
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tagSlice.reducer;
