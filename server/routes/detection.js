const express = require('express');
const router = express.Router();
const DetectionStats = require('../models/DetectionStats');

// Get current detection stats
router.get('/stats', async (req, res) => {
  try {
    let stats = await DetectionStats.findOne();
    
    // Initialize if doesn't exist
    if (!stats) {
      stats = await DetectionStats.create({
        callsAnalyzedToday: 0,
        threatsDetected: 0,
        usersProtected: 0,
      });
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment calls analyzed (when voice detection is enabled)
router.post('/increment-calls', async (req, res) => {
  try {
    let stats = await DetectionStats.findOne();
    
    if (!stats) {
      stats = await DetectionStats.create({
        callsAnalyzedToday: 0,
        threatsDetected: 0,
        usersProtected: 0,
      });
    }
    
    stats.callsAnalyzedToday += 1;
    stats.lastUpdated = new Date();
    await stats.save();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment threats detected (pass threatCount in body)
router.post('/increment-threats', async (req, res) => {
  try {
    const { threatCount = 1 } = req.body;
    
    let stats = await DetectionStats.findOne();
    
    if (!stats) {
      stats = await DetectionStats.create({
        callsAnalyzedToday: 0,
        threatsDetected: 0,
        usersProtected: 0,
      });
    }
    
    // Increment threats by the count of threats found
    stats.threatsDetected += threatCount;
    stats.lastUpdated = new Date();
    await stats.save();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment users protected (when no threats detected)
router.post('/increment-users-protected', async (req, res) => {
  try {
    let stats = await DetectionStats.findOne();
    
    if (!stats) {
      stats = await DetectionStats.create({
        callsAnalyzedToday: 0,
        threatsDetected: 0,
        usersProtected: 0,
      });
    }
    
    // Increment users protected when no threats are found
    stats.usersProtected += 1;
    stats.lastUpdated = new Date();
    await stats.save();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset stats (admin only - optional)
router.post('/reset', async (req, res) => {
  try {
    await DetectionStats.deleteMany({});
    const stats = await DetectionStats.create({
      callsAnalyzedToday: 0,
      threatsDetected: 0,
      usersProtected: 0,
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
