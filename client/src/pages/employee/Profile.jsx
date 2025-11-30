import { useSelector } from "react-redux";
import { Typography, Card } from "@mui/material";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" mb={2}>Profile</Typography>

      <Card sx={{ padding: 3, width: 350 }}>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Employee ID: {user?.employeeId}</Typography>
        <Typography>Department: {user?.department}</Typography>
      </Card>
    </div>
  );
};

export default Profile;
