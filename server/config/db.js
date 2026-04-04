const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('  Please check your .env file and update MONGODB_URI');
    console.error('  with your MongoDB Atlas connection string.');
    console.error('');
    console.error('  Steps:');
    console.error('  1. Go to https://www.mongodb.com/atlas');
    console.error('  2. Create free account → Free M0 cluster');
    console.error('  3. Create database user (username + password)');
    console.error('  4. Click Connect → Connect your application');
    console.error('  5. Copy connection string into .env file');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
};

module.exports = connectDB;
