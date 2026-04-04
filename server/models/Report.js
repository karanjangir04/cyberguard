const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  crimeType: {
    type: String,
    required: true,
    enum: ['financial_fraud', 'harassment', 'hacking', 'phishing', 'identity_theft', 'other']
  },
  description: {
    type: String,
    required: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'resolved'],
    default: 'submitted'
  },
  trackingId: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate tracking ID before saving
reportSchema.pre('save', function (next) {
  if (!this.trackingId) {
    const prefix = 'CG';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.trackingId = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);
