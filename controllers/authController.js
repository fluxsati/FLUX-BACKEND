const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // --- 1. STATIC ADMIN CHECK ---
  if (email === "fluxadmin@mail.com" && password === "Flux*admin") {
    return res.json({
      _id: "STATIC_ADMIN_ID",
      name: "Flux Administrator",
      email: "fluxadmin@mail.com",
      role: "admin",
      token: generateToken("STATIC_ADMIN_ID"),
    });
  }

  // --- 2. STANDARD DATABASE LOGIN ---
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // This line triggers the User Model's pre-save hook
    user.isOnline = true; 
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res, next) => {
  // Handle Static Admin Logout
  if (req.user && req.user._id === "STATIC_ADMIN_ID") {
    return res.json({ message: 'Admin logged out' });
  }

  // Handle Database User Logout
  const user = await User.findById(req.user._id);
  if (user) {
    user.isOnline = false;
    await user.save();
    res.json({ message: 'User logged out' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, authUser, logoutUser };