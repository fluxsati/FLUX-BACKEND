const express = require('express');
const router = express.Router();
// Import the logic from your controller
const { createProject, getProjects } = require('../controllers/projectController');

// Clean approach using router.route()
router.route('/')
  .get(getProjects)     // Fetches all projects for your Admin Panel
  .post(createProject);  // Handles new project submissions from the form

module.exports = router;