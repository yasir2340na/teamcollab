// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'your-mongo-uri', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB; // ← This line is critical
