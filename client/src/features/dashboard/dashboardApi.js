import api from "../../api/axios";

// Employee Dashboard
export const fetchEmployeeDashboardApi = async (month) => {
  const res = await api.get(`/dashboard/employee?month=${month}`);
  return res.data;
};

// Manager Dashboard
export const fetchManagerDashboardApi = async () => {
  const res = await api.get(`/dashboard/manager`);
  return res.data;
};

// Weekly Trend (chart)
export const fetchWeeklyTrendApi = async (days = 7) => {
  const res = await api.get(`/dashboard/weekly-trend?days=${days}`);
  return res.data;
};

// Department-wise attendance (chart)
export const fetchDepartmentWiseApi = async (dateOrMonth) => {
  const res = await api.get(`/dashboard/department-wise?month=${dateOrMonth}`);
  return res.data;
};
