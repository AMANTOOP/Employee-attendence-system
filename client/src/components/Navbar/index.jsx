import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ background: "#1a73e8" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer" }}>
          Employee Attendance System
        </Typography>

        <div>
          <Typography 
            variant="body1" 
            sx={{ mr: 2, display: "inline" }}
          >
            {user?.name} ({user?.role})
          </Typography>

          <Button 
            variant="contained" 
            color="warning" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
