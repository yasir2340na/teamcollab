const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/authMiddleware');

// @POST /api/projects → Create a project
router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    const project = await Project.create({
      name,
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

module.exports = router;
