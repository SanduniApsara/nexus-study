const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    default: null,
  },
  title:       { type: String, required: [true, 'Task title is required'], trim: true },
  description: { type: String, default: '' },
  type:        { type: String, enum: ['Assignment', 'Exam', 'Project', 'Quiz', 'Reading', 'Other'], default: 'Assignment' },
  priority:    { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status:      { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  dueDate:     { type: Date, required: [true, 'Due date is required'] },
  completedAt: { type: Date, default: null },
  estimatedHours: { type: Number, default: 1 },
}, { timestamps: true });

// Virtual: is overdue
taskSchema.virtual('isOverdue').get(function () {
  return this.status !== 'Done' && new Date() > this.dueDate;
});

// Virtual: days until due
taskSchema.virtual('daysUntilDue').get(function () {
  const diff = this.dueDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
