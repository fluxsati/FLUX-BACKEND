const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  approveProject, 
  deleteProject 
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .delete(protect, admin, deleteProject);

router.route('/:id/approve')
  .put(protect, admin, approveProject);

router.route('/:id/confirm')
  .put(protect, admin, approveProject);

module.exports = router;
