import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../features/auth/authSlice";
import { Button, TextField, Card, Typography } from "@mui/material";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: ""
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(registerThunk(form));
    alert("Registered successfully! You can now login.");
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ width: 400, padding: 3 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Register
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
            label="Employee ID"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />

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
      </Card>
    </div>
  );
};

export default Register;
