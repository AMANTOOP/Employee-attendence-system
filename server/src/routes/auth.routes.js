// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// register and login
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.me); // requires token in header; controller checks internally

module.exports = router;
