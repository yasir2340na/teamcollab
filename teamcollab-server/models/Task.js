const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  dueDate:     { type: Date },
  assignedTo:  { type: String, default: 'Unassigned' }, // ✅ This line is now inside the schema
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);




module.exports = mongoose.model('Task', TaskSchema);

