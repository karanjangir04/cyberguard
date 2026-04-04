const express = require('express');
const Workshop = require('../models/Workshop');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/workshops - Submit workshop details
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { organizerName, institution, eventDate, participantsCount } = req.body;

    if (!organizerName || !institution || !eventDate || !participantsCount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const workshop = new Workshop({
      userId: req.user ? req.user.id : undefined,
      organizerName,
      institution,
      eventDate,
      participantsCount: parseInt(participantsCount)
    });

    await workshop.save();

    res.status(201).json({
      message: 'Workshop details submitted successfully!',
      workshop: {
        id: workshop._id,
        organizerName: workshop.organizerName,
        institution: workshop.institution,
        status: workshop.status,
        createdAt: workshop.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit workshop details. Please try again.' });
  }
});

// GET /api/workshops/my - Get user's workshop submissions
router.get('/my', auth, async (req, res) => {
  try {
    const workshops = await Workshop.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ workshops });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

module.exports = router;
