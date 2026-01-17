const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    operator: {
        type: String,
        required: [true, "Operator name is required"],
        trim: true
    },
    channel: {
        type: String,
        required: [true, "Email channel is required"],
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    header: {
        type: String,
        required: [true, "Message header is required"],
        trim: true
    },
    payload: {
        type: String,
        required: [true, "Data payload (message) is required"]
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'archived'],
        default: 'unread'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', ContactSchema);