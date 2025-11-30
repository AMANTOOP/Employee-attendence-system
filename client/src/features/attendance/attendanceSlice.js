import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkInApi,
  checkOutApi,
  fetchMyHistoryApi,
  fetchMySummaryApi,
  fetchAllAttendanceApi,
  fetchTeamSummaryApi,
} from "./attendanceApi";

// ----------------- Thunks -----------------

export const checkInThunk = createAsyncThunk(
  "attendance/checkIn",
  async (_, { rejectWithValue }) => {
    try {
      return await checkInApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Check-in failed");
    }
  }
);

export const checkOutThunk = createAsyncThunk(
  "attendance/checkOut",
  async (_, { rejectWithValue }) => {
    try {
      return await checkOutApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Check-out failed");
    }
  }
);

export const fetchMyHistoryThunk = createAsyncThunk(
  "attendance/fetchMyHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyHistoryApi();
    } catch (err) {
      return rejectWithValue("Failed to fetch attendance history");
    }
  }
);

export const fetchMySummaryThunk = createAsyncThunk(
  "attendance/fetchMySummary",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMySummaryApi();
    } catch (err) {
      return rejectWithValue("Failed to fetch monthly summary");
    }
  }
);

export const fetchAllAttendanceThunk = createAsyncThunk(
  "attendance/fetchAllAttendance",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllAttendanceApi();
    } catch (err) {
      return rejectWithValue("Failed to fetch all employees attendance");
    }
  }
);

export const fetchTeamSummaryThunk = createAsyncThunk(
  "attendance/fetchTeamSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTeamSummaryApi();
    } catch (err) {
      return rejectWithValue("Failed to fetch team summary");
    }
  }
);

// ----------------- Initial State -----------------

const initialState = {
  loading: false,
  myHistory: [],
  mySummary: {},
  allAttendance: [],
  teamSummary: {},
  error: null,
};

// ----------------- Slice -----------------

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Check In
    builder.addCase(checkInThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkInThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(checkInThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Check Out
    builder.addCase(checkOutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkOutThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(checkOutThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // My History
    builder.addCase(fetchMyHistoryThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyHistoryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.myHistory = action.payload.data;
    });
    builder.addCase(fetchMyHistoryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // My Summary
    builder.addCase(fetchMySummaryThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMySummaryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.mySummary = action.payload.data;
    });
    builder.addCase(fetchMySummaryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // All Attendance
    builder.addCase(fetchAllAttendanceThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllAttendanceThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.allAttendance = action.payload.data;
    });
    builder.addCase(fetchAllAttendanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Team Summary
    builder.addCase(fetchTeamSummaryThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTeamSummaryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.teamSummary = action.payload.data;
    });
    builder.addCase(fetchTeamSummaryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// ----------------- Export Reducer -----------------

export default attendanceSlice.reducer;
