const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { protect, admin } = require("../middleware/authMiddleware");

const {
    registerParticipant,
    getRegistrationStatus,
    getAllRegistrations,
    deleteRegistration,
=======

const {
    registerParticipant
>>>>>>> 850b892fb7a34ee08aff39cebfc7107d0314a7a9
} = require("../controllers/fluxWaveController");

// POST /api/fluxwave/register
router.post("/register", registerParticipant);

<<<<<<< HEAD
// GET /api/fluxwave/status?email=someone@example.com
router.get("/status", getRegistrationStatus);

// Admin-clearance routes
// GET /api/fluxwave/registrations
router.get("/registrations", protect, admin, getAllRegistrations);

// DELETE /api/fluxwave/registrations/:id
router.delete("/registrations/:id", protect, admin, deleteRegistration);

=======
>>>>>>> 850b892fb7a34ee08aff39cebfc7107d0314a7a9
module.exports = router;
