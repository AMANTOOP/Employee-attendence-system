import { useState } from "react";
import api from "../../api/axios";
import { Typography, Card, TextField, Button } from "@mui/material";

const Reports = () => {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    employeeId: "",
  });

  const downloadCSV = async () => {
    try {
      const query = new URLSearchParams(filters).toString();

      const response = await api.get(`/attendance/export?${query}`, {
        responseType: "blob", // important
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Attendance Reports
      </Typography>

      <Card sx={{ p: 3, width: 400 }}>
        <TextField
          label="Employee ID"
          value={filters.employeeId}
          onChange={(e) =>
            setFilters({ ...filters, employeeId: e.target.value })
          }
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button variant="contained" fullWidth onClick={downloadCSV}>
          Export CSV
        </Button>
      </Card>
    </div>
  );
};

export default Reports;
