const Module = require('../models/Module');

// GET /api/modules
const getModules = async (req, res) => {
  try {
    const modules = await Module.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/modules
const createModule = async (req, res) => {
  try {
    const module = await Module.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: module });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/modules/:id
const updateModule = async (req, res) => {
  try {
    const module = await Module.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, data: module });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/modules/:id
const deleteModule = async (req, res) => {
  try {
    const module = await Module.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/modules/:id/grades  — add a grade entry
const addGrade = async (req, res) => {
  try {
    const module = await Module.findOne({ _id: req.params.id, user: req.user._id });
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    module.grades.push(req.body);
    await module.save();
    res.json({ success: true, data: module });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/modules/:id/grades/:gradeId
const deleteGrade = async (req, res) => {
  try {
    const module = await Module.findOne({ _id: req.params.id, user: req.user._id });
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    module.grades = module.grades.filter(g => g._id.toString() !== req.params.gradeId);
    await module.save();
    res.json({ success: true, data: module });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getModules, createModule, updateModule, deleteModule, addGrade, deleteGrade };
