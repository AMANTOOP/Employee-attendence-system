import { useDispatch, useSelector } from "react-redux";
import {
  loadEmployeeDashboard,
  loadManagerDashboard,
  loadWeeklyTrend,
  loadDepartmentWise
} from "../features/dashboard/dashboardSlice";

const useDashboard = () => {
  const dispatch = useDispatch();

  const {
    loading,
    employeeStats,
    managerStats,
    weeklyTrend,
    departmentWise
  } = useSelector((s) => s.dashboard);

  return {
    loading,
    employeeStats,
    managerStats,
    weeklyTrend,
    departmentWise,

    loadEmployeeStats: (month) => dispatch(loadEmployeeDashboard(month)),
    loadManagerStats: () => dispatch(loadManagerDashboard()),
    loadWeeklyTrend: () => dispatch(loadWeeklyTrend()),
    loadDepartmentWise: (month) => dispatch(loadDepartmentWise(month))
  };
};

export default useDashboard;
