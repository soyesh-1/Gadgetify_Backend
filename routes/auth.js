// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginUser);

module.exports = router;