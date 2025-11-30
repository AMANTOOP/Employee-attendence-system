import api from "../../api/axios";

// Employee Dashboard Stats
export const fetchEmployeeStatsApi = async () => {
  const res = await api.get("/dashboard/employee");
  return res.data;
};

// Manager Dashboard Stats
export const fetchManagerStatsApi = async () => {
  const res = await api.get("/dashboard/manager");
  return res.data;
};
