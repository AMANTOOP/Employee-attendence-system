// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic root health check
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Attendance backend running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error handler (should be last)
app.use(errorHandler);

module.exports = app;
