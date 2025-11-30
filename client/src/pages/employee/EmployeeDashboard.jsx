import { useEffect } from "react";
import { Grid, Card, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import useDashboard from "../../hooks/useDashboard";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";

const EmployeeDashboard = () => {
  const {
    loadEmployeeStats,
    employeeStats,
    loading
  } = useDashboard();

  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadEmployeeStats(month);
  }, []);

  if (loading) return <Loader />;

  const stats = employeeStats?.stats || {};

  const chartData = {
    labels: ["Present", "Late", "Half-Day", "Absent"],
    datasets: [
      {
        label: "Monthly Summary",
        backgroundColor: ["#4caf50", "#ffb300", "#ff9800", "#f44336"],
        data: [
          stats.present || 0,
          stats.late || 0,
          stats.halfDay || 0,
          stats.absent || 0
        ],
      },
    ],
  };

  return (
    <>
      <Typography variant="h4" mb={3}>
        Employee Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* TODAY STATUS */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ p: 3, backgroundColor: "#1976d2", color: "#fff" }}>
            <Typography variant="h6">Today</Typography>
            <Typography variant="h4">{stats.status || "N/A"}</Typography>
          </Card>
        </Grid>

        {/* MONTH SUMMARY CARDS */}
        {[
          { label: "Present", value: stats.present, color: "#4caf50" },
          { label: "Late", value: stats.late, color: "#ffb300" },
          { label: "Half Day", value: stats.halfDay, color: "#ff9800" },
          { label: "Absent", value: stats.absent, color: "#f44336" },
        ].map((e) => (
          <Grid size={{ xs: 12, md: 3 }} key={e.label}>
            <Card sx={{ p: 3, backgroundColor: e.color, color: "#fff" }}>
              <Typography variant="h6">{e.label}</Typography>
              <Typography variant="h4">{e.value || 0}</Typography>
            </Card>
          </Grid>
        ))}

        {/* TOTAL HOURS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Total Hours</Typography>
            <Typography variant="h4">{stats.totalHours || 0}</Typography>
          </Card>
        </Grid>

        {/* MONTHLY SUMMARY CHART */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Monthly Summary
            </Typography>
            <Bar data={chartData} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDashboard;
