const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fetching user scores efficiently
quizScoreSchema.index({ userId: 1, level: 1 });

module.exports = mongoose.model('QuizScore', quizScoreSchema);
