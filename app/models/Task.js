const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
});

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);