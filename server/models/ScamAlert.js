const mongoose = require('mongoose');

const scamAlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    default: 'https://cybercrime.gov.in'
  },
  category: {
    type: String,
    default: 'general'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScamAlert', scamAlertSchema);
