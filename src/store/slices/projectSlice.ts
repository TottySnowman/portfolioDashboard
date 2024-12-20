import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logout } from "./authSlice";
import { Tag } from "./tagSlice";

export interface ProjectStatus {
  StatusID: number;
  Status: string;
}

export interface Project {
  ProjectID: number;
  Name: string;
  About: string;
  Demo_Link: string | null;
  Github_Link: string | null;
  Status: ProjectStatus;
  Logo_Path: string | null;
  DevDate: Date;
  Hidden: boolean;
  Tags: Tag[]
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const getProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/project", {
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

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: number, { rejectWithValue, getState, dispatch }) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/project/" + id, {
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

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (
    project: Omit<Project, "ProjectID">,
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const authState = (getState() as RootState).auth;
      const token = authState.token;
      const response = await fetch("http://localhost:6001/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(project),
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

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Action to save the token in the state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project.ProjectID !== action.payload,
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = [...state.projects, action.payload];
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
