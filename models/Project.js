const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // No longer strictly required if public
  submittedBy: { type: String, required: true }, // To store user name
  email: { type: String, required: true },       // To store user email
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [String],
  githubLink: { type: String },
  liveLink: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);