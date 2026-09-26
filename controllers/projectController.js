const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description, techStack, githubLink, liveLink, submittedBy, email } = req.body;

  const project = new Project({
    submittedBy,
    email,
    title,
    description,
    techStack,
    githubLink,
    liveLink,
    status: 'pending',
    isApproved: false
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Get all projects (or filtered by approved)
// @route   GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const { approved, status } = req.query;
  let filter = {};

  if (approved === 'true' || status === 'approved') {
    filter = {
      $or: [
        { isApproved: true },
        { status: 'approved' }
      ]
    };
  }

  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Approve a project (Admin)
// @route   PUT /api/projects/:id/approve
const approveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    project.isApproved = true;
    project.status = 'approved';
    const updated = await project.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project (Admin)
// @route   DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed successfully' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = { 
  createProject, 
  getProjects, 
  approveProject, 
  deleteProject 
};
