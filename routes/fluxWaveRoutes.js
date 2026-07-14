const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
    registerParticipant,
    getRegistrationStatus,
    getAllRegistrations,
    deleteRegistration,
} = require("../controllers/fluxWaveController");

// POST /api/fluxwave/register
router.post("/register", registerParticipant);

// GET /api/fluxwave/status?email=someone@example.com
router.get("/status", getRegistrationStatus);

// Admin-clearance routes
// GET /api/fluxwave/registrations
router.get("/registrations", protect, admin, getAllRegistrations);

// DELETE /api/fluxwave/registrations/:id
router.delete("/registrations/:id", protect, admin, deleteRegistration);

module.exports = router;
