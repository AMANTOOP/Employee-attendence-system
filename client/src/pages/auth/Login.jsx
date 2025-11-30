import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, Typography } from "@mui/material";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginThunk(form));

    if (res.meta.requestStatus === "rejected") return;

    if (!res.payload) return;

    const role = res.payload.role;

    if (role === "manager") navigate("/manager/dashboard");
    else navigate("/employee/dashboard");
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
      <Card sx={{ width: 350, padding: 3 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
