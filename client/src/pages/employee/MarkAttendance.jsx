import { useDispatch } from "react-redux";
import { Button, Typography, Card } from "@mui/material";
import api from "../../api/axios";

const MarkAttendance = () => {
  const dispatch = useDispatch();

  const checkIn = async () => {
    await api.post("/attendance/checkin");
    alert("Checked In");
  };

  const checkOut = async () => {
    await api.post("/attendance/checkout");
    alert("Checked Out");
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>Mark Attendance</Typography>

      <Card sx={{ padding: 3, width: 300 }}>
        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={checkIn}>
          Check In
        </Button>

        <Button variant="outlined" fullWidth onClick={checkOut}>
          Check Out
        </Button>
      </Card>
    </div>
  );
};

export default MarkAttendance;
