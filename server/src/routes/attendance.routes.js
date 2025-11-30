// src/routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const auth = require('../middleware/auth.middleware');

// employee actions
router.post('/checkin', auth, attendanceController.checkIn);
router.post('/checkout', auth, attendanceController.checkOut);
router.get('/my-history', auth, attendanceController.myHistory);
router.get('/my-summary', auth, attendanceController.mySummary);
router.get('/today', auth, attendanceController.myStatus);


// manager endpoints (basic role check inside controller)
router.get('/all', auth, attendanceController.allAttendance);
router.get('/today/status', auth, attendanceController.todayStatus);
router.get('/employee/:id', auth, attendanceController.employeeAttendance);
router.get('/summary', auth, attendanceController.teamSummary);
router.get('/export', auth, attendanceController.exportCSV);


module.exports = router;
