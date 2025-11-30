import { useEffect } from "react";
import { Card, Typography, Grid } from "@mui/material";
import useDashboard from "../../hooks/useDashboard";
import Loader from "../../components/Loader";

const ManagerDashboard = () => {
  const { loadManagerStats, managerStats, loading } = useDashboard();

  useEffect(() => {
    loadManagerStats();
  }, []);

  if (loading) return <Loader />;

  const stats = managerStats?.stats || {};

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Manager Dashboard
      </Typography>

      <Grid container spacing={2}>
        {[
          { label: "Total Employees", value: stats.totalEmployees },
          { label: "Present Today", value: stats.presentToday },
          { label: "Late Today", value: stats.lateToday },
          { label: "Half Day Today", value: stats.halfDayToday },
          { label: "Absent Today", value: stats.absentToday }
        ].map((item, idx) => (
          <Grid item xs={12} md={3} key={idx}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4">{item.value ?? 0}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ManagerDashboard;
