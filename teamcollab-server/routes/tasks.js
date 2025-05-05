const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/authMiddleware');

// ✅ CREATE Task
router.post('/', verifyToken, async (req, res) => {
  const { title, description, dueDate, status, project, assignedTo } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      project,
      assignedTo,
      createdBy: req.user
    });

    // 🔴 Real-time broadcast to all clients in project
    req.io.emit('tasksUpdated', project);

    res.status(201).json(task);
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET All Tasks for a project
router.get('/:projectId', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('❌ Error getting tasks:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ UPDATE Task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // 🔴 Notify clients watching this project
    req.io.emit('tasksUpdated', req.body.project);

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating task:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ DELETE Task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (deletedTask) {
      // 🔴 Notify clients of change
      req.io.emit('tasksUpdated', deletedTask.project);
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error deleting task:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
