require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route imports
const authRoutes = require('../server/routes/auth');
const reportRoutes = require('../server/routes/reports');
const workshopRoutes = require('../server/routes/workshops');
const quizScoreRoutes = require('../server/routes/quizScores');
const scamAlertRoutes = require('../server/routes/scamAlerts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (cached for serverless)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
}

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/quiz-scores', quizScoreRoutes);
app.use('/api/scam-alerts', scamAlertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CYBERGUARD API is running on Vercel', timestamp: new Date().toISOString() });
});

module.exports = app;
