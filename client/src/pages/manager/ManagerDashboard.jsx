import { Typography, Card, Grid } from "@mui/material";

const ManagerDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>Manager Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6">Team Overview</Typography>
            <Typography>Total Employees • Present Today • Absent Today</Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ManagerDashboard;
