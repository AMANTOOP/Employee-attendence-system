import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDashboardThunk,
  fetchManagerDashboardThunk,
} from "../features/dashboard/dashboardSlice";

const useDashboard = () => {
  const dispatch = useDispatch();

  const { loading, employeeStats, managerStats } = useSelector((s) => s.dashboard);

  return {
    loading,
    employeeStats,
    managerStats,

    loadEmployeeStats: () => dispatch(fetchEmployeeDashboardThunk()),
    loadManagerStats: () => dispatch(fetchManagerDashboardThunk()),
  };
};

export default useDashboard;
