import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logout } from "./authSlice";

export interface knowledge {
  pointId: string;
  Prompt: string;
}

export interface knowledgeDeleteModel{
  pointId:string
}

interface knowledgeState {
  knowledges: knowledge[];
  loading: boolean;
  error: string | null;
}

const initialState: knowledgeState = {
  knowledges: [],
  loading: false,
  error: null,
};

export const getKnowledge = createAsyncThunk(
  "knowledge/fetchKnowledge",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/knowledge", {
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

export const deleteKnowledge = createAsyncThunk(
  "knowledge/deleteKnowledge",
  async (deleteModel: knowledgeDeleteModel, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/knowledge", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(deleteModel)
      });

      if (response.status === 401) {
        dispatch(logout());
        return;
      }

      if (!response.ok) {
        const error = await response.text();
        return rejectWithValue(error);
      }

      return deleteModel.pointId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createKnowledge = createAsyncThunk(
  "tags/createTag",
  async (
    knowledge: knowledge,
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(knowledge),
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

export const updateKnowledge = createAsyncThunk(
  "knowledge/updateKnowledge",
  async (knowledge: knowledge, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/knowledge", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(knowledge),
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

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState,
  reducers: {
    // Action to save the token in the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKnowledge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKnowledge.fulfilled, (state, action) => {
        state.loading = false;
        state.knowledges = action.payload;
      })
      .addCase(getKnowledge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteKnowledge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteKnowledge.fulfilled, (state, action) => {
        state.loading = false;
        state.knowledges = state.knowledges.filter(
          (knowledge) => knowledge.pointId !== action.payload,
        );
      })
      .addCase(deleteKnowledge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateKnowledge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKnowledge.fulfilled, (state, action) => {
        state.loading = false;
        let knowledgeWithout = state.knowledges.filter(
          (knowledge) => knowledge.pointId !== action.payload.pointId,
        );
        state.knowledges = [...knowledgeWithout, action.payload];
      })
      .addCase(updateKnowledge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createKnowledge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKnowledge.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action);
        state.knowledges = [...state.knowledges, action.payload];
      })
      .addCase(createKnowledge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default knowledgeSlice.reducer;
