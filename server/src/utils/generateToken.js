// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
