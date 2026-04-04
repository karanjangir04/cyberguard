const express = require('express');
const Report = require('../models/Report');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/reports - Submit incident report
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, phone, crimeType, description } = req.body;

    if (!name || !crimeType || !description) {
      return res.status(400).json({ error: 'Name, crime type and description are required' });
    }

    const report = new Report({
      userId: req.user ? req.user.id : undefined,
      name,
      email: email || '',
      phone: phone || '',
      crimeType,
      description
    });

    await report.save();

    res.status(201).json({
      message: 'Report submitted successfully!',
      trackingId: report.trackingId,
      report: {
        id: report._id,
        trackingId: report.trackingId,
        status: report.status,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report. Please try again.' });
  }
});

// GET /api/reports/my - Get logged-in user's reports
router.get('/my', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET /api/reports/:trackingId - Track report by ID
router.get('/track/:trackingId', async (req, res) => {
  try {
    const report = await Report.findOne({ trackingId: req.params.trackingId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found. Please check the tracking ID.' });
    }
    res.json({
      trackingId: report.trackingId,
      status: report.status,
      crimeType: report.crimeType,
      createdAt: report.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track report' });
  }
});

module.exports = router;
