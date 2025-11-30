const express = require("express");
const router = express.Router();

// Controllers
const {
  getEmployeeDashboard,
  getManagerDashboard,
} = require("../controllers/dashboard.controller");

// Middleware (optional but recommended)
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

module.exports = router;
