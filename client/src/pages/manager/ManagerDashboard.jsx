import { useEffect } from "react";
import { Grid, Card, Typography, List, ListItem, Avatar } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import useDashboard from "../../hooks/useDashboard";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";

const ManagerDashboard = () => {
  const {
    loadManagerStats,
    loadWeeklyTrend,
    loadDepartmentWise,
    managerStats,
    weeklyTrend,
    departmentWise,
    loading
  } = useDashboard();

  useEffect(() => {
    loadManagerStats();
    loadWeeklyTrend();
    loadDepartmentWise(new Date().toISOString().slice(0, 7));
  }, []);

  if (loading) return <Loader />;

  const stats = managerStats?.stats || {};

  const weeklyChart = {
    labels: weeklyTrend?.map((d) => d.date),
    datasets: [
      {
        label: "Present",
        data: weeklyTrend?.map((d) => d.present),
        backgroundColor: "#1976d2",
      },
    ],
  };

  const deptChart = {
    labels: departmentWise?.map((d) => d.department),
    datasets: [
      {
        label: "Present",
        data: departmentWise?.map((d) => d.present),
        backgroundColor: ["#2196f3", "#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  return (
    <>
      <Typography variant="h4" mb={3}>
        Manager Dashboard
      </Typography>

      <Grid container spacing={3}>
        {[
          { label: "Total Employees", value: stats.totalEmployees, color: "#1976d2" },
          { label: "Present Today", value: stats.presentToday, color: "#4caf50" },
          { label: "Late Today", value: stats.lateToday, color: "#ff9800" },
          { label: "Absent Today", value: stats.absentToday, color: "#f44336" },
        ].map((e) => (
          <Grid key={e.label} size={{ xs: 12, md: 3 }}>
            <Card sx={{ p: 3, backgroundColor: e.color, color: "#fff" }}>
              <Typography variant="h6">{e.label}</Typography>
              <Typography variant="h4">{e.value || 0}</Typography>
            </Card>
          </Grid>
        ))}

        {/* WEEKLY TREND */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Weekly Attendance Trend
            </Typography>
            <Bar data={weeklyChart} />
          </Card>
        </Grid>

        {/* DEPARTMENT CHART */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Department-wise Attendance
            </Typography>
            <Pie data={deptChart} />
          </Card>
        </Grid>

        {/* ABSENT EMPLOYEE LIST */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Absent Employees Today</Typography>
            <List>
              {managerStats.absentEmployees?.length ? (
                managerStats.absentEmployees.map((emp) => (
                  <ListItem key={emp.employeeId}>
                    <Avatar sx={{ mr: 1 }}>{emp.name[0]}</Avatar>
                    {emp.name} ({emp.employeeId})
                  </ListItem>
                ))
              ) : (
                <Typography>No one absent 🎉</Typography>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ManagerDashboard;
