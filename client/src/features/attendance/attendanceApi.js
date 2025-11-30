import api from "../../api/axios";

// Employee: Check In
export const checkInApi = async () => {
  const res = await api.post("/attendance/checkin");
  return res.data;
};

// Employee: Check Out
export const checkOutApi = async () => {
  const res = await api.post("/attendance/checkout");
  return res.data;
};

// Employee: My Attendance History
export const fetchMyHistoryApi = async () => {
  const res = await api.get("/attendance/my-history");
  return res.data;
};

// Employee: Monthly Summary
export const fetchMySummaryApi = async () => {
  const res = await api.get("/attendance/my-summary");
  return res.data;
};

// Manager: All Employees Attendance
export const fetchAllAttendanceApi = async () => {
  const res = await api.get("/attendance/all");
  return res.data;
};

// Manager: Team Summary
export const fetchTeamSummaryApi = async () => {
  const res = await api.get("/attendance/summary");
  return res.data;
};
