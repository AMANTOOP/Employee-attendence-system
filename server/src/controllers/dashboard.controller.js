const Attendance = require('../models/Attendance');
const User = require("../models/User");

exports.getEmployeeDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // YYYY-MM
    if (!month) {
      return res.status(400).json({ message: 'month (YYYY-MM) required' });
    }

    const records = await Attendance.find({
      userId,
      date: { $regex: `^${month}` }
    });

    const stats = {
      present: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0
    };

    records.forEach(r => {
      if (r.status === 'present') stats.present++;
      if (r.status === 'late') stats.late++;
      if (r.status === 'half-day') stats.halfDay++;
      if (r.totalHours) stats.totalHours += r.totalHours;
    });

    res.json({ stats });
  } catch (err) {
    next(err);
  }
};

exports.getManagerDashboard = async (req, res, next) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const today = new Date();
    const day = today.toISOString().slice(0, 10); // YYYY-MM-DD

    const users = await User.find({ role: 'employee' });
    const all = await Attendance.find({ date: day });

    const totalEmployees = users.length;

    const stats = {
      totalEmployees,
      presentToday: all.filter(r => r.status === 'present').length,
      lateToday: all.filter(r => r.status === 'late').length,
      halfDayToday: all.filter(r => r.status === 'half-day').length,
      absentToday: totalEmployees - all.length
    };

    res.json({ stats });
  } catch (err) {
    next(err);
  }
};
