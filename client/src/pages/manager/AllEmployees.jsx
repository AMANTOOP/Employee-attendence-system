import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const AllEmployees = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/attendance/all").then(res => setData(res.data.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>All Employees Attendance</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.user?.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllEmployees;
