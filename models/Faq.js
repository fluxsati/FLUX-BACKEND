// models/Faq.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    default: 'Anonymous',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    askedBy: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    answers: [answerSchema],
    upvotes: {
      type: Number,
      default: 0,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['General', 'Events', 'Projects', 'Membership', 'Other'],
      default: 'General',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);