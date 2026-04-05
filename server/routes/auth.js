const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Create user
    const user = new User({ name, email, password, college: college || '' });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, college: user.college }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, college: user.college }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/auth/profile (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, college } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    
    await user.save();
    
    // Generate new token with updated name
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ message: 'Profile updated successfully', user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Please provide current and new password' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
    
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });
    
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user found with this email' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();
    
    // Configure Nodemailer Transporter
    let transporter;
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
    } else {
      // Fallback: Send email using ethereal
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }
    
    const info = await transporter.sendMail({
      from: '"Cyberguard Security" <security@cyberguard.com>',
      to: user.email,
      subject: 'Password Reset OTP - Cyberguard',
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
      html: `<h3>Cyberguard Password Reset</h3><p>Your OTP is: <b style="font-size:20px;letter-spacing:2px;color:#dc2626;">${otp}</b></p><p>It is valid for 15 minutes.</p>`
    });
    
    console.log("OTP Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
    
    const user = await User.findOne({ email, resetOtp: otp, resetOtpExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });
    
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
