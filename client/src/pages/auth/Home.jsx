import { Button, Typography, Card, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
        padding: 2,
      }}
    >
      <Card
        elevation={6}
        sx={{
          padding: 5,
          width: "90%",
          maxWidth: 550,
          textAlign: "center",
          borderRadius: 4,
          backgroundColor: "white",
          animation: "fadeIn 0.8s ease",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3183/3183351.png"
          alt="attendance"
          style={{ width: 120, marginBottom: 20 }}
        />

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Employee Attendance System
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          A modern and smart attendance tracking system for employees and managers.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ minWidth: 120 }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/register")}
            sx={{ minWidth: 120 }}
          >
            Register
          </Button>
        </Box>
      </Card>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            0%   { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default Home;
