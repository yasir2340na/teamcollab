const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const verifyToken = require('../middleware/authMiddleware');

// @POST /api/projects → Create a project
router.post('/', verifyToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      owner: req.user,
      members: [req.user]
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @GET /api/projects → View all your projects
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user })
      .populate('owner', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @DELETE /api/projects/:id → Delete a project and its tasks
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Check if user is the owner
    if (project.owner.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });
    
    // Delete the project
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Project and associated tasks deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
