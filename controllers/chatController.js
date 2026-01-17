const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// @desc    Get chat history
// @route   GET /api/chat
const getChatHistory = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ chatRoom: 'general' })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 }); // Oldest first
  res.json(messages);
});

module.exports = { getChatHistory };