const express = require('express');
const router = express.Router();
const { submitContact, getMessages } = require('../controllers/contactController');

// Main Route: /api/contact
router.post('/', submitContact);
router.get('/', getMessages); // Optional: for your admin dashboard

module.exports = router;