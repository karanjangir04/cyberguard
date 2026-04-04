require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const ScamAlert = require('./models/ScamAlert');

const seedData = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing scam alerts
  await ScamAlert.deleteMany({});

  // Seed scam alerts
  const alerts = [
    { title: 'Digital Arrest Scam: Mumbai businessman loses ₹15 lakh', category: 'impersonation', severity: 'critical' },
    { title: 'UPI Fraud Alert: New app malware targeting Android users', category: 'financial', severity: 'high' },
    { title: 'Phishing Scam: Fake SBI KYC update emails circulating', category: 'phishing', severity: 'high' },
    { title: 'Job Scam: Fake WFH job offers on Telegram', category: 'employment', severity: 'medium' },
    { title: 'Crypto Scam: Fake investment app defrauds 500+ users', category: 'financial', severity: 'high' },
    { title: 'OLX Scam: Fraudsters posing as army personnel', category: 'ecommerce', severity: 'medium' },
    { title: 'Electricity Bill Scam: Fake power disconnection threats', category: 'impersonation', severity: 'medium' },
    { title: 'Courier Scam: Fake customs clearance charges demanded', category: 'impersonation', severity: 'medium' },
    { title: 'Digital Arrest Scam: Fraudsters posing as police officers demanding money', category: 'impersonation', severity: 'critical' },
    { title: 'Phishing Attack: Fake bank emails asking for OTP - Never share your OTP!', category: 'phishing', severity: 'high' },
    { title: 'UPI Fraud: Unauthorized transactions reported - Enable UPI PIN', category: 'financial', severity: 'high' },
    { title: 'KYC Scam: Fake calls for KYC update - Banks never ask for PIN/OTP', category: 'phishing', severity: 'high' },
    { title: 'Investment Scam: High returns promise - If too good to be true, it probably is!', category: 'financial', severity: 'medium' },
    { title: 'Social Media Hack: Fake profiles asking for money - Verify identity before helping', category: 'harassment', severity: 'medium' },
    { title: 'QR Code Scam: Scanning unknown QR codes can empty your wallet', category: 'financial', severity: 'high' },
  ];

  await ScamAlert.insertMany(alerts);
  console.log(`✅ Seeded ${alerts.length} scam alerts`);

  console.log('🎉 Seeding complete!');
  process.exit(0);
};

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
