// Gadgetify_backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // This line is crucial

const connectDB = async () => {
  try {
    // This line reads from your .env file
 await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;