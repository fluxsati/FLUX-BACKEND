const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    name: { type: String },
    enrollment: { type: String }
});

const fluxWaveSchema = mongoose.Schema({
    teamName: { type: String, required: true },
    leaderName: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String },
    enrollment: { type: String },
    numMembers: { type: Number },
    members: [memberSchema],
    
    // Round 1
    ideaAbstract: { type: String },
    domain: { type: String },
    pptLink: { type: String },
    
    // Round 2
    deployLink: { type: String },
    githubLink: { type: String },
    screenRecording: { type: String },
    
    // Track rounds
    currentRound: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FluxWave', fluxWaveSchema);
