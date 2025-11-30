const express = require("express");
const router = express.Router();

// Controllers
const {
  getEmployeeDashboard,
  getManagerDashboard,
  getWeeklyTrend,
  getDepartmentWise,
} = require("../controllers/dashboard.controller");

// Middleware
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * Employee Dashboard
 * GET /api/dashboard/employee
 */
router.get(
  "/employee",
  authMiddleware,
  roleMiddleware("employee"),
  getEmployeeDashboard
);

/**
 * Manager Dashboard
 * GET /api/dashboard/manager
 */
router.get(
  "/manager",
  authMiddleware,
  roleMiddleware("manager"),
  getManagerDashboard
);

/**
 * Weekly Trend (Manager)
 * GET /api/dashboard/weekly-trend?days=7
 */
router.get(
  "/weekly-trend",
  authMiddleware,
  roleMiddleware("manager"),
  getWeeklyTrend
);

/**
 * Department-wise Attendance (Manager)
 * GET /api/dashboard/department-wise?month=YYYY-MM
 * OR
 * GET /api/dashboard/department-wise?date=YYYY-MM-DD
 */
router.get(
  "/department-wise",
  authMiddleware,
  roleMiddleware("manager"),
  getDepartmentWise
);

module.exports = router;
