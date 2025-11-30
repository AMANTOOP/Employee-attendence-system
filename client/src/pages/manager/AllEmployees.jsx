import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Card,
  Button
} from "@mui/material";
import Loader from "../../components/Loader";

const AllEmployees = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({
    employeeId: "",
    status: "",
    from: "",
    to: ""
  });

  const loadData = async () => {
    setLoading(true);

    const query = new URLSearchParams(filters).toString();
    const res = await api.get(`/attendance/all?${query}`);

    setAttendance(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Typography variant="h4" mb={3}>All Employees Attendance</Typography>

      <Card sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Employee ID"
          value={filters.employeeId}
          onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
          sx={{ mr: 2 }}
        />

        <TextField
          label="Status"
          select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          sx={{ mr: 2, width: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="present">Present</MenuItem>
          <MenuItem value="late">Late</MenuItem>
          <MenuItem value="half-day">Half Day</MenuItem>
          <MenuItem value="absent">Absent</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          sx={{ mr: 2 }}
        />

        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          sx={{ mr: 2 }}
        />

        <Button variant="contained" onClick={loadData}>Apply Filters</Button>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Check In</TableCell>
            <TableCell>Check Out</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {attendance.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.userId.name} ({row.userId.employeeId})</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{new Date(row.checkInTime).toLocaleTimeString() || "-"}</TableCell>
              <TableCell>{new Date(row.checkOutTime).toLocaleTimeString() || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllEmployees;
