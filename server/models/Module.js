const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  name:   { type: String, required: true },   // e.g. "Midterm", "Assignment 1"
  score:  { type: Number, required: true, min: 0, max: 100 },
  weight: { type: Number, required: true, min: 0, max: 100 }, // percentage
  date:   { type: Date, default: Date.now },
});

const moduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name:       { type: String, required: [true, 'Module name is required'], trim: true },
  code:       { type: String, required: [true, 'Module code is required'], trim: true },
  credits:    { type: Number, required: true, min: 1, max: 12 },
  semester:   { type: String, default: 'Semester 1' },
  year:       { type: Number, default: 1 },
  color:      { type: String, default: '#c8f050' },
  icon:       { type: String, default: '📚' },
  grades:     [gradeSchema],
  finalGrade: { type: String, default: null }, // A, B+, B, etc.
  letterToGPA: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

// Virtual: calculate weighted average score
moduleSchema.virtual('averageScore').get(function () {
  if (!this.grades.length) return null;
  const totalWeight = this.grades.reduce((s, g) => s + g.weight, 0);
  if (totalWeight === 0) return null;
  const weighted = this.grades.reduce((s, g) => s + (g.score * g.weight), 0);
  return weighted / totalWeight;
});

// Virtual: convert score to GPA points
moduleSchema.virtual('gpaPoints').get(function () {
  const score = this.averageScore;
  if (score === null) return null;
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 80) return 3.3;
  if (score >= 75) return 3.0;
  if (score >= 70) return 2.7;
  if (score >= 65) return 2.3;
  if (score >= 60) return 2.0;
  if (score >= 55) return 1.7;
  if (score >= 50) return 1.3;
  if (score >= 45) return 1.0;
  return 0.0;
});

moduleSchema.set('toJSON', { virtuals: true });
moduleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Module', moduleSchema);
