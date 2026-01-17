const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    authUser, 
    logoutUser 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', authUser);

// @desc    Logout user & set offline
// @route   POST /api/auth/logout
// @access  Private (Requires Token)
router.post('/logout', protect, logoutUser);

module.exports = router;