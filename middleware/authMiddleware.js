const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- MATCHING THE STATIC ADMIN ID ---
      if (decoded.id === "STATIC_ADMIN_ID") {
        req.user = {
          _id: "STATIC_ADMIN_ID",
          name: "Flux Administrator",
          role: "admin"
        };
      } else {
        // Normal Database User Check
        req.user = await User.findById(decoded.id).select('-password');
      }

      // Validate user existence
      if (!req.user) {
        res.status(401);
        throw new Error('User not found / Session Invalid');
      }

      // Move to next middleware
      next(); 
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } 
  
  // Explicitly handle missing token
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * Middleware to restrict access to admin users only
 */
const admin = (req, res, next) => {
  // Check user role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access Denied: Administrative Clearance Required');
  }
};

module.exports = { protect, admin };