
const mongoose = require("mongoose");

// A single team member (used for the Round 0 team roster)
const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Member name is required"],
            trim: true,
        },
        enrollment: {
            type: String,
            required: [true, "Member enrollment number is required"],
            trim: true,
        },
    },
    { _id: false }
);

const fluxWaveRegistrationSchema = new mongoose.Schema(
    {
        // --- Common fields (collected on every round) ---
        teamName: {
            type: String,
            required: [true, "Team name is required"],
            trim: true,
        },
        leaderName: {
            type: String,
            required: [true, "Leader name is required"],
            trim: true,
        },
        contactNumber: {
            type: String,
            required: [true, "Contact number is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please provide a valid email address"],
        },
        round: {
            type: Number,
            required: true,
            enum: [0, 1, 2],
        },

        // --- Round 0 (Zeroth Round) fields ---
        enrollment: {
            type: String,
            trim: true,
        },
        numMembers: {
            type: Number,
            min: 2,
            max: 4,
        },
        members: {
            type: [memberSchema],
            default: undefined,
        },

        // --- Round 1 (First Round) fields ---
        ideaAbstract: {
            type: String,
            trim: true,
        },
        domain: {
            type: String,
            trim: true,
        },
        pptLink: {
            type: String,
            trim: true,
        },

        // --- Round 2 (Second Round) fields ---
        deployLink: {
            type: String,
            trim: true,
        },
        githubRepo: {
            type: String,
            trim: true,
        },
        screenRecording: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent the same email from submitting the same round twice
fluxWaveRegistrationSchema.index({ email: 1, round: 1 }, { unique: true });

module.exports = mongoose.model(
    "FluxWaveRegistration",
    fluxWaveRegistrationSchema
);
