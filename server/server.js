require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const workshopRoutes = require('./routes/workshops');
const quizScoreRoutes = require('./routes/quizScores');
const scamAlertRoutes = require('./routes/scamAlerts');
const detectionRoutes = require('./routes/detection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images) from root
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/quiz-scores', quizScoreRoutes);
app.use('/api/scam-alerts', scamAlertRoutes);
app.use('/api/detection', detectionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CYBERGUARD API is running', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🛡️  CYBERGUARD Server Running');
    console.log(`  🌐  http://localhost:${PORT}`);
    console.log(`  📡  API: http://localhost:${PORT}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  });
};

startServer();
