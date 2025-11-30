import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEmployeeStatsApi, fetchManagerStatsApi } from "./dashboardApi";

// ----------------- Thunks -----------------

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

// ----------------- Initial State -----------------

const initialState = {
  loading: false,

  // Employee Stats
  employeeStats: {
    todayStatus: null,
    present: 0,
    absent: 0,
    late: 0,
    totalHours: 0,
    last7Days: [],
  },

  // Manager Stats
  managerStats: {
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    weeklyTrend: [],
    departmentWise: [],
  },

  error: null,
};

// ----------------- Slice -----------------

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Employee Stats
    builder.addCase(fetchEmployeeDashboardThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEmployeeDashboardThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.employeeStats = action.payload.data;
    });
    builder.addCase(fetchEmployeeDashboardThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Manager Stats
    builder.addCase(fetchManagerDashboardThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchManagerDashboardThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.managerStats = action.payload.data;
    });
    builder.addCase(fetchManagerDashboardThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// ----------------- Export Reducer -----------------

export default dashboardSlice.reducer;
