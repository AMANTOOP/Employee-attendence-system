import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MarkAttendance from "./pages/employee/MarkAttendance";
import MyHistory from "./pages/employee/MyHistory";
import Profile from "./pages/employee/Profile";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AllEmployees from "./pages/manager/AllEmployees";
import TeamCalendar from "./pages/manager/TeamCalendar";
import Reports from "./pages/manager/Reports";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/auth/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* EMPLOYEE ROUTES */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute role="employee">
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/mark"
          element={
            <ProtectedRoute role="employee">
              <Layout>
              <MarkAttendance />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/history"
          element={
            <ProtectedRoute role="employee">
              <Layout>
              <MyHistory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute role="employee">
              <Layout>
              <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* MANAGER ROUTES */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute role="manager">
              <Layout>
              <ManagerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute role="manager">
              <Layout>
              <AllEmployees />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/calendar"
          element={
            <ProtectedRoute role="manager">
              <Layout>
              <TeamCalendar />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/reports"
          element={
            <ProtectedRoute role="manager">
              <Layout>
              <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
