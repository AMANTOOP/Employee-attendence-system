import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployeeDashboardApi,
  fetchManagerDashboardApi,
  fetchWeeklyTrendApi,
  fetchDepartmentWiseApi
} from "./dashboardApi";

// Employee Dashboard Stats
export const loadEmployeeDashboard = createAsyncThunk(
  "dashboard/employee",
  async (month, { rejectWithValue }) => {
    try {
      return await fetchEmployeeDashboardApi(month);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

// Manager Dashboard Stats
export const loadManagerDashboard = createAsyncThunk(
  "dashboard/manager",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchManagerDashboardApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

// Weekly trend chart
export const loadWeeklyTrend = createAsyncThunk(
  "dashboard/weeklyTrend",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchWeeklyTrendApi();
    } catch (err) {
      return rejectWithValue("Error loading weekly trend");
    }
  }
);

// Department-wise chart
export const loadDepartmentWise = createAsyncThunk(
  "dashboard/departmentWise",
  async (month, { rejectWithValue }) => {
    try {
      return await fetchDepartmentWiseApi(month);
    } catch (err) {
      return rejectWithValue("Error loading department data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    employeeStats: {},
    managerStats: {},
    weeklyTrend: [],
    departmentWise: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employee
      .addCase(loadEmployeeDashboard.pending, (s) => { s.loading = true })
      .addCase(loadEmployeeDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.employeeStats = a.payload;
      })
      .addCase(loadEmployeeDashboard.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Manager
      .addCase(loadManagerDashboard.pending, (s) => { s.loading = true })
      .addCase(loadManagerDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.managerStats = a.payload;
      })
      .addCase(loadManagerDashboard.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Weekly Trend
      .addCase(loadWeeklyTrend.fulfilled, (s, a) => {
        s.weeklyTrend = a.payload.trend;
      })

      // Department-wise
      .addCase(loadDepartmentWise.fulfilled, (s, a) => {
        s.departmentWise = a.payload.departments;
      });
  },
});

export default dashboardSlice.reducer;
