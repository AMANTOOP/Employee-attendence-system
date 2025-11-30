import { useEffect, useState } from "react";
import { Button, Typography, Card, CircularProgress } from "@mui/material";
import Layout from "../../components/Layout";
import api from "../../api/axios";

const MarkAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch today's attendance
  const loadTodayStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get("/attendance/today");
      setToday(res.data);
      setMessage(res.data.status);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTodayStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await api.post("/attendance/checkin");
      setMessage(res.data.message);
      loadTodayStatus();
    } catch (err) {
      alert("Error while checking in");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await api.post("/attendance/checkout");
      setMessage(res.data.message);
      loadTodayStatus();
    } catch (err) {
      alert("Error while checking out");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // Extract backend values
  const checkInTime = today?.checkInTime;
  const checkOutTime = today?.checkOutTime;

  // Button states (backend driven)
  const canCheckIn = !checkInTime;
  const canCheckOut = checkInTime && !checkOutTime;

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Card sx={{ p: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h4" mb={2}>
          Mark Attendance
        </Typography>

        {/* Status Display */}
        <Typography variant="h6" color="primary" mb={2}>
          {today?.status}
        </Typography>

        {/* Check In Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          disabled={!canCheckIn}
          onClick={handleCheckIn}
        >
          {canCheckIn ? "Check In" : "Already Checked In"}
        </Button>

        {/* Check Out Button */}
        <Button
          fullWidth
          variant="outlined"
          disabled={!canCheckOut}
          onClick={handleCheckOut}
        >
          {canCheckOut ? "Check Out" : "Already Checked Out"}
        </Button>

        {/* Time Details */}
        <div style={{ marginTop: 20 }}>
          <Typography variant="body2">
            <strong>Check In:</strong>{" "}
            {checkInTime ? new Date(checkInTime).toLocaleTimeString() : "-"}
          </Typography>

          <Typography variant="body2">
            <strong>Check Out:</strong>{" "}
            {checkOutTime ? new Date(checkOutTime).toLocaleTimeString() : "-"}
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default MarkAttendance;
