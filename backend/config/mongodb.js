// MongoDB connection এর জন্য mongoose library আনছি
const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    // .env থেকে MongoDB address নিয়ে connect করছি
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected! ✅');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

// অন্য file এ ব্যবহার করার জন্য export করছি
module.exports = connectMongoDB;