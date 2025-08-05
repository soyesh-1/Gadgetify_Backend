// backend/middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// This middleware should run AFTER the standard authMiddleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // If user is an admin, proceed to the next function (the controller)
  } else {
    res.status(403).json({ msg: 'Forbidden: Not authorized as an admin' });
  }
};

module.exports = adminMiddleware;