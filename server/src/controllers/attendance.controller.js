// src/controllers/attendance.controller.js
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const attendanceService = require("../services/attendance.service");

const OFFICE_START = process.env.OFFICE_START_TIME || "09:30";
const LATE_GRACE = Number(process.env.LATE_GRACE_MINUTES || 10);
const { Parser } = require("json2csv");

// helper: parse HH:mm into minutes since midnight
const hhmmToMinutes = (hhmm) => {
  const [hh, mm] = (hhmm || "00:00").split(":").map(Number);
  return hh * 60 + mm;
};

exports.checkIn = async (req, res, next) => {
  try {
    const user = req.user;
    // create or return existing attendance row for today
    const now = new Date();
    const todayStr = attendanceService.formatDateStr(now);
    let att = await attendanceService.findTodayAttendance(user._id, todayStr);

    if (att && att.checkInTime) {
      return res
        .status(200)
        .json({ message: "Already checked in", attendance: att });
    }

    att = await attendanceService.createOrGetToday(user._id, now, todayStr);

    // compute if late
    const officeMins = hhmmToMinutes(OFFICE_START);
    const checkinMins = now.getHours() * 60 + now.getMinutes();
    const isLate = checkinMins > officeMins + LATE_GRACE;

    att.status = isLate ? "late" : "present";
    await att.save();

    res.status(201).json({ message: "Checked in", attendance: att });
  } catch (err) {
    next(err);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const user = req.user;
    const now = new Date();
    const todayStr = attendanceService.formatDateStr(now);

    const att = await attendanceService.findTodayAttendance(user._id, todayStr);
    if (!att || !att.checkInTime) {
      return res.status(400).json({ message: "No check-in found for today" });
    }
    if (att.checkOutTime) {
      return res
        .status(200)
        .json({ message: "Already checked out", attendance: att });
    }

    const halfDayThreshold = 4; // hours
    const updated = await attendanceService.checkoutToday(
      user._id,
      now,
      todayStr,
      halfDayThreshold
    );

    res.json({ message: "Checked out", attendance: updated });
  } catch (err) {
    next(err);
  }
};

exports.myHistory = async (req, res, next) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, month } = req.query;

    const query = { userId: user._id };
    if (month) {
      // month format: YYYY-MM
      query.date = { $regex: `^${month}` };
    }

    const docs = await Attendance.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ data: docs });
  } catch (err) {
    next(err);
  }
};

exports.mySummary = async (req, res, next) => {
  try {
    const user = req.user;
    const { month } = req.query; // required YYYY-MM
    if (!month) {
      return res.status(400).json({ message: "month required as YYYY-MM" });
    }
    const match = { userId: user._id, date: { $regex: `^${month}` } };
    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

exports.allAttendance = async (req, res, next) => {
  try {
    // only allow manager role
    const user = req.user;
    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { page = 1, limit = 50, from, to, status, employeeId } = req.query;
    const query = {};

    if (from && to) {
      // from and to are YYYY-MM-DD
      query.date = { $gte: from, $lte: to };
    } else if (from) {
      query.date = { $gte: from };
    } else if (to) {
      query.date = { $lte: to };
    }

    if (status) query.status = status;
    if (employeeId) {
      const u = await User.findOne({ employeeId }).select("_id");
      if (u) query.userId = u._id;
      else query.userId = null; // will yield empty
    }

    const docs = await Attendance.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "name email employeeId department");

    res.json({ data: docs });
  } catch (err) {
    next(err);
  }
};

exports.todayStatus = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const today = attendanceService.formatDateStr(new Date());
    const docs = await Attendance.find({ date: today }).populate(
      "userId",
      "name employeeId department"
    );
    res.json({ date: today, data: docs });
  } catch (err) {
    next(err);
  }
};

exports.employeeAttendance = async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const employeeId = req.params.id;

    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: "Employee not found" });

    const records = await Attendance.find({ userId: employeeId }).sort({
      date: -1,
    });

    res.json({ employee: user, attendance: records });
  } catch (err) {
    next(err);
  }
};

exports.teamSummary = async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { month } = req.query; // YYYY-MM
    if (!month) return res.status(400).json({ message: "month is required" });

    const summary = await Attendance.aggregate([
      { $match: { date: { $regex: `^${month}` } } },
      {
        $group: {
          _id: "$userId",
          totalPresent: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          totalLate: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
          },
          totalHalfDay: {
            $sum: { $cond: [{ $eq: ["$status", "half-day"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
    ]);

    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

exports.exportCSV = async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const records = await Attendance.find().populate(
      "userId",
      "name email employeeId department"
    );

    const data = records.map((r) => ({
      employeeId: r.userId.employeeId,
      name: r.userId.name,
      department: r.userId.department,
      date: r.date,
      checkInTime: r.checkInTime,
      checkOutTime: r.checkOutTime,
      status: r.status,
      totalHours: r.totalHours,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance.csv");
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};

exports.myStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const todayStr = attendanceService.formatDateStr(new Date());
    const att = await Attendance.findOne({ userId, date: todayStr });

    if (!att) {
      return res.json({
        date: todayStr,
        status: "Not checked in",
        checkInTime: null,
        checkOutTime: null,
        totalHours: null
      });
    }

    res.json({
      date: att.date,
      status: att.status,
      checkInTime: att.checkInTime,
      checkOutTime: att.checkOutTime,
      totalHours: att.totalHours
    });

  } catch (err) {
    next(err);
  }
};

