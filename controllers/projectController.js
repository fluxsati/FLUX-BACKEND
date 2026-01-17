const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res, next) => { // Signature includes next
  const { title, description, techStack, githubLink, liveLink, submittedBy, email } = req.body;

  const project = new Project({
    submittedBy,
    email,
    title,
    description,
    techStack,
    githubLink,
    liveLink
  });

  const createdProject = await project.save(); // Triggers save middleware
  res.status(201).json(createdProject);
});

// @desc    Get all projects
// @route   GET /api/projects
const getProjects = asyncHandler(async (req, res, next) => { // Signature includes next
  // Search for all projects and sort by newest first
  const projects = await Project.find({}).sort({ createdAt: -1 }); 
  
  if (!projects) {
    res.status(404);
    throw new Error('No projects found');
  }

  res.json(projects);
});

module.exports = { createProject, getProjects };