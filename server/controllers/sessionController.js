const Session = require('../models/Session');

// GET /api/sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate('module', 'name code color')
      .sort({ date: -1 })
      .limit(100);
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/sessions
const createSession = async (req, res) => {
  try {
    const { title, date, duration, type, notes, productivity, module } = req.body;

    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!duration) return res.status(400).json({ success: false, message: 'Duration is required' });

    const sessionDate = date ? new Date(date) : new Date();

    const session = await Session.create({
      title,
      date: sessionDate,
      duration: Number(duration),
      type: type || 'Study',
      notes: notes || '',
      productivity: productivity ? Number(productivity) : 3,
      module: module || null,
      user: req.user._id,
    });

    await session.populate('module', 'name code color');
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/sessions/:id
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSessions, createSession, deleteSession };