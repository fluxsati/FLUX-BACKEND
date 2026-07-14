const asyncHandler = require("express-async-handler");
const FluxWaveRegistration = require("../models/FluxWaveRegistration");

const EMAIL_REGEX = /.+\@.+\..+/;

// @desc    Register a participant / team for a FluxWave 2.0 round
// @route   POST /api/fluxwave/register
const registerParticipant = asyncHandler(async (req, res) => {
    const {
        teamName,
        leaderName,
        contactNumber,
        email,
        round,
        enrollment,
        numMembers,
        members,
        ideaAbstract,
        domain,
        pptLink,
        deployLink,
        githubRepo,
        screenRecording,
    } = req.body;

    const roundNumber = Number(round);

    // --- 1. Common field validation (required for every round) ---
    if (!teamName || !leaderName || !contactNumber || !email) {
        res.status(400);
        throw new Error("Team name, leader name, contact number, and email are all required.");
    }

    if (![0, 1, 2].includes(roundNumber)) {
        res.status(400);
        throw new Error("A valid round (0, 1, or 2) is required.");
    }

    if (!EMAIL_REGEX.test(email)) {
        res.status(400);
        throw new Error("Please provide a valid email address.");
    }

    // --- 2. Round-specific validation ---
    const registrationData = {
        teamName: teamName.trim(),
        leaderName: leaderName.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim().toLowerCase(),
        round: roundNumber,
    };

    if (roundNumber === 0) {
        if (!enrollment) {
            res.status(400);
            throw new Error("Leader enrollment number is required for the Zeroth Round.");
        }
        const parsedNumMembers = Number(numMembers);
        if (!parsedNumMembers || parsedNumMembers < 2 || parsedNumMembers > 4) {
            res.status(400);
            throw new Error("Team size must be between 2 and 4 members.");
        }
        if (!Array.isArray(members) || members.length !== parsedNumMembers) {
            res.status(400);
            throw new Error("Please provide details for every team member.");
        }
        for (const member of members) {
            if (!member?.name || !member?.enrollment) {
                res.status(400);
                throw new Error("Each team member needs a name and enrollment number.");
            }
        }

        registrationData.enrollment = enrollment.trim();
        registrationData.numMembers = parsedNumMembers;
        registrationData.members = members.map((m) => ({
            name: String(m.name).trim(),
            enrollment: String(m.enrollment).trim(),
        }));
    }

    if (roundNumber === 1) {
        if (!ideaAbstract || !domain || !pptLink) {
            res.status(400);
            throw new Error("Idea abstract, domain, and PPT link are all required for the First Round.");
        }
        registrationData.ideaAbstract = ideaAbstract.trim();
        registrationData.domain = domain.trim();
        registrationData.pptLink = pptLink.trim();
    }

    if (roundNumber === 2) {
        if (!deployLink || !githubRepo || !screenRecording) {
            res.status(400);
            throw new Error("Deployed link, GitHub repo, and screen recording are all required for the Second Round.");
        }
        registrationData.deployLink = deployLink.trim();
        registrationData.githubRepo = githubRepo.trim();
        registrationData.screenRecording = screenRecording.trim();
    }

    // --- 3. Duplicate registration prevention ---
    const alreadyRegistered = await FluxWaveRegistration.findOne({
        email: registrationData.email,
        round: roundNumber,
    });

    if (alreadyRegistered) {
        res.status(409);
        throw new Error("This email has already been registered for this round.");
    }

    // --- 4. Create the registration ---
    const registration = await FluxWaveRegistration.create(registrationData);

    res.status(201).json({
        success: true,
        message: "Registration successful",
        data: registration,
    });
});

// @desc    Check which rounds an email has already registered for
// @route   GET /api/fluxwave/status?email=someone@example.com
const getRegistrationStatus = asyncHandler(async (req, res) => {
    const { email } = req.query;

    if (!email || !EMAIL_REGEX.test(email)) {
        res.status(400);
        throw new Error("A valid email address is required.");
    }

    const registrations = await FluxWaveRegistration.find({
        email: email.trim().toLowerCase(),
    }).select("round teamName createdAt");

    res.status(200).json({
        success: true,
        registeredRounds: registrations.map((r) => r.round),
        data: registrations,
    });
});

// @desc    Get all registrations
// @route   GET /api/fluxwave/registrations
// @access  Private/Admin
const getAllRegistrations = asyncHandler(async (req, res) => {
    const registrations = await FluxWaveRegistration.find({}).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations,
    });
});

// @desc    Delete a registration
// @route   DELETE /api/fluxwave/registrations/:id
// @access  Private/Admin
const deleteRegistration = asyncHandler(async (req, res) => {
    const registration = await FluxWaveRegistration.findById(req.params.id);
    if (!registration) {
        res.status(404);
        throw new Error("Registration record not found");
    }
    await registration.deleteOne();
    res.status(200).json({
        success: true,
        message: "Registration purged successfully",
    });
});

module.exports = {
    registerParticipant,
    getRegistrationStatus,
    getAllRegistrations,
    deleteRegistration,
};
