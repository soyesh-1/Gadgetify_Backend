// backend/routes/user.js
const express = require('express');
const router = express.Router();

// Import controllers and middlewares
const { getAllUsers, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET /api/users
// @desc    Get all users for admin
// @access  Private/Admin
router.get('/', [authMiddleware, adminMiddleware], getAllUsers);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (for the logged-in user)
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
