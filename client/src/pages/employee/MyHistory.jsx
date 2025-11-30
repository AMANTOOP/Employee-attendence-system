import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const MyHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/attendance/my-history").then(res => setHistory(res.data.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>My Attendance History</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Check In</TableCell>
            <TableCell>Check Out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((h) => (
            <TableRow key={h._id}>
              <TableCell>{h.date}</TableCell>
              <TableCell>{h.status}</TableCell>
              <TableCell>{h.checkInTime}</TableCell>
              <TableCell>{h.checkOutTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyHistory;
