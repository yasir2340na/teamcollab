const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  status:      { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate:     { type: Date },
  assignedTo:  { type: String, default: 'Unassigned' },
  tags:        [{ type: String }],
  attachments: [{ 
    name: String, 
    url: String, 
    uploadedAt: { type: Date, default: Date.now } 
  }],
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);




module.exports = mongoose.model('Task', TaskSchema);

