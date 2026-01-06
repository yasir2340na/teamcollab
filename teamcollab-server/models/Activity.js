const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // 'created_task', 'updated_task', 'deleted_task', etc.
  targetType: { type: String, enum: ['task', 'project', 'comment'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
