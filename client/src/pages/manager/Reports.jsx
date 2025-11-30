import { useState } from "react";
import api from "../../api/axios";
import { Typography, Button, TextField, Card } from "@mui/material";

const Reports = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const exportCSV = async () => {
    window.open(`${import.meta.env.VITE_API_URL}/attendance/export?from=${dateRange.from}&to=${dateRange.to}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>Reports</Typography>

      <Card sx={{ padding: 3, width: 400 }}>
        <TextField
          fullWidth
          type="date"
          label="From"
          margin="dense"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="date"
          label="To"
          margin="dense"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <Button sx={{ mt: 2 }} variant="contained" fullWidth onClick={exportCSV}>
          Export CSV
        </Button>
      </Card>
    </div>
  );
};

export default Reports;
