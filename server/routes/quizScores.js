const express = require('express');
const QuizScore = require('../models/QuizScore');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/quiz-scores - Save quiz result
router.post('/', auth, async (req, res) => {
  try {
    const { level, score, total, percentage, passed } = req.body;

    if (!level || score === undefined || !total || percentage === undefined || passed === undefined) {
      return res.status(400).json({ error: 'All quiz score fields are required' });
    }

    // Upsert: update if better score, or create new
    const existing = await QuizScore.findOne({ userId: req.user.id, level });

    if (existing && existing.percentage >= percentage) {
      return res.json({
        message: 'Score saved (previous score was higher)',
        quizScore: existing
      });
    }

    if (existing) {
      existing.score = score;
      existing.total = total;
      existing.percentage = percentage;
      existing.passed = passed;
      existing.createdAt = Date.now();
      await existing.save();
      return res.json({ message: 'Best score updated!', quizScore: existing });
    }

    const quizScore = new QuizScore({
      userId: req.user.id,
      level,
      score,
      total,
      percentage,
      passed
    });
    await quizScore.save();

    res.status(201).json({ message: 'Quiz score saved!', quizScore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save quiz score' });
  }
});

// GET /api/quiz-scores/my - Get user's quiz scores
router.get('/my', auth, async (req, res) => {
  try {
    const scores = await QuizScore.find({ userId: req.user.id });
    res.json({ scores });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz scores' });
  }
});

// GET /api/quiz-scores/top - Top quiz scorers (for homepage leaderboard)
router.get('/top', async (req, res) => {
  try {
    const topScores = await QuizScore.aggregate([
      { $match: { passed: true } },
      { $group: {
        _id: '$userId',
        bestPercentage: { $max: '$percentage' },
        levelsCompleted: { $sum: 1 }
      }},
      { $sort: { bestPercentage: -1, levelsCompleted: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
        name: '$user.name',
        college: '$user.college',
        score: '$bestPercentage',
        levels: '$levelsCompleted'
      }}
    ]);
    res.json({ winners: topScores });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top scores' });
  }
});

module.exports = router;
