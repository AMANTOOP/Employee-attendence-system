import { Typography, Card } from "@mui/material";

const TeamCalendar = () => {
  return (
    <div>
      <Typography variant="h4" mb={3}>Team Calendar View</Typography>

      <Card sx={{ p: 3 }}>
        Calendar integration can be added (FullCalendar or React Big Calendar).
      </Card>
    </div>
  );
};

export default TeamCalendar;
