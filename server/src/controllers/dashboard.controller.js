const Attendance = require("../models/Attendance");
const User = require("../models/User");
const attendanceService = require("../services/attendance.service");

/**
 * ============================================================
 * EMPLOYEE DASHBOARD CONTROLLER
 * GET /api/dashboard/employee
 * Query: ?month=YYYY-MM
 * ============================================================
 */
exports.getEmployeeDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // YYYY-MM

    if (!month) {
      return res
        .status(400)
        .json({ message: "month (YYYY-MM) query param is required" });
    }

    const records = await Attendance.find({
      userId,
      date: { $regex: `^${month}` },
    });

    const stats = {
      present: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    records.forEach((r) => {
      if (r.status === "present") stats.present++;
      if (r.status === "late") stats.late++;
      if (r.status === "half-day") stats.halfDay++;
      if (r.totalHours) stats.totalHours += r.totalHours;
    });

    stats.totalHours = Math.round(stats.totalHours * 100) / 100;

    res.json({
      success: true,
      month,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ============================================================
 * MANAGER DASHBOARD CONTROLLER
 * GET /api/dashboard/manager
 * ============================================================
 */
exports.getManagerDashboard = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const totalEmployees = await User.countDocuments({ role: "employee" });

    const rows = await Attendance.find({ date: today }).populate(
      "userId",
      "name employeeId department"
    );

    const stats = {
      totalEmployees,
      presentToday: rows.filter((r) => r.status === "present").length,
      lateToday: rows.filter((r) => r.status === "late").length,
      halfDayToday: rows.filter((r) => r.status === "half-day").length,
      absentToday: Math.max(0, totalEmployees - rows.length),
    };

    const absentEmployees = await User.find({
      role: "employee",
      _id: { $nin: rows.map((x) => x.userId._id) },
    }).select("name employeeId department");

    res.json({
      success: true,
      date: today,
      stats,
      absentEmployees,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ============================================================
 * WEEKLY TREND (Manager)
 * GET /api/dashboard/weekly-trend?days=7
 * ============================================================
 */
exports.getWeeklyTrend = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 7;

    const trend = await attendanceService.getWeeklyTrend(days);

    res.json({
      success: true,
      days,
      trend,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ============================================================
 * DEPARTMENT-WISE ATTENDANCE (Manager)
 * GET /api/dashboard/department-wise?month=YYYY-MM
 * OR
 * GET /api/dashboard/department-wise?date=YYYY-MM-DD
 * ============================================================
 */
exports.getDepartmentWise = async (req, res, next) => {
  try {
    const { month, date } = req.query;

    if (!month && !date) {
      return res.status(400).json({
        message: "Provide either month=YYYY-MM or date=YYYY-MM-DD",
      });
    }

    const departments = await attendanceService.getDepartmentWise({
      month,
      date,
    });

    res.json({
      success: true,
      range: month || date,
      departments,
    });
  } catch (err) {
    next(err);
  }
};
