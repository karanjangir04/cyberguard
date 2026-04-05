const mongoose = require('mongoose');

const detectionStatsSchema = new mongoose.Schema(
  {
    callsAnalyzedToday: {
      type: Number,
      default: 0,
    },
    threatsDetected: {
      type: Number,
      default: 0,
    },
    usersProtected: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'detectionStats' }
);

module.exports = mongoose.model('DetectionStats', detectionStatsSchema);
