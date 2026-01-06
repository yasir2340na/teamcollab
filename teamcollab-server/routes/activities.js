const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const verifyToken = require('../middleware/authMiddleware');

// @GET /api/activities/:projectId → Get activity feed for a project
router.get('/:projectId', verifyToken, async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.projectId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
