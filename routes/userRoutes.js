const express = require('express');
const router = express.Router();
const { getUsers, getActiveUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @desc    Get all active/online users
// @route   GET /api/users/active
// @access  Private
router.get('/active', protect, getActiveUsers);

module.exports = router;