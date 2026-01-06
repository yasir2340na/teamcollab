const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const verifyToken = require('../middleware/authMiddleware');

// @GET /api/comments/:taskId → Get all comments for a task
router.get('/:taskId', verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @POST /api/comments → Add a comment to a task
router.post('/', verifyToken, async (req, res) => {
  const { taskId, text } = req.body;
  try {
    const comment = await Comment.create({
      task: taskId,
      user: req.user,
      text
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email avatar');
    
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @DELETE /api/comments/:id → Delete a comment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    if (comment.user.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
