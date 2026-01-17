const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Receive new contact transmission
// @route   POST /api/contact
exports.submitContact = asyncHandler(async (req, res, next) => {
    const { operator, channel, header, payload } = req.body;

    // Basic validation
    if (!operator || !channel || !header || !payload) {
        res.status(400);
        throw new Error("Incomplete transmission. All fields required.");
    }

    const newContact = await Contact.create({
        operator,
        channel,
        header,
        payload
    });

    res.status(201).json({
        success: true,
        message: "Transmission received and archived.",
        data: newContact
    });
});

// @desc    Get all transmissions (For Admin view)
// @route   GET /api/contact
exports.getMessages = asyncHandler(async (req, res, next) => {
    const messages = await Contact.find().sort({ timestamp: -1 });
    
    if (!messages) {
        res.status(404);
        throw new Error("Could not retrieve data.");
    }

    res.status(200).json({ 
        success: true, 
        count: messages.length, 
        data: messages 
    });
});