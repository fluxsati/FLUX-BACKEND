const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  chatRoom: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);