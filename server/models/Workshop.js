const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  organizerName: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true
  },
  institution: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  participantsCount: {
    type: Number,
    required: [true, 'Participants count is required'],
    min: [1, 'At least 1 participant required']
  },
  status: {
    type: String,
    enum: ['submitted', 'approved', 'completed'],
    default: 'submitted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workshop', workshopSchema);
