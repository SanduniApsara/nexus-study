const Task = require('../models/Task');

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.module)   filter.module   = req.query.module;

    const tasks = await Task.find(filter)
      .populate('module', 'name code color')
      .sort({ dueDate: 1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    await task.populate('module', 'name code color');
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    if (req.body.status === 'Done' && !req.body.completedAt) {
      req.body.completedAt = new Date();
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('module', 'name code color');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
