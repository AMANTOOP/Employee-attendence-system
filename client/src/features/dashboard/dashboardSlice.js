import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEmployeeStatsApi, fetchManagerStatsApi } from "./dashboardApi";

// ----------- THUNKS -------------
export const fetchEmployeeDashboardThunk = createAsyncThunk(
  "dashboard/fetchEmployeeStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEmployeeStatsApi();
    } catch (err) {
      return rejectWithValue("Failed to load employee dashboard stats");
    }
  }
);

export const fetchManagerDashboardThunk = createAsyncThunk(
  "dashboard/fetchManagerStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchManagerStatsApi();
    } catch (err) {
      return rejectWithValue("Failed to load manager dashboard stats");
    }
  }
);

// ----------- INITIAL STATE -------------

const initialState = {
  loading: false,
  employeeStats: {}, // will store {stats:{}}
  managerStats: {},  // will store {stats:{}}
  error: null
};

// ----------- SLICE -------------

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Employee Dashboard
    builder
      .addCase(fetchEmployeeDashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeStats = action.payload; // {stats:{}}
      })
      .addCase(fetchEmployeeDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Manager Dashboard
    builder
      .addCase(fetchManagerDashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManagerDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.managerStats = action.payload; // {stats:{}}
      })
      .addCase(fetchManagerDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
