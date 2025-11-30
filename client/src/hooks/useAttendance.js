import { useDispatch, useSelector } from "react-redux";
import {
  checkInThunk,
  checkOutThunk,
  fetchMyHistoryThunk,
  fetchMySummaryThunk,
  fetchAllAttendanceThunk,
  fetchTeamSummaryThunk,
} from "../features/attendance/attendanceSlice";

const useAttendance = () => {
  const dispatch = useDispatch();

  const {
    loading,
    myHistory,
    mySummary,
    allAttendance,
    teamSummary,
  } = useSelector((s) => s.attendance);

  return {
    loading,
    myHistory,
    mySummary,
    allAttendance,
    teamSummary,

    // Action Methods
    checkIn: () => dispatch(checkInThunk()),
    checkOut: () => dispatch(checkOutThunk()),
    loadMyHistory: () => dispatch(fetchMyHistoryThunk()),
    loadMySummary: () => dispatch(fetchMySummaryThunk()),
    loadAllAttendance: () => dispatch(fetchAllAttendanceThunk()),
    loadTeamSummary: () => dispatch(fetchTeamSummaryThunk()),
  };
};

export default useAttendance;
