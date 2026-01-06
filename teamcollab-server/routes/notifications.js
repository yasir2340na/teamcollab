const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/authMiddleware');

// @GET /api/notifications → Get user's notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @PUT /api/notifications/:id/read → Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @PUT /api/notifications/read-all → Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user, read: false },
      { read: true }
    );
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
