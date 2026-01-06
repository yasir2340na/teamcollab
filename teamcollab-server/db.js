// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teamcollab');
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message);
    console.error('');
    console.error('💡 MongoDB is not running! Please start MongoDB:');
    console.error('   - Windows: Start MongoDB service or run "mongod"');
    console.error('   - Mac: "brew services start mongodb-community" or "mongod"');
    console.error('   - Linux: "sudo systemctl start mongod" or "mongod"');
    console.error('');
    console.error('   OR use MongoDB Atlas (cloud):');
    console.error('   - Set MONGODB_URI in your .env file');
    console.error('   - Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/teamcollab');
    console.error('');
    process.exit(1);
  }
};

module.exports = connectDB; // ← This line is critical
