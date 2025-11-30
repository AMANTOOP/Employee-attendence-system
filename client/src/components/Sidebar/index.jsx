import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const employeeMenu = [
    { name: "Dashboard", path: "/employee/dashboard" },
    { name: "Mark Attendance", path: "/employee/mark" },
    { name: "My History", path: "/employee/history" },
    { name: "Profile", path: "/employee/profile" },
  ];

  const managerMenu = [
    { name: "Dashboard", path: "/manager/dashboard" },
    { name: "All Employees", path: "/manager/employees" },
    { name: "Team Calendar", path: "/manager/calendar" },
    { name: "Reports", path: "/manager/reports" },
  ];

  const menu = user?.role === "manager" ? managerMenu : employeeMenu;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box" },
      }}
    >
      <List sx={{ mt: 8 }}>
        {menu.map((item) => (
          <ListItemButton key={item.name} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
