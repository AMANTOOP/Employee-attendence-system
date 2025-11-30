// src/services/attendance.service.js
const Attendance = require('../models/Attendance');

/**
 * formatDateStr: convert Date -> YYYY-MM-DD (local date)
 * We use local date string to group by calendar day for users (frontends convert to user's local)
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
  return Math.round((ms / (1000 * 60 * 60)) * 100) / 100; // rounded to 2 decimals
};

module.exports = {
  formatDateStr,
  hoursBetween,
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
    // if exists but no checkInTime, update, otherwise return existing
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
    if (att.checkOutTime) return att; // idempotent

    att.checkOutTime = checkOutTime || new Date();
    att.totalHours = hoursBetween(att.checkInTime, att.checkOutTime);

    if (att.totalHours < halfDayThresholdHours) {
      att.status = 'half-day';
    }
    await att.save();
    return att;
  }
};
