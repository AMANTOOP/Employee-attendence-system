import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../features/auth/authSlice";
import {
  Button,
  TextField,
  Card,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "",
    role: "employee",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(registerThunk(form));

    alert("Registered successfully! You can now login.");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 400, padding: 3 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Register
        </Typography>

        {/* Render free-tier info */}
        <Typography
          variant="body2"
          sx={{ color: "black", mb: 2, textAlign: "center" }}
        >
          **Note : If registering after a long time, please wait around a minute —
          backend on Render free tier wakes from sleep.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />

          {/* Role Selection */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Navigation buttons */}
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={() => navigate("/")}>
            Home
          </Button>

          <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>
            Login
          </Button>
        </Stack>
      </Card>
    </div>
  );
};

export default Register;
