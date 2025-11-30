// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

// simple pre-save to ensure employeeId exists is handled in controller/seed
module.exports = mongoose.model('User', UserSchema);
