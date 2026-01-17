const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res, next) => {
  // Fetch all users and exclude password for security
  const users = await User.find({}).select('-password');
  
  if (!users) {
    res.status(404);
    throw new Error('No users found');
  }

  res.json(users);
});

// @desc    Get active users
// @route   GET /api/users/active
const getActiveUsers = asyncHandler(async (req, res, next) => {
  // Fetch users where isOnline is true
  const users = await User.find({ isOnline: true }).select('-password');
  
  res.json(users);
});

// IMPORTANT: These names must match what you import in userRoutes.js
module.exports = { 
  getUsers, 
  getActiveUsers 
};