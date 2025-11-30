// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// helper to create a simple employeeId: EMP + timestamp + random 3 digits
const createEmployeeId = async () => {
  const id = `EMP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;
  // Ideally: ensure uniqueness in DB; for simplicity we'll return id and rely on unique index to fail if collision
  return id;
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'employee', department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const employeeId = await createEmployeeId();

    const user = new User({
      name,
      email,
      password: hashed,
      role,
      employeeId,
      department: department || null
    });

    await user.save();

    // return basic profile and tokens
    const accessToken = generateToken({ id: user._id, role: user.role }, ACCESS_EXPIRES);
    const refreshToken = generateToken({ id: user._id, role: user.role }, REFRESH_EXPIRES);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key
      return res.status(409).json({ message: 'Duplicate field value' });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateToken({ id: user._id, role: user.role }, ACCESS_EXPIRES);
    const refreshToken = generateToken({ id: user._id, role: user.role }, REFRESH_EXPIRES);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    // read token and return profile (keeps route simple so user can call without middleware)
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
