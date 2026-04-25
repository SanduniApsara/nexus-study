const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
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
  title:      { type: String, required: true, trim: true },
  date:       { type: Date, default: Date.now },
  duration:   { type: Number, required: true, min: 1 },
  type:       { type: String, enum: ['Study', 'Revision', 'Practice', 'Lecture', 'Tutorial'], default: 'Study' },
  notes:      { type: String, default: '' },
  productivity: { type: Number, min: 1, max: 5, default: 3 },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);