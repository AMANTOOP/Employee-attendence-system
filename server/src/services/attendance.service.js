// src/services/attendance.service.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * formatDateStr: convert Date -> YYYY-MM-DD (local date)
 */
const formatDateStr = (d = new Date()) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = `${dt.getMonth() + 1}`.padStart(2, '0');
  const day = `${dt.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const hoursBetween = (start, end) => {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round((ms / (1000 * 60 * 60)) * 100) / 100; // 2 decimals
};

module.exports = {
  formatDateStr,
  hoursBetween,

  // existing helpers
  findTodayAttendance: async (userId, date = null) => {
    const d = date || formatDateStr();
    return Attendance.findOne({ userId, date: d });
  },

  createOrGetToday: async (userId, checkInTime = null, date = null) => {
    const d = date || formatDateStr();
    let att = await Attendance.findOne({ userId, date: d });
    if (!att) {
      att = new Attendance({ userId, date: d, checkInTime: checkInTime || new Date() });
      await att.save();
      return att;
    }
    if (!att.checkInTime && checkInTime) {
      att.checkInTime = checkInTime;
      await att.save();
    }
    return att;
  },

  checkoutToday: async (userId, checkOutTime = null, date = null, halfDayThresholdHours = 4) => {
    const d = date || formatDateStr();
    const att = await Attendance.findOne({ userId, date: d });
    if (!att) throw new Error('No check-in found for today');
    if (att.checkOutTime) return att;
    att.checkOutTime = checkOutTime || new Date();
    att.totalHours = hoursBetween(att.checkInTime, att.checkOutTime);
    if (att.totalHours < halfDayThresholdHours) att.status = 'half-day';
    await att.save();
    return att;
  },

  // NEW: user monthly summary counts (present/late/half-day/absent)
  getUserMonthlySummary: async (userId, month) => {
    // month: 'YYYY-MM'
    const match = { userId: mongoose.Types.ObjectId(userId), date: { $regex: `^${month}` } };
    const agg = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    // transform to easy object
    const res = { present: 0, late: 0, 'half-day': 0 };
    agg.forEach(r => {
      res[r._id] = r.count;
    });

    // compute absent: number of days in month minus counted days
    // We can't reliably know scheduled workdays from backend; we'll treat absent as days with explicit absent status
    const absentAgg = await Attendance.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), date: { $regex: `^${month}` }, status: 'absent' } },
      { $count: 'absentCount' }
    ]);
    res.absent = absentAgg.length ? absentAgg[0].absentCount : 0;
    return res;
  },

  // NEW: user total hours for month
  getUserMonthlyHours: async (userId, month) => {
    const agg = await Attendance.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), date: { $regex: `^${month}` } } },
      {
        $group: {
          _id: null,
          totalHours: { $sum: { $ifNull: ['$totalHours', 0] } }
        }
      }
    ]);
    return (agg[0] && agg[0].totalHours) ? Math.round(agg[0].totalHours * 100) / 100 : 0;
  },

  // NEW: last 7 calendar days for a user (including today)
  getUserLastNDays: async (userId, n = 7) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
      const dt = new Date();
      dt.setDate(today.getDate() - i);
      days.push(formatDateStr(dt));
    }
    // query attendance rows for those dates
    const rows = await Attendance.find({ userId: mongoose.Types.ObjectId(userId), date: { $in: days } }).lean();
    const map = {};
    rows.forEach(r => { map[r.date] = r; });

    // return in ascending order from oldest to newest
    return days.reverse().map(d => {
      const r = map[d];
      return {
        date: d,
        status: r ? r.status : 'Not checked in',
        checkInTime: r ? r.checkInTime : null,
        checkOutTime: r ? r.checkOutTime : null,
        totalHours: r ? r.totalHours : null
      };
    });
  },

  // ----------------- Manager-level aggregations -----------------

  // NEW: today's attendance summary (counts)
  getTodaySummary: async () => {
    const today = formatDateStr(new Date());
    const totalUsers = await User.countDocuments({ role: 'employee' });
    const agg = await Attendance.aggregate([
      { $match: { date: today } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    const byStatus = { present: 0, late: 0, 'half-day': 0, absent: 0 };
    agg.forEach(r => { byStatus[r._id] = r.count; });
    // absent = employees - rows recorded for today where status != absent?
    const recordedCount = await Attendance.countDocuments({ date: today });
    byStatus.absent = Math.max(0, totalUsers - recordedCount);
    return {
      date: today,
      totalEmployees: totalUsers,
      present: byStatus.present || 0,
      late: byStatus.late || 0,
      halfDay: byStatus['half-day'] || 0,
      absent: byStatus.absent || 0
    };
  },

  // NEW: weekly trend (last N days aggregated) - returns array of {date, present, late, halfDay, absent}
  getWeeklyTrend: async (days = 7) => {
    const today = new Date();
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(today.getDate() - i);
      dates.push(formatDateStr(dt));
    }

    // aggregate per date & status
    const agg = await Attendance.aggregate([
      { $match: { date: { $in: dates } } },
      {
        $group: {
          _id: { date: '$date', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);

    // map for quick lookup
    const map = {};
    agg.forEach(r => {
      const d = r._id.date;
      const s = r._id.status;
      map[d] = map[d] || { present: 0, late: 0, halfDay: 0, absent: 0 };
      if (s === 'present') map[d].present += r.count;
      if (s === 'late') map[d].late += r.count;
      if (s === 'half-day') map[d].halfDay += r.count;
      if (s === 'absent') map[d].absent += r.count;
    });

    // compute absent by subtracting recorded from total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const result = [];
    for (const d of dates) {
      const recorded = await Attendance.countDocuments({ date: d });
      const absentCalc = Math.max(0, totalEmployees - recorded);
      const entry = map[d] || { present: 0, late: 0, halfDay: 0, absent: 0 };
      // prefer explicit absent counts but ensure total absent >= calculated absent
      entry.absent = Math.max(entry.absent || 0, absentCalc);
      result.push({
        date: d,
        present: entry.present || 0,
        late: entry.late || 0,
        halfDay: entry.halfDay || 0,
        absent: entry.absent || 0
      });
    }
    return result;
  },

  // NEW: department-wise attendance for a month or single date
  getDepartmentWise: async ({ month = null, date = null }) => {
    // If date provided, match that date; otherwise match month prefix YYYY-MM
    let match = {};
    if (date) match.date = date;
    else if (month) match.date = { $regex: `^${month}` };

    // join users to get department per attendance record, then group
    const agg = await Attendance.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: { department: '$user.department', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform to { department: { present, late, halfDay, absent } }
    const out = {};
    agg.forEach(r => {
      const dept = r._id.department || 'Unknown';
      out[dept] = out[dept] || { present: 0, late: 0, halfDay: 0, absent: 0 };
      const status = r._id.status;
      if (status === 'present') out[dept].present += r.count;
      else if (status === 'late') out[dept].late += r.count;
      else if (status === 'half-day') out[dept].halfDay += r.count;
      else if (status === 'absent') out[dept].absent += r.count;
    });

    // For departments with no records the frontend can handle zeros.
    const list = Object.keys(out).map(dept => ({ department: dept, ...out[dept] }));
    return list;
  },

  // NEW: absent employees list for today (employees without attendance row for today)
  getAbsentEmployeesToday: async () => {
    const today = formatDateStr(new Date());
    // find all employee ids who have attendance today
    const presentRows = await Attendance.find({ date: today }).select('userId').lean();
    const presentSet = new Set(presentRows.map(r => String(r.userId)));
    // find employees not in presentSet
    const absent = await User.find({ role: 'employee', _id: { $nin: Array.from(presentSet) } })
      .select('name email employeeId department')
      .lean();
    return { date: today, absent };
  }
};
