const express = require('express');
const ScamAlert = require('../models/ScamAlert');

const router = express.Router();

// GET /api/scam-alerts - Fetch all active scam alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await ScamAlert.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scam alerts' });
  }
});

module.exports = router;
