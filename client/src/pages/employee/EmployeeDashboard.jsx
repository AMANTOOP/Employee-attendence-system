import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserThunk } from "../../features/auth/authSlice";
import { Typography, Card, Grid } from "@mui/material";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadUserThunk());
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>Employee Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6">Welcome, {user?.name}</Typography>
            <Typography>Role: Employee</Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default EmployeeDashboard;
